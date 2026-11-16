import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import yaml from 'js-yaml';
import {detectedFoods, detectionSystem} from '../supabase/functions/_shared/detection.ts';
import {data} from '../supabase/functions/_shared/data.ts';
import {taxonomy} from '../lib/taxonomy.js';

const foods = taxonomy().foods;

test('the detector vocabulary matches every current ingredient and alias', () => {
  const current = Object.fromEntries(Object.entries(foods).map(([key, food]) => [key, {name: food.name, aliases: food.aliases}]));
  assert.deepEqual(data.foods, current, 'Run npm run supabase-data after changing the ingredient vocabulary');
});

test('Claude is sent only the foods the recipes use, not the whole grocery list', () => {
  const used = new Set();
  for (const name of readdirSync(new URL('../src/recept/', import.meta.url)).filter(name => name.endsWith('.md'))) {
    const source = readFileSync(new URL(`../src/recept/${name}`, import.meta.url), 'utf8');
    const recipe = yaml.load(source.match(/^---\n([\s\S]*?)\n---/)[1]);
    const groups = recipe.ingredients?.[0]?.items ? recipe.ingredients : [{items: recipe.ingredients ?? []}];
    for (const key of [...(recipe.pantryKeys ?? []), ...groups.flatMap(group => group.items.map(item => item.key))]) used.add(key);
  }
  assert.deepEqual(data.commonFoods, Object.keys(foods).filter(key => used.has(key)),
    'Run npm run supabase-data after adding recipes or changing the ingredient vocabulary');

  const vocabulary = detectionSystem.slice(detectionSystem.indexOf('SWEDISH GROCERY VOCABULARY')).split('\n').slice(1);
  assert.equal(vocabulary.length, data.commonFoods.length);
  assert.ok(detectionSystem.length < 20_000, `the detector prompt is ${detectionSystem.length} characters`);
  assert.ok(vocabulary.some(line => line.startsWith('Halloumi')));
  assert.equal(vocabulary.some(line => /^Blöjor|^Diskborste|^Verjus/.test(line)), false);
  assert.deepEqual(vocabulary.filter(line => /^(.+) \(\1\)$/i.test(line)), [], 'a name is not repeated as its own alias');
});

test('observed product names and varieties survive broad recipe aliases', () => {
  const names = ['Hushållsost', 'Cheddar', 'Parmesan', 'Basilika', 'Koriander', 'Dill', 'Rödkål', 'Vitkål', 'Laktosfri mjölk', 'Havredryck', 'Gräddfil', 'Halloumi'];
  const result = detectedFoods({names});
  assert.deepEqual(result.names, names);
  assert.ok(result.keys.includes('halloumi'));
  assert.ok(result.keys.includes('graddfil'));
  assert.equal(result.names.includes('Riven ost'), false);
  assert.equal(result.names.includes('Färska örter'), false);
});

test('foods outside the catalogue have no eight-item cutoff and are never forced into a key', () => {
  const names = ['Rönnbärschutney', 'Nässelkimchi', 'Havtornssriracha', 'Libbstickspesto', 'Älgörtsgelé', 'Nyponmarmelad med enbär', 'Morotsblastshummus', 'Granskottssirap med citron', 'Rödbetsrelish', 'Rostad vitlöksolja med timjan'];
  const result = detectedFoods({names});
  assert.deepEqual(result.names, names);
  assert.deepEqual(result.other, names);
  assert.deepEqual(result.keys, []);
});

test('detection cleans duplicates and invalid entries, retaining up to the pantry limit', () => {
  const result = detectedFoods({names: ['  Mjölk\n ', 'MJÖLK', '', null, {}, 2, 'salt', 'Vatten', 'Cre\u0300me fraiche', 'Crème fraiche', ...Array.from({length: 65}, (_, i) => `Mat ${i}`)]});
  assert.deepEqual(result.names.slice(0, 3), ['Mjölk', 'Crème fraiche', 'Mat 0']);
  assert.equal(result.names.length, 60);
  for (const answer of [{}, {names: null}, {names: 'Mjölk'}, null]) assert.deepEqual(detectedFoods(answer).names, []);
});

