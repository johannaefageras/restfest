import assert from 'node:assert/strict';
import test from 'node:test';
import { createShoppingCopy, encodeShoppingCopy } from '../lib/shopping-copy.js';
import { createShoppingCopyLink, loadShoppingCopy } from '../lib/shopping-copy-links.js';

const base = 'https://example.test/site/';
const api = 'https://backend.test/functions/v1';
const code = 'mK9d_P4wR8eV2sT6aX0bQz';
const snapshot = () => createShoppingCopy([{ id: 'private-id', recipe: 'Hemligt recept', text: '2 l mjölk', note: 'Laktosfri' }], 'Till helgen');
const json = (data, status = 200) => new Response(JSON.stringify(data), { status });

test('short links contain only a fixed-length code and round-trip independent display snapshots', async () => {
  let saved;
  const fetcher = async (url, options) => {
    assert.equal(options.credentials, 'omit');
    assert.equal(options.referrerPolicy, 'no-referrer');
    assert.equal(options.cache, 'no-store');
    if (options.method === 'POST') {
      assert.equal(url, `${api}/shopping-copy`);
      saved = JSON.parse(options.body);
      assert.doesNotMatch(options.body, /private-id|Hemligt recept|account/);
      return json({ code });
    }
    assert.equal(url, `${api}/shopping-copy?code=${code}`);
    return json(saved);
  };
  const copy = snapshot();
  const link = await createShoppingCopyLink(copy, { base, api, fetcher });
  assert.equal(link, `${base}lista/#${code}`);
  assert.deepEqual(await loadShoppingCopy(new URL(link).hash.slice(1), { api, fetcher }), copy);
  const larger = { ...copy, i: Array.from({ length: 500 }, () => ['1 kg potatis', '', '']) };
  assert.equal((await createShoppingCopyLink(larger, { base, api, fetcher })).length, link.length);
});

test('existing links and backend-free builds work without requesting a server', async () => {
  const copy = snapshot();
  const fetcher = () => assert.fail('a portable copy never needs the backend');
  const link = await createShoppingCopyLink(copy, { base, fetcher });
  assert.equal(new URL(link).pathname, '/site/delad-inkopslista.html');
  assert.deepEqual(await loadShoppingCopy(new URL(link).hash.slice(1), { api, fetcher }), copy);
  assert.deepEqual(await loadShoppingCopy(await encodeShoppingCopy(copy), { fetcher }), copy);
});

test('visited short copies reopen offline, and unavailable or damaged storage does not break online opening', async () => {
  const copy = snapshot();
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  const online = { api, storage, fetcher: async () => json(copy) };
  assert.deepEqual(await loadShoppingCopy(code, online), copy);
  assert.deepEqual(await loadShoppingCopy(code, { storage, fetcher: () => assert.fail('cached copies need no network') }), copy);
  values.set(`ofta-shopping-link:${code}`, 'broken');
  assert.deepEqual(await loadShoppingCopy(code, online), copy);
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.deepEqual(await loadShoppingCopy(code, { ...online, storage: blocked }), copy);
  assert.deepEqual(await loadShoppingCopy(code, { ...online, storage: null }), copy);
});

test('invalid or missing links are rejected before fetching, and missing copies get useful errors', async () => {
  for (const fragment of ['', 'not-a-code', '../other', 'x'.repeat(23)]) {
    await assert.rejects(loadShoppingCopy(fragment, { api, fetcher: () => assert.fail('invalid code must not be sent') }), /felaktig/);
  }
  await assert.rejects(loadShoppingCopy(code, { api, fetcher: async () => json({}, 404) }), /finns inte/);
  await assert.rejects(loadShoppingCopy(code, { api, fetcher: async () => json({ i: [] }) }), /felaktig/);
});

test('connection and creation failures offer retries without silently producing another long link', async () => {
  const copy = snapshot();
  const offline = { base, api, fetcher: async () => { throw new TypeError('offline'); } };
  await assert.rejects(createShoppingCopyLink(copy, offline), /anslutning.*försök igen/);
  await assert.rejects(loadShoppingCopy(code, offline), /anslutning.*igen/);
  await assert.rejects(createShoppingCopyLink(copy, { base, api, fetcher: async () => json({ error: 'Prova i morgon.' }, 429) }), /Prova i morgon/);
  for (const data of [{}, { code: 123 }, { code: 'bad' }, { code: 'https://other.test/' }]) {
    await assert.rejects(createShoppingCopyLink(copy, { base, api, fetcher: async () => json(data) }), /kunde inte skapas/);
  }
});
