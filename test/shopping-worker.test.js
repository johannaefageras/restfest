import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../src/shopping-worker.js', import.meta.url), 'utf8');
function worker() {
  const handlers = new Map();
  const held = new Map();
  let down = false;
  let code = 200;
  const cache = {
    async addAll(urls) { for (const url of urls) held.set(url, new Response('cached ' + url)); },
    async put(url, response) { held.set(url, response.clone()); },
    async match(url) { return held.get(url)?.clone(); },
    async keys() { return [...held.keys()].map(url => new Request(url)); },
    async delete(request) { return held.delete(request.url); },
  };
  const self = {
    registration: { scope: 'https://example.test/site/' },
    addEventListener: (name, handler) => handlers.set(name, handler),
    skipWaiting: async () => {}, clients: { claim: async () => {} },
  };
  vm.runInNewContext(source, {
    self, URL, AbortSignal,
    caches: { open: async () => cache, keys: async () => [], delete: async () => true },
    fetch: async request => {
      if (down) throw new Error('offline');
      return new Response('network ' + request.url, { status: code });
    },
  });
  return {
    held,
    down(value) { down = value; },
    code(value) { code = value; },
    async install() { let done; handlers.get('install')({ waitUntil: promise => { done = promise; } }); await done; },
    fetch(path, method = 'GET') {
      let answer;
      handlers.get('fetch')({ request: new Request(new URL(path, self.registration.scope), { method }), respondWith: promise => { answer = promise; } });
      return answer;
    },
  };
}

test('the visited shopping page and all core scripts can reopen offline, including below a subpath', async () => {
  const sw = worker();
  await sw.install();
  sw.down(true);
  for (const path of ['inkopslista.html', 'delad-inkopslista.html', 'lista/', 'data/shopping-departments.js', 'js/shopping-departments.js', 'js/shopping-copy.js', 'js/shopping-copy-links.js', 'js/shopping-share.js', 'js/shopping-copy-view.js', 'css/shopping-share.css', 'receptbok.html', 'nytt-recept.html?id=abc', 'js/recipe-book.js', 'js/load-more.js', 'js/account-sync.js', 'js/account.js', 'js/shopping-account.js', 'js/shopping-sync.js', 'js/vendor/supabase.js', 'css/kitchen.css']) {
    const response = await sw.fetch(path);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /cached https:\/\/example.test\/site\//);
  }
});

test('online visits update cached assets and offline visits use that latest successful response', async () => {
  const sw = worker();
  await sw.install();
  assert.match(await (await sw.fetch('js/app.js')).text(), /^network /);
  sw.down(true);
  assert.match(await (await sw.fetch('js/app.js')).text(), /^network /);
});

test('the worker never intercepts account APIs, sign-in, other pages or third-party requests', async () => {
  const sw = worker();
  await sw.install();
  for (const path of ['logga-in.html', 'konto.html', 'profil.html', 'rest/v1/rpc/sync_shopping_list', 'https://backend.test/functions/v1/shopping-copy?code=abc', 'https://other.test/site/inkopslista.html'])
    assert.equal(sw.fetch(path), undefined, path);
  assert.equal(sw.fetch('inkopslista.html', 'POST'), undefined);
});

test('visited public recipe pages can be opened offline, while unvisited recipes have no fabricated fallback', async () => {
  const sw = worker();
  await sw.install();
  await sw.fetch('recept/01-rodbetspytt.html');
  sw.down(true);
  assert.match(await (await sw.fetch('recept/01-rodbetspytt.html')).text(), /^network /);
  await assert.rejects(sw.fetch('recept/02-glaserade-morotter.html'));
});

test('a transient server failure falls back to the cached shopping page', async () => {
  const sw = worker();
  await sw.install();
  sw.code(503);
  const response = await sw.fetch('inkopslista.html');
  assert.equal(response.status, 200);
  assert.match(await response.text(), /^cached /);
});
