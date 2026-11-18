// Exercise the shared renderer with the real quantity/source logic. Both the account page and
// guest modal must keep purchases separate without changing stored entries or losing open drafts.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import { groupShoppingItems, shoppingRecipeSources } from '../lib/shopping-groups.js';
import { applyShoppingChanges } from '../lib/shopping-sync.js';
import { shoppingDepartmentNames, createShoppingDepartmentClassifier, groupShoppingDepartments } from '../lib/shopping-departments.js';
import { taxonomy } from '../lib/taxonomy.js';

const catalogue = JSON.parse(readFileSync(new URL('../src/_data/foods.json', import.meta.url), 'utf8'));
const classify = createShoppingDepartmentClassifier(shoppingDepartmentNames({ ...catalogue, ...taxonomy().foods }));

const source = readFileSync(new URL('../src/js/app.js', import.meta.url), 'utf8');
const code = source.slice(source.indexOf('function shoppingSources('), source.indexOf('function shoppingText('));
const item = (id, text, checked = false, extra = {}) => ({ id, text, checked, recipe: '', ...extra });
function element(dataset = {}) {
  return { dataset, hidden: false, open: false, innerHTML: '', textContent: '', querySelectorAll: () => [] };
}
function root() {
  const pending = element({ shoppingItems: 'pending' }), bought = element({ shoppingItems: 'bought' });
  const nodes = new Map([
    ['[data-shopping-empty]', element()], ['[data-shopping-pending]', element()],
    ['[data-shopping-bought]', element()], ['[data-shopping-pending-empty]', element()],
    ['[data-shopping-section-count="pending"]', element()], ['[data-shopping-section-count="bought"]', element()],
  ]);
  return {
    dataset: {}, pending, bought, nodes,
    querySelector: selector => nodes.get(selector), querySelectorAll: () => [pending, bought],
    contains: node => node === pending || node === bought,
    count: section => Number(nodes.get(`[data-shopping-section-count="${section}"]`).textContent),
  };
}
function view(items) {
  const roots = [root(), root()];
  const context = vm.createContext({
    shoppingItems: new Map(items.map(item => [item.id, item])), shoppingEditor: null,
    shoppingRecipeFilter: null, shoppingRecipeUndo: null, owner: null,
    shoppingOwner: () => context.owner,
    shoppingRecipeTools: { shoppingRecipeSources }, recipes: [], window: {},
    shoppingRows: groupShoppingItems, shoppingText: item => item.customText || item.text,
    loadShoppingDepartments() {}, shoppingSections: rows => groupShoppingDepartments(rows, classify),
    escapeHtml: value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;'),
    faIcon: () => '', showToast() {},
    document: { activeElement: null, querySelectorAll: () => roots },
    $: (selector, parent) => parent.querySelector(selector),
  });
  vm.runInContext(code + '\nrenderShoppingSources = () => {};', context);
  return {
    roots, context,
    render: () => context.renderShoppingList(),
    change(changes) {
      context.shoppingItems = new Map(applyShoppingChanges([...context.shoppingItems.values()], changes).map(item => [item.id, item]));
      context.renderShoppingList();
    },
  };
}

test('account and modal separate combined buying rows from purchases, retaining stored source entries', () => {
  const items = [item('a', '1 gul lök'), item('b', '2 gula lökar'), item('c', '500 g potatis', true), item('d', '1 l mjölk')];
  const before = structuredClone(items), page = view(items);
  page.render();
  for (const root of page.roots) {
    assert.equal(root.count('pending'), 2);
    assert.equal(root.count('bought'), 1);
    assert.match(root.pending.innerHTML, /3 gula lökar/);
    assert.doesNotMatch(root.pending.innerHTML, /500 g potatis/);
    assert.match(root.bought.innerHTML, /500 g potatis/);
    assert.doesNotMatch(root.bought.innerHTML, /gul[ a]*lök/);
    assert.equal(root.nodes.get('[data-shopping-bought]').hidden, false);
    assert.equal(root.nodes.get('[data-shopping-bought]').open, false);
  }
  assert.deepEqual(items, before);
  page.roots[0].nodes.get('[data-shopping-bought]').open = true;
  page.render();
  assert.equal(page.roots[0].nodes.get('[data-shopping-bought]').open, true, 'refresh retains the visitor disclosure choice');
});

test('buying a combined row moves every contribution and unchecking merges compatible amounts back', () => {
  const page = view([item('a', '200 g potatis', false, { note: 'Ekologisk', customText: '300 g potatis' }), item('b', '½ kg potatis', true, { note: 'Ekologisk' })]);
  page.render();
  page.change([{ kind: 'check', id: 'a', checked: true }]);
  assert.equal(page.roots[0].count('pending'), 0);
  assert.equal(page.roots[0].count('bought'), 1);
  assert.match(page.roots[0].bought.innerHTML, /800 g potatis/);
  page.change(['a', 'b'].map(id => ({ kind: 'check', id, checked: false })));
  assert.equal(page.roots[0].count('pending'), 1);
  assert.equal(page.roots[0].count('bought'), 0);
  assert.match(page.roots[0].pending.innerHTML, /800 g potatis/);
  assert.equal(page.roots[0].nodes.get('[data-shopping-bought]').hidden, true);
  assert.equal(page.context.shoppingItems.get('a').customText, '300 g potatis');
  assert.equal(page.context.shoppingItems.get('b').note, 'Ekologisk');
});

