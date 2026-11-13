-- Accounts: a profile with preferences for each signed-in visitor, and their recipe book.
-- Sign-in itself is Supabase Auth (auth.users). HANDOFF.md, "Konton och receptbok".
--
-- Unlike the tables in …_ai_recipes.sql, these three are read and written from the browser with the
-- visitor's own sign-in (src/js/account.js), so each has row level security policies: a visitor
-- reaches their own rows and nobody else's. Without a sign-in (anon) nothing is reachable.

-- One row per user, made by the trigger below when the user is created and deleted with the user.
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  -- Shown in the greeting on the account pages. From the sign-up form, or the name Google gives.
  display_name text check (char_length(display_name) <= 80),
  -- Keys from dietTags in src/js/recipes.js.
  diets text[] not null default '{}'
    check (diets <@ array['Vegetarian', 'Vegan', 'Dairy free', 'Egg free', 'Gluten free']),
  -- Foods the visitor doesn't eat, as typed: at most 30 of at most 80 characters. The total length
  -- is what's checked here; generate-recipe cleans each one again before Claude sees it
  -- (supabase/functions/_shared/preferences.ts).
  avoid text[] not null default '{}'
    check (cardinality(avoid) <= 30 and char_length(array_to_string(avoid, '')) <= 2400),
  -- How many to cook for. Null lets the recipe decide.
  servings int check (servings between 1 and 12),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Own profile: read" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Own profile: update" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Rows are made by the trigger and removed with the user, so the browser may only read a row and
-- change these four columns.
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name, diets, avoid, servings) on table public.profiles to authenticated;

create function public.profiles_touch()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.profiles_touch();

-- A profile for every new user. If this fails the sign-up fails, so it does as little as it can.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(left(btrim(coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      ''
    )), 80), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Users from before this migration, if there are any.
insert into public.profiles (id) select id from auth.users on conflict (id) do nothing;

-- Archive recipes in a visitor's recipe book: the hearts. `recipe_id` is a recipe file's name, e.g.
-- '01-rodbetspytt'. The archive isn't in the database, so the id can only be checked for its shape;
-- the pages skip ids that aren't in the recipe index.
create table public.saved_recipes (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  recipe_id text not null check (recipe_id ~ '^[a-z0-9-]{1,80}$'),
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

-- Generated recipes in a visitor's recipe book. generate-recipe adds the ones a signed-in visitor
-- generates; the heart on nytt-recept.html adds and removes them. This row is the only link between
-- a generated recipe and a person.
create table public.saved_generated_recipes (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  recipe_id uuid not null references public.generated_recipes on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

alter table public.saved_recipes enable row level security;
alter table public.saved_generated_recipes enable row level security;

create policy "Own book: read" on public.saved_recipes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Own book: add" on public.saved_recipes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Own book: remove" on public.saved_recipes
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Own book: read" on public.saved_generated_recipes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Own book: add" on public.saved_generated_recipes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Own book: remove" on public.saved_generated_recipes
  for delete to authenticated using ((select auth.uid()) = user_id);

revoke all on table public.saved_recipes, public.saved_generated_recipes from anon, authenticated;
grant select, insert, delete on table public.saved_recipes, public.saved_generated_recipes to authenticated;

-- A book holds at most 1000 recipes of each kind, so one account can't fill the database.
create function public.recipe_book_limit()
returns trigger
language plpgsql
as $$
declare
  held int;
begin
  execute format('select count(*) from %I.%I where user_id = $1', tg_table_schema, tg_table_name)
    into held using new.user_id;
  if held >= 1000 then
    raise exception 'The recipe book is full.' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger saved_recipes_limit before insert on public.saved_recipes
  for each row execute function public.recipe_book_limit();
create trigger saved_generated_recipes_limit before insert on public.saved_generated_recipes
  for each row execute function public.recipe_book_limit();

-- The generated recipes in the caller's book, with what a recipe card shows (receptbok.html), newest
-- first. The browser can't read generated_recipes itself, so this runs with the owner's rights and
-- returns only the caller's saved recipes that haven't been hidden.
create function public.my_generated_recipes()
returns table (
  id uuid,
  saved_at timestamptz,
  title text,
  description text,
  time_label text,
  categories jsonb,
  tags jsonb,
  image_status text,
  image_path text,
  promoted_as text
)
language sql
stable
security definer
set search_path = public
as $$
  select g.id, s.created_at, g.recipe ->> 'title', g.recipe ->> 'description', g.recipe ->> 'timeLabel',
    g.recipe -> 'categories', g.recipe -> 'tags', g.image_status, g.image_path, g.promoted_as
  from saved_generated_recipes s
  join generated_recipes g on g.id = s.recipe_id
  where s.user_id = auth.uid() and not g.hidden
  order by s.created_at desc;
$$;

revoke execute on function public.my_generated_recipes() from public, anon;
grant execute on function public.my_generated_recipes() to authenticated;
