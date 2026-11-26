// Exercise the archive renderer with a small DOM boundary: pages must keep their order, preserve
// existing cards when expanded, and reset only when the visitor changes their search or filters.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import { taxonomy } from '../lib/taxonomy.js';

const source = readFileSync(new URL('../src/js/app.js', import.meta.url), 'utf8');
const state = source.slice(source.indexOf('const archivePageSize ='), source.indexOf('let activeRecipe ='));
const archive = source.slice(source.indexOf('// The archive is for food.'), source.indexOf('// mer-an-mat.html:'));

function element() {
  let html = '';
  const node = {
    children: [], hidden: false, value: '', textContent: '',
    get firstElementChild() { return this.children[0] ?? null; },
    append(...cards) { this.children.push(...cards); },
    setAttribute() {}, querySelector: () => null,
    insertAdjacentHTML(position, value) {
      html += value;
      for (const [, id] of value.matchAll(/data-id="([^"]+)"/g)) {
        const card = {
          id, querySelector: () => ({
            focus: options => { card.focused = options; },
            scrollIntoView: options => { card.scrolled = options; },
          }),
        };
        node.children.push(card);
      }
    },
  };
  Object.defineProperty(node, 'innerHTML', {
    get: () => html,
    set(value) { html = ''; node.children = []; node.insertAdjacentHTML('beforeend', value); },
  });
  return node;
}

function page(count = 29) {
  const nodes = new Map();
  const $ = selector => {
    if (!nodes.has(selector)) nodes.set(selector, element());
    return nodes.get(selector);
  };
  const recipes = Array.from({ length: count }, (_, index) => ({
    id: `${index + 1}-recipe`, title: `Recept ${String(index + 1).padStart(2, '0')}`,
    meals: ['main'], foodKeys: [], tags: [], search: '', time: 10,
    difficulty: 'Nybörjare', date: '2026-11-20',
  }));
  $('#archive-sort-match').hidden = true;
  const archiveSort = { value: 'title', setValue(value) { this.value = value; } };
  const { allTags, recipeTagLabels } = taxonomy();
  const context = vm.createContext({
    $, recipes, archiveSearch: $('#recipe-search'), archiveSort,
    savedOnly: false, saved: new Set(), quickOnly: false, meatFreeOnly: false, budgetOnly: false,
    mealFilter: 'all',
    foodFilter: 'all', difficultyFilter: 'all', dietFilter: new Set(), selectedTags: new Set(),
    revealedSavedFilters: false, archiveSortChosen: false,
    isFood: () => true, loadPantry: () => ({ items: [] }), keyForIngredient: item => item,
    matchRecipe: recipe => ({ mainCount: 1, ownMatches: 1, score: parseInt(recipe.id, 10), have: [] }),
    searchKey: value => value.toLocaleLowerCase('sv-SE'), allTags,
    hasTag: (recipe, tag) => allTags(recipe).includes(tag),
    mealTypes: { main: { label: 'Huvudrätt' } }, mealName: () => 'Huvudrätt',
    recipeTagLabels, foodGroups: {},
    archiveCard: recipe => `<article data-id="${recipe.id}"></article>`,
    document: { querySelectorAll: () => [] },
    window: { matchMedia: () => ({ matches: false }) },
  });
  vm.runInContext(state + archive, context);
  return {
    $, context, grid: $('#recipe-grid'), preview: $('#archive-preview'),
    render: () => context.renderArchive(),
    load: (detail = 1) => context.loadMoreArchiveRecipes({ detail }),
  };
}

test('the archive starts with 12 usable recipes and previews only the next three', () => {
  const view = page();
  view.render();
  assert.equal(view.grid.children.length, 12);
  assert.deepEqual(view.preview.children.map(card => card.id), ['13-recipe', '14-recipe', '15-recipe']);
  assert.equal(view.$('#archive-more').hidden, false);
  assert.equal(view.$('#archive-results').textContent, 'Visar 12 av 29 recept');
});

