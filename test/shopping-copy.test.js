import assert from 'node:assert/strict';
import test from 'node:test';
import { gzipSync } from 'node:zlib';
import { createShoppingCopy, encodeShoppingCopy, decodeShoppingCopy, readCopyChecks, writeCopyChecks, shoppingCopyKey } from '../lib/shopping-copy.js';

const item = (id, text, extra = {}) => ({ id, text, recipe: '', checked: false, ...extra });
const snapshot = () => createShoppingCopy([item('manual:private-id', '2 l mjölk')], 'Veckans inköp');
const plainFragment = data => 'j1.' + Buffer.from(JSON.stringify(data)).toString('base64url');

test('the snapshot combines outstanding amounts and retains display edits and notes, excluding recipe names', () => {
  const items = [
    item('a', '200 g potatis', { customText: '300 g potatis', note: 'Ekologisk', recipe: 'Soppa', source: 'archive:private-source' }),
    item('b', '½ kg potatis', { note: 'Ekologisk', recipe: 'Gratäng' }),
    item('c', '1 kg potatis', { checked: true }),
    item('d', '1 l mjölk', { note: 'Laktosfri' }),
  ];
  const original = structuredClone(items);
  const copy = createShoppingCopy(items, 'Till helgen');
  assert.equal(copy.t, 'Till helgen');
  assert.deepEqual(copy.i, [['800 g potatis', 'Ekologisk', ''], ['1 l mjölk', 'Laktosfri', '']]);
  assert.deepEqual(items, original);
  assert.doesNotMatch(JSON.stringify(copy), /Soppa|Gratäng|private-source|customText|checked|source/);
  assert.throws(() => createShoppingCopy([item('a', 'Ägg', { checked: true })]), /inga varor/);
});

test('older shared links still open with their notes and identity, discarding recipe labels', async () => {
  const original = snapshot();
  const legacy = { ...original, i: [['2 l mjölk', 'Laktosfri', 'Hemliga pannkakor']] };
  const copy = await decodeShoppingCopy(plainFragment(legacy));
  assert.equal(copy.id, original.id, 'existing recipient checkmarks keep the same storage key');
  assert.deepEqual(copy.i, [['2 l mjölk', 'Laktosfri', '']]);
  assert.doesNotMatch(JSON.stringify(copy), /Hemliga pannkakor/);
  assert.deepEqual(await decodeShoppingCopy(await encodeShoppingCopy(legacy)), copy);
});

test('compressed links round-trip Swedish, fractions, emoji and untrusted markup without changing text', async () => {
  const copy = createShoppingCopy([
    item('a', '2½ dl crème fraîche 🥣', { note: 'Öppnad & kyld', recipe: 'Rödbetssoppa' }),
    item('b', '<img src=x onerror=alert(1)>', { note: '"åäö"' }),
  ], 'Fredagens middag');
  const fragment = await encodeShoppingCopy(copy);
  assert.match(fragment, /^(g1|j1)\.[A-Za-z0-9_-]+$/);
  assert.deepEqual(await decodeShoppingCopy(fragment), copy);
  const large = createShoppingCopy(Array.from({ length: 40 }, (_, index) => item(`a:${index}`, `Vara ${index}`, { note: 'Ekologisk, välj en mogen och fin vara' })));
  const compressed = await encodeShoppingCopy(large);
  assert.match(compressed, /^g1\./);
  assert.deepEqual(await decodeShoppingCopy(compressed), large);
  const url = new URL('delad-inkopslista.html', 'https://example.test/site/recept/../');
  url.hash = fragment;
  assert.equal(url.pathname, '/site/delad-inkopslista.html');
  assert.equal(url.search, '');
  assert.deepEqual(await decodeShoppingCopy(url.hash.slice(1)), copy);
});

test('plain links remain readable when native compression is unavailable', async t => {
  const native = globalThis.CompressionStream;
  globalThis.CompressionStream = undefined;
  t.after(() => { globalThis.CompressionStream = native; });
  const copy = snapshot();
  const fragment = await encodeShoppingCopy(copy);
  assert.match(fragment, /^j1\./);
  assert.deepEqual(await decodeShoppingCopy(fragment), copy);
});

test('broken, unsupported and oversized copies fail without rendering arbitrary data', async () => {
  const copy = snapshot();
  for (const fragment of ['', 'g2.abc', 'j1.!', 'j1.A', 'g1.Zm9v', plainFragment({ ...copy, v: 2 }),
    plainFragment({ ...copy, t: '<h1>' + 'x'.repeat(80) }), plainFragment({ ...copy, i: [] }),
    plainFragment({ ...copy, i: [['Mjölk', {}, '']] }), plainFragment({ ...copy, i: [['Mjölk', '', '']].flat() })]) {
    await assert.rejects(decodeShoppingCopy(fragment), /felaktig/);
  }
  const bomb = gzipSync(Buffer.alloc(1000000, 'a')).toString('base64url');
  await assert.rejects(decodeShoppingCopy(`g1.${bomb}`));
  await assert.rejects(decodeShoppingCopy('j1.' + 'a'.repeat(16001)), /för stor/);
  await assert.rejects(encodeShoppingCopy({ ...copy, i: Array.from({ length: 50 }, () => ['x'.repeat(4000), '', '']) }), /för stor/);
});

test('recipient checks are isolated between copies and never stored with the original shopping list', () => {
  const values = new Map([['restfest-shopping-list', '["original"]']]);
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  const first = snapshot(), second = snapshot();
  assert.notEqual(shoppingCopyKey(first), shoppingCopyKey(second));
  assert.equal(writeCopyChecks(storage, first, new Set([0])), true);
  assert.deepEqual([...readCopyChecks(storage, first)], [0]);
  assert.deepEqual([...readCopyChecks(storage, second)], []);
  assert.equal(values.get('restfest-shopping-list'), '["original"]');
  values.set(shoppingCopyKey(first), '[0,0,-1,12,"0",null]');
  assert.deepEqual([...readCopyChecks(storage, first)], [0]);
  values.set(shoppingCopyKey(first), 'broken');
  assert.equal(readCopyChecks(storage, first).size, 0);
  assert.equal(writeCopyChecks(null, first, new Set()), false);
  assert.equal(readCopyChecks(null, first).size, 0);
});
