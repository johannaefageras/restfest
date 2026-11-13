// Keeping the recipe book in the browser in step with the account: bookSync in lib/account-helpers.js,
// which src/js/account.js runs with localStorage and Supabase. Here the browser's storage is an object,
// the account is a pair of Sets, and two "tabs" are two bookSyncs sharing both.
import assert from 'node:assert/strict';
import test from 'node:test';
import { bookSync } from '../lib/account-helpers.js';

const add = (id, kind = 'archive') => ({kind, id, saved: true});
const drop = (id, kind = 'archive') => ({kind, id, saved: false});

// The account: what it holds, and switches for being out of reach or slow.
function account({archive = [], generated = [], name = 'Anna'} = {}) {
  const held = {archive: new Set(archive), generated: new Set(generated)};
  const self = {
    held,
    down: false,
    refused: new Set(),
    fetches: 0,
    // Set to a promise to hold every change until it resolves.
    hold: null,
    remote: {
      async change({kind, saved, ids}) {
        if (self.hold) await self.hold;
        if (self.down) throw new Error('offline');
        if (ids.some(id => self.refused.has(id))) return false;
        for (const id of ids) held[kind][saved ? 'add' : 'delete'](id);
        return true;
      },
      async book() {
        self.fetches++;
        if (self.down) throw new Error('offline');
        return {archive: [...held.archive], generated: [...held.generated], name};
      }
    }
  };
  return self;
}

// What the web locks give the real tabs: one task at a time, whoever asks.
function sharedLock() {
  let last = Promise.resolve();
  return task => {
    const run = last.then(task);
    last = run.catch(() => {});
    return run;
  };
}

// A tab: the browser's storage is shared between tabs, `shown` is what the tab last drew.
function tab(storage, remote, lock) {
  const view = {shown: null};
  view.sync = bookSync({
    queue: {read: () => storage.queue ?? [], write: list => { storage.queue = list; }},
    remote,
    lock,
    show: book => { view.shown = book; }
  });
  return view;
}

test('a change is sent at once and leaves the queue', async () => {
  const there = account();
  const storage = {};
  assert.equal(await tab(storage, there.remote).sync.change(add('a')), true);
  assert.deepEqual([...there.held.archive], ['a']);
  assert.deepEqual(storage.queue, []);
});

test('a change that cannot be sent stays queued and goes with the next send', async () => {
  const there = account();
  const storage = {};
  const here = tab(storage, there.remote);
  there.down = true;
  assert.equal(await here.sync.change(add('a')), false);
  assert.deepEqual(storage.queue, [add('a')]);
  there.down = false;
  assert.equal(await here.sync.send(), true);
  assert.deepEqual([...there.held.archive], ['a']);
  assert.deepEqual(storage.queue, []);
});

test('a change the account refuses for good is dropped, and the others go through', async () => {
  const there = account();
  there.refused.add('gone');
  const storage = {queue: [add('a'), add('gone'), add('c')]};
  assert.equal(await tab(storage, there.remote).sync.send(), true);
  assert.deepEqual([...there.held.archive], ['a', 'c']);
  assert.deepEqual(storage.queue, []);
});

test('refresh sends what is queued, then shows the account\'s book', async () => {
  const there = account({archive: ['a', 'b'], generated: ['g']});
  const storage = {queue: [drop('b'), add('c')]};
  const here = tab(storage, there.remote);
  assert.equal(await here.sync.refresh(), true);
  assert.deepEqual(here.shown, {archive: ['a', 'c'], generated: ['g'], name: 'Anna'});
});

test('refresh shows nothing while the queue cannot be sent', async () => {
  const there = account({archive: ['a']});
  const storage = {queue: [add('b')]};
  const here = tab(storage, there.remote);
  there.down = true;
  assert.equal(await here.sync.refresh(), false);
  assert.equal(here.shown, null);
  assert.equal(there.fetches, 0);
  assert.deepEqual(storage.queue, [add('b')]);
});

test('refresh lays a change made during the fetch over what was fetched', async () => {
  const there = account({archive: ['a', 'b']});
  const storage = {};
  const here = tab(storage, there.remote);
  const book = there.remote.book;
  // The visitor takes b out while the lists are on their way.
  there.remote.book = async () => {
    const lists = await book();
    storage.queue = [drop('b')];
    return lists;
  };
  await here.sync.refresh();
  assert.deepEqual(here.shown.archive, ['a']);
});

test('refreshIfStale fetches nothing when the book has just been fetched', async () => {
  const there = account({archive: ['a']});
  let fresh = false;
  const sync = bookSync({queue: {read: () => [], write() {}}, remote: there.remote, show: () => { fresh = true; }});
  // As on receptbok.html: the page asks for the book, and the page load's own check comes after.
  sync.refresh();
  assert.equal(await sync.refreshIfStale(() => fresh), true);
  assert.equal(there.fetches, 1);
});

test('refreshIfStale fetches when the book is old, or something is queued', async () => {
  const there = account();
  const storage = {};
  const here = tab(storage, there.remote);
  await here.sync.refreshIfStale(() => false);
  assert.equal(there.fetches, 1);
  storage.queue = [add('a')];
  await here.sync.refreshIfStale(() => true);
  assert.equal(there.fetches, 2);
  assert.deepEqual(here.shown.archive, ['a']);
});

test('a heart taken out in one tab while another tab is still sending it stays out', async () => {
  const there = account();
  // "add x" never reached the account (the visitor was offline). Now two tabs are open.
  const storage = {queue: [add('x')]};
  const lock = sharedLock();
  const first = tab(storage, there.remote, lock);
  const second = tab(storage, there.remote, lock);
  let release;
  there.hold = new Promise(resolve => { release = resolve; });
  // The first tab's "add x" is on its way: it was read from the queue and is held up on the network.
  const sending = first.sync.send();
  await new Promise(resolve => setImmediate(resolve));
  // In the second tab the visitor takes x out; that request is quick.
  there.hold = null;
  const removing = second.sync.change(drop('x'));
  await new Promise(resolve => setImmediate(resolve));
  release();
  await Promise.all([sending, removing]);
  assert.deepEqual([...there.held.archive], []);
  assert.deepEqual(storage.queue, []);
});