test('loading reuses the preview cards, preserves the viewport on click and clears the fade at the end', () => {
  const view = page();
  view.render();
  const firstCard = view.grid.children[0];
  const firstPreview = view.preview.firstElementChild;
  view.load();
  assert.equal(view.grid.children.length, 24);
  assert.equal(view.grid.children[0], firstCard);
  assert.equal(view.grid.children[12], firstPreview);
  assert.equal(firstPreview.focused?.preventScroll, true);
  assert.equal(firstPreview.scrolled, undefined);
  const nextPreview = view.preview.firstElementChild;
  view.load(0);
  assert.equal(nextPreview.focused?.preventScroll, true);
  assert.equal(nextPreview.scrolled?.block, 'nearest');
  assert.equal(nextPreview.scrolled?.behavior, 'instant');
  assert.equal(view.grid.children.length, 29);
  assert.equal(new Set(view.grid.children.map(card => card.id)).size, 29);
  assert.equal(view.$('#archive-more').hidden, true);
  assert.equal(view.preview.children.length, 0);
  assert.equal(view.$('#archive-results').textContent, 'Visar 29 recept');
});

test('saving keeps the expanded depth; changing a search, filter or sort resets it', () => {
  const view = page();
  view.render(); view.load();
  view.context.saved.add('1-recipe');
  view.render();
  assert.equal(view.grid.children.length, 24);
  view.context.archiveSearch.value = 'recept';
  view.render();
  assert.equal(view.grid.children.length, 12);
  view.load();
  view.context.archiveSort.value = 'newest';
  view.render();
  assert.equal(view.grid.children.length, 12);
  assert.equal(view.grid.children[0].id, '29-recipe');
  view.load();
  view.context.quickOnly = true;
  view.render();
  assert.equal(view.grid.children.length, 12);
  view.context.archiveSort.value = 'default';
  view.render();
  assert.equal(view.grid.children[0].id, '29-recipe');
});

test('title and publication-date sorts work in both directions', () => {
  const view = page(5);
  const details = [
    ['Örtpasta', '2026-11-20'],
    ['Albondigas', '2026-11-22'],
    ['Zucchinigratäng', '2026-11-19'],
    ['Äppelpaj', '2026-11-22'],
    ['Ålandspannkaka', '2026-11-20'],
  ];
  view.context.recipes.forEach((recipe, index) => {
    [recipe.title, recipe.date] = details[index];
  });

  const orders = {
    title: [2, 3, 5, 4, 1],
    'title-descending': [1, 4, 5, 3, 2],
    newest: [4, 2, 5, 1, 3],
    oldest: [3, 1, 5, 2, 4],
  };
  for (const [order, numbers] of Object.entries(orders)) {
    view.context.archiveSort.setValue(order);
    view.render();
    assert.deepEqual(view.grid.children.map(card => card.id), numbers.map(number => `${number}-recipe`), order);
  }
});

test('fridge matching is offered for known ingredients and respects a chosen order', () => {
  const view = page(5);
  const { archiveSort } = view.context;
  const option = view.$('#archive-sort-match');
  const items = ['custom:unknown'];
  view.context.loadPantry = () => ({ items });
  archiveSort.setValue('default');
  view.render();
  assert.equal(option.hidden, true);
  assert.equal(archiveSort.value, 'default');

  items.push('potatis');
  view.render();
  assert.equal(option.hidden, false);
  assert.equal(archiveSort.value, 'match');
  assert.deepEqual(view.grid.children.map(card => card.id), ['5-recipe', '4-recipe', '3-recipe', '2-recipe', '1-recipe']);

  items.pop();
  view.render();
  assert.equal(option.hidden, true);
  assert.equal(archiveSort.value, 'default');

  view.context.archiveSortChosen = true;
  archiveSort.setValue('title');
  items.push('potatis');
  view.render();
  assert.equal(option.hidden, false);
  assert.equal(archiveSort.value, 'title');
});

