// Which parts of src/_data/foods.json go where. The file is a whole grocery list, thousands of entries,
// and most pages only need the foods the recipes use:
//
//   data/recipe-index.js   the foods the recipes use and their lookalikes, on every page (src/pages/recipe-index.njk)
//   data/foods.js          the rest of the food list, on the pages that match typed or photographed
//                          foods against it: the home page and the new-recipe page (src/pages/foods-data.njk)
//   supabase/functions     the keys the recipes use, as the foods Claude is sent by name (tools/supabase-data.mjs)
//
// Entries outside the food groups in src/js/recipes.js (blöjor, schampo, krukväxter) are in neither file:
// they aren't ingredients.

// The ingredient keys the recipes use. `recipes` are their front matter: {pantryKeys, ingredients}.
export function recipeFoodKeys(recipes) {
  return new Set(recipes.flatMap(recipe => [
    ...(recipe.pantryKeys ?? []),
    ...(recipe.ingredients?.[0]?.items ? recipe.ingredients : [{items: recipe.ingredients ?? []}])
      .flatMap(group => group.items.map(item => item.key).filter(Boolean))
  ]));
}

// As the browser folds names to compare them (searchKey in src/js/app.js): lower case, no accents.
const fold = name => name.toLocaleLowerCase('sv-SE').normalize('NFD').replace(/\p{M}/gu, '').replaceAll('ø', 'o');
const words = food => [food.name, ...(food.aliases ?? [])].map(fold);

// Whether the browser could take one word for a form of the other: it tries a typed name without a
// plural or definite ending of up to four letters, with "a" or "e" in its place, and with an ending
// of up to two letters added, and what is left of the name is at least three letters (resolveIngredient
// in src/js/app.js). Wider than that rule, never narrower.
function alike(typed, known) {
  let same = 0;
  while (same < typed.length && same < known.length && typed[same] === known[same]) same++;
  return same >= Math.min(3, typed.length) && typed.length - same <= 4 && known.length - same <= 2;
}

// The keys for data/recipe-index.js: the foods the recipes use, and the other foods whose names look
// like a form of one of theirs. "Aprikos" is one: without it, a page with only the recipes' foods
// would read it as "aprikoser", the dried ones in a recipe, where the home page knows it's the fruit.
// test/food-list.test.js checks that both kinds of page match every name the same way.
//   foods        src/_data/foods.json
//   recipes      the recipes' front matter
//   t            taxonomy() from lib/taxonomy.js: its foods also have those written in src/js/recipes.js
function everyPageKeys(foods, recipes, t) {
  const used = recipeFoodKeys(recipes);
  const always = Object.keys(t.foods).filter(key => used.has(key) || !Object.hasOwn(foods, key));
  const known = [...new Set(always.flatMap(key => words(t.foods[key])))];
  const keys = new Set(used);
  for (const [key, food] of Object.entries(foods)) {
    if (keys.has(key) || !Object.hasOwn(t.foodGroups, food.group)) continue;
    if (words(food).some(typed => known.some(word => alike(typed, word)))) keys.add(key);
  }
  return keys;
}

// The entries of foods.json for every page, as they are.
export function recipeFoods(foods, recipes, t) {
  const keys = everyPageKeys(foods, recipes, t);
  return Object.fromEntries(Object.entries(foods).filter(([key]) => keys.has(key)));
}

// The other foods, written compactly as {group: {key: [name, …other words]}}. A name's own lower-case
// form is left out of the words, since a name always matches itself. src/js/recipes.js unpacks it.
export function otherFoods(foods, recipes, t) {
  const keys = everyPageKeys(foods, recipes, t);
  const groups = {};
  for (const [key, food] of Object.entries(foods)) {
    if (keys.has(key) || !Object.hasOwn(t.foodGroups, food.group)) continue;
    const name = food.name.toLocaleLowerCase('sv-SE');
    (groups[food.group] ??= {})[key] = [food.name, ...(food.aliases ?? []).filter(alias => alias.toLocaleLowerCase('sv-SE') !== name)];
  }
  return groups;
}
