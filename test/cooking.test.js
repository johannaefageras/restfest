// The state behind cooking along (src/js/cooking.js): the place saved per recipe, the timers and their
// clock, and when the screen should stay on. Only the pure functions; the page parts are checked in
// the browser.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../src/js/cooking.js', import.meta.url), 'utf8');
const timesSource = readFileSync(new URL('../src/js/cooking-times.js', import.meta.url), 'utf8');
// Both scripts, as on the page: cooking.js uses cooking-times.js's words for durations.
function load(globals = {}) {
  const loaded = vm.createContext(globals);
  vm.runInContext(timesSource, loaded);
  vm.runInContext(source, loaded);
  return loaded;
}
const context = load();
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

// A stand-in for navigator.wakeLock. Each request() gives a sentinel; drop() is the browser letting go
// (the tab was hidden), release() is the page letting go. `fail` makes the next requests refuse.
function fakeWakeLock() {
  const fake = {
    fail: false,
    last: null,
    async request() {
      if (fake.fail) throw new Error('NotAllowedError');
      const listeners = [];
      const sentinel = {
        released: false,
        addEventListener: (name, listener) => { if (name === 'release') listeners.push(listener); },
        async release() {
          if (sentinel.released) return;
          sentinel.released = true;
          listeners.forEach((listener) => listener());
        },
        drop() {
          sentinel.released = true;
          listeners.forEach((listener) => listener());
        },
      };
      fake.last = sentinel;
      return sentinel;
    },
  };
  return fake;
}

test('screen lock follows the browser', async () => {
  const { cookingScreenLock } = context;
  let changes = 0;
  assert.equal(cookingScreenLock(undefined, () => changes++).supported, false);
  assert.equal(await cookingScreenLock(undefined, () => changes++).request(), false);
  assert.equal(changes, 0);
  const fake = fakeWakeLock();
  const lock = cookingScreenLock(fake, () => changes++);
  assert.equal(lock.supported, true);
  assert.equal(await lock.request(), true);
  assert.equal(lock.held(), true);
  fake.last.drop(); // the tab was hidden
  assert.equal(lock.held(), false);
  await lock.resume();
  assert.equal(lock.held(), true);
  await lock.release();
  assert.equal(fake.last.released, true);
  await lock.resume(); // not wanted any more
  assert.equal(lock.held(), false);
  fake.fail = true;
  assert.equal(await lock.request(), false);
  assert.equal(lock.held(), false);
  fake.fail = false;
  await lock.resume(); // still wanted, so it tries again
  assert.equal(lock.held(), true);
  assert.ok(changes >= 4, `${changes} changes`);
});

test('two requests at once hold one lock', async () => {
  const { cookingScreenLock } = context;
  const fake = fakeWakeLock();
  let requests = 0;
  const request = fake.request;
  fake.request = (...args) => { requests++; return request(...args); };
  const lock = cookingScreenLock(fake, () => {});
  await Promise.all([lock.request(), lock.request()]);
  assert.equal(requests, 1);
  assert.equal(lock.held(), true);
});

test('blocked site data reads as no storage, and odd saved entries are dropped', () => {
  const blocked = {};
  Object.defineProperty(blocked, 'localStorage', { get() { throw new Error('SecurityError'); } });
  assert.equal(load(blocked).cookingStorage(), null);
  const storage = memoryStorage();
  assert.equal(load({ localStorage: storage }).cookingStorage(), storage);
  storage.setItem('restfest-cooking', JSON.stringify({ a: { steps: 3, ingredients: [], screenOff: false, updated: NOW } }));
  assert.deepEqual(plain(cookingReadState(storage, NOW)), {});
});

test('timers live on in memory when storage refuses them', () => {
  const fresh = load();
  fresh.cookingWriteTimers(brokenStorage, [{ id: 'x', endsAt: NOW + 1000, done: false }]);
  assert.deepEqual(plain(fresh.cookingReadTimers(brokenStorage, NOW)).map((t) => t.id), ['x']);
  assert.deepEqual(plain(fresh.cookingReadTimers(null, NOW)).map((t) => t.id), ['x']);
  const storage = memoryStorage();
  fresh.cookingWriteTimers(storage, []);
  assert.deepEqual(plain(fresh.cookingReadTimers(storage, NOW)), []);
});

