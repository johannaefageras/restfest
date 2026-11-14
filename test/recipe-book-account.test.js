import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { applyBookChanges } from '../lib/recipe-book-sync.js';

const source = readFileSync(new URL('../src/js/recipe-book-account.js', import.meta.url), 'utf8')
  .replace("'./recipe-book-sync.js'", JSON.stringify(new URL('../lib/recipe-book-sync.js', import.meta.url).href));
const { createRecipeBookAccount } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const genId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const generated = { id: genId, recipe: { title: 'Ny middag', description: 'En middag', categories: ['main'], tags: [], timeLabel: '20 min' }, saveFor: 'A', saved: false };

function browser(t, initial = [], visible = false) {
  const values = new Map([['restfest-saved', JSON.stringify(initial)]]);
  const storage = {
    get length() { return values.size; }, key: i => [...values.keys()][i],
    getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key),
  };
  const server = new Map(), receipts = new Set(), removed = new Set(), timers = new Map();
  let user = null, down = false, shown, hold;
  let timerId = 0;
  const document = new EventTarget(), window = new EventTarget();
  document.hidden = !visible;
  document.querySelector = () => ({ content: 'https://example.test', dataset: { key: 'public' } });
  const globals = {
    document, window, localStorage: storage, navigator: { onLine: true },
    setTimeout(callback, delay) { const id = ++timerId; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    readSavedRecipes: () => new Set(JSON.parse(storage.getItem('restfest-saved') ?? '[]')),
    async fetch(url, options) {
      if (down) throw new Error('offline');
      const owner = options.headers.Authorization.replace('Bearer token-', '');
      let snapshot = server.get(owner) ?? { archive: [], generated: [] };
      for (const change of JSON.parse(options.body).changes) {
        if (receipts.has(change.op)) continue;
        receipts.add(change.op);
        const key = owner + ':' + change.kind + ':' + change.id;
        if (change.saved && change.import && removed.has(key)) continue;
        snapshot = applyBookChanges(snapshot, [change]);
        if (!change.saved) removed.add(key); else removed.delete(key);
      }
      server.set(owner, snapshot);
      if (hold) await hold;
      return Response.json(snapshot);
    },
  };
  for (const [key, value] of Object.entries(globals)) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
    t.after(() => descriptor ? Object.defineProperty(globalThis, key, descriptor) : delete globalThis[key]);
  }
  const client = async () => ({ auth: { getSession: async () => ({ data: { session: { user: { id: user }, access_token: 'token-' + user } } }) } });
  return {
    server, storage, window, document, timers,
    bridge: () => createRecipeBookAccount({ client, currentUser: () => user, show(snapshot) { shown = snapshot; storage.setItem('restfest-saved', JSON.stringify(snapshot.archive.map(row => row.recipe_id))); } }),
    user(id) { user = id; }, down(value) { down = value; }, hold(value) { hold = value; }, shown: () => shown,
    async timer() { const [id, entry] = [...timers][0]; timers.delete(id); await entry.callback(); },
  };
}

test('both recipe types survive offline changes and reopening before syncing', async t => {
  const env = browser(t);
  env.user('A'); env.down(true);
  const first = env.bridge(); first.activate('A');
  first.change({ kind: 'archive', id: '01-rodbetspytt', saved: true });
  first.noteGenerated(generated);
  assert.equal(await first.refresh(), false);
  const reopened = env.bridge(); reopened.activate('A');
  assert.equal(reopened.snapshot().archive.length, 1);
  assert.equal(reopened.snapshot().generated[0].title, 'Ny middag');
  assert.equal(reopened.cachedRecipe(genId).recipe.title, 'Ny middag');
  env.down(false); await reopened.refresh();
  assert.equal(env.server.get('A').archive.length, 1);
  assert.equal(env.server.get('A').generated.length, 1);
  assert.equal(reopened.status().pending, 0);
});

test('reconnection and focus automatically retry the durable book outbox', async t => {
  const env = browser(t, [], true);
  env.user('A'); env.down(true);
  const api = env.bridge(); api.activate('A');
  api.change({ kind: 'archive', id: '01-rodbetspytt', saved: true });
  await env.timer();
  assert.equal(api.status().phase, 'waiting');
  env.down(false); env.window.dispatchEvent(new Event('online'));
  assert.equal([...env.timers.values()][0].delay, 0);
  await env.timer();
  assert.equal(api.status().phase, 'saved');
  assert.equal(env.server.get('A').archive.length, 1);
  assert.equal([...env.timers.values()][0].delay, 15000);
  env.window.dispatchEvent(new Event('focus'));
  assert.equal([...env.timers.values()][0].delay, 0);
});

