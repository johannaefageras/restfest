import assert from 'node:assert/strict';
import test from 'node:test';
import { amountParts, recipeServings } from '../lib/recipe-amounts.js';

const values = text => amountParts(text).filter(part => part.amount != null).map(part => part.amount);

test('reads Swedish decimals, fractions, mixed numbers and ranges', () => {
  assert.deepEqual(values('½–1 dl mjölk, eller 2½ dl grädde'), [0.5, 1, 2.5]);
  assert.deepEqual(values('1,2 kg kål (ca 1 1/2 huvud)'), [1.2, 1.5]);
  assert.deepEqual(values('⅓ tsk salt och 3/4 dl vatten'), [1 / 3, 0.75]);
});

test('scales quantities within the description and equivalent amounts', () => {
  assert.deepEqual(values('800 g kokt potatis (ca 10 medelstora)'), [800, 10]);
  assert.deepEqual(values('Fint rivet skal och 1 msk saft av ½ citron'), [1, 0.5]);
  assert.deepEqual(values('8–10 salviablad eller 4 kvistar timjan'), [8, 10, 4]);
});

test('keeps concentrations, individual package sizes and recipe references fixed', () => {
  assert.deepEqual(values('2 burkar tomater (à 400 g)'), [2]);
  assert.deepEqual(values('2 burkar sardiner (à ca 120 g)'), [2]);
  assert.deepEqual(values('2 rena plastflaskor à 1 liter, eller 3 à ½ liter'), [2, 3]);
  assert.deepEqual(values('100 g mörk choklad, 70 %'), [100]);
  assert.deepEqual(values('½ tsk ättika (12 %) från recept 92'), [0.5]);
  assert.deepEqual(values('1 sats pajdeg (recept 92), eller 1 rulle smördeg'), [1, 1]);
  assert.deepEqual(values('Några hundkex, gärna från recept 111 eller 176'), []);
  assert.deepEqual(values('Sprayen i recept 106, eller 1 del ättika (12 %) och 2 delar vatten'), [1, 2]);
  assert.deepEqual(values('1 äggkartong av papp för 12 ägg, inte plast'), [1]);
});

test('distinguishes an ingredient length from equipment dimensions and per-unit ratios', () => {
  assert.deepEqual(values('3 cm färsk ingefära'), [3]);
  assert.deepEqual(values('½ tsk malen ingefära, eller 2 cm färsk ingefära, riven'), [0.5, 2]);
  assert.deepEqual(values('1 bit purjolök (ca 10 cm)'), [1]);
  assert.deepEqual(values('Vaxpapper, skuret i rutor, ca 10 × 10 cm'), []);
  assert.deepEqual(values('ca 5 dl strösocker per liter silad saft'), []);
  assert.deepEqual(values('1 msk russin, plus 2–3 russin per flaska'), [1]);
});

test('preserves every character, including quantities that should not scale', () => {
  for (const text of ['Flingsalt', '2½–3 dl mjöl', '2 burkar tomater (à 400 g)', 'Rivet skal av ½ citron', '1,2 kg kål (2 %)']) {
    assert.equal(amountParts(text).map(part => part.text).join(''), text);
  }
});

test('keeps the original yield context and uses the start of a range as the default', () => {
  const servings = recipeServings('ca 1½ liter (4 burkar à 2½ dl)');
  assert.equal(servings.value, 1.5);
  assert.equal(servings.prefix.map(part => part.text).join(''), 'ca ');
  assert.deepEqual(servings.suffix.filter(part => part.amount != null).map(part => part.amount), [4]);
  assert.equal(recipeServings('4–6 som tillbehör').value, 4);
  assert.equal(recipeServings('ca 30 flarn').value, 30);
  assert.equal(recipeServings(undefined), null);
});
