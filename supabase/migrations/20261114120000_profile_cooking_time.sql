-- A usual total cooking-time budget. Null means "Ingen brådska".
alter table public.profiles
  add column max_cooking_minutes int
    check (max_cooking_minutes in (15, 30, 45));

grant update (max_cooking_minutes) on table public.profiles to authenticated;
