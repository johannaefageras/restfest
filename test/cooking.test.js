// The state behind cooking along (src/js/cooking.js): the place saved per recipe, the timers and their
// clock, and when the screen should stay on. Only the pure functions; the page parts are checked in
// the browser.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../src/js/cooking.js', import.meta.url), 'utf8');
const context = {};
vm.runInNewContext(source, context);
const {
  cookingReadState, cookingSaveEntry, cookingReadTimers, cookingWriteTimers, cookingTimerId,
  cookingStartTimer, cookingAddMinute, cookingRemoveTimer, cookingDueTimers, cookingSortTimers,
  cookingShouldRing, cookingFormatRemaining, cookingCurrentStep, cookingStepLabel, cookingWantsScreen,
} = context;
// The results come from the script's own realm; copy them into this one before comparing.
const plain = (value) => JSON.parse(JSON.stringify(value));

function memoryStorage() {
  const items = new Map();
  return {
    getItem: (key) => (items.has(key) ? items.get(key) : null),
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: (key) => items.delete(key),
  };
}
const brokenStorage = {
  getItem() { throw new Error('denied'); },
  setItem() { throw new Error('quota'); },
  removeItem() { throw new Error('denied'); },
};

const H = 3600000;
const NOW = Date.UTC(2026, 10, 26, 18);

test('saved place expires after 12 hours and survives bad storage', () => {
  const storage = memoryStorage();
  cookingSaveEntry(storage, 'a', { steps: [0, 1], ingredients: [2], screenOff: false }, NOW - 12 * H - 1);
  cookingSaveEntry(storage, 'b', { steps: [0], ingredients: [], screenOff: true }, NOW - 12 * H + 1);
  assert.deepEqual(Object.keys(plain(cookingReadState(storage, NOW))), ['b']);
  assert.deepEqual(plain(cookingReadState(storage, NOW)).b,
    { steps: [0], ingredients: [], screenOff: true, updated: NOW - 12 * H + 1 });
  storage.setItem('restfest-cooking', '{nope');
  assert.deepEqual(plain(cookingReadState(storage, NOW)), {});
  assert.deepEqual(plain(cookingReadState(brokenStorage, NOW)), {});
  assert.doesNotThrow(() =>
    cookingSaveEntry(brokenStorage, 'a', { steps: [], ingredients: [], screenOff: false }, NOW));
  assert.deepEqual(plain(cookingReadTimers(brokenStorage, NOW)), []);
});

test('saving one recipe prunes the expired ones', () => {
  const storage = memoryStorage();
  cookingSaveEntry(storage, 'old', { steps: [0], ingredients: [], screenOff: false }, NOW - 13 * H);
  cookingSaveEntry(storage, 'new', { steps: [1], ingredients: [], screenOff: false }, NOW);
  assert.deepEqual(Object.keys(JSON.parse(storage.getItem('restfest-cooking'))), ['new']);
});

test('timers: start, +1 min, finish once, drop after an hour', () => {
  const fields = {
    id: cookingTimerId('01-rodbetspytt', 2, 0), recipeId: '01-rodbetspytt',
    recipeTitle: 'Rödbetspytt', recipeUrl: '/recept/01-rodbetspytt.html', stepLabel: 'Steg 3',
    phrase: '4–5 minuter', seconds: 240,
  };
  assert.equal(fields.id, '01-rodbetspytt:2:0');
  assert.notEqual(cookingTimerId('01-rodbetspytt', 3, 0), fields.id);
  let timers = cookingStartTimer([], fields, NOW);
  assert.equal(timers[0].endsAt, NOW + 240000);
  assert.equal(timers[0].done, false);
  timers = cookingStartTimer(timers, fields, NOW + 1000); // the same id replaces
  assert.equal(timers.length, 1);
  timers = cookingAddMinute(timers, fields.id, NOW + 1000);
  assert.equal(timers[0].endsAt, NOW + 1000 + 300000);
  const due = cookingDueTimers(timers, NOW + 301000);
  assert.equal(due.finished.length, 1);
  assert.equal(due.timers[0].done, true);
  assert.equal(cookingDueTimers(due.timers, NOW + 302000).finished.length, 0);
  assert.equal(cookingShouldRing(due.timers[0], NOW + 301000 + 59000), true);
  assert.equal(cookingShouldRing(due.timers[0], NOW + 301000 + 61000), false);
  const again = cookingAddMinute(due.timers, fields.id, NOW + 400000);
  assert.deepEqual([again[0].done, again[0].endsAt], [false, NOW + 460000]);
  const storage = memoryStorage();
  cookingWriteTimers(storage, due.timers);
  assert.equal(cookingReadTimers(storage, NOW + 301000 + H + 1).length, 0);
  assert.equal(cookingReadTimers(storage, NOW + 301000 + H - 1).length, 1);
  assert.equal(cookingRemoveTimer(due.timers, fields.id).length, 0);
});

test('corrupt timer storage reads as no timers', () => {
  const storage = memoryStorage();
  storage.setItem('restfest-timers', '{"not":"a list"}');
  assert.deepEqual(plain(cookingReadTimers(storage, NOW)), []);
  storage.setItem('restfest-timers', 'garbage');
  assert.deepEqual(plain(cookingReadTimers(storage, NOW)), []);
});

test('formatting, current step, labels, screen policy', () => {
  for (const [ms, text] of [[240000, '4:00'], [239001, '4:00'], [59000, '0:59'], [0, '0:00'],
    [-5000, '0:00'], [3599000, '59:59'], [3600000, '1:00:00'], [3900000, '1:05:00']])
    assert.equal(cookingFormatRemaining(ms), text, String(ms));
  assert.equal(cookingCurrentStep([true, true, false, false]), 2);
  assert.equal(cookingCurrentStep([true, true]), -1);
  assert.equal(cookingCurrentStep([]), -1);
  assert.equal(cookingStepLabel(null, 3, 1), 'Steg 3');
  assert.equal(cookingStepLabel('Vattenkokare', 2, 3), 'Vattenkokare, steg 2');
  const want = (overrides) =>
    cookingWantsScreen({ started: false, screenOff: false, allDone: false, running: 0, ...overrides });
  assert.equal(want({}), false);
  assert.equal(want({ started: true }), true);
  assert.equal(want({ started: true, allDone: true }), false);
  assert.equal(want({ started: true, allDone: true, running: 1 }), true);
  assert.equal(want({ running: 1 }), true);
  assert.equal(want({ started: true, running: 1, screenOff: true }), false);
});

test('sorts by end time', () => {
  const ids = plain(cookingSortTimers([{ id: 'b', endsAt: 2 }, { id: 'a', endsAt: 1 }])).map((t) => t.id);
  assert.deepEqual(ids, ['a', 'b']);
});
