// The Scrollstopp TikTok images (tools/scrollstopp-images.mjs), made here in a temporary folder from
// plain-coloured sources and stamp: the sizes, the crop, where the stamp goes and when they are made
// again.
import assert from 'node:assert/strict';
import {mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, utimesSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import {makeScrollstoppImages} from '../tools/scrollstopp-images.mjs';

const blue = {r: 0, g: 0, b: 255};
const red = {r: 255, g: 0, b: 0};
const green = {r: 0, g: 255, b: 0};
const outputNames = ['photo.jpg', 'photo-540.webp', 'photo-card.webp'];

const plain = (width, height, background) => sharp({create: {width, height, channels: 3, background}});

async function folders(t, {width = 941, height = 1672} = {}) {
  const root = mkdtempSync(join(tmpdir(), 'ofta-scrollstopp-'));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  const input = join(root, 'originals');
  const output = join(root, 'made');
  const stamp = join(root, 'stamp.png');
  const source = join(input, 'photo.png');
  mkdirSync(input);
  await plain(width, height, blue).png().toFile(source);
  await plain(100, 40, green).png().toFile(stamp);
  return {input, output, stamp, source, made: name => join(output, name)};
}

// The colour of one pixel, as [r, g, b].
async function pixel(file, left, top) {
  return [...await sharp(file).extract({left, top, width: 1, height: 1}).removeAlpha().raw().toBuffer()];
}
const isBlue = ([r, g, b]) => b > 200 && r < 60 && g < 60;
const isGreen = ([r, g, b]) => g > 200 && r < 60 && b < 60;

test('a source gets a 1080 × 1920 JPEG, a 540 × 960 and a 600 × 1067 WebP', async t => {
  const {input, output, stamp, made} = await folders(t);

  assert.deepEqual(await makeScrollstoppImages({input, output, stamp}), {made: 1, upToDate: 0});
  assert.deepEqual(readdirSync(output).sort(), [...outputNames].sort());
  const size = async name => {
    const {width, height, format} = await sharp(made(name)).metadata();
    return [width, height, format];
  };
  assert.deepEqual(await size('photo.jpg'), [1080, 1920, 'jpeg']);
  assert.deepEqual(await size('photo-540.webp'), [540, 960, 'webp']);
  assert.deepEqual(await size('photo-card.webp'), [600, 1067, 'webp']);
});

test('a source taller than 9:16 is cropped, not squashed', async t => {
  const {input, output, stamp, source, made} = await folders(t, {width: 916, height: 1717});
  // The 44 rows the crop takes off the top are red; a squashed image would keep them.
  await plain(916, 1717, blue).composite([{input: await plain(916, 44, red).png().toBuffer(), left: 0, top: 0}]).png().toFile(`${source}.tmp`);
  rmSync(source);
  await sharp(`${source}.tmp`).toFile(source);
  rmSync(`${source}.tmp`);

  await makeScrollstoppImages({input, output, stamp});
  assert.ok(isBlue(await pixel(made('photo.jpg'), 540, 4)));
});

test('the stamp is on the saved and shown images but not the card', async t => {
  const {input, output, stamp, made} = await folders(t);

  await makeScrollstoppImages({input, output, stamp});
  // The stamp's top left corner is 48 px from the left and 160 px from the top of the 1080 px image.
  assert.ok(isGreen(await pixel(made('photo.jpg'), 60, 170)));
  assert.ok(isGreen(await pixel(made('photo-540.webp'), 30, 85)));
  assert.ok(isBlue(await pixel(made('photo-card.webp'), 33, 94)));
});

test('outputs newer than the source and the stamp are skipped', async t => {
  const {input, output, stamp, made} = await folders(t);
  await makeScrollstoppImages({input, output, stamp});
  const times = () => outputNames.map(name => statSync(made(name)).mtimeMs);
  const before = times();

  assert.deepEqual(await makeScrollstoppImages({input, output, stamp}), {made: 0, upToDate: 1});
  assert.deepEqual(times(), before);
});

test('a newer stamp makes them again', async t => {
  const {input, output, stamp, source, made} = await folders(t);
  await makeScrollstoppImages({input, output, stamp});
  // The source is older than the outputs, and the stamp, just saved, is newer.
  utimesSync(source, new Date(0), new Date(0));
  outputNames.forEach(name => utimesSync(made(name), new Date(1_000_000), new Date(1_000_000)));

  assert.deepEqual(await makeScrollstoppImages({input, output, stamp}), {made: 1, upToDate: 0});
});
