import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { shoppingRecipeSources, removeShoppingRecipe, restoreShoppingRecipe, groupShoppingItems } from '../lib/shopping-groups.js';
import { applyShoppingChanges } from '../lib/shopping-sync.js';

const uuid = 'aaaaaaaa-1234-4567-89ab-aaaaaaaaaaaa';
const line = (recipe, key, text, extra = {}) => ({ id: JSON.stringify([recipe, key, text]), text, recipe: 'Middag', checked: false, ...extra });

test('recipes with identical titles stay distinct, and manual items remain independent', () => {
  const items = [line('01-soppa', 'a', '200 g potatis'), line('02-gratang', 'b', '500 g potatis'), { id: 'manual:1', text: '300 g potatis', recipe: '', checked: false }];
  const sources = shoppingRecipeSources(items);
  assert.deepEqual(sources.map(source => [source.key, source.path]), [
    ['archive:01-soppa', 'recept/01-soppa.html'], ['archive:02-gratang', 'recept/02-gratang.html'],
  ]);
  const { changes, removed } = removeShoppingRecipe(items, sources[0].items.map(item => item.id));
  const left = applyShoppingChanges(items, changes);
  assert.equal(groupShoppingItems(left)[0].text, '800 g potatis');
  assert.deepEqual(left.map(item => item.id), [items[1].id, 'manual:1']);
  assert.deepEqual(applyShoppingChanges(left, restoreShoppingRecipe(left, removed)).sort((a,b)=>a.id.localeCompare(b.id)), [...items].sort((a,b)=>a.id.localeCompare(b.id)));
});

test('full generated identities survive their legacy short ingredient ids and produce exact recipe links', () => {
  const item = line('ny-aaaaaaaa', 'a', '2 ägg', { source: `generated:${uuid}` });
  const [source] = shoppingRecipeSources([item], [], [{ id: uuid, title: 'Egen middag' }]);
  assert.equal(source.key, `generated:${uuid}`);
  assert.equal(source.path, `nytt-recept.html?id=${uuid}`);
  assert.equal(source.title, 'Egen middag');
  assert.equal(item.id, JSON.stringify(['ny-aaaaaaaa', 'a', '2 ägg']));
});

test('old generated links resolve only when the saved recipe identity is unambiguous', () => {
  const item = line('ny-aaaaaaaa', 'a', '2 ägg');
  assert.equal(shoppingRecipeSources([item])[0].path, null);
  assert.equal(shoppingRecipeSources([item], [], [{ id: uuid }])[0].path, `nytt-recept.html?id=${uuid}`);
  assert.equal(shoppingRecipeSources([item], [], [{ id: uuid }, { id: 'aaaaaaaa-0000-0000-0000-000000000000' }])[0].path, null);
});

test('recipe counts include purchased contributions and existing archive ids recover their source', () => {
  const a = line('01-soppa', 'a', '2 ägg', { checked: true });
  const b = line('01-soppa', 'b', '1 dl mjölk');
  const [source] = shoppingRecipeSources([a,b], [{ id: '01-soppa', title: 'Ny titel' }]);
  assert.equal(source.title, 'Ny titel');
  assert.equal(source.remaining, 1);
  assert.equal(source.items.length, 2);
});

test('undo preserves edited text, notes and purchases and never replaces a newer restored entry', () => {
  const old = line('01-soppa', 'a', '200 g potatis', { customText: '300 g potatis', note: 'Ekologisk', checked: true, source: 'archive:01-soppa' });
  const newer = { ...old, customText: '400 g potatis', note: 'Ny anteckning' };
  assert.deepEqual(restoreShoppingRecipe([newer], [old]), []);
  assert.deepEqual(restoreShoppingRecipe([], [old]), [{ kind: 'add', id: old.id, item: old }]);
  const { removed } = removeShoppingRecipe([old], [old.id]);
  removed[0].note = 'Draft only';
  assert.equal(old.note, 'Ekologisk');
});

test('a recipe removal targets its displayed ids, preserving contributions added afterwards', () => {
  const a = line('01-soppa', 'a', '2 ägg');
  const later = line('01-soppa', 'b', '1 dl mjölk');
  const { changes } = removeShoppingRecipe([a,later], [a.id]);
  assert.deepEqual(applyShoppingChanges([a,later], changes), [later]);
});

test('legacy shared week entries stay visibly grouped and unsafe source URLs are never followed', () => {
  const a = { id: JSON.stringify(['week', 'potatis']), text: 'Potatis', recipe: 'Soppa · Gratäng', checked: false };
  const b = { ...a, id: JSON.stringify(['week', 'mjolk']), text: 'Mjölk', recipe: 'Soppa' };
  const [source] = shoppingRecipeSources([a,b]);
  assert.equal(source.kind, 'legacy-week');
  assert.equal(source.items.length, 2);
  assert.equal(source.path, null);
  for (const unsafe of ['javascript:alert(1)', 'archive:../../konto', 'generated:bad?id=1']) {
    assert.equal(shoppingRecipeSources([{ ...a, id: 'old-item', source: unsafe }])[0].path, null);
  }
});

test('new week-plan additions retain separate recipe identities without guessing missing quantities', () => {
  const source = readFileSync(new URL('../src/js/kitchen.js', import.meta.url), 'utf8');
  const code = source.slice(source.indexOf('function weekShoppingLines('), source.indexOf('function updateWeekShopButton('));
  const context = vm.createContext({ foods: { potatis: { name: 'Potatis' } } });
  vm.runInContext(code, context);
  const result = JSON.parse(JSON.stringify(context.weekShoppingLines([
    { missing: ['potatis'], recipe: { id: '01-soppa', title: 'Soppa' } },
    { missing: ['potatis'], recipe: { id: '02-gratang', title: 'Gratäng' } },
  ])));
  assert.equal(result.length, 2);
  assert.notEqual(result[0].id, result[1].id);
  assert.deepEqual(result.map(item => item.source), ['archive:01-soppa', 'archive:02-gratang']);
  assert.deepEqual(result.map(item => item.text), ['Potatis', 'Potatis']);
  assert.equal(shoppingRecipeSources(result).length, 2);
  assert.equal(groupShoppingItems(result).length, 1);
});
