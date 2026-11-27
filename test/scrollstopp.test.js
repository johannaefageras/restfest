// Scrollstopp: archive recipes with a `scrollstopp` block (lib/scrollstopp.js), each with a portrait
// TikTok image the build stamps and visitors can save. The helpers sort the recipes, find a recipe's
// neighbours, name the image files and crop an original to 9:16.
import assert from 'node:assert/strict';
import test from 'node:test';
import {scrollstoppFiles, scrollstoppNeighbours, sortScrollstopp, tiktokCrop} from '../lib/scrollstopp.js';

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
