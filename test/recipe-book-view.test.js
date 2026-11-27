// Render the actual page script against a small DOM boundary. Network failures must retain cached
// cards, filters must keep working, and polling must not keep replacing focused cards.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../src/js/recipe-book.js', import.meta.url), 'utf8');
const snapshot = () => ({ fetched: true, archive: [{ recipe_id: '01-rodbetspytt', created_at: '2026-11-14T10:00:00Z' }], generated: [{ id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', title: 'Egen middag', saved_at: '2026-11-14T11:00:00Z', categories: ['main'], tags: [] }] });
function element() {
  const node = new EventTarget();
  node.dataset = {}; node.hidden = false; node.textContent = ''; node.writes = 0;
  let html = '';
  Object.defineProperty(node, 'innerHTML', { get: () => html, set(value) { html = value; node.writes++; } });
  node.setAttribute = () => {};
  node.querySelectorAll = () => [];
  node.querySelector = () => ({ focus() {} });
  return node;
}
async function page({ online = true, book = snapshot(), signedIn = true } = {}) {
  const nodes = new Map(['[data-book-grid]', '[data-book-status]', '[data-book-empty]', '[data-book-toolbar]', '[data-book-sync-status]', '[data-book-sync-retry]', '#main'].map(key => [key, element()]));
  const filters = ['alla', 'egna', 'arkiv'].map(name => { const node = element(); node.dataset.bookFilter = name; return node; });
  const document = new EventTarget(); document.activeElement = null;
  document.querySelector = () => ({ content: 'https://example.test' });
  document.querySelectorAll = () => filters;
  const data = { book, signedIn, state: { phase: online ? 'waiting' : 'saved', durable: true, pending: 0 } };
  // The views the book hands its pager (load-more.js): a new one starts again at the first page.
  const views = [];
  const pagerSaw = [];
  const context = {
    document, window: new EventTarget(), navigator: { onLine: online },
    pagedGrid: grid => ({ update: view => { views.push(view); pagerSaw.push(grid.innerHTML); } }),
    $: selector => nodes.get(selector), Event,
    recipes: [{ id: '01-rodbetspytt', title: 'Arkivmiddag' }],
    archiveCard: recipe => `<article>${recipe.title}</article>`,
    escapeHtml: value => String(value).replaceAll('<', '&lt;'),
    assetUrl: path => '/' + path, squareIcon: () => '', heartIcon: () => '', faIcon: () => '',
    mealTypes: { main: { icon: 'main' } }, mealName: () => 'Huvudrätt', recipeTagLabels: {}, showToast() {},
  };
  context.window.restfestAccount = {
    signedIn: () => data.signedIn, bookSnapshot: () => data.book, bookStatus: () => data.state,
    refreshBook: async () => false,
    setGenerated(id, saved) {
      if (!saved) data.book.generated = data.book.generated.filter(row => row.id !== id);
      document.dispatchEvent(new Event('restfest:book'));
    },
  };
  vm.runInNewContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  return { data, nodes, filters, document, views, pagerSaw };
}

test('switching the book filter starts again at the first page; a removal keeps the depth', async () => {
  const view = await page();
  assert.equal(view.views.at(-1), 'alla');
  view.filters[1].dispatchEvent(new Event('click'));
  assert.equal(view.views.at(-1), 'egna');
  view.filters[0].dispatchEvent(new Event('click'));
  const before = view.views.length;
  view.data.book.generated = [];
  view.document.dispatchEvent(new Event('restfest:book'));
  assert.ok(view.views.length > before);
  assert.equal(view.views.at(-1), 'alla');
});

test('offline recipe book renders cached archive and generated cards despite a failed refresh', async () => {
  const view = await page({ online: false });
  const grid = view.nodes.get('[data-book-grid]');
  assert.match(grid.innerHTML, /Arkivmiddag/);
  assert.match(grid.innerHTML, /Egen middag/);
  assert.equal(view.nodes.get('[data-book-empty]').hidden, true);
  assert.match(view.nodes.get('[data-book-sync-status]').textContent, /offline/);
});

test('filters still select both kinds of cached recipes offline', async () => {
  const view = await page({ online: false });
  view.filters[1].dispatchEvent(new Event('click'));
  assert.match(view.nodes.get('[data-book-grid]').innerHTML, /Egen middag/);
  assert.doesNotMatch(view.nodes.get('[data-book-grid]').innerHTML, /Arkivmiddag/);
  view.filters[2].dispatchEvent(new Event('click'));
  assert.match(view.nodes.get('[data-book-grid]').innerHTML, /Arkivmiddag/);
  assert.doesNotMatch(view.nodes.get('[data-book-grid]').innerHTML, /Egen middag/);
});

test('unchanged polling results do not replace cards or disturb the active filter', async () => {
  const view = await page();
  view.filters[1].dispatchEvent(new Event('click'));
  const grid = view.nodes.get('[data-book-grid]'), before = grid.writes;
  view.document.dispatchEvent(new Event('restfest:account'));
  view.document.dispatchEvent(new Event('restfest:book'));
  assert.equal(grid.writes, before);
  assert.doesNotMatch(grid.innerHTML, /Arkivmiddag/);
});

test('signing out clears private cards immediately', async () => {
  const view = await page();
  view.data.signedIn = false;
  view.document.dispatchEvent(new Event('restfest:account'));
  assert.equal(view.nodes.get('[data-book-grid]').innerHTML, '');
  assert.equal(view.nodes.get('[data-book-toolbar]').hidden, true);
  // The pager saw the empty grid too, so its faded row holds no copies of the private cards.
  assert.equal(view.pagerSaw.at(-1), '');
  // An empty book is a view of its own, so signing in again starts the book at 12, not the old depth.
  assert.notEqual(view.views.at(-1), 'alla');
  view.data.signedIn = true;
  view.document.dispatchEvent(new Event('restfest:account'));
  assert.equal(view.views.at(-1), 'alla');
});
