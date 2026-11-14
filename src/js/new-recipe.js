// nytt-recept.html?id=<uuid>: a recipe Claude wrote from a fridge list (supabase/functions/generate-recipe).
// Fetches it, draws it with the same markup as a recipe page (src/_includes/layouts/recipe.njk) and
// hands it to enhanceRecipe() in app.js, then asks for its photo if it doesn't have one yet.
//
// A module, loaded after the plain scripts, so it can use their globals ($, escapeHtml, assetUrl,
// enhanceRecipe, mealTypes, recipeTagLabels …) and import the build's quantity parser.
// The recipe's shape is RecipeDoc in supabase/functions/_shared/recipe.ts.

import { intendedSave, saveIntent } from "./account-helpers.js";
import { amountParts, recipeServings } from "./recipe-amounts.js";

const api = document.querySelector('meta[name="restfest-ai"]')?.content;
// Accounts (account.js, which runs before this module), or undefined when the site has none.
const account = window.restfestAccount;
const main = $("#main");
const message = $("[data-new-recipe-message]");
const pageParams = new URLSearchParams(location.search);
const id = (pageParams.get("id") ?? "").toLowerCase();
const photoWait = 3 * 60 * 1000;

const homeLink = `<a href="${assetUrl("")}#borja">Till kylskåpet</a>`;

function showMessage(html) {
  message.innerHTML = html;
  main.removeAttribute("aria-busy");
}

// The same addresses as lib/taxonomy.js gives the category and tag pages.
const slug = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, " och ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const categoryPath = (key) => `kategori/${slug(mealTypes[key].label)}.html`;
const tagLabel = (tag) => recipeTagLabels[tag] ?? tag;
const tagPath = (tag) => `tagg/${slug(tagLabel(tag))}.html`;

const factIcons = {
  Förberedelse: "cutting-board",
  Tillagning: "timer",
  Portioner: "cutlery",
  Nivå: "difficulty-level",
};

// An ingredient's text, with each quantity the stepper may scale in a span, as recipe.njk does.
const amountText = (name) =>
  amountParts(name)
    .map((part) =>
      part.amount
        ? `<span data-base-amount="${part.amount}">${escapeHtml(part.text)}</span>`
        : escapeHtml(part.text),
    )
    .join("");

// Keeps a range like "1–3" on one line, like the keepRanges filter in eleventy.config.js.
const keepRanges = (text) => escapeHtml(text).replace(/(\d)–(\d)/g, "$1⁠–⁠$2");

function factsHtml(recipe) {
  return recipe.facts
    .map(({ label, value }) => {
      const icon = factIcons[label];
      const servings = label === "Portioner" ? recipeServings(value) : null;
      const dt = `<dt${servings ? ' id="recipe-servings-label"' : ""}>${icon ? `<img src="${squareIconPath(icon)}" alt="" width="44" height="44">` : ""}${escapeHtml(label)}</dt>`;
      const dd = servings
        ? `<dd>
          <span data-servings-fallback>${keepRanges(value)}</span>
          <span class="recipe-servings-stepper" hidden>
            <button class="recipe-servings-step" type="button" data-servings-step="down" aria-label="Minska portionerna"></button>
            <input class="recipe-servings-input" type="number" min="0.5" step="0.5" value="${servings.value}" inputmode="decimal" aria-labelledby="recipe-servings-label" aria-describedby="recipe-servings-help">
            <button class="recipe-servings-step" type="button" data-servings-step="up" aria-label="Öka portionerna"></button>
          </span>
          <span id="recipe-servings-help" class="sr-only">Ändra värdet för att räkna om mängderna i ingredienslistan.</span>
        </dd>`
        : `<dd>${keepRanges(value)}</dd>`;
      return `<div>${dt}${dd}</div>`;
    })
    .join("");
}

