import assert from 'node:assert/strict';
import test from 'node:test';
import { draftSchema, recipeDoc, recipePrompt, recipeSystem, UnsuitableError } from '../supabase/functions/_shared/recipe.ts';

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
