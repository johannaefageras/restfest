// The recipe taxonomy for the build: categories, recipe types, tags and the ingredient list.
//
// src/js/recipes.js is a plain browser script and the source of the categories (mealTypes), the tag
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

// Recipe types: food, or one of the kinds on the Mer än mat page. A recipe's type follows from
// its categories: a recipe in a non-food category has that type, anything else is food.
// pages/mer-an-mat.njk shows the non-food labels, icons and intros from here, with links to
// their type pages; the food intro is the start of the one on receptarkiv.html.
// `menu` is the type's entry in the "Recept" menu in the header and footer (layouts/base.njk): a short
// label and a line about what's there. It leads to the type page, except Mat & dryck, which leads to
// the archive.
const typeDetails = {
  food: {label: 'Mat', slug: 'mat', icon: 'serving-cloche-1', back: 'archive',
    intro: 'Bläddra bland middagar, fika, drycker och skafferirecept.',
    menu: {label: 'Mat & dryck', note: 'Middagar, fika och drycker', path: 'receptarkiv.html'}},
  spa: {slug: 'hemmaspa', back: 'more',
    intro: 'Masker, skrubb och bad av kaffesump, havregryn, honung och övermogen frukt.',
    menu: {label: 'Hemmaspa', note: 'Masker, skrubb och bad'}},
  household: {slug: 'hushall-och-rengoring', back: 'more',
    intro: 'Rengöring och doft med citrusskal, ättika, bikarbonat och citronsyra.',
    menu: {label: 'Hushåll', note: 'Rengöring och doft'}},
  pets: {slug: 'husdjur', back: 'more',
    intro: 'Godis, glass och tassvård till hund och katt. Varje recept börjar med vad djuren inte tål.',
    menu: {label: 'Husdjur', note: 'Godis och tassvård'}},
  garden: {slug: 'odling', back: 'more',
    intro: 'Odla vidare på rotstumpar, frön och sticklingar, och ge burkar och matrester nytt liv bland växterna.',
    menu: {label: 'Odling', note: 'Rotstumpar, frön och sticklingar'}}
};

export const backLinks = {
  archive: {path: 'receptarkiv.html', label: 'Till receptarkivet'},
  more: {path: 'mer-an-mat.html', label: 'Till Mer än mat'}
};

function load() {
  const context = vm.createContext({});
  const run = code => vm.runInContext(code, context);
  run(`const collectionFoods = ${read('_data/foods.json')}; const collectionRecipes = [];`);
  run(read('js/recipes.js'));
  // Plain objects for the build; the functions keep working on them.
  const get = expression => JSON.parse(run(`JSON.stringify(${expression})`));
  const {mealName, isFood, allTags, difficultyLabel} = run('({mealName, isFood, allTags, difficultyLabel})');
  const difficultyLevels = get('difficultyLevels');
  const mealTypes = get('mealTypes');
  const recipeTagLabels = get('recipeTagLabels');
  const tagIcons = get('tagIcons');
  const nonFoodMeals = get('nonFoodMeals');

  const tagLabel = tag => recipeTagLabels[tag] ?? tag;
  const foodCategories = Object.keys(mealTypes).filter(key => !nonFoodMeals.includes(key));

  const recipeTypes = Object.entries(typeDetails).map(([key, details]) => ({
    key,
    label: details.label ?? mealTypes[key].label,
    icon: details.icon ?? mealTypes[key].icon,
    ...details,
    path: `typ/${details.slug}.html`,
    menu: {path: `typ/${details.slug}.html`, ...details.menu}
  }));

  return {
    foods: get('foods'),
    foodGroups: get('foodGroups'),
    dietTags: get('dietTags'),
    mealTypes, mealName, isFood, allTags, recipeTagLabels, nonFoodMeals, foodCategories, recipeTypes, tagLabel,
    difficultyLevels, difficultyLabel,
    typeOf: categories => nonFoodMeals.find(key => categories.includes(key)) ?? 'food',
    categoryPath: key => `kategori/${slug(mealTypes[key].label)}.html`,
    tagPath: tag => `tagg/${slug(tagLabel(tag))}.html`,
    tagIcon: tag => tagIcons[tag] ?? 'hashtag'
  };
}

// Loaded again only when one of the two files has changed, e.g. while `npm start` is running.
let cache;
export function taxonomy() {
  const stamp = ['js/recipes.js', '_data/foods.json'].map(file => fs.statSync(source(file)).mtimeMs).join();
  if (cache?.stamp !== stamp) cache = {stamp, value: load()};
  return cache.value;
}
