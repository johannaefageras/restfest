-- Add the sixth profile diet while retaining the existing choices and row-level policies.
alter table public.profiles
  drop constraint profiles_diets_check,
  add constraint profiles_diets_check check (
    diets <@ array['Vegetarian', 'Vegan', 'Dairy free', 'Egg free', 'Gluten free', 'Lactose free']
    and cardinality(diets) <= 6
  );
