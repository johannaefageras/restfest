// Exercise the browser bridge with separate account caches and a real outbox, using fake DOM,
// storage and network boundaries. Only the module import URL changes for Node.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { applyShoppingChanges } from '../lib/shopping-sync.js';

const source = readFileSync(new URL('../src/js/shopping-account.js', import.meta.url), 'utf8')
  .replace("'./shopping-sync.js'", JSON.stringify(new URL('../lib/shopping-sync.js', import.meta.url).href));
const { createShoppingAccount } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const item = id => ({ id, text: id, recipe: 'Middag', checked: false });

function browser(t, initial = []) {
  const values = new Map([['restfest-shopping-list', JSON.stringify(initial)]]);
  const storage = {
    get length() { return values.size; }, key: i => [...values.keys()][i],
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, String(value)); },
    removeItem: key => { values.delete(key); },
  };
  const server = new Map();
  const seen = new Set();
  let user = null;
  let down = false;
  let calls = 0;
  const document = new EventTarget();
  document.hidden = true; // No polling timers: each test explicitly asks for a refresh.
  document.querySelector = () => ({ content: 'https://example.supabase.co', dataset: { key: 'public-test' } });
  const globals = {
    localStorage: storage, document, window: new EventTarget(), navigator: { onLine: true },
    readShoppingItems: () => new Map(JSON.parse(storage.getItem('restfest-shopping-list') ?? '[]').map(item => [item.id, item])),
    setShoppingItems: items => storage.setItem('restfest-shopping-list', JSON.stringify(items)),
    async fetch(url, options) {
      calls++;
      if (down) throw new Error('offline');
      const owner = options.headers.Authorization.replace('Bearer token-', '');
      let items = server.get(owner) ?? [];
      for (const change of JSON.parse(options.body).changes) {
        if (seen.has(change.op)) continue;
        seen.add(change.op);
        items = applyShoppingChanges(items, [change]);
      }
      server.set(owner, items);
      return Response.json(items);
    },
  };
  for (const [key, value] of Object.entries(globals)) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
    t.after(() => descriptor ? Object.defineProperty(globalThis, key, descriptor) : delete globalThis[key]);
  }
  const client = async () => ({ auth: { getSession: async () => ({ data: { session: { user: { id: user }, access_token: 'token-' + user } } }) } });
  const bridge = () => createShoppingAccount({ client, currentUser: () => user });
  return {
    bridge, server, storage,
    user(id) { user = id; },
    down(value) { down = value; },
    calls: () => calls,
    shown: () => JSON.parse(storage.getItem('restfest-shopping-list')),
    change(api, changes) { globals.setShoppingItems(api.change(changes)); },
  };
}

test('an existing signed-out list is imported into the account once, preserving server items', async t => {
  const env = browser(t, [item('guest')]);
  env.server.set('A', [item('remote')]);
  const api = env.bridge();
  api.activate(null);
  assert.equal(env.calls(), 0, 'signed-out visitors make no shopping API requests');
  env.user('A'); api.activate('A');
  await api.refresh();
  assert.deepEqual(env.shown().map(item => item.id), ['remote', 'guest']);
  env.change(api, [{ kind: 'remove', id: 'guest' }]);
  await api.refresh();
  const reopened = env.bridge();
  reopened.activate('A');
  await reopened.refresh();
  assert.deepEqual(env.shown().map(item => item.id), ['remote']);
});

test('signing out hides the private list and keeps unsent changes for the same account', async t => {
  const env = browser(t);
  env.user('A');
  const api = env.bridge();
  api.activate('A');
  env.down(true);
  env.change(api, [{ kind: 'add', id: 'private', item: item('private') }]);
  assert.equal(await api.refresh(), false);
  env.user(null); api.activate(null);
  assert.deepEqual(env.shown(), []);
  env.user('B'); api.activate('B');
  env.down(false);
  await api.refresh();
  assert.deepEqual(env.server.get('B'), []);
  env.user('A'); api.activate('A');
  assert.deepEqual(env.shown(), [item('private')]);
  await api.refresh();
  assert.deepEqual(env.server.get('A'), [item('private')]);
});

test('a new guest list merges on the next sign-in without copying the previous account list', async t => {
  const env = browser(t);
  const api = env.bridge();
  env.user('A'); api.activate('A');
  env.change(api, [{ kind: 'add', id: 'A-only', item: item('A-only') }]);
  await api.refresh();
  env.user(null); api.activate(null);
  env.change(api, [{ kind: 'add', id: 'guest', item: item('guest') }]);
  env.user('B'); api.activate('B');
  await api.refresh();
  assert.deepEqual(env.server.get('B'), [item('guest')]);
  assert.deepEqual(env.server.get('A'), [item('A-only')]);
});

test('a different authentication session cannot receive another owner\'s queued changes', async t => {
  const env = browser(t);
  env.user('A');
  const api = env.bridge();
  api.activate('A');
  env.change(api, [{ kind: 'add', id: 'private', item: item('private') }]);
  env.user('B'); // The marker changed while this tab still had A activated.
  assert.equal(await api.refresh(), false);
  assert.equal(env.calls(), 0);
});

test('deleting an account discards its local cache and outbox while keeping another account\'s', t => {
  const env = browser(t);
  env.storage.setItem('restfest-shopping:B:items', JSON.stringify([item('B-only')]));
  env.user('A');
  const api = env.bridge();
  api.activate('A');
  env.change(api, [{ kind: 'add', id: 'private', item: item('private') }]);
  api.discard();
  assert.deepEqual(env.shown(), []);
  assert.equal([...Array(env.storage.length)].map((_, i) => env.storage.key(i)).some(key => key.startsWith('restfest-shopping:A:')), false);
  assert.ok(env.storage.getItem('restfest-shopping:B:items'));
});
