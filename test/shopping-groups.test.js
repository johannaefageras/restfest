import assert from 'node:assert/strict';
import test from 'node:test';
import { groupShoppingItems } from '../lib/shopping-groups.js';

const item = (text, id = text, extra = {}) => ({ id, text, recipe: `Recept ${id}`, checked: false, ...extra });
const texts = (...lines) => groupShoppingItems(lines.map((text, i) => item(text, String(i)))).map(row => row.text);

test('sums compatible weights and volumes, including Swedish decimals and fractions', () => {
  assert.deepEqual(texts('500 g potatis', '250 g potatis'), ['750 g potatis']);
  assert.deepEqual(texts('500 g potatis', '0,5 kg potatis', '2 hg potatis'), ['1,2 kg potatis']);
  assert.deepEqual(texts('2 dl mjölk', '½ l mjölk'), ['7 dl mjölk']);
  assert.deepEqual(texts('1/2 dl grädde', '1½ dl grädde'), ['2 dl grädde']);
  assert.deepEqual(texts('⅓ dl grädde', '⅔ dl grädde'), ['1 dl grädde']);
  assert.deepEqual(texts('1 tsk salt', '½ tsk salt'), ['1½ tsk salt']);
  assert.deepEqual(texts('1 msk olivolja', '1 tsk olivolja'), ['20 ml olivolja']);
});

test('recognizes simple Swedish singulars, plurals, count units and preparation suffixes', () => {
  assert.deepEqual(texts('1 gul lök', '2 gula lökar, finhackade'), ['3 gula lökar']);
  assert.deepEqual(texts('1 morot', '2 morötter'), ['3 morötter']);
  assert.deepEqual(texts('1 st ägg', '2 ägg'), ['3 ägg']);
  assert.deepEqual(texts('½ citron', '½ citron'), ['1 citron']);
  assert.deepEqual(texts('200 g morot', '300 gram morötter'), ['500 g morötter']);
});

test('adds intervals and retains an approximate qualifier', () => {
  assert.deepEqual(texts('2–3 dl mjölk', '1 dl mjölk'), ['3–4 dl mjölk']);
  assert.deepEqual(texts('ca 200 g potatis', '300 g potatis'), ['ca 500 g potatis']);
});

test('packages combine only when their kinds and named sizes agree', () => {
  assert.deepEqual(texts('1 burk krossade tomater (400 g)', '2 burkar krossade tomater (400 g)'), ['3 burkar krossade tomater (400 g)']);
  assert.equal(texts('1 burk tomater (400 g)', '1 burk tomater (800 g)').length, 2);
  assert.equal(texts('1 burk tomater', '1 paket tomater').length, 2);
});

test('never guesses weight-to-volume conversions, product variants or ambiguous quantities', () => {
  for (const lines of [
    ['100 g smör', '1 dl smör'], ['2 dl mjölk', '2 dl laktosfri mjölk'],
    ['200 g potatis', '200 g kokt potatis'], ['1 tsk oregano', '1 tsk torkad oregano'],
    ['2 dl grädde (40 %)', '2 dl grädde (15 %)'], ['1 gul lök', '1 rödlök'],
    ['1 burk tomater', '400 g tomater'], ['1 gul lök eller 2 rödlökar', '1 gul lök eller 2 rödlökar'],
    ['Saft av ½ citron', 'Saft av ½ citron'], ['800 g potatis (ca 10 stycken)', '800 g potatis (ca 10 stycken)'],
    ['3–2 dl mjölk', '3–2 dl mjölk'], ['1/0 dl mjölk', '1/0 dl mjölk'],
  ]) assert.equal(texts(...lines).length, 2, lines.join(' + '));
});

test('different notes and purchased amounts stay separate from the outstanding total', () => {
  const rows = groupShoppingItems([
    item('1 l mjölk', 'a', { note: 'Laktosfri' }), item('1 l mjölk', 'b', { note: 'Standard' }),
    item('1 l mjölk', 'c', { note: 'Laktosfri', checked: true }), item('½ l mjölk', 'd', { note: 'Laktosfri' }),
  ]);
  assert.deepEqual(rows.map(row => [row.text, row.checked, row.note]), [
    ['1½ l mjölk', false, 'Laktosfri'], ['1 l mjölk', false, 'Standard'], ['1 l mjölk', true, 'Laktosfri'],
  ]);
});

test('uses edited buying text while retaining original ids, amounts, notes and recipe membership', () => {
  const a = item('200 g potatis', 'a', { customText: '300 g potatis', note: 'Ekologisk' });
  const b = item('½ kg potatis', 'b', { note: 'Ekologisk' });
  const before = structuredClone([a,b]);
  const rows = groupShoppingItems([a,b]);
  assert.equal(rows[0].text, '800 g potatis');
  assert.equal(rows[0].recipe, 'Recept a · Recept b');
  assert.deepEqual(rows[0].items.map(source => source.id), ['a', 'b']);
  assert.deepEqual([a,b], before);
  assert.equal(groupShoppingItems([b])[0].text, '½ kg potatis');
});

test('keeps first-occurrence order, folds unquantified duplicates and leaves individual wording intact', () => {
  assert.deepEqual(texts('2 dl mjölk', 'Salt efter smak', '1 dl grädde', '1 dl mjölk', 'Salt efter smak'), ['3 dl mjölk', 'Salt efter smak', '1 dl grädde']);
  assert.deepEqual(texts(' 2 dl Mjölk '), [' 2 dl Mjölk ']);
  const sources = [item('1 ägg', 'a', { recipe: 'Samma recept' }), item('1 ägg', 'b', { recipe: 'Samma recept' })];
  assert.equal(groupShoppingItems(sources)[0].recipe, 'Samma recept');
});