function ingredientsHtml(recipe, recipeId) {
  return recipe.ingredients
    .map(
      (group, groupIndex) => `
    <div class="ingredient-group">
      ${group.title ? `<h3>${escapeHtml(group.title)}</h3>` : ""}
      <ul class="ingredients">${group.items
        .map((item, index) => {
          // Same id format as the recipe pages' shopping buttons (lib/recipes.js).
          const shoppingId = JSON.stringify([
            recipeId,
            `${groupIndex}-${index}-${item.key ?? "unmatched"}`,
            item.name,
          ]);
          return `<li class="cook-ingredient"${item.key ? ` data-key="${escapeHtml(item.key)}"` : ""}${item.basic ? " data-basic" : ""}>
          <label><input type="checkbox"><span data-ingredient-name>${amountText(item.name)}</span></label>
          <div class="cook-ingredient-actions">
            <span class="ingredient-status" hidden></span>
            <button class="shopping-add" type="button" data-shopping-ingredient="${escapeHtml(shoppingId)}" data-shopping-text="${escapeHtml(item.name)}" aria-label="${escapeHtml(item.name)} på inköpslistan" aria-pressed="false"><i class="fas fa-plus" aria-hidden="true"></i></button>
          </div>
        </li>`;
        })
        .join("")}</ul>
    </div>`,
    )
    .join("");
}

function photoHtml(recipe, image) {
  if (image.status === "done" && image.url) {
    return `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(recipe.alt)}" width="1536" height="864">`;
  }
  return `<div class="new-recipe-photo-wait" role="status">
    <img src="${squareIconPath("camera")}" alt="" width="48" height="48">
    <p>Fotot tas fram. Det brukar ta en minut.</p>
  </div>`;
}