const app = readFileSync(new URL('../src/js/app.js', import.meta.url), 'utf8');
const helpers = app.slice(app.indexOf('function searchKey('), app.indexOf('function loadPantry('));
const kitchen = readFileSync(new URL('../src/js/kitchen.js', import.meta.url), 'utf8');
const capitalize = kitchen.slice(kitchen.indexOf('function capitalize('), kitchen.indexOf('function isUnknownIngredient('));
const fridge = readFileSync(new URL('../src/js/fridge-ai.js', import.meta.url), 'utf8');

// Exercise the actual change handler, matching helpers, upload preparation and response parsing.
// The fake network returns detector output; no paid model calls or real photos are needed here.
// `camera` is what "Fota" has to open: 'capture' for a phone's browser, 'webcam' for a computer with a
// camera, 'blocked' for one where the visitor said no, and nothing for a browser with neither.
function page({result = {names: []}, initial = [], width = 4032, height = 3024, blobSizes = [500_000], fail = false, camera} = {}) {
  const elements = new Map();
  const uploads = [], encodes = [], bitmaps = [], sources = [], clicks = [], tracks = [];
  const node = selector => ({
    disabled: false, textContent: '', value: '', handlers: {}, attributes: {},
    addEventListener(type, handler) { this.handlers[type] = handler; },
    setAttribute(key, value) { this.attributes[key] = value; },
    removeAttribute(key) { delete this.attributes[key]; },
    scrollIntoView() {}, click() { clicks.push(selector); },
  });
  const $ = selector => {
    if (!elements.has(selector)) elements.set(selector, node(selector));
    return elements.get(selector);
  };
  const pantry = {items: [...initial]};
  if (camera === 'capture') $('#fridge-camera-input').capture = 'environment';
  const dialog = Object.assign($('#fridge-camera-dialog'), {
    open: false,
    showModal() { this.open = true; },
    close() { this.open = false; this.handlers.close(); },
  });
  Object.assign($('#fridge-camera-video'), {videoWidth: 1920, videoHeight: 1080});
  const getUserMedia = async constraints => {
    if (camera === 'blocked') throw Object.assign(new Error('denied'), {name: 'NotAllowedError'});
    const track = {constraints, stopped: false, stop() { this.stopped = true; }};
    tracks.push(track);
    return {getTracks: () => [track]};
  };
  const context = vm.createContext({
    foods, $, pantry, setTimeout, clearTimeout,
    window: {addEventListener() {}, ...(camera === 'webcam' || camera === 'blocked' ? {navigator: {mediaDevices: {getUserMedia}}} : {})},
    matchMedia: () => ({matches: true}),
    document: {
      querySelector: () => ({content: 'https://api.test/functions/v1'}), addEventListener() {},
      createElement() {
        return {width: 0, height: 0,
          getContext: () => ({fillRect() {}, drawImage() {}}),
          toBlob(callback, type, quality) {
            encodes.push({width: this.width, height: this.height, type, quality});
            callback(blobSizes.length ? {size: blobSizes.shift()} : null);
          },
        };
      },
    },
    createImageBitmap: async source => {
      sources.push(source);
      const bitmap = {width, height, closed: false, close() { this.closed = true; }};
      bitmaps.push(bitmap);
      return bitmap;
    },
    FileReader: class {
      readAsDataURL() { this.result = 'data:image/jpeg;base64,ZmFrZQ=='; this.onload(); }
    },
    fetch: async (url, options) => {
      uploads.push({url, body: JSON.parse(options.body)});
      return {ok: !fail, json: async () => fail ? {error: 'Prova igen.'} : result};
    },
    updatePantry: message => { $('#pantry-status').textContent = message; },
  });
  vm.runInContext(helpers + capitalize + fridge, context);
  return {pantry, $, uploads, encodes, bitmaps, sources, clicks, tracks, dialog,
    async choose() { $('#fridge-photo-input').files = [{name: 'kyl.jpg'}]; await $('#fridge-photo-input').handlers.change(); },
    // The phone's camera hands its one photo to the capture input.
    async capture() { $('#fridge-camera-input').files = [{name: 'image.jpg'}]; await $('#fridge-camera-input').handlers.change(); },
    keys: () => pantry.items.map(name => context.keyForIngredient(name)),
  };
}

