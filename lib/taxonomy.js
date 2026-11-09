// The recipe taxonomy for the build: categories, recipe types, tags and the ingredient list.
//
// src/recipes.js is a plain browser script and the source of the categories (mealTypes), the tag
// labels and the diet rules. It is loaded here the way the browser loads it, as a script, so the
// build and the browser always work from the same lists. src/_data/foods.json is the ingredient list
// it builds on, which the browser gets through data/recipe-index.js.

import fs from 'node:fs';
import vm from 'node:vm';

const source = file => new URL(`../src/${file}`, import.meta.url);
const read = file => fs.readFileSync(source(file), 'utf8');

// A URL-safe name from a Swedish label: "Fika & bakning" → "fika-och-bakning", "Höst" → "host".
export const slug = text => text.toLowerCase().replace(/&/g, ' och ')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Recipe types: food, or one of the three kinds on the Mer än mat page. A recipe's type follows from
// its categories: a recipe in the spa, household or pets category has that type, anything else is food.
// mer-an-mat.njk shows the spa, household and pets labels, icons and intros from here, with links to
// their type pages; the food intro is the start of the one on receptarkiv.html.
const typeDetails = {
  food: {label: 'Mat', slug: 'mat', icon: 'serving-cloche', back: 'archive',
    intro: 'Bläddra bland middagar, fika, drycker och skafferirecept.'},
  spa: {slug: 'hemmaspa', back: 'more',
    intro: 'Masker, skrubb och bad av kaffesump, havregryn, honung och övermogen frukt.'},
  household: {slug: 'hushall-och-stad', back: 'more',
    intro: 'Rengöring och doft med citrusskal, ättika, bikarbonat och citronsyra.'},
  pets: {slug: 'husdjur', back: 'more',
    intro: 'Godis, glass och tassvård till hund och katt. Varje recept börjar med vad djuren inte tål.'}
};

export const backLinks = {
  archive: {path: 'receptarkiv.html', label: 'Till receptarkivet'},
  more: {path: 'mer-an-mat.html', label: 'Till Mer än mat'}
};

function load() {
  const context = vm.createContext({});
  const run = code => vm.runInContext(code, context);
  run(`const collectionFoods = ${read('_data/foods.json')}; const collectionRecipes = [];`);
  run(read('recipes.js'));
  // Plain objects for the build; the functions keep working on them.
  const get = expression => JSON.parse(run(`JSON.stringify(${expression})`));
  const {mealName, isFood, allTags} = run('({mealName, isFood, allTags})');
  const mealTypes = get('mealTypes');
  const recipeTagLabels = get('recipeTagLabels');
  const nonFoodMeals = get('nonFoodMeals');

  const tagLabel = tag => recipeTagLabels[tag] ?? tag;
  const foodCategories = Object.keys(mealTypes).filter(key => !nonFoodMeals.includes(key));

  const recipeTypes = Object.entries(typeDetails).map(([key, details]) => ({
    key,
    label: details.label ?? mealTypes[key].label,
    icon: details.icon ?? mealTypes[key].icon,
    ...details,
    path: `typ/${details.slug}.html`
  }));

  return {
    foods: get('foods'),
    mealTypes, mealName, isFood, allTags, recipeTagLabels, nonFoodMeals, foodCategories, recipeTypes, tagLabel,
    typeOf: categories => nonFoodMeals.find(key => categories.includes(key)) ?? 'food',
    categoryPath: key => `kategori/${slug(mealTypes[key].label)}.html`,
    tagPath: tag => `tagg/${slug(tagLabel(tag))}.html`
  };
}

// Loaded again only when one of the two files has changed, e.g. while `npm start` is running.
let cache;
export function taxonomy() {
  const stamp = ['recipes.js', '_data/foods.json'].map(file => fs.statSync(source(file)).mtimeMs).join();
  if (cache?.stamp !== stamp) cache = {stamp, value: load()};
  return cache.value;
}
