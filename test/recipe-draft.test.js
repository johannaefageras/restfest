import assert from 'node:assert/strict';
import test from 'node:test';
import { draftSchema, recipeDoc, recipePrompt, recipeSystem, UnsuitableError } from '../supabase/functions/_shared/recipe.ts';
import { data } from '../supabase/functions/_shared/data.ts';

const items = [{name: 'kokt potatis', key: 'potatis'}, {name: 'något okänt', key: null}];

test('recipePrompt without preferences is the fridge list and the request', () => {
  assert.equal(recipePrompt(items), 'Kyllistan:\n- kokt potatis (potatis)\n- något okänt\n\nSkriv ett nytt middagsrecept av det här.');
  assert.equal(recipePrompt(items, ''), recipePrompt(items));
});

test('recipePrompt adds the preferences after a blank line', () => {
  assert.equal(recipePrompt(items, 'Den som ska laga …'), `${recipePrompt(items)}\n\nDen som ska laga …`);
});

test('the draft has a required unsuitable flag, and the instructions explain it', () => {
  assert.deepEqual(draftSchema.properties.unsuitable, {type: 'boolean'});
  assert.ok(draftSchema.required.includes('unsuitable'));
  assert.match(recipeSystem, /- unsuitable: false, unless/);
});

test('the schema and instructions stay small however many foods the site knows', () => {
  const itemKey = draftSchema.properties.ingredientGroups.items.properties.items.items.properties.key;
  assert.deepEqual(itemKey, {type: 'string'});
  assert.deepEqual(draftSchema.properties.pantryKeys.items, {type: 'string'});
  assert.ok(JSON.stringify(draftSchema).length < 10_000, `the schema is ${JSON.stringify(draftSchema).length} characters`);
  assert.ok(recipeSystem.length < 60_000, `the instructions are ${recipeSystem.length} characters`);
  for (const key of data.commonFoods) assert.ok(recipeSystem.includes(`\n${key}: `), `${key} is listed`);
  for (const key of ['blojor', 'diskborste', 'verjus']) assert.equal(recipeSystem.includes(`\n${key}: `), false, `${key} is not listed`);
  assert.match(recipeSystem, /in brackets/);
});

test('recipeDoc keeps any key the site knows, whatever its capitalisation, and drops invented ones', () => {
  assert.equal(data.commonFoods.includes('verjus'), false);
  const doc = recipeDoc({
    title: 'Lök i verjus', description: 'Syrlig lök.',
    ingredientGroups: [{title: '', items: [
      {name: '1 msk verjus', key: 'Verjus', basic: false},
      {name: '2 dl hittepå', key: 'hittepa', basic: false},
      {name: '1 gul lök', key: '', basic: false}
    ]}],
    pantryKeys: ['verjus', 'hittepa', 'blojor'],
    steps: ['Fräs löken.']
  });
  assert.deepEqual(doc.ingredients, [{items: [{name: '1 msk verjus', key: 'verjus'}, {name: '2 dl hittepå'}, {name: '1 gul lök'}]}]);
  assert.deepEqual(doc.pantryKeys, ['verjus']);
});

test('recipeDoc refuses a draft Claude marked unsuitable', () => {
  assert.throws(() => recipeDoc({unsuitable: true, title: 'x', description: 'y'}), UnsuitableError);
});

test('new recipes keep a lactose-free tag, with dairy-free and vegan covering it', () => {
  const draft = {
    title: 'Enkel soppa', description: 'En varm soppa.',
    ingredientGroups: [{items: [{name: '2 dl vatten', key: ''}]}],
    steps: ['Värm vattnet.']
  };
  assert.deepEqual(recipeDoc({...draft, tags: ['Lactose free']}).tags, ['Lactose free']);
  assert.deepEqual(recipeDoc({...draft, tags: ['Dairy free', 'Lactose free']}).tags, ['Dairy free']);
  assert.deepEqual(recipeDoc({...draft, tags: ['Vegan', 'Dairy free', 'Lactose free']}).tags, ['Vegan']);
});
