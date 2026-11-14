-- Safe delta sync for both recipe-book lists, and durable recovery of a generated recipe's first
-- automatic save. Existing hearts and generated recipes stay in their existing tables.
create table public.recipe_book_operations (
  user_id uuid not null references auth.users on delete cascade,
  op uuid not null,
  primary key (user_id, op)
);
create table public.recipe_book_removed (
  user_id uuid not null references auth.users on delete cascade,
  kind text not null check (kind in ('archive', 'generated')),
  recipe_id text not null,
  primary key (user_id, kind, recipe_id)
);
create table public.generated_recipe_save_queue (
  user_id uuid not null references auth.users on delete cascade,
  recipe_id uuid not null references public.generated_recipes on delete cascade,
  primary key (user_id, recipe_id)
);
alter table public.recipe_book_operations enable row level security;
alter table public.recipe_book_removed enable row level security;
alter table public.generated_recipe_save_queue enable row level security;
revoke all on public.recipe_book_operations, public.recipe_book_removed, public.generated_recipe_save_queue from anon, authenticated;

-- Track legacy/direct writes too, including an older client removing a recipe.
create function public.recipe_book_remember_removal()
returns trigger language plpgsql security definer set search_path = '' as $$
declare recipe_kind text := case when tg_table_name = 'saved_recipes' then 'archive' else 'generated' end;
begin
  if tg_op = 'DELETE' then
    -- A cascaded account deletion must not recreate rows referencing the deleted user.
    if exists (select 1 from auth.users where id = old.user_id) then
      insert into public.recipe_book_removed (user_id, kind, recipe_id)
        values (old.user_id, recipe_kind, old.recipe_id::text) on conflict do nothing;
      if recipe_kind = 'generated' then
        delete from public.generated_recipe_save_queue where user_id = old.user_id and recipe_id = old.recipe_id::uuid;
      end if;
    end if;
    return old;
  end if;
  delete from public.recipe_book_removed where user_id = new.user_id and kind = recipe_kind and recipe_id = new.recipe_id::text;
  return new;
end;
$$;
revoke execute on function public.recipe_book_remember_removal() from public, anon, authenticated;
create trigger saved_recipes_removals after insert or delete on public.saved_recipes
  for each row execute function public.recipe_book_remember_removal();
create trigger saved_generated_recipes_removals after insert or delete on public.saved_generated_recipes
  for each row execute function public.recipe_book_remember_removal();

-- Service only: store the recipe and its pending save in one transaction. Even a lost HTTP response
-- or a closed browser cannot orphan its first save. The next book sync retries the pending row.
create function public.store_generated_recipe(recipe_data jsonb, pantry_names text[], save_for uuid default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
<<recipe_store>>
declare recipe_id uuid; saved boolean := false;
begin
  insert into public.generated_recipes (recipe, pantry) values (recipe_data, pantry_names) returning id into recipe_id;
  if save_for is not null then
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('book:' || save_for::text, 0));
    insert into public.generated_recipe_save_queue (user_id, recipe_id) values (save_for, recipe_id);
    begin
      insert into public.saved_generated_recipes (user_id, recipe_id) values (save_for, recipe_id);
      delete from public.generated_recipe_save_queue q where q.user_id = save_for and q.recipe_id = recipe_store.recipe_id;
      saved := true;
    exception when others then
      -- The queued save survives independently of the browser; do not regenerate the recipe.
      saved := false;
    end;
  end if;
  return jsonb_build_object('id', recipe_id, 'saved', saved, 'saveFor', save_for);
end;
$$;
revoke execute on function public.store_generated_recipe(jsonb, text[], uuid) from public, anon, authenticated;
grant execute on function public.store_generated_recipe(jsonb, text[], uuid) to service_role;

