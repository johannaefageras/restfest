-- my_generated_recipes() with an empty search path, like handle_new_user(): every table it reads is
-- written with its schema, so the function can't be led to another schema's table of the same name.
-- …_accounts.sql made it with `search_path = public`. Nothing could misuse that as the project is
-- (visitors can't create anything in public); this is the tidier form, and it closes the gap for good.
--
-- The function answers exactly as before, and replacing it keeps who may call it (signed-in visitors
-- only). tools/standin/check-rls.mjs checks both.
create or replace function public.my_generated_recipes()
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
set search_path = ''
as $$
  select g.id, s.created_at, g.recipe ->> 'title', g.recipe ->> 'description', g.recipe ->> 'timeLabel',
    g.recipe -> 'categories', g.recipe -> 'tags', g.image_status, g.image_path, g.promoted_as
  from public.saved_generated_recipes s
  join public.generated_recipes g on g.id = s.recipe_id
  where s.user_id = auth.uid() and not g.hidden
  order by s.created_at desc;
$$;
