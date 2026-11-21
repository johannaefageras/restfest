// The guides in src/guider/ (guider/guider.11tydata.js): every card's picture, every recipe a card
// names and every food key behind the recipe list at the end has to exist, and the cards' anchors
// (#farfalle) have to be unique on the page. There are none at the moment: the pasta sorts that were
// the first guide have their own pages now (test/pasta.test.js).
import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import test from 'node:test';
import yaml from 'js-yaml';

const src = path => new URL(`../src/${path}`, import.meta.url);
const foods = JSON.parse(readFileSync(src('_data/foods.json'), 'utf8'));
const guides = readdirSync(src('guider/')).filter(name => name.endsWith('.md')).map(name => ({
  name,
  data: yaml.load(readFileSync(src(`guider/${name}`), 'utf8').match(/^---\n([\s\S]*?)\n---/)[1])
}));

for (const {name, data} of guides) {
  const items = data.sections.flatMap(section => section.items);

  test(`${name}: every card has a picture, a name and a text`, () => {
    for (const slug of [...items.map(item => item.slug), ...data.lineup, ...data.sections.map(section => section.icon)])
      assert.ok(existsSync(src(`${data.imageDir}${slug}.svg`)), `${data.imageDir}${slug}.svg`);
    for (const item of items) {
      assert.ok(item.name, item.slug);
      assert.ok(item.text, item.slug);
    }
  });

  test(`${name}: the cards and sections have unique anchors`, () => {
    const anchors = [...items.map(item => item.slug), ...data.sections.map(section => section.id), 'recept'];
    assert.equal(new Set(anchors).size, anchors.length);
  });

  test(`${name}: every recipe a card names exists`, () => {
    for (const item of items)
      for (const id of item.recipes ?? [])
        assert.ok(existsSync(src(`recept/${id}.md`)), `${item.slug}: ${id}`);
  });

  test(`${name}: the food keys are in the food list`, () => {
    for (const key of data.foodKeys ?? []) assert.ok(Object.hasOwn(foods, key), key);
  });
}
