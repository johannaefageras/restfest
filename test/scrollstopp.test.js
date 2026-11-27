// Scrollstopp: archive recipes with a `scrollstopp` block (lib/scrollstopp.js), each with a portrait
// TikTok image the build stamps and visitors can save. The helpers sort the recipes, find a recipe's
// neighbours, name the image files and crop an original to 9:16.
import assert from 'node:assert/strict';
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import yaml from 'js-yaml';
import sharp from 'sharp';
import {levels} from '../lib/cakes.js';
import {scrollstoppFiles, scrollstoppNeighbours, sortScrollstopp, tiktokCrop} from '../lib/scrollstopp.js';

const src = path => new URL(`../src/${path}`, import.meta.url);
const recipes = readdirSync(src('recept/'))
  .filter(name => name.endsWith('.md'))
  .map(name => ({
    fileSlug: name.slice(0, -3),
    data: yaml.load(readFileSync(src(`recept/${name}`), 'utf8').match(/^---\n([\s\S]*?)\n---/)[1])
  }))
  .filter(item => item.data.scrollstopp);

// Each recipe's problems, as "id: problem" lines; none passes.
const problems = async check => (await Promise.all(recipes.map(async ({fileSlug, data}) =>
  (await check(data.scrollstopp, data, fileSlug)).map(problem => `${fileSlug}: ${problem}`)))).flat();

test('there are Scrollstopp recipes, numbered 1, 2, 3 … without gaps or repeats', () => {
  assert.ok(recipes.length > 0);
  const numbers = recipes.map(item => item.data.scrollstopp.nr).sort((a, b) => a - b);
  assert.deepEqual(numbers, numbers.map((_, index) => index + 1));
});

test('every Scrollstopp recipe has a short name and a level from the cakes\' levels', async () => {
  assert.deepEqual(await problems((block, data) => [
    ...(typeof block.namn === 'string' && block.namn.trim() ? [] : ['namn is empty']),
    ...(Object.hasOwn(levels, data.facts?.Nivå) ? [] : [`facts Nivå: ${data.facts?.Nivå}`])
  ]), []);
});

test('every Scrollstopp recipe has a portrait TikTok original close to 9:16, and every original belongs to one', async () => {
  assert.deepEqual(await problems(async (block, data, id) => {
    const original = src(scrollstoppFiles(id).original);
    if (!existsSync(original)) return [`no src/${scrollstoppFiles(id).original}`];
    const {width, height} = await sharp(fileURLToPath(original)).metadata();
    return Math.abs(width / height / (9 / 16) - 1) <= 0.1 ? [] : [`${width} × ${height} is not close to 9:16`];
  }), []);
  const originals = readdirSync(src('assets/scrollstopp/')).filter(name => name.endsWith('.png'));
  const expected = recipes.map(({fileSlug}) => `${fileSlug}.png`);
  assert.deepEqual(originals.filter(name => !expected.includes(name)), [], 'not a Scrollstopp recipe');
});

test('the recipes come in number order, and only recipes with a scrollstopp block count', () => {
  const recipe = (fileSlug, scrollstopp) => ({fileSlug, data: scrollstopp ? {scrollstopp} : {}});
  const sorted = sortScrollstopp([recipe('b', {nr: 2}), recipe('plain'), recipe('a', {nr: 1})]);
  assert.deepEqual(sorted.map(item => item.fileSlug), ['a', 'b']);
});

test('the neighbours are the recipes before and after, and the ends have one each', () => {
  const items = ['a', 'b', 'c'].map(fileSlug => ({fileSlug}));
  const slugs = ({previous, next}) => [previous?.fileSlug, next?.fileSlug];
  assert.deepEqual(slugs(scrollstoppNeighbours(items, 'b')), ['a', 'c']);
  assert.deepEqual(slugs(scrollstoppNeighbours(items, 'a')), [undefined, 'b']);
  assert.deepEqual(slugs(scrollstoppNeighbours(items, 'c')), ['b', undefined]);
  assert.deepEqual(scrollstoppNeighbours(items, 'not-in-scrollstopp'), {});
});

test('each recipe has a saved JPEG, a shown and a card WebP next to its original', () => {
  assert.deepEqual(scrollstoppFiles('340-cookiepizza'), {
    original: 'assets/scrollstopp/340-cookiepizza.png',
    save: 'assets/scrollstopp/340-cookiepizza.jpg',
    shown: 'assets/scrollstopp/340-cookiepizza-540.webp',
    card: 'assets/scrollstopp/340-cookiepizza-card.webp'
  });
});

test('a 9:16 image is not cropped, a taller one loses its top and bottom, a wider one its sides', () => {
  assert.deepEqual(tiktokCrop(941, 1672), {left: 0, top: 0, width: 941, height: 1672});
  assert.deepEqual(tiktokCrop(916, 1717), {left: 0, top: 44, width: 916, height: 1628});
  assert.deepEqual(tiktokCrop(941, 1671), {left: 0, top: 0, width: 940, height: 1671});
  assert.deepEqual(tiktokCrop(1000, 1000), {left: 218, top: 0, width: 563, height: 1000});
});