test('empty and all-purchased lists have distinct messages, including within a recipe filter', () => {
  const page = view([]);
  page.render();
  assert.equal(page.roots[0].nodes.get('[data-shopping-empty]').hidden, false);
  assert.equal(page.roots[0].nodes.get('[data-shopping-pending]').hidden, true);
  assert.equal(page.roots[0].nodes.get('[data-shopping-bought]').hidden, true);
  page.change([{ kind: 'add', id: 'a', item: item('a', '1 ägg', true, { recipe: 'Middag', source: 'archive:01-middag' }) }]);
  assert.equal(page.roots[0].nodes.get('[data-shopping-empty]').hidden, true);
  assert.equal(page.roots[0].nodes.get('[data-shopping-pending-empty]').hidden, false);
  assert.equal(page.roots[0].nodes.get('[data-shopping-pending-empty]').textContent, 'Allt är köpt.');
  page.context.shoppingRecipeFilter = { key: 'archive:01-middag', ids: ['a'], owner: null };
  page.change([{ kind: 'add', id: 'manual:a', item: item('manual:a', '2 l mjölk') }]);
  assert.equal(page.roots[0].count('pending'), 0);
  assert.equal(page.roots[0].count('bought'), 1);
  assert.equal(page.roots[0].nodes.get('[data-shopping-pending-empty]').textContent, 'Allt från receptet är köpt.');
  assert.doesNotMatch(page.roots[0].pending.innerHTML, /mjölk/);
});

test('remote purchase changes keep an open draft in its section without duplicating its sources', () => {
  for (const startedBought of [false, true]) {
    const page = view([item('a', '1 ägg', startedBought)]);
    page.render();
    const section = startedBought ? 'bought' : 'pending';
    page.context.shoppingEditor = { id: 'a', owner: null, list: page.roots[0][section], position: 0,
      entries: [{ id: 'a', text: '2 ägg', note: 'Utkast' }] };
    page.change([{ kind: 'check', id: 'a', checked: !startedBought }]);
    assert.match(page.roots[0][section].innerHTML, /value="2 ägg"/);
    assert.match(page.roots[0][section].innerHTML, /value="Utkast"/);
    assert.equal(page.roots[0][startedBought ? 'pending' : 'bought'].innerHTML, '');
    assert.equal(page.roots[1].count(startedBought ? 'pending' : 'bought'), 1, 'the other view reflects the actual purchase state');
    page.context.shoppingEditor = null;
    page.render();
    assert.equal(page.roots[0].count(section), 0);
    assert.equal(page.roots[0].count(startedBought ? 'pending' : 'bought'), 1);
  }
});

test('department sections follow displayed edits and keep counts, identities and recipe filters intact', () => {
  const page = view([
    item('a', '1 l mjölk', false, { recipe: 'Soppa', source: 'archive:01-soppa', note: 'Laktosfri' }),
    item('b', '2 tomater', false, { recipe: 'Soppa', source: 'archive:01-soppa' }),
    item('c', '1 kg potatis'), item('d', '1 påse chips'), item('e', 'Okänd vara'),
  ]);
  page.render();
  const list = page.roots[0].pending;
  assert.equal(page.roots[0].count('pending'), 5, 'department headings are not counted as items');
  assert.match(list.innerHTML, /data-shopping-department="produce"/);
  assert.match(list.innerHTML, /data-shopping-department="dairy"/);
  assert.match(list.innerHTML, /data-shopping-department="other"/);
  assert.ok(list.innerHTML.indexOf('Frukt &amp; grönt') < list.innerHTML.indexOf('Mejeri &amp; ägg'));
  page.change([{ kind: 'edit', id: 'a', fields: { customText: '500 g fryst broccoli' } }]);
  assert.doesNotMatch(list.innerHTML, /data-shopping-department="dairy"/);
  assert.match(list.innerHTML, /data-shopping-department="frozen"/);
  assert.match(list.innerHTML, /Laktosfri/);
  assert.equal(page.context.shoppingItems.get('a').source, 'archive:01-soppa');
  page.context.shoppingRecipeFilter = { key: 'archive:01-soppa', ids: ['a', 'b'], owner: null };
  page.render();
  assert.equal(page.roots[0].count('pending'), 2);
  assert.doesNotMatch(list.innerHTML, /chips|Okänd vara|potatis/);
});
