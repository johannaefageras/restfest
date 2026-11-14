import assert from 'node:assert/strict';
import test from 'node:test';
import { applyShoppingChanges, shoppingStorage, shoppingSync } from '../lib/shopping-sync.js';
import { groupShoppingItems, shoppingRecipeSources, removeShoppingRecipe, restoreShoppingRecipe } from '../lib/shopping-groups.js';

const item = (id, checked = false) => ({ id, text: `Vara ${id}`, recipe: 'Middag', checked });
const add = id => ({ kind: 'add', id, item: item(id) });
const check = (id, checked = true) => ({ kind: 'check', id, checked });
const remove = id => ({ kind: 'remove', id });
const edit = (id, fields) => ({ kind: 'edit', id, fields });
export function localStorageMock() {
  const values = new Map();
  return {
    get length() { return values.size; },
    key: i => [...values.keys()][i],
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, String(value)); },
    removeItem: key => { values.delete(key); },
  };
}
function server() {
  let items = [];
  const removed = new Set();
  const seen = new Set();
  const self = {
    calls: [], down: false, loseResponse: false,
    async remote(changes) {
      self.calls.push(changes);
      if (self.down) throw new Error('offline');
      for (const change of changes) {
        if (seen.has(change.op)) continue;
        seen.add(change.op);
        if (change.kind === 'import' && removed.has(change.id)) continue;
        items = applyShoppingChanges(items, [change]);
        if (change.kind === 'remove') removed.add(change.id);
        if (change.kind === 'add') removed.delete(change.id);
      }
      if (self.loseResponse) { self.loseResponse = false; throw new Error('response lost'); }
      return structuredClone(items);
    },
    items: () => structuredClone(items),
  };
  return self;
}
function device(there, disk = localStorageMock(), user = 'A', extra = {}) {
  const storage = shoppingStorage(disk, user);
  const view = { shown: null, status: null };
  view.sync = shoppingSync({ storage, remote: there.remote, show: items => { view.shown = items; }, status: state => { view.status = state; }, ...extra });
  return { ...view, view, disk, storage, sync: view.sync };
}

test('offline additions, checks and removals survive closing and reopening the page', async () => {
  const there = server();
  const first = device(there);
  there.down = true;
  first.sync.change([add('a'), add('b'), check('a'), remove('b')]);
  assert.equal(await first.sync.refresh(), false);
  const reopened = device(there, first.disk);
  assert.deepEqual(reopened.sync.items(), [item('a', true)]);
  there.down = false;
  assert.equal(await reopened.sync.refresh(), true);
  assert.deepEqual(there.items(), [item('a', true)]);
  assert.equal(reopened.storage.pending().length, 0);
});

test('a stale second device adds its item without undoing a purchase or removal', async () => {
  const there = server();
  const first = device(there), second = device(there);
  first.sync.change([add('a'), add('b')]);
  await first.sync.refresh();
  await second.sync.refresh();
  first.sync.change([check('a'), remove('b')]);
  await first.sync.refresh();
  second.sync.change([add('c')]);
  await second.sync.refresh();
  assert.deepEqual(there.items(), [item('a', true), item('c')]);
});

test('combined totals survive offline edits and keep each recipe contribution independently removable', async () => {
  const there = server(), first = device(there), second = device(there);
  const a = { id: 'recipe-a:potato', text: '200 g potatis', recipe: 'Recept A', checked: false };
  const b = { id: 'recipe-b:potato', text: '½ kg potatis', recipe: 'Recept B', checked: false };
  first.sync.change([a,b].map(item => ({ kind: 'add', id: item.id, item })));
  await first.sync.refresh();
  await second.sync.refresh();
  assert.equal(groupShoppingItems(second.sync.items())[0].text, '700 g potatis');
  there.down = true;
  first.sync.change([edit(a.id, { customText: '300 g potatis' })]);
  const reopened = device(there, first.disk);
  assert.equal(groupShoppingItems(reopened.sync.items())[0].text, '800 g potatis');
  there.down = false;
  second.sync.change([remove(b.id)]);
  await second.sync.refresh();
  await reopened.sync.refresh();
  assert.equal(groupShoppingItems(reopened.sync.items())[0].text, '300 g potatis');
  assert.deepEqual(there.items(), [{ ...a, customText: '300 g potatis' }]);
});

