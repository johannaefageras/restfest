// pastasorter.html (src/pages/pastasorter.njk): the filter over the pasta cards, and the dialog that
// shows one sort. Without this script the cards are plain links to the sorts' pages.
//
// The filter's choices live in the address, pastasorter.html?sas=soppa&deg=torkad, and the open sort
// in its hash, pastasorter.html#bucatini, so both can be linked to; a link with a hash opens that sort
// when the page loads. The dialog shows the sort's own page (pasta/<slug>.html): it fetches the page and
// takes its .pasta-view, the way app.js shows a recipe. The arrows step through the cards the filter
// shows, also with ← and → on the keyboard. Esc, a click outside, × and the browser's Back close it.
// Recipe links inside it open the recipe dialog on top (data-open, app.js).
(() => {
  const form = document.getElementById("pasta-filter");
  const grid = document.getElementById("pasta-grid");
  const dialog = document.getElementById("pasta-dialog");
  if (!form || !grid || typeof dialog?.showModal !== "function") return;

  const cards = [...grid.querySelectorAll(".pasta-card")];
  const bySlug = new Map(cards.map((card) => [card.dataset.slug, card]));
  const linkOf = (slug) => bySlug.get(slug).querySelector("a").href;
  const content = document.getElementById("pasta-dialog-content");
  const pageLink = dialog.querySelector(".pasta-dialog-page");
  const steps = [...dialog.querySelectorAll("[data-step]")];

  // ---------- The filter ----------

  // The controls: the search, the Form, Deg and Region menus (like the archive's category menu
  // in app.js), and the sauce buttons.
  const search = form.elements.q;
  const pickers = [...form.closest(".pasta-list").querySelectorAll("details[data-picker]")].map(picker => {
    const name = picker.dataset.picker;
    return [name, setupArchivePicker(picker, value => choose({ [name]: value }))];
  });
  const sauceButtons = [...form.querySelectorAll("[data-sas]")];
  const filterCount = form.querySelector(".archive-filter-count");
  const count = document.getElementById("pasta-count");
  const reset = document.getElementById("pasta-reset");
  const empty = document.getElementById("pasta-empty");
  // The fields the cards are compared on: each is a data attribute on the cards (pasta-card.njk).
  // `sas` and `deg` are lists separated by spaces, a sort's sauces and doughs: a choice matches any one.
  const fields = ["kategori", "sas", "deg", "region"];
  const lists = ["sas", "deg"];
  const nothingChosen = { q: "", kategori: "", sas: "", deg: "", region: "" };
  let chosen = { ...nothingChosen };

  form.hidden = false;
  document.getElementById("pasta-region-field").hidden = false;

  // The values each field offers, to leave out one the filter doesn't have (an old link, a typo).
  const offered = {
    sas: (value) => sauceButtons.some((button) => button.dataset.sas === value),
  };
  for (const [name, picker] of pickers) offered[name] = picker.hasValue;

  // Lower case without accents, so "anglahar" finds änglahår (Capellini).
  const plain = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  // The controls show what is chosen: the menus their option's icon and name, the sauce its button
  // pressed, and the Filter button on phones how many filters are on.
  function showChoices() {
    if (search.value.trim() !== chosen.q) search.value = chosen.q;
    for (const [name, picker] of pickers) picker.setValue(chosen[name]);
    for (const button of sauceButtons)
      button.setAttribute("aria-pressed", button.dataset.sas === chosen.sas);
    const on = fields.filter((name) => chosen[name]).length;
    filterCount.textContent = on;
    filterCount.hidden = !on;
  }

  function applyFilter() {
    const query = plain(chosen.q);
    let shown = 0;
    for (const card of cards) {
      const match =
        fields.every(
          (name) =>
            !chosen[name] ||
            (lists.includes(name)
              ? card.dataset[name].split(" ").includes(chosen[name])
              : card.dataset[name] === chosen[name]),
        ) &&
        (!query || plain(card.dataset.search).includes(query));
      card.hidden = !match;
      if (match) shown++;
    }
    const filtered = Object.values(chosen).some(Boolean);
    count.textContent = filtered
      ? `Visar ${shown} av ${cards.length} sorter`
      : `${cards.length} sorter`;
    reset.hidden = !filtered;
    empty.hidden = shown > 0;
    grid.hidden = shown === 0;

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
  // A sauce button turns its sauce on, and off again; one sauce at a time.
  for (const button of sauceButtons)
    button.addEventListener("click", () =>
      choose({ sas: chosen.sas === button.dataset.sas ? "" : button.dataset.sas }),
    );
  document.querySelectorAll("[data-pasta-clear]").forEach((button) =>
    button.addEventListener("click", () => {
      choose(nothingChosen);
      search.focus({ preventScroll: true });
    }),
  );

  // ---------- The dialog ----------

  let open = null; // the slug of the sort the dialog shows
  let opener = null; // the card that opened it, to return focus to
  let previousTitle = document.title;
  let request = 0;
  let closingFromHistory = false;
  const pages = new Map(); // slug → {article, title}, each page fetched once

  // The sort's article, with its links and pictures resolved against its own page (pasta/<slug>.html),
  // as it is shown here, one folder up.
  async function fetchSort(slug) {
    if (pages.has(slug)) return pages.get(slug);
    const response = await fetch(linkOf(slug));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const page = new DOMParser().parseFromString(await response.text(), "text/html");
    const article = page.querySelector(".pasta-view");
    if (!article) throw new Error("No pasta sort on the page");
    for (const attribute of ["href", "src"])
      article.querySelectorAll(`[${attribute}]`).forEach((element) =>
        element.setAttribute(
          attribute,
          new URL(element.getAttribute(attribute), response.url).href,
        ),
      );
    const sort = { article, title: page.title };
    pages.set(slug, sort);
    return sort;
  }

  const visibleCards = () => cards.filter((card) => !card.hidden);

  // Shows a sort. `push` adds a step to the history, so Back closes the dialog; stepping with the
  // arrows or following a "Byt mot" link replaces it, so Back still closes it in one go.
  async function show(slug, { push = false } = {}) {
    if (!bySlug.has(slug)) return;
    const current = ++request;
    let sort;
    try {
      sort = await fetchSort(slug);
    } catch {
      // Opened from disk (file://) or offline: go to the sort's page itself.
      if (current === request) location.href = linkOf(slug);
      return;
    }
    if (current !== request) return;

    content.replaceChildren(document.importNode(sort.article, true));
    pageLink.href = linkOf(slug);
    const shown = visibleCards();
    const index = shown.indexOf(bySlug.get(slug));
    steps[0].disabled = index <= 0;
    steps[1].disabled = index < 0 || index >= shown.length - 1;
    if (!dialog.open) {
      previousTitle = document.title;
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
    open = slug;
    document.title = sort.title;
    dialog.scrollTop = 0;
    // Start at the top, with the close button focused, also when stepping to another sort.
    dialog.querySelector(".dialog-close").focus({ preventScroll: true });

    const url = location.pathname + location.search + "#" + slug;
    if (push) history.pushState({ pasta: slug, pushed: true }, "", url);
    else history.replaceState({ ...history.state, pasta: slug }, "", url);
  }

  function step(direction) {
    const shown = visibleCards();
    const next = shown[shown.indexOf(bySlug.get(open)) + direction];
    if (next) show(next.dataset.slug);
  }

  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
    document.title = previousTitle;
    const card = bySlug.get(open);
    (opener?.isConnected ? opener : card?.querySelector("a"))?.focus({ preventScroll: true });
    open = null;
    opener = null;
    request++;
    // Closed with ×, Esc or a click outside: a step this page added goes back, so the address is
    // the list again; a sort that was in the address from the start only loses its hash.
    if (closingFromHistory) closingFromHistory = false;
    else if (history.state?.pushed) history.back();
    else history.replaceState(null, "", location.pathname + location.search);
  });

  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  steps.forEach((button) =>
    button.addEventListener("click", () => step(Number(button.dataset.step))),
  );
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft") step(-1);
    else if (event.key === "ArrowRight") step(1);
  });

  // The cards, and the "Byt mot" links inside the dialog, open the sort here, unless the visitor asks
  // for a new tab or window.
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-pasta]");
    if (
      !link ||
      !bySlug.has(link.dataset.pasta) ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    if (!dialog.open) opener = link;
    show(link.dataset.pasta, { push: !dialog.open });
  });

  // Back and Forward: the dialog follows the hash. The recipe dialog (app.js) adds steps of its own,
  // with a recipe's address; those are its business.
  function sync() {
    if (history.state?.recipe) return;
    readFilter();
    applyFilter();
    const slug = decodeURIComponent(location.hash.slice(1));
    if (bySlug.has(slug)) {
      if (slug !== open) show(slug);
    } else if (dialog.open) {
      closingFromHistory = true;
      dialog.close();
    }
  }
  window.addEventListener("popstate", sync);
  sync();
})();
