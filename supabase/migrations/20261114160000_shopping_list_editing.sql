-- Display overrides leave the original ingredient text and recipe linkage intact.
-- Notes and edits share the existing durable, owner-scoped operation protocol.
alter table public.shopping_list_items
  add column custom_text text not null default '' check (char_length(custom_text) <= 4000),
  add column note text not null default '' check (char_length(note) <= 500);

create or replace function public.sync_shopping_list(changes jsonb default '[]'::jsonb)
-- A JSON array avoids PostgREST's row limit silently cutting a large list down to 1000 items.
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_id uuid := auth.uid();
  change jsonb;
  operation_id uuid;
  item_id text;
  action text;
begin
  if owner_id is null then
    raise exception 'Sign in to sync a shopping list.' using errcode = '42501';
  end if;
  if jsonb_typeof(changes) is distinct from 'array' or jsonb_array_length(changes) > 100 then
    raise exception 'Invalid shopping changes.' using errcode = '22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(owner_id::text, 0));
  for change in select value from jsonb_array_elements(changes) loop
    operation_id := (change ->> 'op')::uuid;
    item_id := change ->> 'id';
    action := change ->> 'kind';
    if operation_id is null or item_id is null or char_length(item_id) not between 1 and 2000
      or action is null or action not in ('import', 'add', 'check', 'remove', 'edit') then
      raise exception 'Invalid shopping change.' using errcode = '22023';
    end if;
    if action in ('import', 'add') and (
      jsonb_typeof(change -> 'item' -> 'text') is distinct from 'string'
      or jsonb_typeof(change -> 'item' -> 'recipe') is distinct from 'string'
      or jsonb_typeof(change -> 'item' -> 'checked') is distinct from 'boolean'
      or char_length(change -> 'item' ->> 'text') > 4000
      or char_length(change -> 'item' ->> 'recipe') > 4000
    ) then
      raise exception 'Invalid shopping item.' using errcode = '22023';
    end if;
    if action in ('import', 'add') then
      if ((change -> 'item') ? 'customText' and (
          jsonb_typeof(change -> 'item' -> 'customText') is distinct from 'string'
          or char_length(change -> 'item' ->> 'customText') > 4000))
        or ((change -> 'item') ? 'note' and (
          jsonb_typeof(change -> 'item' -> 'note') is distinct from 'string'
          or char_length(change -> 'item' ->> 'note') > 500)) then
        raise exception 'Invalid shopping details.' using errcode = '22023';
      end if;
    end if;
    if action = 'edit' then
      if jsonb_typeof(change -> 'fields') is distinct from 'object' then
        raise exception 'Invalid shopping edit.' using errcode = '22023';
      end if;
      if exists (select 1 from jsonb_object_keys(change -> 'fields') as field(key)
          where key not in ('customText', 'note'))
        or ((change -> 'fields') ? 'customText' and (
          jsonb_typeof(change -> 'fields' -> 'customText') is distinct from 'string'
          or char_length(change -> 'fields' ->> 'customText') > 4000))
        or ((change -> 'fields') ? 'note' and (
          jsonb_typeof(change -> 'fields' -> 'note') is distinct from 'string'
          or char_length(change -> 'fields' ->> 'note') > 500)) then
        raise exception 'Invalid shopping edit.' using errcode = '22023';
      end if;
    end if;
    if action = 'check' and jsonb_typeof(change -> 'checked') is distinct from 'boolean' then
      raise exception 'Invalid shopping checkbox.' using errcode = '22023';
    end if;
    insert into public.shopping_list_operations (user_id, op) values (owner_id, operation_id)
      on conflict do nothing;
    if not found then continue; end if;
    if action = 'import' then
      insert into public.shopping_list_items (user_id, id, text, recipe, checked, custom_text, note)
        values (owner_id, item_id, change -> 'item' ->> 'text', change -> 'item' ->> 'recipe', (change -> 'item' ->> 'checked')::boolean,
          coalesce(change -> 'item' ->> 'customText', ''), coalesce(change -> 'item' ->> 'note', ''))
        on conflict do nothing;
    elsif action = 'add' then
      insert into public.shopping_list_items as held (user_id, id, text, recipe, checked, custom_text, note)
        values (owner_id, item_id, change -> 'item' ->> 'text', change -> 'item' ->> 'recipe', (change -> 'item' ->> 'checked')::boolean,
          coalesce(change -> 'item' ->> 'customText', ''), coalesce(change -> 'item' ->> 'note', ''))
        on conflict on constraint shopping_list_items_pkey do update
        set text = excluded.text, recipe = excluded.recipe, checked = excluded.checked, deleted = false,
          custom_text = excluded.custom_text, note = excluded.note,
          sort_order = case when held.deleted then excluded.sort_order else held.sort_order end,
          created_at = case when held.deleted then now() else held.created_at end;
    elsif action = 'edit' then
      update public.shopping_list_items as held set
        custom_text = case when (change -> 'fields') ? 'customText' then change -> 'fields' ->> 'customText' else held.custom_text end,
        note = case when (change -> 'fields') ? 'note' then change -> 'fields' ->> 'note' else held.note end
        where held.user_id = owner_id and held.id = item_id and not held.deleted;
    elsif action = 'check' then
      update public.shopping_list_items as held set checked = (change ->> 'checked')::boolean
        where held.user_id = owner_id and held.id = item_id and not held.deleted;
    else
      insert into public.shopping_list_items (user_id, id, deleted) values (owner_id, item_id, true)
        on conflict on constraint shopping_list_items_pkey do update set deleted = true;
    end if;
  end loop;
  return coalesce((select jsonb_agg(jsonb_build_object(
      'id', held.id, 'text', held.text, 'recipe', held.recipe, 'checked', held.checked,
      'customText', held.custom_text, 'note', held.note
    ) order by held.sort_order)
    from public.shopping_list_items as held
    where held.user_id = owner_id and not held.deleted), '[]'::jsonb);
end;
$$;
revoke execute on function public.sync_shopping_list(jsonb) from public, anon;
grant execute on function public.sync_shopping_list(jsonb) to authenticated;
notify pgrst, 'reload schema';
