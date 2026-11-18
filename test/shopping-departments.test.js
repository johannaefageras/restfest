import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { shoppingDepartmentNames, createShoppingDepartmentClassifier, groupShoppingDepartments } from '../lib/shopping-departments.js';
import { taxonomy } from '../lib/taxonomy.js';

const foods = JSON.parse(readFileSync(new URL('../src/_data/foods.json', import.meta.url), 'utf8'));
const index = shoppingDepartmentNames({ ...foods, ...taxonomy().foods });
const classify = createShoppingDepartmentClassifier(index);

test('store departments recognise amounts, Swedish forms and items outside the recipe vocabulary', () => {
  const cases = {
    '2 l mjölk': 'dairy', '1 tsk smör': 'dairy', '6 ägg': 'dairy', '2 dl laktosfri grädde': 'dairy',
    '2 tomater': 'produce', '3 gula lökar': 'produce', '1 kg potatis': 'produce', '2 äpplen': 'produce',
    '4 vitlöksklyftor': 'produce', '1 kruka basilika': 'produce', '1 tsk torkad oregano': 'spices',
    '1 dl valnötter': 'pantry', '1 msk strösocker': 'pantry', '2 burkar krossade tomater': 'pantry',
    '500 g vetemjöl': 'pantry', '2 dl potatismjöl': 'pantry', '1 burk tonfisk': 'pantry',
    '1 limpa bröd': 'bread', '2 baguetter': 'bread', '500 g kyckling': 'meat', '200 g färsk lax': 'fish',
    '200 g tofu': 'vegetarian', '1 l havredryck': 'dairy', '1 paket kaffe': 'drinks',
    '1 påse chips': 'snacks', 'Fryst broccoli': 'frozen', '500 g frysta ärter': 'frozen',
    '1 paket vaniljglass': 'frozen', 'Diskmedel': 'household', 'Schampo': 'hygiene', 'Blöjor': 'baby',
    'Fryst hundfoder': 'pets', 'Astronautfrukt från månen': 'other',
  };
  for (const [text, expected] of Object.entries(cases)) assert.equal(classify(text), expected, text);
});

test('specific products are classified without confusing compound ingredient names or toiletries', () => {
  for (const [text, expected] of Object.entries({
    '1 dl kaffegrädde': 'dairy', 'Chokladmjölk': 'dairy', 'Inlagda rödbetor': 'pantry',
    'Färsk ingefära': 'produce', 'Mald ingefära': 'spices', 'Vegansk choklad': 'snacks',
    'Glasskål': 'household', '1 flaska kokosmjölk': 'pantry',
  })) assert.equal(classify(text), expected, text);
});

test('grouping retains every item and stable row identity in both normal and shared lists', () => {
  const rows = [{ text: 'Mjölk', index: 0 }, { text: 'Okänd vara', index: 1 },
    { text: 'Äpple', index: 2 }, { text: 'Smör', index: 3 }, { text: 'Frysta ärter', index: 4 }];
  const before = structuredClone(rows);
  const groups = groupShoppingDepartments(rows, classify);
  assert.deepEqual(groups.map(group => group.id), ['produce', 'dairy', 'frozen', 'other']);
  assert.deepEqual(groups.flatMap(group => group.items.map(item => item.index)), [2, 0, 3, 4, 1]);
  assert.equal(groups[1].items[0], rows[0]);
  assert.deepEqual(rows, before, 'saved row order and recipient checkbox indices are not mutated');
  assert.deepEqual(groupShoppingDepartments([], classify), []);
});
