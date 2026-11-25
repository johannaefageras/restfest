// The WebP copies of the recipe photos (tools/photos.mjs), made here in a temporary folder.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, utimesSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {makePhotos} from '../tools/photos.mjs';

const originals = new URL('../src/assets/recipes/', import.meta.url);
const [first, second] = readdirSync(originals)
  .filter(name => name.endsWith('.png'))
  .map(name => readFileSync(new URL(name, originals)));
const copyNames = ['photo-600.webp', 'photo-1200.webp', 'photo-1600.webp'];

function folders(t) {
  const root = mkdtempSync(join(tmpdir(), 'ofta-photos-'));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  const input = join(root, 'photos');
  const output = join(root, 'copies');
  mkdirSync(input);
  return {
    input,
    output,
    photo: join(input, 'photo.png'),
    copies: () => copyNames.map(name => createHash('md5').update(readFileSync(join(output, name))).digest('hex')),
    // As if the copies were made a while before the photo was last saved.
    age: () => copyNames.forEach(name => utimesSync(join(output, name), new Date(0), new Date(0)))
  };
}

test('a new photo gets a copy of each width', async t => {
  const {input, output, photo} = folders(t);
  writeFileSync(photo, first);

  assert.deepEqual(await makePhotos({input, output}), {made: 1, upToDate: 0});
  assert.deepEqual(readdirSync(output).sort(), [...copyNames].sort());
});

test('a photo with up-to-date copies is skipped', async t => {
  const {input, output, photo} = folders(t);
  writeFileSync(photo, first);
  await makePhotos({input, output});
  const times = () => copyNames.map(name => statSync(join(output, name)).mtimeMs);
  const before = times();

  assert.deepEqual(await makePhotos({input, output}), {made: 0, upToDate: 1});
  assert.deepEqual(times(), before);
});

test('copies an earlier run left are replaced when the photo is newer', async t => {
  const {input, output, photo, copies, age} = folders(t);
  mkdirSync(output);
  copyNames.forEach(name => writeFileSync(join(output, name), 'an older photo'));
  const left = copies();
  age();
  writeFileSync(photo, first);

  assert.deepEqual(await makePhotos({input, output}), {made: 1, upToDate: 0});
  const made = copies();
  copyNames.forEach((name, i) => assert.notEqual(made[i], left[i], `${name} is still the older photo`));
});

// The local server makes the copies in one long-running process, so nothing may be remembered from
// the previous photo, neither that the files exist nor what they held.
test('a replaced photo gets new copies every time, in the same process', async t => {
  const {input, output, photo, copies, age} = folders(t);
  writeFileSync(photo, first);
  await makePhotos({input, output});
  const copiesOfFirst = copies();

  age();
  writeFileSync(photo, second);
  assert.deepEqual(await makePhotos({input, output}), {made: 1, upToDate: 0});
  const copiesOfSecond = copies();
  copyNames.forEach((name, i) => assert.notEqual(copiesOfSecond[i], copiesOfFirst[i], `${name} is still the first photo`));
  assert.deepEqual(await makePhotos({input, output}), {made: 0, upToDate: 1}, 'the new copies count as up to date');

  age();
  writeFileSync(photo, first);
  await makePhotos({input, output});
  assert.deepEqual(copies(), copiesOfFirst, 'back to the first photo');
});