test('a cached book remains visible when a later refresh fails', async t => {
  const env = browser(t, ['01-rodbetspytt']);
  env.user('A');
  const api = env.bridge(); api.activate('A'); await api.refresh();
  assert.equal(api.snapshot().fetched, true);
  env.down(true);
  const reopened = env.bridge(); reopened.activate('A');
  assert.equal(await reopened.refresh(), false);
  assert.equal(env.shown().archive[0].recipe_id, '01-rodbetspytt');
  assert.equal(reopened.snapshot().fetched, true);
});

test('guest favorites import once and account switches keep both books and offline recipes private', async t => {
  const env = browser(t, ['01-rodbetspytt']);
  const api = env.bridge(); api.activate(null);
  env.user('A'); api.activate('A'); api.noteGenerated(generated); await api.refresh();
  env.user(null); api.activate(null);
  assert.deepEqual(env.shown().archive, []);
  env.user('B'); api.activate('B'); await api.refresh();
  assert.deepEqual(api.snapshot().generated, []);
  assert.equal(api.cachedRecipe(genId), null);
  env.user('A'); api.activate('A');
  assert.equal(api.cachedRecipe(genId).recipe.title, 'Ny middag');
  api.change({ kind: 'archive', id: '01-rodbetspytt', saved: false }); await api.refresh();
  const reopened = env.bridge(); reopened.activate('A'); await reopened.refresh();
  assert.equal(reopened.snapshot().archive.length, 0, 'old cached favorites are not re-imported');
});

test('a generation completed after an account switch is queued only for its verified original owner', async t => {
  const env = browser(t);
  env.user('B'); const api = env.bridge(); api.activate('B');
  api.noteGenerated(generated); await api.refresh();
  assert.equal(api.snapshot().generated.length, 0);
  env.user('A'); api.activate('A'); await api.refresh();
  assert.equal(api.snapshot().generated[0].id, genId);
});

test('a stale response after sign-out cannot replace the current account book or acknowledge its queue', async t => {
  const env = browser(t);
  env.user('A'); const api = env.bridge(); api.activate('A');
  api.change({ kind: 'archive', id: '01-rodbetspytt', saved: true });
  let release; env.hold(new Promise(resolve => { release = resolve; }));
  const flight = api.refresh();
  await new Promise(resolve => setImmediate(resolve));
  env.user('B'); api.activate('B');
  release(); await flight;
  assert.equal(api.snapshot().archive.length, 0);
  assert.ok([...Array(env.storage.length)].map((_, i) => env.storage.key(i)).some(key => key.startsWith('restfest-book:A:change:')));
});

test('legacy queued changes and a stashed generated favorite migrate to the correct owners', async t => {
  const env = browser(t);
  env.storage.setItem('restfest-saved-queue', JSON.stringify([{ kind: 'archive', id: '01-rodbetspytt', saved: true }]));
  env.storage.setItem('restfest-saved-stash', JSON.stringify({ user: 'B', queue: [{ kind: 'generated', id: genId, saved: true }] }));
  env.user('A'); const api = env.bridge(); api.activate('A'); await api.refresh();
  assert.equal(api.snapshot().archive.length, 1);
  assert.equal(api.snapshot().generated.length, 0);
  env.user('B'); api.activate('B'); await api.refresh();
  assert.equal(api.snapshot().generated.length, 1);
  assert.equal(api.snapshot().archive.length, 0);
});

test('account deletion removes its book cache, queued hearts and stored recipe bodies', t => {
  const env = browser(t);
  env.user('A'); const api = env.bridge(); api.activate('A'); api.noteGenerated(generated);
  env.storage.setItem('restfest-book:B:items', JSON.stringify({ archive: [], generated: [] }));
  api.discard();
  assert.equal([...Array(env.storage.length)].map((_, i) => env.storage.key(i)).some(key => key.startsWith('restfest-book:A:')), false);
  assert.ok(env.storage.getItem('restfest-book:B:items'));
});

test('a following tab clears its view even after another tab has switched the shared owner to guest', async t => {
  const env = browser(t);
  env.user('A');
  const first = env.bridge(), second = env.bridge();
  first.activate('A'); first.noteGenerated(generated); await first.refresh();
  second.activate('A');
  env.user(null); first.activate(null);
  let redraws = 0;
  env.document.addEventListener('restfest:book', () => { redraws++; });
  second.activate(null);
  assert.equal(redraws, 1);
  assert.deepEqual(env.shown().generated, []);
});
