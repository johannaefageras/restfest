import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../src/js/shopping-list.js', import.meta.url), 'utf8');

function page({ accounts = true, signedIn = false } = {}) {
  const events = new Map();
  const status = { textContent: '' }, retry = { hidden: false, addEventListener() {} };
  const panel = { hidden: true };
  const registrations = [];
  let inside = signedIn;
  let state = { phase: 'synced', pending: 0, durable: true };
  const context = {
    window: { addEventListener() {}, restfestShopping: { status: () => state } },
    document: {
      querySelector: selector => selector.includes('retry') ? retry : selector.includes('page-list') ? panel : status,
      addEventListener: (name, handler) => events.set(name, handler),
    },
    navigator: { onLine: true, serviceWorker: { register: async url => { registrations.push(url); } } },
    assetUrl: path => `https://example.test/site/${path}`,
    location: { replace() { assert.fail('opening the shopping page must never redirect to sign-in'); } },
  };
  if (accounts) context.window.restfestAccount = {
    signedIn: () => inside,
    loginUrl() { assert.fail('a guest must not need a login URL to use the shopping page'); },
  };
  vm.runInNewContext(source, context);
  return { status, retry, panel, registrations,
    signIn(value) { inside = value; events.get('restfest:account')(); },
    sync(value) { state = value; events.get('restfest:shopping-sync')(); },
  };
}

test('the shopping page stays usable without a session, with or without account support', () => {
  for (const accounts of [true, false]) {
    const view = page({ accounts });
    assert.match(view.status.textContent, /dela en kopia utan att logga in/);
    assert.equal(view.retry.hidden, true);
    assert.equal(view.panel.hidden, false, 'the guest list becomes visible after initialization');
    assert.deepEqual(view.registrations, []);
    view.sync({ phase: 'waiting', pending: 2, durable: true });
    assert.match(view.status.textContent, /dela en kopia utan att logga in/, 'a stale account sync event cannot replace the guest status');
  }
});

test('the shopping page follows account changes while preserving signed-in sync feedback', () => {
  const view = page({ signedIn: true });
  assert.equal(view.status.textContent, 'Sparat i kontot.');
  assert.deepEqual(view.registrations, ['https://example.test/site/shopping-worker.js']);
  view.sync({ phase: 'waiting', pending: 1, durable: true });
  assert.equal(view.retry.hidden, false);
  view.signIn(false);
  assert.match(view.status.textContent, /dela en kopia utan att logga in/);
  assert.equal(view.retry.hidden, true);
  view.signIn(true);
  assert.match(view.status.textContent, /Kunde inte synka/);
});