test('short results, empty searches and saved recipes do not leave a teaser or a more button', () => {
  const view = page(5);
  view.render();
  assert.equal(view.grid.children.length, 5);
  assert.equal(view.$('#archive-more').hidden, true);
  view.context.archiveSearch.value = 'no match';
  view.render();
  assert.equal(view.grid.children.length, 0);
  assert.equal(view.$('#empty-search').hidden, false);
  assert.equal(view.$('#archive-more').hidden, true);
  view.context.archiveSearch.value = '';
  view.context.savedOnly = true;
  view.context.revealedSavedFilters = true;
  view.render();
  assert.equal(view.$('#empty-saved').hidden, false);
  view.context.saved.add('1-recipe');
  view.render();
  assert.equal(view.grid.children.length, 1);
  assert.equal(view.$('#archive-results').textContent, 'Visar 1 sparat recept');
  assert.equal(view.$('#archive-more').hidden, true);
});

test('lactose-free filtering and search include lactose-free, milk-free and vegan recipes', () => {
  const view = page(4);
  const [vegan, dairyFree, lactoseFree, vegetarian] = view.context.recipes;
  vegan.tags = ['Vegan', 'Soy free'];
  dairyFree.tags = ['Dairy free'];
  lactoseFree.tags = ['Lactose free', 'Soy free'];
  vegetarian.tags = ['Vegetarian', 'Soy free'];

  const resultIds = () => view.grid.children.map(card => card.id);
  view.context.dietFilter.add('Lactose free');
  view.render();
  assert.deepEqual(resultIds(), [vegan.id, dairyFree.id, lactoseFree.id]);

  view.context.dietFilter.add('Soy free');
  view.render();
  assert.deepEqual(resultIds(), [vegan.id, lactoseFree.id]);
  assert.equal(view.$('#advanced-filter-state').textContent, '2');

  view.context.dietFilter.clear();
  view.context.dietFilter.add('Dairy free');
  view.render();
  assert.deepEqual(resultIds(), [vegan.id, dairyFree.id]);

  view.context.dietFilter.clear();
  for (const query of ['Laktosfritt', 'lactose free']) {
    view.context.archiveSearch.value = query;
    view.render();
    assert.deepEqual(resultIds(), [vegan.id, dairyFree.id, lactoseFree.id]);
  }
});

test('Utan kött matches vegetarian and vegan recipes and combines with the saved filter', () => {
  const view = page(4);
  const [vegan, vegetarian, fish, meat] = view.context.recipes;
  vegan.tags = ['Vegan'];
  vegetarian.tags = ['Vegetarian'];
  fish.tags = ['Pescatarian'];
  meat.tags = ['Pork'];

  const resultIds = () => view.grid.children.map(card => card.id);
  view.context.meatFreeOnly = true;
  view.render();
  assert.deepEqual(resultIds(), [vegan.id, vegetarian.id]);
  assert.equal(view.$('#archive-filter-count').textContent, '1');

  view.context.savedOnly = true;
  for (const recipe of [vegan, fish, meat]) view.context.saved.add(recipe.id);
  view.render();
  assert.deepEqual(resultIds(), [vegan.id]);
  assert.equal(view.$('#archive-filter-count').textContent, '2');

  view.context.meatFreeOnly = false;
  view.render();
  assert.deepEqual(resultIds(), [vegan.id, fish.id, meat.id]);
});

test('Budgetvänligt matches the Budget tag and combines with Utan kött', () => {
  const view = page(3);
  const [vegetarian, meat, untagged] = view.context.recipes;
  vegetarian.tags = ['Vegetarian', 'Budget'];
  meat.tags = ['Pork', 'Budget'];
  untagged.tags = ['Vegan'];

  const resultIds = () => view.grid.children.map(card => card.id);
  view.context.budgetOnly = true;
  view.render();
  assert.deepEqual(resultIds(), [vegetarian.id, meat.id]);
  assert.equal(view.$('#archive-filter-count').textContent, '1');

  view.context.meatFreeOnly = true;
  view.render();
  assert.deepEqual(resultIds(), [vegetarian.id]);
  assert.equal(view.$('#archive-filter-count').textContent, '2');
});
