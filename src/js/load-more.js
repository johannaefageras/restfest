// Long card grids show 12 cards, a faded glimpse of the next row, "Visa fler …" and a count, the way the
// recipe archive does. Used by the category, type and tag pages (listing.njk), Pastasorter (pasta.js),
// Tårtor (tartor.js), Mer än mat (app.js) and the recipe book (recipe-book.js); a grid asks for it with
// data-load-more="<noun>", e.g. "recept" or "sorter". The archive itself builds only the cards it shows
// (renderArchivePage() in app.js) and uses the count and focus helpers here.
//
// Every card stays in the grid, in order. Cards past the current depth get data-paged-out, never
// `hidden`: the pasta and cake filters hide cards with `hidden`, and paging counts only the cards a
// filter left. Without JavaScript nothing is paged and every card shows.
//
// The block under a grid is the same as #archive-more in receptarkiv.njk: change the two together.

const loadMorePageSize = 12;
// Copies in the faded row: four for the four-across pasta grid. CSS hides the ones a narrower grid
// has no room for.
const loadMorePreviewSize = 4;
// A card's ground and drawing tilt follow its place in the grid (nth-child in kitchen.css): the
// grounds repeat every three or four cards and the tilt every two, so every 12 places look the same.
const loadMorePlaceCycle = 12;
const loadMorePagers = new WeakMap();
let loadMoreGridCount = 0;

function loadMoreCount(shown, total, noun) {
  return `${shown} av ${total} ${noun}`;
}

// What a paged grid shows at a depth: of the cards a filter left visible, the first `depth`, the rest,
// and the first few of the rest for the faded row.
function loadMoreView(cards, depth) {
  const visible = [...cards].filter((card) => !card.hidden);
  const later = visible.slice(depth);
  return {
    shown: visible.slice(0, depth),
    later,
    preview: later.slice(0, loadMorePreviewSize),
  };
}

// The first card of a new batch takes focus without moving the page. Pressed from the keyboard
// (no click detail), the page also scrolls just enough to show it.
function focusFirstNew(card, event) {
  const link =
    card?.querySelector(".recipe-main-link") ?? card?.querySelector("a[href]");
  link?.focus({ preventScroll: true });
  if (event.detail === 0)
    link?.scrollIntoView({ block: "nearest", behavior: "instant" });
}

// The pager for a grid whose cards are all in the page. The same grid always gets the same pager.
//   update(view)        Shows the cards again. A different `view` (e.g. the filter's choices) starts
//                       again at 12; the same one keeps what was loaded.
//   loadMore(event)     Shows 12 more and focuses the first of them.
//   revealThrough(card) Shows whole pages until `card` is shown, e.g. to return focus to it.
function pagedGrid(grid) {
  if (loadMorePagers.has(grid)) return loadMorePagers.get(grid);

  const noun = grid.dataset.loadMore || "recept";
  if (!grid.id) grid.id = `paged-grid-${++loadMoreGridCount}`;

  const block = document.createElement("div");
  block.className = "archive-more";
  block.hidden = true;
  const preview = document.createElement("div");
  preview.className = `${grid.className} archive-preview`;
  preview.setAttribute("aria-hidden", "true");
  preview.setAttribute("inert", "");
  const controls = document.createElement("div");
  controls.className = "archive-more-controls";
  const button = document.createElement("button");
  button.className = "text-button";
  button.type = "button";
  button.setAttribute("aria-controls", grid.id);
  button.textContent = `Visa fler ${noun}`;
  const count = document.createElement("p");
  count.className = "archive-page-count";
  controls.append(button, count);
  block.append(preview, controls);
  grid.after(block);

  let depth = loadMorePageSize;
  let lastView;

  const view = () => loadMoreView(grid.children, depth);

  const pager = {
    update(nextView = "") {
      if (nextView !== lastView) depth = loadMorePageSize;
      lastView = nextView;
      const { shown, later, preview: upcoming } = view();
      const out = new Set(later);
      for (const card of grid.children)
        card.toggleAttribute("data-paged-out", out.has(card));
      // Each copy sits at its card's place, counted in twelves, so it looks like the card it
      // previews also when a filter has hidden cards before it. Hidden spacers fill the gaps.
      const places = [...grid.children];
      const row = [];
      for (const card of upcoming) {
        const place = places.indexOf(card) % loadMorePlaceCycle;
        while (row.length % loadMorePlaceCycle !== place) {
          const spacer = document.createElement("span");
          spacer.hidden = true;
          row.push(spacer);
        }
        const copy = card.cloneNode(true);
        copy.removeAttribute("data-paged-out");
        row.push(copy);
      }
      preview.replaceChildren(...row);
      block.hidden = later.length === 0;
      count.textContent = loadMoreCount(
        shown.length,
        shown.length + later.length,
        noun,
      );
    },
    loadMore(event) {
      const firstNew = view().later[0];
      depth += loadMorePageSize;
      pager.update(lastView);
      focusFirstNew(firstNew, event);
    },
    revealThrough(card) {
      const index = view().later.indexOf(card);
      if (index < 0) return;
      depth += Math.ceil((index + 1) / loadMorePageSize) * loadMorePageSize;
      pager.update(lastView);
    },
  };

  button.addEventListener("click", (event) => pager.loadMore(event));
  grid.setAttribute("data-paging", "");
  loadMorePagers.set(grid, pager);
  return pager;
}
