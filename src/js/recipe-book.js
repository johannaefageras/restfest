// receptbok.html: the signed-in visitor's recipe book (HANDOFF.md, "Konton och receptbok"). A module,
// after account.js, using its window.restfestAccount and the plain scripts' globals (archiveCard,
// recipes, saved, mealTypes, showToast …).
//
// The book is two lists in the account: hearted archive recipes (saved_recipes) and generated ones
// (my_generated_recipes()). They're shown as one, newest first. Archive recipes get the archive's own
// card; generatedCard() below repeats that card's markup for a generated recipe, so change it together
// with archiveCard() in app.js and _includes/recipe-card.njk.

const account = window.restfestAccount;
const grid = $("[data-book-grid]");
const status = $("[data-book-status]");
const empty = $("[data-book-empty]");
const toolbar = $("[data-book-toolbar]");
const filters = [...document.querySelectorAll("[data-book-filter]")];
const storage = `${document.querySelector('meta[name="restfest-account"]')?.content}/storage/v1/object/public/recipe-images`;

// {kind: 'archive', id, savedAt, recipe} or {kind: 'generated', id, savedAt, row}
let entries = [];
let loaded = false;
let loading = false;
let filter = "alla";

function generatedCard(row) {
  const key = (row.categories ?? []).find((name) => mealTypes[name]) ?? "main";
  const photo =
    (row.image_status === "done" && row.image_path
      ? `${storage}/${row.image_path}`
      : row.image_url ?? null);
  const url = assetUrl(`nytt-recept.html?id=${encodeURIComponent(row.id)}`);
  const title = escapeHtml(row.title ?? "Recept");
  const chips = (row.tags ?? [])
    .slice(0, 3)
    .map((tag) => recipeTagLabels[tag] ?? tag);
  return `<article class="archive-card">
    <div class="archive-card-art${photo ? " has-photo" : ""}">
      <img src="${escapeHtml(photo ?? assetUrl("assets/icons/ramen.svg"))}" alt="" width="${photo ? 600 : 80}" height="${photo ? 338 : 80}" loading="lazy" decoding="async">
      <span class="archive-time">${escapeHtml(row.time_label ?? "")}</span>
      <button class="favorite" data-save-generated="${escapeHtml(row.id)}" aria-label="Ta bort ${title}" aria-pressed="true">${heartIcon(true)}</button>
    </div>
    <div class="archive-card-body">
      <p class="archive-meal-type">${squareIcon(mealTypes[key].icon, 20)}${escapeHtml(mealName(key))}</p>
      <h3><a class="recipe-main-link" href="${url}">${title}</a></h3>
      <p class="archive-description">${escapeHtml(row.description ?? "")}</p>
      <p class="archive-match">Eget recept</p>
      <div class="ingredient-chips">${chips.map((name) => `<span>${escapeHtml(name)}</span>`).join("")}</div>
    </div>
  </article>`;
}

const shown = () =>
  entries.filter(
    (entry) =>
      filter === "alla" ||
      (filter === "egna") === (entry.kind === "generated"),
  );

function render() {
  const visible = shown();
  grid.innerHTML = visible
    .map((entry) =>
      entry.kind === "generated"
        ? generatedCard(entry.row)
        : archiveCard(entry.recipe),
    )
    .join("");
  empty.hidden = entries.length > 0;
  toolbar.hidden = entries.length === 0;
  if (!entries.length) status.textContent = "";
  else if (!visible.length)
    status.textContent =
      filter === "egna"
        ? "Du har inga egna recept i receptboken än."
        : "Du har inga recept från arkivet i receptboken än.";
  else
    status.textContent = `Visar ${visible.length}${visible.length === entries.length ? "" : ` av ${entries.length}`} recept`;
}

