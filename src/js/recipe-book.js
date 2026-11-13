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
const filters = [...document.querySelectorAll("[data-book-filter]")];
const storage = `${document.querySelector('meta[name="restfest-account"]')?.content}/storage/v1/object/public/recipe-images`;

// {kind: 'archive', id, savedAt, recipe} or {kind: 'generated', id, savedAt, row}
let entries = [];
let loaded = false;
let filter = "alla";

function generatedCard(row) {
  const key = (row.categories ?? []).find((name) => mealTypes[name]) ?? "main";
  const photo =
    row.image_status === "done" && row.image_path
      ? `${storage}/${row.image_path}`
      : null;
  const url = assetUrl(`nytt-recept.html?id=${encodeURIComponent(row.id)}`);
  const title = escapeHtml(row.title ?? "Recept");
  const chips = (row.tags ?? [])
    .slice(0, 3)
    .map((tag) => recipeTagLabels[tag] ?? tag);
  return `<article class="archive-card">
    <div class="archive-card-art${photo ? " has-photo" : ""}">
      <img src="${escapeHtml(photo ?? assetUrl("assets/illustrations/ramen.svg"))}" alt="" width="${photo ? 600 : 80}" height="${photo ? 338 : 80}" loading="lazy" decoding="async">
      <span class="archive-time">${escapeHtml(row.time_label ?? "")}</span>
      <button class="favorite" data-save-generated="${escapeHtml(row.id)}" aria-label="Ta bort ${title}" aria-pressed="true">${heartIcon(true)}</button>
    </div>
    <div class="archive-card-body">
      <p class="archive-meal-type">${squareIcon(mealTypes[key].icon, 20)}${escapeHtml(mealName(key))}</p>
      <h3><a class="recipe-main-link" href="${url}">${title}</a></h3>
      <p class="archive-description">${escapeHtml(row.description ?? "")}</p>
      <p class="archive-match">Eget recept</p>
      <div class="ingredient-chips">${chips.map((name) => `<span>${escapeHtml(name)}</span>`).join("")}</div>
      <a class="open-recipe" href="${url}" aria-label="Öppna ${title}">Visa recept ${faIcon("arrow-up-right")}</a>
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
  $(".book-filter").hidden = entries.length === 0;
  if (!entries.length) status.textContent = "";
  else if (!visible.length)
    status.textContent =
      filter === "egna"
        ? "Du har inga egna recept i receptboken än."
        : "Du har inga recept från arkivet i receptboken än.";
  else
    status.textContent = `Visar ${visible.length}${visible.length === entries.length ? "" : ` av ${entries.length}`} recept`;
}

async function load() {
  if (!account.signedIn()) return;
  status.textContent = "Hämtar receptboken …";
  try {
    // Sends any heart that hasn't reached the account yet, so the lists below are complete. When the
    // account can't be reached, stop here: supabase-js has already retried for several seconds.
    if (!(await account.refreshBook())) throw new Error("The recipe book is out of reach.");
    const db = await account.client();
    const [archive, generated] = await Promise.all([
      db.from("saved_recipes").select("recipe_id, created_at"),
      db.rpc("my_generated_recipes"),
    ]);
    if (archive.error) throw archive.error;
    if (generated.error) throw generated.error;
    entries = [
      ...archive.data
        .map((row) => ({
          kind: "archive",
          id: row.recipe_id,
          savedAt: row.created_at,
          // A recipe that has left the archive isn't shown.
          recipe: recipes.find((recipe) => recipe.id === row.recipe_id),
        }))
        .filter((entry) => entry.recipe),
      ...generated.data.map((row) => ({
        kind: "generated",
        id: row.id,
        savedAt: row.saved_at,
        row,
      })),
    ].sort((a, b) => b.savedAt.localeCompare(a.savedAt));
    loaded = true;
    render();
  } catch {
    grid.innerHTML = "";
    empty.hidden = true;
    status.innerHTML =
      'Kunde inte hämta receptboken. <button class="text-button" type="button" data-book-retry>Försök igen</button>';
  }
}

// After a card is taken out, the keyboard's place moves to the next card's heart, or to the filter.
function focusAfterRemoval(index) {
  const hearts = [...grid.querySelectorAll(".favorite")];
  (hearts[Math.min(index, hearts.length - 1)] ?? filters[0])?.focus({
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
    entries = entries.filter(
      (entry) =>
        entry.kind !== "generated" || entry.id !== heart.dataset.saveGenerated,
    );
    render();
    focusAfterRemoval(index);
    showToast("Receptet har tagits bort från receptboken");
  });

  // A heart on an archive card (toggleSave in app.js): the recipe leaves the book.
  document.addEventListener("restfest:saved", () => {
    if (!loaded) return;
    const kept = entries.filter(
      (entry) => entry.kind !== "archive" || saved.has(entry.id),
    );
    if (kept.length === entries.length) return;
    const focused = document.activeElement;
    const index = [...grid.querySelectorAll(".favorite")].indexOf(focused);
    entries = kept;
    render();
    if (index >= 0) focusAfterRemoval(index);
  });

  // Signed in from another tab while this one was open.
  document.addEventListener("restfest:account", () => {
    if (!loaded && account.signedIn()) load();
  });

  load();
}
