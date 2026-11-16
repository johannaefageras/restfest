import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import yaml from 'js-yaml';
import {otherFoods, recipeFoodKeys, recipeFoods} from '../lib/foods.js';
import {taxonomy} from '../lib/taxonomy.js';

// How src/_data/foods.json is divided between data/recipe-index.js (every page) and data/foods.js
// (the home page and the new-recipe page), and that both kinds of page match foods the same way.
const read = path => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');
const allFoods = JSON.parse(read('_data/foods.json'));
const recipes = readdirSync(new URL('../src/recept/', import.meta.url)).filter(name => name.endsWith('.md'))
  .map(name => yaml.load(read(`recept/${name}`).match(/^---\n([\s\S]*?)\n---/)[1]));
const t = taxonomy();
const used = recipeFoodKeys(recipes);
const core = recipeFoods(allFoods, recipes, t);
const more = otherFoods(allFoods, recipes, t);

const app = read('js/app.js');
const helpers = app.slice(app.indexOf('function searchKey('), app.indexOf('function loadPantry('));

// A page's scripts up to the matching helpers, with or without data/foods.js.
function page({withMore}) {
  const context = vm.createContext({});
  const run = code => vm.runInContext(code, context);
  run(`const collectionFoods = ${JSON.stringify(core)}; const collectionRecipes = [];`);
  if (withMore) run(`const moreFoods = ${JSON.stringify(more)};`);
  run(read('js/recipes.js'));
  run(helpers);
  return {foods: JSON.parse(run('JSON.stringify(foods)')), key: name => context.keyForIngredient(name)};
}

test('every page gets the foods the recipes use, and only two pages the rest', () => {
  assert.ok(used.size > 100 && used.size < 400, `${used.size} keys are used by recipes`);
  for (const key of used) assert.ok(core[key], `${key} is in the recipe index`);
  assert.ok(Object.keys(core).length < used.size * 3, `${Object.keys(core).length} foods are on every page`);
  assert.ok(core['aprikos-frukt'], 'a food that reads as a form of a recipe food is on every page too');
  assert.ok(JSON.stringify(core).length < 60_000, `the recipe foods are ${JSON.stringify(core).length} characters`);
  assert.ok(JSON.stringify(more).length < 200_000, `the other foods are ${JSON.stringify(more).length} characters`);

  const small = page({withMore: false});
  for (const key of used) assert.ok(small.foods[key], `${key} is on every page`);
  assert.equal(small.foods.verjus, undefined);

  // With data/foods.js the page knows the same foods as the build, by the same names and words.
  const full = page({withMore: true});
  assert.deepEqual(Object.keys(full.foods).sort(), Object.keys(t.foods).sort());
  for (const [key, food] of Object.entries(t.foods)) {
    const words = entry => [...new Set([entry.name, ...entry.aliases].map(word => word.toLocaleLowerCase('sv-SE')))].sort();
    assert.equal(full.foods[key].name, food.name);
    assert.equal(full.foods[key].group, food.group);
    assert.deepEqual(words(full.foods[key]), words(food), key);
  }
});

test('only foods are ingredients: the rest of the grocery list is not recognised', () => {
  assert.equal(allFoods.blojor.group, 'baby-care');
  for (const key of ['blojor', 'diskborste']) assert.equal(t.foods[key], undefined, key);
  assert.deepEqual(Object.keys(more).filter(group => !t.foodGroups[group]), []);
  const full = page({withMore: true});
  assert.equal(full.key('Blöjor'), 'custom:blöjor');
  assert.equal(full.key('Verjus'), 'verjus');
  assert.equal(full.key('körsbärstomater'), 'tomat');
});

test('a fridge list matches the recipes the same way with and without the full food list', () => {
  const small = page({withMore: false});
  const full = page({withMore: true});
  const different = [];
  for (const food of Object.values(t.foods)) {
    for (const name of [food.name, ...food.aliases]) {
      const [a, b] = [full.key(name), small.key(name)];
      if (used.has(a) ? a !== b : used.has(b)) different.push(`${name}: ${a} with the full list, ${b} without`);
    }
  }
  assert.deepEqual(different, []);
});

const kitchen = read('js/kitchen.js');
const suggestions = kitchen.slice(kitchen.indexOf('function matchingFoodNames('), kitchen.indexOf('function isUnknownIngredient('));

test('the field suggests a few matching foods: names that start with the text first', () => {
  const context = vm.createContext({});
  vm.runInContext(helpers.slice(0, helpers.indexOf('const ingredientKeys')) + suggestions, context);
  const names = ['Blomkål', 'Grönkål', 'Kål', 'Kålrot', 'Lax', 'Rökt lax', 'Vitkål', 'Ägg'];
  const match = (typed, limit) => [...context.matchingFoodNames(typed, names, limit)];
  assert.deepEqual(match('kål'), ['Kål', 'Kålrot', 'Blomkål', 'Grönkål', 'Vitkål']);
  assert.deepEqual(match(' LAX '), ['Lax', 'Rökt lax']);
  assert.deepEqual(match('kål', 2), ['Kål', 'Kålrot']);
  assert.deepEqual(match('ägg'), ['Ägg']);
  assert.deepEqual(match('xyz'), []);
  assert.deepEqual(match(''), []);
});