test('the tray goes to the modal dialog on top', () => {
  const { cookingModalStack } = context;
  const a = { id: 'a' };
  const b = { id: 'b' };
  const ids = (stack) => plain(stack.map((dialog) => dialog.id));
  let stack = cookingModalStack([], a, true);
  stack = cookingModalStack(stack, b, true);
  assert.deepEqual(ids(stack), ['a', 'b']);
  assert.deepEqual(ids(cookingModalStack(stack, b, false)), ['a']);
  assert.deepEqual(ids(cookingModalStack(cookingModalStack(stack, b, false), a, false)), []);
  assert.deepEqual(ids(cookingModalStack(stack, a, true)), ['b', 'a']);
});

test('a finished timer rings before any tap; only vibration waits for one', () => {
  const { cookingAlerts } = context;
  const fresh = [{ endsAt: NOW - 1000 }];
  const stale = [{ endsAt: NOW - 61000 }];
  assert.deepEqual(plain(cookingAlerts(fresh, NOW, false)), { ring: true, vibrate: false });
  assert.deepEqual(plain(cookingAlerts(fresh, NOW, true)), { ring: true, vibrate: true });
  assert.deepEqual(plain(cookingAlerts(stale, NOW, true)), { ring: false, vibrate: false });
  assert.deepEqual(plain(cookingAlerts([], NOW, true)), { ring: false, vibrate: false });
});

test('the alarm waits for running audio and stops when no finished timer is left', async () => {
  let tones = 0;
  class FakeAudio {
    constructor() { this.state = 'suspended'; this.currentTime = 0; this.destination = {}; }
    resume() { return Promise.reject(new Error('not allowed')); }
    createOscillator() { tones++; return { frequency: {}, connect: (node) => node, start() {}, stop() {} }; }
    createGain() {
      return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect: (node) => node };
    }
  }
  const audio = load({ window: { AudioContext: FakeAudio }, setTimeout, clearTimeout });
  const alarm = vm.runInContext('cookingAlarm', audio); // a const, so not on the context object
  alarm.prime();
  alarm.ring();
  assert.equal(tones, 0, 'no beeps pile up while the browser holds the sound back');
  alarm.context.state = 'running';
  alarm.ring();
  assert.equal(tones, 3);
  audio.cookingSettleAlarm([{ done: true }]);
  assert.notEqual(alarm.timeout, 0, 'still ringing for a finished timer');
  audio.cookingSettleAlarm([{ done: false }]);
  assert.equal(alarm.timeout, 0);
  await new Promise((resolve) => setTimeout(resolve, 10)); // lets an unhandled resume() rejection surface
});

test('tray buttons say which timer they belong to, and focus returns to the same kind', () => {
  const { cookingTrayLabels, cookingDismissMessage, cookingFocusSelector } = context;
  const timer = { phrase: '4–5 minuter', stepLabel: 'Steg 3', seconds: 240, done: false };
  assert.deepEqual(plain(cookingTrayLabels(timer)), {
    more: '+1 min, 4–5 minuter · Steg 3',
    close: 'Avbryt timer, 4–5 minuter · Steg 3',
  });
  assert.equal(cookingTrayLabels({ ...timer, done: true }).close, 'Stäng timer, 4–5 minuter · Steg 3');
  assert.equal(cookingDismissMessage(timer), 'Timer avbruten: 4 minuter, Steg 3');
  assert.equal(cookingDismissMessage({ ...timer, done: true }), 'Timer stängd: 4 minuter, Steg 3');
  assert.equal(cookingFocusSelector('text-button cook-tray-more'), '.cook-tray-more');
  assert.equal(cookingFocusSelector('cook-tray-close'), '.cook-tray-close');
  assert.equal(cookingFocusSelector('cook-tray-recipe'), '.cook-tray-recipe');
  assert.equal(cookingFocusSelector('cook-tray-list'), null);
});

test('the screen lock says while it is still asking', async () => {
  const lock = context.cookingScreenLock(fakeWakeLock(), () => {});
  const asking = lock.request();
  assert.equal(lock.busy(), true);
  await asking;
  assert.equal(lock.busy(), false);
});
