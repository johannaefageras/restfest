// The cakes on tartor.html: archive recipes with a `tarta` block (lib/cakes.js). Every cake has its own
// number, a short name, an origin in one of the regions, parts and a level the page knows, and its two
// drawings; the icons, base recipes and leftover recipes the page uses exist; and the helpers pick the
// right cakes. Each test lists every cake that fails it.
import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import test from 'node:test';
import yaml from 'js-yaml';
import {baseRecipes, cakeChoices, cakeNeighbours, cakeRegion, cakesMadeWith, flags, leftoverRecipes, levels, parts, regions, sortCakes} from '../lib/cakes.js';

const src = path => new URL(`../src/${path}`, import.meta.url);
const cakes = readdirSync(src('recept/'))
  .filter(name => name.endsWith('.md'))
  .map(name => ({
    fileSlug: name.slice(0, -3),
    data: yaml.load(readFileSync(src(`recept/${name}`), 'utf8').match(/^---\n([\s\S]*?)\n---/)[1])
  }))
  .filter(item => item.data.tarta);

// Each cake's problems, as "id: problem" lines; none passes.
const problems = check => cakes.flatMap(({fileSlug, data}) => check(data.tarta, data).map(problem => `${fileSlug}: ${problem}`));

test('there are cakes, numbered 1, 2, 3 … without gaps or repeats', () => {
  assert.ok(cakes.length > 0);
  const numbers = cakes.map(item => item.data.tarta.nr).sort((a, b) => a - b);
  assert.deepEqual(numbers, numbers.map((_, index) => index + 1));
});

test('every cake has a short name, an origin in one of the regions, parts and a level the page knows', () => {
  assert.deepEqual(problems((cake, data) => [
    ...(typeof cake.namn === 'string' && cake.namn.trim() ? [] : ['namn is empty']),
    ...(typeof cake.ursprung === 'string' && cake.ursprung.trim() ? [] : ['ursprung is empty']),
    ...(cakeRegion(cake.ursprung) ? [] : [`ursprung: ${cake.ursprung} is in no region`]),
    ...(Array.isArray(cake.delar) ? [] : ['delar is not a list']),
    ...(cake.delar ?? []).filter(part => !Object.hasOwn(parts, part)).map(part => `delar: ${part}`),
    ...(new Set(cake.delar ?? []).size === (cake.delar ?? []).length ? [] : ['delar repeats a part']),
    ...(Object.hasOwn(levels, data.facts?.Nivå) ? [] : [`facts Nivå: ${data.facts?.Nivå}`])
  ]), []);
});

test('the icons, flags, base recipes and leftover recipes the page uses exist', () => {
  for (const icon of [...Object.values(parts).map(part => part.icon), ...Object.values(levels), ...Object.values(flags).map(code => `flag-${code}`)])
    assert.ok(existsSync(src(`assets/icons/${icon}.svg`)), icon);
  for (const {id} of baseRecipes()) assert.ok(existsSync(src(`recept/${id}.md`)), id);
  for (const id of leftoverRecipes) assert.ok(existsSync(src(`recept/${id}.md`)), id);
});

test('every cake has a drawing of the whole cake and of a piece, and every drawing belongs to a cake', () => {
  const drawings = readdirSync(src('assets/icons/tartor/')).filter(name => name.endsWith('.svg'));
  const expected = cakes.flatMap(({fileSlug}) => [`${fileSlug}.svg`, `${fileSlug}-bit.svg`]);
  assert.deepEqual(expected.filter(name => !drawings.includes(name)), [], 'missing');
  assert.deepEqual(drawings.filter(name => !expected.includes(name)), [], 'not a cake');
});

test('the cakes come in number order, and only recipes with a tarta block are cakes', () => {
  const recipe = (fileSlug, tarta) => ({fileSlug, data: tarta ? {tarta} : {}});
  const sorted = sortCakes([recipe('b', {nr: 2}), recipe('plain'), recipe('a', {nr: 1})]);
  assert.deepEqual(sorted.map(item => item.fileSlug), ['a', 'b']);
});

test('the filter offers only what some cake has, in the page order, with origins as their regions', () => {
  const cake = (nr, ursprung, delar, Nivå) => ({data: {tarta: {nr, ursprung, delar}, facts: {Nivå}}});
  const choices = cakeChoices([
    cake(1, 'Österrike', ['ganache', 'sockerbotten'], 'Avancerat'),
    cake(2, 'Frankrike', [], 'Nybörjare'),
    cake(3, 'Frankrike', ['sockerbotten'], 'Avancerat')
  ]);
  assert.deepEqual(choices.levels, ['Nybörjare', 'Avancerat']);
  assert.deepEqual(choices.parts, ['sockerbotten', 'ganache']);
  assert.deepEqual(choices.regions, ['Europa']);
  // The regions come in the menu's order, whatever order the cakes are in.
  const spread = cakeChoices([cake(1, 'USA', [], 'Nybörjare'), cake(2, 'Japan', [], 'Nybörjare'), cake(3, 'Australien', [], 'Nybörjare')]);
  assert.deepEqual(spread.regions, ['Australien', 'Asien', 'USA']);
});

test('every flag belongs to an origin in one of the regions', () => {
  assert.deepEqual(Object.keys(flags).filter(origin => !cakeRegion(origin)), []);
});

test('no origin is in two regions', () => {
  const origins = Object.values(regions).flat();
  assert.deepEqual(origins.filter((origin, index) => origins.indexOf(origin) !== index), []);
});

test('a base recipe lists the cakes built with its part, and no others', () => {
  const [base] = Object.entries(parts).filter(([, part]) => part.grundrecept);
  // Without a part that has a base recipe there is nothing to list; the test still checks that.
  const cake = (fileSlug, delar) => ({fileSlug, data: {tarta: {delar}}});
  const items = [cake('with', base ? [base[0]] : []), cake('without', ['ganache']), cake('none', [])];
  if (base) assert.deepEqual(cakesMadeWith(items, base[1].grundrecept).map(item => item.fileSlug), ['with']);
  assert.deepEqual(cakesMadeWith(items, 'not-a-base-recipe'), []);
});

test('the neighbours of a cake are the cakes numbered before and after it, and the ends have one each', () => {
  const items = ['a', 'b', 'c'].map(fileSlug => ({fileSlug}));
  const slugs = ({previous, next}) => [previous?.fileSlug, next?.fileSlug];
  assert.deepEqual(slugs(cakeNeighbours(items, 'b')), ['a', 'c']);
  assert.deepEqual(slugs(cakeNeighbours(items, 'a')), [undefined, 'b']);
  assert.deepEqual(slugs(cakeNeighbours(items, 'c')), ['b', undefined]);
  assert.deepEqual(cakeNeighbours(items, 'not-a-cake'), {});
});
