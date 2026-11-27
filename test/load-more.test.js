// The shared pager for long card grids (src/js/load-more.js), run against a small fake DOM: a grid shows
// 12 cards, previews the next row as inert copies, loads 12 more at a time, and starts again at 12 only
// when the page's filter changes.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../src/js/load-more.js', import.meta.url), 'utf8');

function fakeElement(tag = 'div') {
  const attributes = new Map();
  const listeners = {};
  const node = {
    tagName: tag.toUpperCase(), children: [], dataset: {}, hidden: false, id: '', className: '',
    textContent: '', afterCalls: 0,
    append(...nodes) { node.children.push(...nodes); },
    replaceChildren(...nodes) { node.children = [...nodes]; },
    after(other) { node.next = other; node.afterCalls++; },
    setAttribute(name, value) { attributes.set(name, String(value)); },
    getAttribute(name) { return attributes.has(name) ? attributes.get(name) : null; },
    removeAttribute(name) { attributes.delete(name); },
    hasAttribute(name) { return attributes.has(name); },
    toggleAttribute(name, force) {
      const on = force ?? !attributes.has(name);
      if (on) attributes.set(name, ''); else attributes.delete(name);
      return on;
    },
    addEventListener(type, listener) { (listeners[type] ??= []).push(listener); },
    click(detail = 1) { for (const listener of listeners.click ?? []) listener({ detail }); },
    cloneNode() {
      const clone = fakeElement(tag);
      for (const [name, value] of attributes) clone.setAttribute(name, value);
      clone.className = node.className;
      clone.original = node;
      return clone;
    },
    // The first descendant with this tag name (`button`) or class (`.archive-page-count`).
    querySelector(selector) {
      const matches = child => selector.startsWith('.')
        ? String(child.className).split(' ').includes(selector.slice(1))
        : child.tagName === selector.toUpperCase();
      for (const child of node.children) {
        if (matches(child)) return child;
        const found = child.querySelector?.(selector);
        if (found) return found;
      }
      return null;
    },
  };
  return node;
}

// A card whose title link records where focus and scrolling went.
function fakeCard(n) {
  const card = fakeElement('article');
  card.n = n;
  card.className = 'archive-card';
  const link = {
    focus(options) { card.focused = options; },
    scrollIntoView(options) { card.scrolled = options; },
    closest: selector => (selector === '[data-paged-out]' && card.hasAttribute('data-paged-out') ? card : null),
  };
  card.link = link;
  card.querySelector = selector => (selector === '.recipe-main-link' ? link : null);
  return card;
}

function load() {
  const context = vm.createContext({ document: { createElement: fakeElement } });
  vm.runInContext(source, context);
  return context;
}

const api = load();

function makeGrid(count, noun) {
  const grid = fakeElement('div');
  grid.className = 'recipe-grid';
  if (noun) grid.dataset.loadMore = noun;
  const cards = Array.from({ length: count }, (_, index) => fakeCard(index + 1));
  grid.append(...cards);
  for (const card of cards) card.parentElement = grid;
  return { grid, cards };
}

const shown = grid => grid.children.filter(card => !card.hidden && !card.hasAttribute('data-paged-out'));

test('the count reads like the archive', () => {
  assert.equal(api.loadMoreCount(12, 263, 'recept'), '12 av 263 recept');
});