test('removing and undoing a recipe offline survives reopening without changing other recipes or manual items', async () => {
  const there = server(), first = device(there);
  const a = { id: 'a-potato', text: '200 g potatis', recipe: 'Soppa', source: 'archive:01-soppa', checked: false, note: 'Ekologisk' };
  const egg = { id: 'a-egg', text: '2 ägg', recipe: 'Soppa', source: 'archive:01-soppa', checked: true, customText: '3 ägg' };
  const b = { id: 'b-potato', text: '500 g potatis', recipe: 'Gratäng', source: 'archive:02-gratang', checked: false };
  const manual = { id: 'manual:potato', text: '300 g potatis', recipe: '', checked: false };
  first.sync.change([a,egg,b,manual].map(item => ({ kind: 'add', id: item.id, item })));
  await first.sync.refresh();
  const source = shoppingRecipeSources(first.sync.items()).find(source => source.key === a.source);
  there.down = true;
  const removal = removeShoppingRecipe(first.sync.items(), source.items.map(item => item.id));
  first.sync.change(removal.changes);
  assert.deepEqual(first.sync.items(), [b,manual]);
  first.sync.change(restoreShoppingRecipe(first.sync.items(), removal.removed));
  const reopened = device(there, first.disk);
  assert.equal(reopened.sync.items().find(item => item.id === egg.id).checked, true);
  assert.equal(reopened.sync.items().find(item => item.id === egg.id).customText, '3 ägg');
  there.down = false;
  await reopened.sync.refresh();
  assert.deepEqual(there.items(), reopened.sync.items());
  assert.equal(reopened.storage.pending().length, 0);
  assert.deepEqual(there.items().find(item => item.id === a.id), a);
});

test('undo after another device restores a contribution preserves its newer note and purchase', async () => {
  const there = server(), first = device(there), second = device(there);
  first.sync.change([add('a'), add('b')]);
  await first.sync.refresh();
  const removal = removeShoppingRecipe(first.sync.items(), ['a','b']);
  first.sync.change(removal.changes);
  await first.sync.refresh();
  second.sync.change([add('a'), check('a'), edit('a', { note: 'Senaste val' })]);
  await second.sync.refresh();
  await first.sync.refresh();
  first.sync.change(restoreShoppingRecipe(first.sync.items(), removal.removed));
  await first.sync.refresh();
  assert.deepEqual(there.items(), [{ ...item('a', true), note: 'Senaste val' }, item('b')]);
});

test('checking a stale row cannot recreate an item another device removed', async () => {
  const there = server();
  const first = device(there), second = device(there);
  first.sync.change([add('a')]);
  await first.sync.refresh();
  await second.sync.refresh();
  first.sync.change([remove('a')]);
  await first.sync.refresh();
  second.sync.change([check('a')]);
  await second.sync.refresh();
  assert.deepEqual(second.view.shown, []);
});

test('manual items and offline edits survive a reload, preserving notes and recipe membership', async () => {
  const there = server();
  const first = device(there);
  const manual = { id: 'manual:milk', text: '2 l mjölk', recipe: '', checked: false, note: 'Laktosfri' };
  there.down = true;
  first.sync.change([{ kind: 'add', id: manual.id, item: manual }, add('recipe'), edit('recipe', { customText: '3 dl grädde', note: 'Till såsen' })]);
  await first.sync.refresh();
  const reopened = device(there, first.disk);
  assert.deepEqual(reopened.sync.items(), [manual, { ...item('recipe'), customText: '3 dl grädde', note: 'Till såsen' }]);
  there.down = false;
  await reopened.sync.refresh();
  assert.deepEqual(there.items(), reopened.sync.items());
  assert.equal(reopened.storage.pending().length, 0);
});

test('editing only the amount preserves another device purchase, note and source ingredient', async () => {
  const there = server();
  const first = device(there), second = device(there);
  first.sync.change([add('a')]);
  await first.sync.refresh();
  await second.sync.refresh();
  first.sync.change([check('a'), edit('a', { note: 'Ekologisk' })]);
  await first.sync.refresh();
  second.sync.change([edit('a', { customText: '2 l mjölk' })]);
  await second.sync.refresh();
  assert.deepEqual(there.items(), [{ ...item('a', true), customText: '2 l mjölk', note: 'Ekologisk' }]);
});