create function public.sync_recipe_book(changes jsonb default '[]'::jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
<<book_sync>>
declare
  owner_id uuid := auth.uid(); change jsonb; receipt uuid; recipe_kind text; recipe_id text;
  saving boolean; importing boolean; held int; rejected jsonb := '[]'; queued record;
begin
  if owner_id is null then raise exception 'Sign in to sync the recipe book.' using errcode = '42501'; end if;
  if jsonb_typeof(changes) is distinct from 'array' or jsonb_array_length(changes) > 100 then
    raise exception 'Invalid book changes.' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('book:' || owner_id::text, 0));
  for change in select value from jsonb_array_elements(changes) loop
    receipt := (change ->> 'op')::uuid; recipe_kind := change ->> 'kind'; recipe_id := change ->> 'id';
    if receipt is null or recipe_kind is null or recipe_kind not in ('archive', 'generated') or recipe_id is null
      or jsonb_typeof(change -> 'saved') is distinct from 'boolean'
      or (recipe_kind = 'archive' and recipe_id !~ '^[a-z0-9-]{1,80}$')
      or (recipe_kind = 'generated' and recipe_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$') then
      raise exception 'Invalid book change.' using errcode = '22023';
    end if;
    saving := (change ->> 'saved')::boolean; importing := coalesce((change ->> 'import')::boolean, false);
    insert into public.recipe_book_operations (user_id, op) values (owner_id, receipt) on conflict do nothing;
    if not found then continue; end if;
    if saving and importing and exists (select 1 from public.recipe_book_removed r where r.user_id = owner_id and r.kind = recipe_kind and r.recipe_id = book_sync.recipe_id) then
      continue;
    end if;
    if not saving then
      insert into public.recipe_book_removed (user_id, kind, recipe_id) values (owner_id, recipe_kind, recipe_id) on conflict do nothing;
      if recipe_kind = 'archive' then
        delete from public.saved_recipes s where s.user_id = owner_id and s.recipe_id = book_sync.recipe_id;
      else
        delete from public.saved_generated_recipes s where s.user_id = owner_id and s.recipe_id = book_sync.recipe_id::uuid;
        delete from public.generated_recipe_save_queue q where q.user_id = owner_id and q.recipe_id = book_sync.recipe_id::uuid;
      end if;
    elsif recipe_kind = 'archive' then
      if not exists (select 1 from public.saved_recipes s where s.user_id = owner_id and s.recipe_id = book_sync.recipe_id) then
        select count(*) into held from public.saved_recipes where user_id = owner_id;
        if held >= 1000 then rejected := rejected || jsonb_build_object('id', recipe_id, 'reason', 'full'); continue; end if;
        insert into public.saved_recipes (user_id, recipe_id) values (owner_id, recipe_id);
      end if;
    else
      if not exists (select 1 from public.generated_recipes g where g.id = recipe_id::uuid and not g.hidden) then
        rejected := rejected || jsonb_build_object('id', recipe_id, 'reason', 'missing'); continue;
      end if;
      if not exists (select 1 from public.saved_generated_recipes s where s.user_id = owner_id and s.recipe_id = book_sync.recipe_id::uuid) then
        select count(*) into held from public.saved_generated_recipes where user_id = owner_id;
        if held >= 1000 then rejected := rejected || jsonb_build_object('id', recipe_id, 'reason', 'full'); continue; end if;
        insert into public.saved_generated_recipes (user_id, recipe_id) values (owner_id, recipe_id::uuid);
      end if;
    end if;
  end loop;
  -- Retry initial auto-saves after user removals have made room. Explicitly removing a pending
  -- recipe cancels it above, so a background retry cannot put it back.
  for queued in select q.recipe_id from public.generated_recipe_save_queue q where q.user_id = owner_id loop
    if exists (select 1 from public.generated_recipes g where g.id = queued.recipe_id and not g.hidden)
      and not exists (select 1 from public.recipe_book_removed r where r.user_id = owner_id and r.kind = 'generated' and r.recipe_id = queued.recipe_id::text) then
      begin
        if not exists (select 1 from public.saved_generated_recipes s where s.user_id = owner_id and s.recipe_id = queued.recipe_id) then
          insert into public.saved_generated_recipes (user_id, recipe_id) values (owner_id, queued.recipe_id);
        end if;
        delete from public.generated_recipe_save_queue q where q.user_id = owner_id and q.recipe_id = queued.recipe_id;
      exception when check_violation then null;
      end;
    else
      delete from public.generated_recipe_save_queue q where q.user_id = owner_id and q.recipe_id = queued.recipe_id;
    end if;
  end loop;
  return jsonb_build_object(
    'archive', coalesce((select jsonb_agg(jsonb_build_object('recipe_id', s.recipe_id, 'created_at', s.created_at) order by s.created_at desc, s.recipe_id) from public.saved_recipes s where s.user_id = owner_id), '[]'::jsonb),
    'generated', coalesce((select jsonb_agg(to_jsonb(g)) from public.my_generated_recipes() g), '[]'::jsonb),
    'name', (select p.display_name from public.profiles p where p.id = owner_id),
    'pendingGenerated', (select count(*) from public.generated_recipe_save_queue q where q.user_id = owner_id),
    'rejected', rejected
  );
end;
$$;
revoke execute on function public.sync_recipe_book(jsonb) from public, anon;
grant execute on function public.sync_recipe_book(jsonb) to authenticated;
notify pgrst, 'reload schema';