test('a paged view skips filtered cards and previews the next four', () => {
  const cards = Array.from({ length: 30 }, (_, i) => ({ n: i + 1, hidden: i === 2 }));
  const view = api.loadMoreView(cards, 12);
  // Spread into this realm's arrays: the strict deepEqual compares prototypes, and the script runs in a vm.
  assert.deepEqual([...view.shown].map(c => c.n), [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  assert.equal(view.later.length, 17);
  assert.deepEqual([...view.preview].map(c => c.n), [14, 15, 16, 17]);
});

test('a grid of 30 shows 12 and an inert preview of copies', () => {
  const { grid, cards } = makeGrid(30);
  api.pagedGrid(grid).update();
  const block = grid.next, preview = block.children[0];
  assert.equal(shown(grid).length, 12);
  assert.equal(block.hidden, false);
  assert.ok(preview.hasAttribute('inert'));
  assert.equal(preview.getAttribute('aria-hidden'), 'true');
  assert.deepEqual(preview.children.map(c => c.original), cards.slice(12, 16));
  assert.ok(preview.children.every(c => !c.hasAttribute('data-paged-out')));
  assert.equal(block.querySelector('.archive-page-count').textContent, '12 av 30 recept');
  assert.equal(block.querySelector('button').textContent, 'Visa fler recept');
  assert.equal(block.querySelector('button').getAttribute('aria-controls'), grid.id);
  assert.ok(grid.id);
  assert.ok(grid.hasAttribute('data-paging'));
});

test('the noun comes from data-load-more', () => {
  const { grid } = makeGrid(30, 'sorter');
  api.pagedGrid(grid).update();
  assert.equal(grid.next.querySelector('button').textContent, 'Visa fler sorter');
  assert.equal(grid.next.querySelector('.archive-page-count').textContent, '12 av 30 sorter');
});

test('loading more shows 12 more, focuses the first new card and scrolls only for the keyboard', () => {
  const { grid, cards } = makeGrid(30);
  api.pagedGrid(grid).update();
  grid.next.querySelector('button').click(1);
  assert.equal(shown(grid).length, 24);
  assert.equal(cards[12].focused?.preventScroll, true);
  assert.equal(cards[12].scrolled, undefined);
  grid.next.querySelector('button').click(0);
  assert.equal(shown(grid).length, 30);
  assert.equal(cards[24].scrolled?.block, 'nearest');
  assert.equal(cards[24].scrolled?.behavior, 'instant');
  assert.equal(grid.next.hidden, true);
  assert.equal(grid.next.children[0].children.length, 0);
});

test('the same view keeps the depth; a new view starts again at 12', () => {
  const { grid } = makeGrid(40);
  const pager = api.pagedGrid(grid);
  pager.update('a'); pager.loadMore({ detail: 1 });
  pager.update('a');
  assert.equal(shown(grid).length, 24);
  pager.update('b');
  assert.equal(shown(grid).length, 12);
});

test('cards a filter hides are neither shown nor counted', () => {
  const { grid, cards } = makeGrid(30);
  const pager = api.pagedGrid(grid);
  pager.update();
  cards.slice(10).forEach(card => { card.hidden = true; });
  pager.update('filtered');
  assert.equal(shown(grid).length, 10);
  assert.equal(grid.next.hidden, true);
  assert.equal(grid.next.children[0].children.length, 0);
});

test('copies sit where their cards do, counted in twelves, so they keep their ground and tilt', () => {
  const { grid, cards } = makeGrid(30);
  cards[1].hidden = true; cards[2].hidden = true;
  api.pagedGrid(grid).update('filtered');
  const preview = grid.next.children[0];
  const copies = preview.children.filter(child => child.original);
  assert.deepEqual(copies.map(copy => copy.original), cards.slice(14, 18));
  for (const copy of copies)
    assert.equal(preview.children.indexOf(copy) % 12, grid.children.indexOf(copy.original) % 12);
  const spacers = preview.children.filter(child => !child.original);
  assert.equal(spacers.length, 2);
  assert.ok(spacers.every(spacer => spacer.hidden));
});

test('a grid of 12 or fewer gets no button and no marks', () => {
  const { grid } = makeGrid(12);
  api.pagedGrid(grid).update();
  assert.equal(grid.next.hidden, true);
  assert.ok(grid.children.every(card => !card.hasAttribute('data-paged-out')));
});

test('revealing a card further down shows whole pages up to it', () => {
  const { grid, cards } = makeGrid(50);
  const pager = api.pagedGrid(grid);
  pager.update();
  pager.revealThrough(cards[5]);
  assert.equal(shown(grid).length, 12);
  pager.revealThrough(cards[20]);
  assert.equal(shown(grid).length, 24);
  pager.revealThrough(cards[45]);
  assert.equal(shown(grid).length, 48);
});

test('a link in a card further down loads its grid down to that card', () => {
  const { grid, cards } = makeGrid(30);
  api.pagedGrid(grid).update();
  api.showPagedCard(cards[20].link);
  assert.equal(shown(grid).length, 24);
  api.showPagedCard(cards[3].link);
  assert.equal(shown(grid).length, 24);
  api.showPagedCard(null);
  api.showPagedCard({ closest: () => null });
  assert.equal(shown(grid).length, 24);
});

test('the same grid gets the same pager and one block', () => {
  const { grid } = makeGrid(30);
  assert.equal(api.pagedGrid(grid), api.pagedGrid(grid));
  assert.equal(grid.afterCalls, 1);
});

test('long card grids ask to be paged, and the page is ready for it', () => {
  const read = path => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');
  assert.match(read('_includes/layouts/listing.njk'), /class="recipe-grid" data-load-more="recept"/);
  const base = read('_includes/layouts/base.njk');
  assert.match(base, /<head>\s*<script>document\.documentElement\.classList\.add\('paged-grids'\)/);
  assert.ok(base.indexOf('js/load-more.js') < base.indexOf('js/app.js'));
  assert.match(read('css/kitchen.css'), /\.paged-grids \.recipe-grid\[data-load-more\]:not\(\[data-paging\]\) > :nth-child\(n \+ 13\)/);
  assert.match(read('js/app.js'), /querySelectorAll\("\[data-load-more\]"\)\.forEach\(\(grid\) => pagedGrid\(grid\)\.update\(\)\)/);
  assert.match(read('pages/pastasorter.njk'), /id="pasta-grid" class="recipe-grid pasta-grid" data-load-more="sorter"/);
  assert.match(read('pages/tartor.njk'), /id="cake-grid" class="recipe-grid" data-load-more="tårtor"/);
  assert.match(read('pages/tartor.njk'), /cake-leftovers[\s\S]*class="recipe-grid" data-load-more="recept"/);
  assert.match(read('js/pasta.js'), /pagedGrid\(grid\)\.update\(JSON\.stringify\(chosen\)\)/);
  assert.match(read('js/tartor.js'), /pagedGrid\(grid\)\.update\(JSON\.stringify\(chosen\)\)/);
});

test('if the pager never takes over, every card shows once the page has loaded', () => {
  const base = readFileSync(new URL('../src/_includes/layouts/base.njk', import.meta.url), 'utf8');
  const script = base.match(/<head>\s*<script>([\s\S]*?)<\/script>/)[1];
  // Runs the head script; `pending` says whether a long grid is still waiting for its pager at load.
  const run = pending => {
    const classes = new Set();
    let onLoad = () => {};
    const context = vm.createContext({
      document: {
        documentElement: { classList: { add: name => classes.add(name), remove: name => classes.delete(name) } },
        querySelector: selector => (selector === '[data-load-more]:not([data-paging])' && pending ? {} : null),
      },
      addEventListener: (type, listener) => { if (type === 'load') onLoad = listener; },
    });
    vm.runInContext(script, context);
    const before = classes.has('paged-grids');
    onLoad();
    return { before, after: classes.has('paged-grids') };
  };
  assert.deepEqual(run(false), { before: true, after: true });
  assert.deepEqual(run(true), { before: true, after: false });
});

test('the faded row counts only cards, not the spacers, when it decides how many copies fit', () => {
  const css = readFileSync(new URL('../src/css/kitchen.css', import.meta.url), 'utf8');
  const rules = [...css.matchAll(/\.archive-preview[^{]*> :nth-child\(([^)]*)\)/g)].map(match => match[1]);
  assert.deepEqual(rules, ['n + 4 of .archive-card', 'n + 3 of .archive-card', 'n + 2 of .archive-card', '4 of .archive-card']);
});

test('the recipe book flattens only its own grid, so its faded row keeps the gap above it', () => {
  const css = readFileSync(new URL('../src/css/kitchen.css', import.meta.url), 'utf8');
  assert.match(css, /\.book-page \[data-book-grid\] \{\s*margin-top: 0;\s*padding-top: 0;\s*border-top: 0;/);
  assert.doesNotMatch(css, /\.book-page \.recipe-grid \{/);
});
