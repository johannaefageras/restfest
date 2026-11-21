// The pasta sorts in src/pasta/ (pasta/pasta.11tydata.js; pasta/_mall.md explains the fields): every
// sort has its text, values the page and the filter know (lib/pasta.js), a drawing and a cover, and the sorts
// and recipes it names exist. Each test lists every sort that fails it.
import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import test from 'node:test';
import yaml from 'js-yaml';
import {doughs, forms, pastasMadeWith, sauces} from '../lib/pasta.js';
import pastaFolder from '../src/pasta/pasta.11tydata.js';

const src = path => new URL(`../src/${path}`, import.meta.url);
const slugs = readdirSync(src('pasta/'))
  .filter(name => name.endsWith('.md') && name !== '_mall.md')
  .map(name => name.slice(0, -3));
const pastas = slugs.map(slug => ({
  slug,
  data: yaml.load(readFileSync(src(`pasta/${slug}.md`), 'utf8').match(/^---\n([\s\S]*?)\n---/)[1])
}));

// Each sort's problems, as "slug: problem" lines; none passes.
const problems = check => pastas.flatMap(({slug, data}) => check(data, slug).map(problem => `${slug}: ${problem}`));
const isList = value => Array.isArray(value);

test('there are pasta sorts', () => {
  assert.ok(pastas.length > 0);
});

test('every sort has its text', () => {
  const fields = ['namn', 'bildAlt', 'intro', 'namnet', 'funktion', 'passarTill', 'braAttVeta', 'raddaEnRest'];
  assert.deepEqual(problems(data => fields.filter(field => typeof data[field] !== 'string' || !data[field].trim())
    .map(field => `${field} is empty`)), []);
});

test('every sort has a form, sauces, a dough and a cooking time the page knows', () => {
  assert.deepEqual(problems(data => [
    ...(Object.hasOwn(forms, data.kategori) ? [] : [`kategori: ${data.kategori}`]),
    ...(isList(data.saser) && data.saser.length ? [] : ['saser is empty']),
    ...(data.saser ?? []).filter(sauce => !Object.hasOwn(sauces, sauce)).map(sauce => `saser: ${sauce}`),
    ...(Object.hasOwn(doughs, data.deg) ? [] : [`deg: ${data.deg}`]),
    ...(isList(data.koktid) && data.koktid.length === 2 && data.koktid.every(Number.isFinite) && data.koktid[0] <= data.koktid[1]
      ? [] : ['koktid is not [min, max]']),
    ...(data.alias == null || isList(data.alias) ? [] : ['alias is not a list']),
    ...(data.region == null || typeof data.region === 'string' ? [] : ['region is not text'])
  ]), []);
});

test('every sort has a drawing for its card and a cover for its page', () => {
  assert.deepEqual(problems((data, slug) => [
    ...(existsSync(src(`assets/icons/pasta/${slug}.svg`)) ? [] : ['no drawing in assets/icons/pasta/']),
    ...(existsSync(src(`assets/covers/pasta/${slug}.svg`)) ? [] : ['no cover in assets/covers/pasta/'])
  ]), []);
  for (const icon of Object.values(forms)) assert.ok(existsSync(src(`assets/icons/pasta/${icon}.svg`)), icon);
  for (const icon of [...Object.values(sauces), ...Object.values(doughs).map(dough => dough.icon)])
    assert.ok(existsSync(src(`assets/icons/${icon}.svg`)), icon);
});

test('the sorts and recipes a sort names exist', () => {
  assert.deepEqual(problems((data, slug) => [
    ...(data.bytMot ?? []).filter(other => !slugs.includes(other) || other === slug).map(other => `bytMot: ${other}`),
    ...(data.recept ?? []).filter(id => !existsSync(src(`recept/${id}.md`))).map(id => `recept: ${id}`),
    // A sort's own grundrecept: "" for no link, or another recipe that exists.
    ...(data.grundrecept == null || data.grundrecept === '' || existsSync(src(`recept/${data.grundrecept}.md`))
      ? [] : [`grundrecept: ${data.grundrecept}`])
  ]), []);
});

test('the fresh-pasta recipe exists', () => {
  assert.ok(existsSync(src(`recept/${pastaFolder.grundrecept}.md`)), pastaFolder.grundrecept);
});

test('a recipe lists the fresh sorts that link to it, and no others', () => {
  const sort = (fileSlug, deg, grundrecept) => ({fileSlug, data: {deg, grundrecept}});
  const items = [
    sort('fresh', 'färsk', 'dough'),
    sort('both', 'båda', 'dough'),
    sort('dried', 'torkad', 'dough'),
    sort('potato', 'potatis', 'dough'),
    sort('opted-out', 'färsk', ''),
    sort('other-dough', 'färsk', 'another-dough')
  ];
  assert.deepEqual(pastasMadeWith(items, 'dough').map(item => item.fileSlug), ['fresh', 'both']);
  assert.deepEqual(pastasMadeWith(items, 'no-such-recipe'), []);
});
