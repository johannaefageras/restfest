// Saving a Scrollstopp recipe's TikTok image (src/js/tiktok-save.js): when a click shares the file and
// when it downloads, and what a share that fails or is closed does. Only the pure functions; the page
// parts are checked in the browser.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../src/js/tiktok-save.js', import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const {tiktokSaveMode, tiktokShare} = context;

test('a phone that can share files shares once the file is ready', () => {
  assert.equal(tiktokSaveMode({coarsePointer: true, canShareFiles: true, file: {}}), 'share');
});

test('without the file, without sharing, or on a computer, the link downloads', () => {
  assert.equal(tiktokSaveMode({coarsePointer: true, canShareFiles: true, file: null}), 'download');
  assert.equal(tiktokSaveMode({coarsePointer: true, canShareFiles: false, file: {}}), 'download');
  assert.equal(tiktokSaveMode({coarsePointer: false, canShareFiles: true, file: {}}), 'download');
});

test('a closed share sheet does nothing; another failure downloads instead', async () => {
  let downloads = 0;
  const download = () => downloads++;
  const fail = name => async () => { throw Object.assign(new Error(name), {name}); };
  assert.equal(await tiktokShare({}, {share: async () => {}, download}), 'shared');
  assert.equal(await tiktokShare({}, {share: fail('AbortError'), download}), 'cancelled');
  assert.equal(await tiktokShare({}, {share: fail('NotAllowedError'), download}), 'downloaded');
  assert.equal(downloads, 1);
});

test('the share sheet gets the file and nothing else', async () => {
  const file = {name: 'scrollstopp-340-cookiepizza.jpg'};
  let shared;
  await tiktokShare(file, {share: async data => { shared = data; }, download: () => {}});
  assert.equal(Object.keys(shared).join(), 'files');
  assert.equal(shared.files.length, 1);
  assert.equal(shared.files[0], file);
});