test('a stale edit cannot restore a deleted item and a retried edit cannot undo a newer one', async () => {
  const there = server();
  const first = device(there), second = device(there);
  first.sync.change([add('a'), add('b')]);
  await first.sync.refresh();
  await second.sync.refresh();
  first.sync.change([edit('a', { customText: 'Första ändringen' })]);
  there.loseResponse = true;
  await first.sync.refresh();
  second.sync.change([edit('a', { customText: 'Senaste ändringen' }), remove('b')]);
  await second.sync.refresh();
  first.sync.change([edit('b', { note: 'Gammal ändring' })]);
  await first.sync.refresh();
  assert.deepEqual(there.items(), [{ ...item('a'), customText: 'Senaste ändringen' }]);
});

test('guest imports preserve server checkmarks and do not resurrect deleted items', async () => {
  const there = server();
  const first = device(there);
  first.sync.change([add('a'), check('a'), add('b'), remove('b')]);
  await first.sync.refresh();
  const second = device(there);
  second.sync.change(['a', 'b', 'c'].map(id => ({ ...add(id), kind: 'import' })));
  await second.sync.refresh();
  assert.deepEqual(there.items(), [item('a', true), item('c')]);
});

test('a lost response can be retried without replaying its old value over a newer purchase', async () => {
  const there = server();
  const first = device(there), second = device(there);
  first.sync.change([add('a')]);
  there.loseResponse = true;
  assert.equal(await first.sync.refresh(), false);
  await second.sync.refresh();
  second.sync.change([check('a')]);
  await second.sync.refresh();
  await first.sync.refresh();
  assert.deepEqual(there.items(), [item('a', true)]);
  assert.deepEqual(first.view.shown, [item('a', true)]);
});

test('an edit made while a request is in flight is displayed and sent afterwards', async () => {
  const there = server();
  let here;
  let once = true;
  here = device(there, undefined, 'A', {
    async remote(changes) {
      const snapshot = await there.remote(changes);
      if (once) { once = false; here.sync.change([check('a')]); }
      return snapshot;
    },
  });
  here.sync.change([add('a')]);
  await here.sync.refresh();
  assert.deepEqual(here.view.shown, [item('a', true)]);
  assert.equal(there.calls.length, 2);
});

test('pending work for another user is never read, sent or shown after an account switch', async () => {
  const there = server();
  const disk = localStorageMock();
  let active = true;
  const first = device(there, disk, 'A', {
    active: () => active,
    async remote(changes) { const result = await there.remote(changes); active = false; return result; },
  });
  first.sync.change([add('private')]);
  assert.equal(await first.sync.refresh(), false);
  assert.equal(first.view.shown, null);
  assert.equal(first.storage.pending().length, 1);
  const second = device(server(), disk, 'B');
  assert.deepEqual(second.sync.items(), []);
  assert.equal(second.storage.pending().length, 0);
});

test('two tabs keep distinct outbox entries and acknowledge only their own batch', () => {
  const disk = localStorageMock();
  const first = shoppingStorage(disk, 'A'), second = shoppingStorage(disk, 'A');
  first.append([add('a')]);
  const sent = first.pending();
  second.append([check('a')]);
  first.acknowledge(sent);
  assert.equal(second.pending().length, 1);
  assert.equal(second.pending()[0].kind, 'check');
});

test('a long offline queue is drained in bounded batches', async () => {
  const there = server();
  const here = device(there);
  here.sync.change(Array.from({ length: 235 }, (_, i) => add(String(i))));
  await here.sync.refresh();
  assert.deepEqual(there.calls.map(batch => batch.length), [100, 100, 35]);
  assert.equal(there.items().length, 235);
});

test('storage failure keeps changes in memory and reports that they are not durable', async () => {
  const disk = localStorageMock();
  disk.setItem = () => { throw new Error('quota'); };
  const there = server();
  const here = device(there, disk);
  here.sync.change([add('a')]);
  assert.equal(here.view.status.durable, false);
  assert.deepEqual(here.sync.items(), [item('a')]);
  await here.sync.refresh();
  assert.deepEqual(there.items(), [item('a')]);
});