test('the photo flow retains distinct cheeses, herbs and cabbage varieties and keeps recipe matching', async () => {
  const result = detectedFoods({names: ['Hushållsost', 'Cheddar', 'Basilika', 'Dill', 'Rödkål', 'Vitkål', 'Halloumi', 'Sriracha', 'HUSHÅLLSOST']});
  const p = page({result});
  await p.choose();
  assert.deepEqual(p.pantry.items, result.names);
  assert.deepEqual(p.keys(), ['cheddar', 'cheddar', 'orter', 'dill', 'kal', 'kal', 'halloumi', 'sriracha']);
  await p.choose();
  assert.deepEqual(p.pantry.items, result.names, 'repeating a photo does not duplicate its groceries');
});

test('a scan says when the list is full, counting only foods that were left out', async () => {
  const names = Array.from({length: 8}, (_, i) => `Mat ${i}`);
  const initial = Array.from({length: 55}, (_, i) => `Hemma ${i}`);
  // One encoded photo per scan: the stand-in canvas hands out a blob size each time.
  const p = page({result: detectedFoods({names: ['Hemma 3', ...names]}), initial, blobSizes: [500_000, 500_000]});
  await p.choose();
  assert.equal(p.pantry.items.length, 60);
  assert.deepEqual(p.pantry.items.slice(55), names.slice(0, 5));
  assert.equal(p.$('#pantry-status').textContent, '5 råvaror från bilden lades till. Listan rymmer 60 råvaror, så 3 fick inte plats. Ta bort några och fota igen.');

  // Already full: nothing is added, and foods that are already there don't count as left out.
  await p.choose();
  assert.equal(p.pantry.items.length, 60);
  assert.equal(p.$('#pantry-status').textContent, 'Listan rymmer 60 råvaror, så 3 från bilden fick inte plats. Ta bort några och fota igen.');
  const one = page({result: detectedFoods({names: ['Mjölk', 'Ägg']}), initial: Array.from({length: 59}, (_, i) => `Hemma ${i}`)});
  await one.choose();
  assert.equal(one.$('#pantry-status').textContent, '1 råvara från bilden lades till. Listan rymmer 60 råvaror, så 1 fick inte plats. Ta bort några och fota igen.');
});

test('photo uploads retain label detail, aspect ratio and JPEG quality', async () => {
  const p = page();
  await p.choose();
  assert.deepEqual(p.encodes, [{width: 2560, height: 1920, type: 'image/jpeg', quality: 0.9}]);
  assert.deepEqual(p.uploads, [{url: 'https://api.test/functions/v1/detect-ingredients', body: {images: ['ZmFrZQ==']}}]);
  assert.equal(p.bitmaps[0].closed, true);
  const small = page({width: 800, height: 600});
  await small.choose();
  assert.equal(small.encodes[0].width, 800, 'small images are not enlarged');
});

test('large JPEGs are reduced to the existing upload cap and bitmap resources are released on failure', async () => {
  const p = page({blobSizes: [3_000_000, 2_000_000]});
  await p.choose();
  assert.deepEqual(p.encodes.map(({width, height}) => [width, height]), [[2560, 1920], [2048, 1536]]);
  assert.equal(p.uploads.length, 1);
  const broken = page({blobSizes: []});
  await broken.choose();
  assert.equal(broken.bitmaps[0].closed, true);
  assert.equal(broken.uploads.length, 0);
  assert.equal(broken.$('#fridge-photo').disabled, false);
});

