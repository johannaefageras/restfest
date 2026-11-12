-- Restfest's AI features: recipes written from a fridge list, their photos, and a daily cap on requests.
-- The Edge Functions in supabase/functions/ are the only things that read or write these tables. They use
-- the project's secret key, so row level security is on with no policies: the public API can't reach them.

-- One row per recipe Claude has written. `recipe` is the recipe in the shape the site renders
-- (supabase/functions/_shared/recipe.ts, RecipeDoc). tools/promote.mjs turns a good one into src/recept/<id>.md.
create table public.generated_recipes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- The fridge list it was written from, as the visitor typed it.
  pantry text[] not null default '{}',
  recipe jsonb not null,
  -- pending → generating → done, or failed (tried again once, see claim_recipe_image).
  image_status text not null default 'pending'
    check (image_status in ('pending', 'generating', 'done', 'failed')),
  image_path text,
  image_attempts int not null default 0,
  image_started_at timestamptz,
  image_error text,
  -- Set by hand when the recipe has been added to the archive, e.g. '206-halloumipasta'.
  promoted_as text,
  -- Set to true by hand to take a recipe's page down.
  hidden boolean not null default false
);

alter table public.generated_recipes enable row level security;

-- Requests in the last day or two, for the daily caps. Visitors are stored as a hash of their IP address
-- and the day, so a row can't be traced back to an address, and the same address hashes differently each day.
create table public.ai_requests (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind text not null,
  ip_hash text not null
);

create index ai_requests_kind_created_at on public.ai_requests (kind, created_at);

alter table public.ai_requests enable row level security;

-- Records a request and returns true, or returns false when this visitor or everyone together has
-- reached today's cap for this kind of request. Rows older than two days are cleared on the way.
create function public.ai_allow(p_kind text, p_ip_hash text, p_per_ip int, p_per_day int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  mine int;
  everyone int;
begin
  -- One request at a time per kind, so two at once can't both take the last place.
  perform pg_advisory_xact_lock(hashtext('ai_allow:' || p_kind));
  delete from ai_requests where created_at < now() - interval '2 days';
  select count(*) filter (where ip_hash = p_ip_hash), count(*)
    into mine, everyone
    from ai_requests
    where kind = p_kind and created_at > now() - interval '1 day';
  if mine >= p_per_ip or everyone >= p_per_day then
    return false;
  end if;
  insert into ai_requests (kind, ip_hash) values (p_kind, p_ip_hash);
  return true;
end;
$$;

-- Marks a recipe's photo as being made and returns the recipe, or returns null when it's done, already
-- being made, or has failed twice. A photo that has been "generating" for over four minutes was
-- abandoned (the function stops long before that), so it can be claimed again.
create function public.claim_recipe_image(p_id uuid)
returns jsonb
language sql
security definer
set search_path = public
as $$
  update generated_recipes
  set image_status = 'generating',
      image_attempts = image_attempts + 1,
      image_started_at = now(),
      image_error = null
  where id = p_id
    and not hidden
    and (
      image_status = 'pending'
      or (image_status = 'failed' and image_attempts < 2)
      or (image_status = 'generating' and image_started_at < now() - interval '4 minutes' and image_attempts < 3)
    )
  returning recipe;
$$;

-- Only the Edge Functions (secret key) may call these.
revoke execute on function public.ai_allow(text, text, int, int) from public, anon, authenticated;
revoke execute on function public.claim_recipe_image(uuid) from public, anon, authenticated;

-- The photos. Public, so the recipe page can show them by URL; only the functions can upload.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('recipe-images', 'recipe-images', true, 5242880, array['image/jpeg', 'image/webp', 'image/png'])
on conflict (id) do nothing;