function recipeHtml(recipe, data) {
  const recipeId = `ny-${data.id.slice(0, 8)}`;
  const ingredientCount = recipe.ingredients.reduce(
    (count, group) => count + group.items.length,
    0,
  );
  const made = new Date(data.createdAt).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const promoted = data.promotedAs
    ? ` Det finns nu också <a href="${escapeHtml(assetUrl(`recept/${data.promotedAs}.html`))}">i receptarkivet</a>.`
    : "";
  return `<article class="recipe-view" data-recipe="${recipeId}">
    <div class="dialog-top cook-art has-photo" data-recipe-photo>${photoHtml(recipe, data.image)}</div>
    <div class="dialog-main">
      <p class="dialog-kicker"><span class="mini-badge">OFTA BRA EFTER · NYTT RECEPT</span><span>${recipe.categories
        .filter((key) => mealTypes[key])
        .map(
          (key) =>
            `<a href="${assetUrl(categoryPath(key))}">${escapeHtml(mealName(key))}</a>`,
        )
        .join(" · ")}</span></p>
      <h1 id="recipe-title" class="recipe-heading">${escapeHtml(recipe.title)}</h1>
      <p class="dialog-intro">${escapeHtml(recipe.description)}</p>
      <p class="recipe-tip new-recipe-note"><b>Nytt och oprovat.</b> Vi skrev receptet ${made} utifrån en kyllista. Ingen har lagat det än, så läs igenom det och lita på din egen känsla för mängder och tider.${promoted}</p>
      <dl class="recipe-facts">${factsHtml(recipe)}</dl>
      <ul class="recipe-tags" aria-label="Taggar">${recipe.tags
        .map(
          (tag) =>
            `<li><a href="${assetUrl(tagPath(tag))}">${escapeHtml(tagLabel(tag))}</a></li>`,
        )
        .join("")}</ul>
      ${recipe.beforeYouStart ? `<p class="recipe-tip"><b>Bra att veta.</b> ${escapeHtml(recipe.beforeYouStart)}</p>` : ""}
      <section class="recipe-section" aria-labelledby="ingredients-heading">
        <div class="recipe-section-heading">
          <h2 id="ingredients-heading" class="cook-ingredient-heading"><img src="${squareIconPath("clipboard-2")}" alt="" width="24" height="24">Det här behöver du</h2>
          <span data-book-save></span>
        </div>
        ${
          recipe.pantryKeys.length
            ? `<div class="cook-pantry" hidden>
          <div>
            <span class="eyebrow">JÄMFÖRT MED DIN KYL</span>
            <strong class="cook-pantry-summary" role="status"></strong>
          </div>
          <button class="button cook-add-missing" type="button" hidden></button>
        </div>`
            : ""
        }
        <div class="cook-checklist">
          <progress class="cook-progress" aria-label="Avbockade råvaror" value="0" max="${ingredientCount}"></progress>
          <p class="meta cook-progress-text" aria-live="polite">0 av ${ingredientCount} avbockade</p>
        </div>
        <div class="cook-shopping">
          <p>Tryck på + vid det du behöver köpa.</p>
          <button class="text-button cook-open-shopping" type="button" aria-haspopup="dialog"><img src="${squareIconPath("shopping-basket-1")}" alt="" width="20" height="20">Inköpslista <span class="count cook-shopping-count">0</span></button>
        </div>
        <p class="meta" data-servings-note hidden>Ingredienslistan är omräknad. Mängder i instruktionerna gäller originalreceptet.</p>
        <div class="cook-ingredient-columns">${ingredientsHtml(recipe, recipeId)}</div>
        <p class="sr-only" data-servings-status role="status"></p>
      </section>
      <section class="recipe-section recipe-directions" aria-labelledby="directions-heading">
        <h2 id="directions-heading">Gör så här</h2>
        <ol class="directions">${recipe.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        ${recipe.tips.map((tip) => `<p class="recipe-tip"><b>${escapeHtml(tip.title)}</b> ${escapeHtml(tip.text)}</p>`).join("")}
      </section>
      ${recipe.sections
        .map(
          (section) => `<section class="recipe-extra">
        <h2>${escapeHtml(section.title)}</h2>
        <ul role="list">${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>`,
        )
        .join("")}
      <details class="recipe-measurements">
        <summary>Mått och ugnstemperaturer<i class="fas fa-chevron-down" aria-hidden="true"></i></summary>
        <p>Måtten är svenska (dl, msk, tsk, krm). Ugnstemperaturerna gäller vanlig ugn med över- och undervärme; med varmluft, sänk med 20 grader.</p>
      </details>
    </div>
  </article>`;
}

async function getRecipe() {
  const response = await fetch(
    `${api}/get-recipe?id=${encodeURIComponent(id)}`,
  );
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw Object.assign(new Error(result.error || "Något gick fel."), {
      status: response.status,
    });
  return result;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function showPhoto(article, recipe, url) {
  const box = $("[data-recipe-photo]", article);
  const image = new Image(1536, 864);
  image.alt = recipe.alt;
  image.className = "new-recipe-photo";
  image.addEventListener("load", () => box.replaceChildren(image), {
    once: true,
  });
  image.addEventListener("error", () => showNoPhoto(article), { once: true });
  image.src = url;
}

function showNoPhoto(article) {
  const box = $(".new-recipe-photo-wait", article);
  if (!box) return;
  box.classList.add("is-done");
  $("p", box).textContent = "Det blev inget foto den här gången.";
}

// Asks recipe-image for the photo. That call makes it and answers when it's stored, unless someone
// else's call already is (another tab, or a visitor the link was shared with); then this checks back
// until it's there.
async function loadPhoto(article, recipe, image) {
  let state = image;
  if (state.status !== "done") {
    try {
      const response = await fetch(`${api}/recipe-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) state = await response.json();
    } catch {
      // Checked again below.
    }
  }
  const stop = Date.now() + photoWait;
  while (state.status === "generating" && Date.now() < stop) {
    await wait(5000);
    try {
      state = (await getRecipe()).image;
    } catch {
      // Try again on the next round.
    }
  }
  if (state.status === "done" && state.url)
    showPhoto(article, recipe, state.url);
  else showNoPhoto(article);
}

// Where an archive recipe has its "Spara recept" heart: the same button for a signed-in visitor, which
// puts the recipe in their recipe book or takes it out, and a link to the sign-in page for anyone
// else. Signing in from that link comes back here with ?spara=1, and the recipe is saved, if this
// browser remembers the click on the link (intentKey): the address alone saves nothing, since anyone
// can put ?spara=1 in a link.
const intentKey = "restfest-save-intent";

function drawBookSave({ focus = false } = {}) {
  const slot = $("[data-book-save]", main);
  if (!slot || !account) return;
  if (account.signedIn()) {
    const inBook = account.generatedIds().has(id);
    slot.innerHTML = `<button class="dialog-save" type="button" data-save-generated="${id}" aria-pressed="${inBook}">${heartIcon(inBook)}${inBook ? "Sparat" : "Spara recept"}</button>`;
  } else {
    const back = `${location.pathname}?id=${encodeURIComponent(id)}&spara=1`;
    slot.innerHTML = `<a class="dialog-save" href="${escapeHtml(account.loginUrl(back))}" data-save-intent>${heartIcon(false)}Spara i receptboken</a>`;
  }
  if (focus) slot.firstElementChild.focus({ preventScroll: true });
}

function setInBook(on) {
  account.setGenerated(id, on);
  showToast(
    on ? "Sparat i din receptbok ♡" : "Receptet har tagits bort från receptboken",
  );
}

// The visitor's request to save, taken out of the browser: it is good for one return.
function takeSaveIntent() {
  try {
    const intent = JSON.parse(localStorage.getItem(intentKey));
    localStorage.removeItem(intentKey);
    return intent;
  } catch {
    return null;
  }
}

if (account) {
  // "Spara i receptboken", also when it's opened in a new tab.
  for (const type of ["click", "auxclick"]) {
    main.addEventListener(type, (event) => {
      if (!event.target.closest("[data-save-intent]")) return;
      try {
        localStorage.setItem(
          intentKey,
          JSON.stringify(saveIntent(id, Date.now())),
        );
      } catch {
        // Without storage the recipe isn't saved on the way back; the heart is there to click.
      }
    });
  }
  main.addEventListener("click", (event) => {
    const button = event.target.closest("[data-save-generated]");
    if (!button) return;
    setInBook(button.getAttribute("aria-pressed") !== "true");
    drawBookSave({ focus: true });
  });
  document.addEventListener("restfest:account", () => {
    const focused = $("[data-book-save]", main)?.contains(document.activeElement);
    drawBookSave({ focus: Boolean(focused) });
  });
}

async function load() {
  let data;
  try {
    data = await getRecipe();
  } catch (error) {
    showMessage(
      error.status === 404
        ? `<p>Receptet finns inte, eller har tagits bort.</p><p>${homeLink}</p>`
        : `<p>${escapeHtml(error.message)} Ladda om sidan för att försöka igen.</p>`,
    );
    return;
  }
  const { recipe } = data;
  document.title = `${recipe.title} · Ofta bra efter`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", recipe.description);
  message.remove();
  main.insertAdjacentHTML("beforeend", recipeHtml(recipe, data));
  main.removeAttribute("aria-busy");
  const article = $(".recipe-view", main);
  enhanceRecipe(article);
  drawBookSave();
  // Back from signing in through "Spara i receptboken".
  if (pageParams.get("spara") === "1") {
    const asked = intendedSave(takeSaveIntent(), id, Date.now());
    if (asked && account?.signedIn() && !account.generatedIds().has(id)) {
      setInBook(true);
      drawBookSave();
    }
    pageParams.delete("spara");
    history.replaceState(null, "", `${location.pathname}?${pageParams}`);
  }
  if (data.image.status !== "done" || !data.image.url)
    loadPhoto(article, recipe, data.image);
}

if (!api)
  showMessage(`<p>Nya recept är inte påslagna här.</p><p>${homeLink}</p>`);
else if (
  !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
) {
  showMessage(`<p>Receptet finns inte.</p><p>${homeLink}</p>`);
} else load();