function drawSnapshot() {
  if (!account.signedIn()) {
    entries = []; grid.innerHTML = ""; toolbar.hidden = true; empty.hidden = true; status.textContent = "";
    loaded = false;
    return;
  }
  const snapshot = account.bookSnapshot();
  const next = [
    ...snapshot.archive.map(row => ({ kind: "archive", id: row.recipe_id, savedAt: row.created_at ?? "", recipe: recipes.find(recipe => recipe.id === row.recipe_id) })).filter(entry => entry.recipe),
    ...snapshot.generated.map(row => ({ kind: "generated", id: row.id, savedAt: row.saved_at ?? "", row })),
  ].sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  const changed = JSON.stringify(next) !== JSON.stringify(entries);
  const wasLoaded = loaded;
  entries = next;
  loaded = snapshot.fetched || entries.length > 0;
  if (changed || (!wasLoaded && loaded)) {
    const focused = document.activeElement;
    const heart = focused?.closest(".favorite");
    const index = heart ? [...grid.querySelectorAll(".favorite")].indexOf(heart) : -1;
    render();
    if (index >= 0) focusAfterRemoval(index);
  }
  if (!loaded) {
    empty.hidden = true;
    status.textContent = navigator.onLine ? "Hämtar receptboken …" : "Det finns ingen sparad kopia av receptboken på den här enheten än.";
  }
}

function showSync() {
  const state = account.bookStatus();
  const label = $("[data-book-sync-status]");
  const retry = $("[data-book-sync-retry]");
  retry.hidden = state.phase !== "waiting" || !navigator.onLine;
  if (!state.durable && state.pending) label.textContent = "Ändringarna kan inte sparas på enheten. Håll sidan öppen tills de har synkats.";
  else if (!state.durable) label.textContent = "Receptboken är sparad i kontot, men kan inte sparas på den här enheten för offlineanvändning.";
  else if (!navigator.onLine) label.textContent = "Du är offline. Sparade recept visas från enheten och ändringarna synkas när du är online igen.";
  else if (state.pendingGenerated) label.textContent = "Receptboken är full. Ta bort ett recept för att ge plats åt nya recept som väntar på att sparas.";
  else if (state.issue === "full") label.textContent = "Receptboken är full. Ta bort ett recept och försök spara igen.";
  else if (state.issue === "missing") label.textContent = "Ett recept kunde inte sparas eftersom det har tagits bort.";
  else if (state.phase === "waiting") label.textContent = "Kunde inte synka just nu. Sparade recept och ändringar finns kvar på den här enheten.";
  else if (state.phase === "loading") label.textContent = "Hämtar receptboken …";
  else if (state.phase === "syncing" || state.phase === "pending") label.textContent = "Synkar receptboken …";
  else label.textContent = "Sparat i kontot.";
}
async function load() {
  drawSnapshot();
  if (loading || !account.signedIn()) return;
  loading = true;
  try { await account.refreshBook(); }
  finally { loading = false; drawSnapshot(); showSync(); }
}

// After a card is taken out, the keyboard's place moves to the next card's heart, or to the filter.
function focusAfterRemoval(index) {
  const hearts = [...grid.querySelectorAll(".favorite")];
  const fallback = entries.length ? filters[0] : empty.querySelector("a");
  (hearts[Math.min(index, hearts.length - 1)] ?? fallback)?.focus({
    preventScroll: true,
  });
}

if (account) {
  filters.forEach((button) =>
    button.addEventListener("click", () => {
      filter = button.dataset.bookFilter;
      filters.forEach((other) =>
        other.setAttribute("aria-pressed", String(other === button)),
      );
      render();
    }),
  );

  $("#main").addEventListener("click", (event) => {
    if (event.target.closest("[data-book-retry]")) {
      load();
      return;
    }
    const heart = event.target.closest("[data-save-generated]");
    if (!heart) return;
    const index = [...grid.querySelectorAll(".favorite")].indexOf(heart);
    account.setGenerated(heart.dataset.saveGenerated, false);
    focusAfterRemoval(index);
    showToast("Receptet har tagits bort från receptboken");
  });

  document.addEventListener("restfest:book", drawSnapshot);
  document.addEventListener("restfest:book-sync", showSync);
  document.addEventListener("restfest:account", drawSnapshot);
  window.addEventListener("online", showSync);
  window.addEventListener("offline", showSync);
  $("[data-book-sync-retry]").addEventListener("click", load);
  showSync();
  load();
}