test('an old detector still works during rollout and failed or empty scans leave existing groceries alone', async () => {
  const old = page({result: {keys: ['mjolk', 'invalid'], other: ['Sriracha']}});
  await old.choose();
  assert.deepEqual(old.pantry.items, ['Mjölk', 'Sriracha']);
  for (const fail of [false, true]) {
    const p = page({initial: ['Ägg'], fail});
    await p.choose();
    assert.deepEqual(p.pantry.items, ['Ägg']);
    assert.equal(p.$('#fridge-photo').disabled, false);
    assert.equal(p.$('#fridge-photo-input').value, '');
    assert.match(p.$('#pantry-status').textContent, fail ? /Prova igen/ : /Hittade inga råvaror/);
  }
});

test('"Fota" opens the phone camera at once, and steps aside where there is no camera', async () => {
  const none = page();
  assert.equal(none.$('#fridge-camera').hidden, true);
  await none.choose();
  assert.equal(none.$('#fridge-camera').hidden, true, 'a scan does not bring the button back');
  assert.equal(none.$('#fridge-photo').hidden, undefined);

  const p = page({camera: 'capture', result: detectedFoods({names: ['Mjölk', 'Ägg']})});
  assert.equal(p.$('#fridge-camera').hidden, false);
  await p.$('#fridge-camera').handlers.click();
  assert.deepEqual(p.clicks, ['#fridge-camera-input'], 'the capture input, not the photo library');
  assert.equal(p.dialog.open, false);
  await p.capture();
  assert.deepEqual(p.pantry.items, ['Mjölk', 'Ägg']);
  assert.equal(p.uploads[0].body.images.length, 1);
  assert.equal(p.$('#pantry-status').textContent, '2 råvaror från bilden lades till. Stämmer något inte, tryck på det för att ta bort det.');
  assert.equal(p.$('#fridge-camera').disabled, false);
  assert.equal(p.$('#fridge-photo').hidden, false, 'both buttons are back after the scan');
  assert.equal(p.$('span').textContent, 'Fota');

  await p.$('#fridge-photo').handlers.click();
  assert.deepEqual(p.clicks, ['#fridge-camera-input', '#fridge-photo-input']);
});

test('on a computer "Fota" shows the webcam, sends its picture and turns the camera off', async () => {
  const p = page({camera: 'webcam', result: detectedFoods({names: ['Gurka']})});
  assert.equal(p.$('#fridge-camera').hidden, false);
  await p.$('#fridge-camera').handlers.click();
  assert.deepEqual(p.clicks, [], 'no file picker');
  assert.equal(p.dialog.open, true);
  assert.equal(p.tracks[0].constraints.audio, false);
  assert.equal(p.$('#fridge-camera-shoot').disabled, true, 'no picture before the camera shows one');
  p.$('#fridge-camera-video').handlers.loadedmetadata();
  assert.equal(p.$('#fridge-camera-shoot').disabled, false);

  await p.$('#fridge-camera-shoot').handlers.click();
  assert.equal(p.dialog.open, false);
  assert.equal(p.tracks[0].stopped, true);
  assert.equal(p.$('#fridge-camera-video').srcObject, null);
  assert.deepEqual([p.sources[0].width, p.sources[0].height], [1920, 1080], 'the frame at the camera\'s own size');
  assert.equal(p.uploads.length, 1);
  assert.deepEqual(p.pantry.items, ['Gurka']);

  // Closing without a picture sends nothing, and turns the camera off too.
  await p.$('#fridge-camera').handlers.click();
  p.$('.dialog-close').handlers.click();
  assert.equal(p.tracks[1].stopped, true);
  assert.equal(p.uploads.length, 1);
});

test('a blocked camera says so and leaves the photo library to use', async () => {
  const p = page({camera: 'blocked'});
  await p.$('#fridge-camera').handlers.click();
  assert.equal(p.dialog.open, false);
  assert.equal(p.$('#pantry-status').textContent, 'Kameran är blockerad. Tillåt den i webbläsaren, eller välj bilder i stället.');
  assert.equal(p.$('#fridge-camera').disabled, false);
  assert.equal(p.uploads.length, 0);
});
