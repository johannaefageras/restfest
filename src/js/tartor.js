// tartor.html (src/pages/tartor.njk): the filter over the cake cards. Without this script the filter
// stays hidden and the cards are plain links to the recipes; with or without it, a card opens its
// recipe in the recipe dialog (data-open, app.js).
//
// The filter's choices live in the address, tartor.html?niva=Nybörjare&del=marsipan, so they can be
// linked to, and Back and Forward follow them. It works like the one on pastasorter.html (pasta.js).
(() => {
  const form = document.getElementById("cake-filter");
  const grid = document.getElementById("cake-grid");
  if (!form || !grid) return;

  const cards = [...grid.querySelectorAll(".cake-card")];
  const search = form.elements.q;
  const origin = setupArchivePicker(document.getElementById("cake-origin"), value => choose({ ursprung: value }));
  const buttons = [...form.querySelectorAll("[data-niva], [data-del]")];
  const filterCount = form.querySelector(".archive-filter-count");
  const count = document.getElementById("cake-count");
  const reset = document.getElementById("cake-reset");
  const empty = document.getElementById("cake-empty");
  // The fields the cards are compared on: each is a data attribute on the cards (cake-card.njk).
  // `del` is a list separated by spaces, the parts a cake is built with: a choice matches any one.
  const fields = ["niva", "del", "ursprung"];
  const nothingChosen = { q: "", niva: "", del: "", ursprung: "" };
  let chosen = { ...nothingChosen };

  form.hidden = false;
  document.getElementById("cake-origin-field").hidden = false;

  // The values each field offers, to leave out one the filter doesn't have (an old link, a typo).
  const offered = {
    niva: (value) => buttons.some((button) => button.dataset.niva === value),
    del: (value) => buttons.some((button) => button.dataset.del === value),
    ursprung: origin.hasValue,
  };

  // Lower case without accents, so "creme" finds crème and "osterrike" Österrike.
  const plain = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

  // The controls show what is chosen, and the Filter button on phones how many filters are on.
  function showChoices() {
    if (search.value.trim() !== chosen.q) search.value = chosen.q;
    origin.setValue(chosen.ursprung);
    for (const button of buttons) {
      const field = "niva" in button.dataset ? "niva" : "del";
      button.setAttribute("aria-pressed", button.dataset[field] === chosen[field]);
    }
    // The origin menu sits beside the count, outside the panel, so it isn't counted on the button.
    const on = ["niva", "del"].filter((name) => chosen[name]).length;
    filterCount.textContent = on;
    filterCount.hidden = !on;
  }

  function applyFilter() {
    const query = plain(chosen.q);
    let shown = 0;
    for (const card of cards) {
      const match =
        (!chosen.niva || card.dataset.niva === chosen.niva) &&
        (!chosen.del || card.dataset.del.split(" ").includes(chosen.del)) &&
        (!chosen.ursprung || card.dataset.ursprung === chosen.ursprung) &&
        (!query || plain(card.dataset.search).includes(query));
      card.hidden = !match;
      if (match) shown++;
    }
    const filtered = Object.values(chosen).some(Boolean);
    count.textContent = filtered
      ? `Visar ${shown} av ${cards.length} tårtor`
      : `${cards.length} tårtor`;
    reset.hidden = !filtered;
    empty.hidden = shown > 0;
    grid.hidden = shown === 0;
    // 12 at a time (load-more.js). New choices start again at 12; the same ones, e.g. when Back
    // runs the filter again, keep the cards already loaded.
    pagedGrid(grid).update(JSON.stringify(chosen));

    // The choices go into the address in place of the old ones, so Back leaves the page as usual.
    const params = new URLSearchParams();
    for (const [name, value] of Object.entries(chosen))
      if (value) params.set(name, value);
    const address = params.toString() ? `?${params}` : "";
    if (address !== location.search)
      history.replaceState(history.state, "", location.pathname + address + location.hash);
  }

  function choose(changes) {
    chosen = { ...chosen, ...changes };
    showChoices();
    applyFilter();
  }

  function readFilter() {
    const params = new URLSearchParams(location.search);
    chosen = { ...nothingChosen, q: params.get("q") ?? "" };
    for (const name of fields) {
      const value = params.get(name) ?? "";
      if (value && offered[name](value)) chosen[name] = value;
    }
    showChoices();
  }

  form.addEventListener("submit", (event) => event.preventDefault());
  search.addEventListener("input", () => choose({ q: search.value.trim() }));
  // A level or part button turns its choice on, and off again; one of each at a time.
  for (const button of buttons) {
    const field = "niva" in button.dataset ? "niva" : "del";
    button.addEventListener("click", () =>
      choose({ [field]: chosen[field] === button.dataset[field] ? "" : button.dataset[field] }),
    );
  }
  document.querySelectorAll("[data-cake-clear]").forEach((button) =>
    button.addEventListener("click", () => {
      choose(nothingChosen);
      search.focus({ preventScroll: true });
    }),
  );

  // Back and Forward between filtered addresses. The recipe dialog (app.js) adds steps of its own,
  // with a recipe's address; those are its business.
  function sync() {
    if (history.state?.recipe) return;
    readFilter();
    applyFilter();
  }
  window.addEventListener("popstate", sync);
  sync();
})();
