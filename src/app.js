'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
// Pages in a subfolder (recept/) set data-base="../" so paths resolve from the site root.
// Absolute, so paths stay right while the address bar shows a recipe page (see openRecipe).
const siteBase = new URL(document.documentElement.dataset.base ?? './', location.href).href;
// Chrome looks the favicon up again when the address changes, so give it its absolute address too.
document.querySelectorAll('link[rel~="icon"]').forEach(link => link.setAttribute('href', link.href));
const assetUrl = path => siteBase + path;
const recipeUrl = id => `${siteBase}recept/${id}.html`;
const squareIconPath = name => assetUrl(`assets/icons/square/${name}.webp`);
const squareIcon = (name, size = 22) => `<img src="${squareIconPath(name)}" alt="" width="${size}" height="${size}">`;
const heartIcon = pressed => pressed
  ? squareIcon('heart', 20)
  : '<svg aria-hidden="true"><use href="#icon-heart"/></svg>';
const savedKey = 'restfest-saved';
const archiveSearch = $('#recipe-search');
const selectedTags = new Set();
const dietFilter = new Set();
let saved = readSavedRecipes() ?? new Set();
let foodFilter = 'all';
let mealFilter = 'all';
let quickOnly = false;
let savedOnly = Boolean(archiveSearch) && new URLSearchParams(location.search).get('vy') === 'sparade';
let activeRecipe = null;
let toastTimer;

const pantryKey = 'restfest-pantry';
let pantry = loadPantry();
const shoppingKey = 'restfest-shopping-list';
const shoppingDialog = $('#shopping-dialog');
let shoppingItems = readShoppingItems() ?? new Map();

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
}

function searchKey(value) {
  return value.toLocaleLowerCase('sv-SE').normalize('NFD').replace(/\p{M}/gu, '').replaceAll('ø', 'o');
}

function cleanIngredient(value) {
  return value.normalize('NFC').trim().replace(/\s+/g, ' ');
}

function normalizeIngredient(value) {
  return cleanIngredient(value).toLocaleLowerCase('sv-SE');
}

const ingredientKeys = new Map(Object.entries(foods).flatMap(([key, food]) =>
  [food.name, ...food.aliases].map(name => [normalizeIngredient(name), key])
));

// The same names without å, ä, ö and accents, so "agg" finds Ägg. Names that become ambiguous are left out.
const foldedIngredientKeys = new Map();
for (const [name, key] of ingredientKeys) {
  const folded = searchKey(name);
  const existing = foldedIngredientKeys.get(folded);
  foldedIngredientKeys.set(folded, existing === undefined || existing === key ? key : null);
}

// Assumed to be at home, like salt and pepper.
const stapleIngredientKeys = new Set(['olja', 'kryddor']);
// Too broad to compare ("Färska örter" covers every herb), so they never count for or against a match.
const genericIngredientKeys = new Set(['kryddor', 'orter']);
const basicIngredientWords = new Set(['salt', 'flingsalt', 'havssalt', 'peppar', 'svartpeppar', 'vitpeppar', 'vatten']);
const dinnerMeals = ['main', 'soup', 'salad', 'sandwich'];
const inflectionEndings = ['erna', 'arna', 'orna', 'na', 'er', 'ar', 'or', 'en', 'et', 'n', 'r'];

function lookupIngredient(normalized) {
  return ingredientKeys.get(normalized) ?? foldedIngredientKeys.get(searchKey(normalized)) ?? null;
}

// Also understands plural and definite forms, e.g. "gurkor", "lökarna", "kycklingen".
function resolveIngredient(name) {
  const normalized = normalizeIngredient(name);
  const direct = lookupIngredient(normalized);
  if (direct) return direct;
  for (const ending of inflectionEndings) {
    const stem = normalized.slice(0, -ending.length);
    if (!normalized.endsWith(ending) || stem.length < 3) continue;
    for (const candidate of [stem, stem + 'a', stem + 'e']) {
      const key = lookupIngredient(candidate);
      if (key) return key;
    }
  }
  for (const ending of ['er', 'ar', 'or', 'r', 'n']) {
    const key = lookupIngredient(normalized + ending);
    if (key) return key;
  }
  return null;
}

function keyForIngredient(name) {
  return resolveIngredient(name) ?? 'custom:' + normalizeIngredient(name);
}

function editDistance(a, b) {
  const row = Array.from({length: b.length + 1}, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(above + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return row[b.length];
}

// Close matches for a name we don't recognise: compounds ("färsk kyckling", "vetemjöl") and typos ("brocoli").
function suggestIngredients(name, limit = 3) {
  const query = searchKey(cleanIngredient(name));
  if (query.length < 3) return [];
  const best = new Map();
  for (const [alias, key] of ingredientKeys) {
    if (genericIngredientKeys.has(key)) continue;
    const folded = searchKey(alias);
    let score = 0;
    if (folded.length >= 4 && (query.endsWith(folded) || folded.endsWith(query))) score = 3;
    else if (Math.abs(folded.length - query.length) <= 2
      && editDistance(folded, query) <= (query.length >= 7 ? 2 : 1)) score = 2.5;
    else if (folded.length >= 4 && (query.startsWith(folded) || folded.startsWith(query))) score = 2;
    if (score > (best.get(key) ?? 0)) best.set(key, score);
  }
  return [...best]
    .sort((a, b) => b[1] - a[1] || foods[a[0]].name.length - foods[b[0]].name.length)
    .slice(0, limit)
    .map(([key]) => key);
}

function sameIngredient(a, b) {
  const key = keyForIngredient(a);
  return key === keyForIngredient(b)
    && (!genericIngredientKeys.has(key) || normalizeIngredient(a) === normalizeIngredient(b));
}

function loadPantry() {
  try {
    const stored = JSON.parse(localStorage.getItem(pantryKey));
    if (Array.isArray(stored?.items)) {
      return {items: stored.items.filter(item => typeof item === 'string' && item.trim()).slice(0, 60), example: stored.example === true};
    }
  } catch {}
  return {items: [], example: false};
}

// Compares the pantry with a recipe. The main ingredients (pantryKeys) decide most of the score;
// the rest of the ingredient list breaks ties between recipes that are equally close.
function matchRecipe(recipe, available) {
  const swap = recipe.swap;
  const canSwap = Boolean(swap && !available.has(swap.key) && available.has(swap.with)
    && !recipe.pantryKeys.includes(swap.with));
  const atHome = key => available.has(key) || stapleIngredientKeys.has(key);
  const mainKeys = recipe.pantryKeys.filter(key => !genericIngredientKeys.has(key));
  const otherKeys = recipe.foodKeys.filter(key => !recipe.pantryKeys.includes(key) && !genericIngredientKeys.has(key));
  const have = mainKeys.filter(atHome);
  const missing = mainKeys.filter(key => !atHome(key) && !(canSwap && key === swap.key));
  const otherHave = otherKeys.filter(atHome);
  const otherMissing = otherKeys.filter(key => !atHome(key));
  const coverage = (have.length + Number(canSwap)) / (mainKeys.length || 1);
  const score = otherKeys.length ? coverage * .75 + otherHave.length / otherKeys.length * .25 : coverage;
  // Only the user's own items count here, so assumed staples alone never produce a suggestion.
  const ownMatches = mainKeys.filter(key => available.has(key)).length + Number(canSwap);
  return {recipe, have, missing, otherHave, otherMissing, mainCount: mainKeys.length,
    swap: canSwap ? swap : null, coverage, score, ownMatches};
}

function readSavedRecipes() {
  try {
    const ids = JSON.parse(localStorage.getItem(savedKey) || '[]');
    return new Set(ids.filter(id => recipes.some(recipe => recipe.id === id)));
  } catch {
    return null;
  }
}

function readShoppingItems() {
  try {
    const items = JSON.parse(localStorage.getItem(shoppingKey) || '[]');
    if (!Array.isArray(items)) return null;
    return new Map(items.filter(item => typeof item?.id === 'string'
      && typeof item.text === 'string' && typeof item.recipe === 'string'
      && typeof item.checked === 'boolean').map(item => [item.id, item]));
  } catch {
    return null;
  }
}

function saveShoppingItems() {
  try {
    localStorage.setItem(shoppingKey, JSON.stringify([...shoppingItems.values()]));
  } catch {}
  updateShoppingButtons();
}

function updateShoppingButtons() {
  const count = [...shoppingItems.values()].filter(item => !item.checked).length;
  $('#shopping-count').textContent = count;
  $('#shopping-nav').setAttribute('aria-label', `Visa inköpslistan (${count} kvar att köpa)`);
  document.querySelectorAll('.cook-shopping-count').forEach(element => { element.textContent = count; });

  document.querySelectorAll('[data-shopping-ingredient]').forEach(button => {
    const added = shoppingItems.get(button.dataset.shoppingIngredient)?.text === button.dataset.shoppingText;
    button.setAttribute('aria-pressed', String(added));
    button.title = added ? 'Ta bort från inköpslistan' : 'Lägg till i inköpslistan';
    $('img', button).src = squareIconPath(added ? 'check-mark' : 'plus-sign');
  });
  document.querySelectorAll('.recipe-view').forEach(updateMissingButton);
}

function renderShoppingList() {
  $('#shopping-empty').hidden = shoppingItems.size > 0;
  $('#shopping-items').innerHTML = [...shoppingItems.values()].map(item => `
    <li class="shopping-item" data-shopping-item="${escapeHtml(item.id)}">
      <div>
        <label><input type="checkbox" ${item.checked ? 'checked' : ''}><span>${escapeHtml(item.text)}</span></label>
        <p class="meta">${escapeHtml(item.recipe)}</p>
      </div>
      <button type="button" class="shopping-remove" aria-label="Ta bort ${escapeHtml(item.text)}">×</button>
    </li>`).join('');
}

function openShoppingList() {
  shoppingItems = readShoppingItems() ?? shoppingItems;
  updateShoppingButtons();
  renderShoppingList();
  shoppingDialog.showModal();
}

function saveButton(recipe) {
  const pressed = saved.has(recipe.id);
  const label = pressed ? 'Ta bort' : 'Spara';
  return `<button class="favorite" data-save="${recipe.id}" aria-label="${label} ${escapeHtml(recipe.title)}" aria-pressed="${pressed}">${heartIcon(pressed)}</button>`;
}

function archiveCard(recipe) {
  const meal = mealTypes[recipe.meals[0]];
  const photo = recipe.cardImage;
  const chips = recipe.tags?.slice(0, 3).map(tag => recipeTagLabels[tag] ?? tag) ?? recipe.chips;
  const action = meal.action ?? 'Visa recept';
  return `<article class="archive-card" data-tone="${recipe.category ?? ''}">
    <div class="archive-card-art${photo ? ' has-photo' : ''}">
      <img src="${assetUrl(photo ?? recipe.image)}" alt="" width="${photo ? 600 : 80}" height="${photo ? 338 : 80}" loading="lazy" decoding="async">
      <span class="archive-time">${escapeHtml(recipe.timeLabel)}</span>
      ${saveButton(recipe)}
    </div>
    <div class="archive-card-body">
      <p class="archive-meal-type">${squareIcon(meal.icon, 20)}${escapeHtml(mealName(recipe.meals[0]))}</p>
      <h3><a class="recipe-main-link" href="${recipeUrl(recipe.id)}" data-open="${recipe.id}">${escapeHtml(recipe.title)}</a></h3>
      <p class="archive-description">${escapeHtml(recipe.description)}</p>
      <div class="ingredient-chips">${chips.map(name => `<span>${escapeHtml(name)}</span>`).join('')}</div>
      <a class="open-recipe" href="${recipeUrl(recipe.id)}" data-open="${recipe.id}" aria-label="Öppna ${escapeHtml(recipe.title)}">${action} <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;
}

// The archive is for food. Saved spa, cleaning and pet recipes still show under Sparade.
const foodRecipes = recipes.filter(isFood);

function matchesSearch(recipe, words) {
  if (!words.length) return true;
  const tags = allTags(recipe);
  const searchable = searchKey([
    recipe.title, ...recipe.meals.flatMap(meal => [mealTypes[meal].label, mealName(meal)]),
    ...tags, ...tags.map(tag => recipeTagLabels[tag] ?? tag), ...(recipe.chips ?? []), recipe.search
  ].join(' '));
  return words.every(word => searchable.includes(word));
}

function renderArchive() {
  if (!archiveSearch) return;
  const query = searchKey(archiveSearch.value.trim());
  const words = query ? query.split(/\s+/) : [];
  const pool = savedOnly ? recipes : foodRecipes;
  const visible = pool.filter(recipe => {
    if (savedOnly && !saved.has(recipe.id)) return false;
    if (quickOnly && (recipe.time === null || recipe.time >= 20)) return false;
    if (mealFilter !== 'all' && !recipe.meals.includes(mealFilter)) return false;
    if (foodFilter !== 'all' && !recipe.foodKeys.some(key => foods[key].group === foodFilter)) return false;
    for (const tag of [...dietFilter, ...selectedTags]) {
      if (!hasTag(recipe, tag)) return false;
    }
    return matchesSearch(recipe, words);
  });

  $('#recipe-grid').innerHTML = visible.map(archiveCard).join('');
  const noSavedRecipes = savedOnly && saved.size === 0;
  $('#empty-saved').hidden = !noSavedRecipes;
  $('#empty-search').hidden = visible.length > 0 || noSavedRecipes;
  const results = $('#archive-results');
  const total = savedOnly ? pool.filter(recipe => saved.has(recipe.id)).length : pool.length;
  const summary = `Visar ${visible.length}${visible.length === total ? '' : ` av ${total}`} ${savedOnly ? 'sparade' : 'recept'}`;
  if (results.textContent !== summary) results.textContent = summary;
  // Point to Mer än mat when a search only finds something there, e.g. "kaffeskrubb".
  const elsewhere = savedOnly || !words.length ? 0
    : recipes.filter(recipe => !isFood(recipe) && matchesSearch(recipe, words)).length;
  const hint = $('#archive-elsewhere');
  hint.hidden = !elsewhere;
  hint.innerHTML = elsewhere
    ? `${elsewhere === 1 ? '1 träff' : `${elsewhere} träffar`} finns under <a href="mer-an-mat.html">Mer än mat</a>.`
    : '';
  $('#saved-filter').setAttribute('aria-pressed', String(savedOnly));
  $('#quick-filter').setAttribute('aria-pressed', String(quickOnly));
  const filtersInUse = [...dietFilter].map(tag => recipeTagLabels[tag]);
  if (foodFilter !== 'all') filtersInUse.push(foodGroups[foodFilter].label);
  if (selectedTags.size === 1) {
    const [tag] = selectedTags;
    filtersInUse.push(recipeTagLabels[tag] ?? tag);
  } else if (selectedTags.size > 1) {
    filtersInUse.push(`${selectedTags.size} taggar`);
  }
  const filterState = $('#advanced-filter-state');
  filterState.hidden = !filtersInUse.length;
  filterState.textContent = filtersInUse.length ? `· ${filtersInUse.join(' · ')}` : '';
  document.querySelectorAll('[data-food-filter]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.foodFilter === foodFilter));
  });
  document.querySelectorAll('[data-diet-filter]').forEach(button => {
    button.setAttribute('aria-pressed', String(dietFilter.has(button.dataset.dietFilter)));
  });
}

// mer-an-mat.html: one grid per category, filled from the recipe index.
function renderMorePage() {
  document.querySelectorAll('[data-more]').forEach(grid => {
    grid.innerHTML = recipes.filter(recipe => recipe.meals[0] === grid.dataset.more).map(archiveCard).join('');
  });
}

// The category, type and tag pages have cards rendered at build time, with the heart not pressed.
// Show which ones are saved. Cards app.js renders itself are already right and are left alone.
function updateCardHearts() {
  document.querySelectorAll('.favorite[data-save]').forEach(button => {
    const recipe = recipes.find(item => item.id === button.dataset.save);
    const pressed = saved.has(button.dataset.save);
    if (!recipe || button.getAttribute('aria-pressed') === String(pressed)) return;
    button.setAttribute('aria-pressed', String(pressed));
    button.setAttribute('aria-label', `${pressed ? 'Ta bort' : 'Spara'} ${recipe.title}`);
    button.innerHTML = heartIcon(pressed);
  });
}

function refreshSavedViews() {
  $('#saved-count').textContent = saved.size;
  renderArchive();
  renderMorePage();
  updateCardHearts();
  updateSaveButtons();
  document.dispatchEvent(new Event('restfest:saved'));
}

function showToast(message) {
  clearTimeout(toastTimer);
  const toast = $('#toast');
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2400);
}

function toggleSave(id) {
  saved = readSavedRecipes() ?? saved;
  const focused = document.activeElement;
  if (saved.has(id)) saved.delete(id);
  else saved.add(id);
  try {
    localStorage.setItem(savedKey, JSON.stringify([...saved]));
  } catch {}
  refreshSavedViews();
  // Re-rendered cards replace the button that had focus; move focus to its replacement.
  if (focused?.dataset?.save === id && !focused.isConnected) {
    ($(`[data-save="${id}"]`) ?? $('#saved-filter'))?.focus({preventScroll: true});
  }
  showToast(saved.has(id) ? 'Sparat bland dina favoriter ♡' : 'Receptet har tagits bort från sparade');
}

function refreshSavedRecipes() {
  saved = readSavedRecipes() ?? saved;
  refreshSavedViews();
}

window.addEventListener('storage', event => {
  if (event.key === savedKey || event.key === null) refreshSavedRecipes();
  if (event.key === shoppingKey || event.key === null) {
    shoppingItems = readShoppingItems() ?? shoppingItems;
    updateShoppingButtons();
    if (shoppingDialog.open) renderShoppingList();
  }
  if (event.key === pantryKey || event.key === null) {
    document.querySelectorAll('.recipe-view').forEach(renderPantryStatus);
  }
});
window.addEventListener('pageshow', event => {
  if (!event.persisted) return;
  refreshSavedRecipes();
  document.querySelectorAll('.recipe-view').forEach(renderPantryStatus);
});

document.addEventListener('click', event => {
  const save = event.target.closest('[data-save]');
  if (save) {
    toggleSave(save.dataset.save);
    return;
  }
  // Recipe links are real links. With JavaScript they open in the dialog instead,
  // unless the visitor asks for a new tab or window.
  const link = event.target.closest('a[data-open]');
  if (!link || !recipeDialog || event.button !== 0
    || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  openRecipe(link.dataset.open, {opener: link, url: link.href});
});

function setSavedView(enabled) {
  savedOnly = enabled;
  const url = new URL(location.href);
  if (enabled) url.searchParams.set('vy', 'sparade');
  else url.searchParams.delete('vy');
  history.replaceState(null, '', url);
}

function foodFilterButton(key, group) {
  const artwork = group.icon ? squareIcon(group.icon) : '';
  return `<button type="button" class="food-filter" data-food-filter="${key}" aria-pressed="false">${artwork}${group.label}</button>`;
}

function setupMealPicker() {
  const picker = $('#meal-picker');
  const trigger = $('summary', picker);
  const list = $('#meal-filters');
  const representedMeals = new Set(foodRecipes.flatMap(recipe => recipe.meals));
  const meals = new Map([
    ['all', {label: 'Alla kategorier', icon: 'grid'}],
    ...Object.entries(mealTypes).filter(([key]) => representedMeals.has(key))
  ]);
  list.innerHTML = [...meals].map(([key, meal]) => `
    <button type="button" tabindex="-1" data-meal-filter="${key}" aria-pressed="${key === mealFilter}">
      ${squareIcon(meal.icon, 24)}<span>${escapeHtml(meal.label)}</span>${squareIcon('check-mark', 16)}
    </button>`).join('');
  const options = [...list.children];
  let selectedOption = options[0];

  function setMealFilter(key) {
    const meal = meals.get(key);
    selectedOption.setAttribute('aria-pressed', 'false');
    selectedOption = options.find(option => option.dataset.mealFilter === key);
    selectedOption.setAttribute('aria-pressed', 'true');
    $('img', trigger).src = squareIconPath(meal.icon);
    $('#meal-filter-value').textContent = meal.label;
    mealFilter = key;
  }

  function closePicker() {
    picker.open = false;
    trigger.focus({preventScroll: true});
  }

  picker.addEventListener('toggle', () => {
    if (picker.open) selectedOption.focus();
  });
  list.addEventListener('click', event => {
    const option = event.target.closest('[data-meal-filter]');
    if (!option) return;
    setMealFilter(option.dataset.mealFilter);
    closePicker();
    renderArchive();
  });
  picker.addEventListener('keydown', event => {
    const {key} = event;
    if (key === 'Escape' && picker.open) {
      event.preventDefault();
      closePicker();
      return;
    }
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      if (!picker.open) {
        picker.open = true;
        return;
      }
      const index = options.indexOf(event.target);
      const step = key === 'ArrowDown' ? 1 : -1;
      (index < 0 ? selectedOption : options[(index + step + options.length) % options.length]).focus();
    } else if (picker.open && (key === 'Home' || key === 'End')) {
      event.preventDefault();
      options[key === 'Home' ? 0 : options.length - 1].focus();
    }
  });
  picker.addEventListener('focusout', event => {
    if (event.relatedTarget && !picker.contains(event.relatedTarget)) picker.open = false;
  });
  document.addEventListener('click', event => {
    if (picker.open && !picker.contains(event.target)) picker.open = false;
  });

  return setMealFilter;
}

function setupTagPicker() {
  const input = $('#recipe-tag-search');
  const field = input.parentElement;
  const list = $('#recipe-tag-suggestions');
  const empty = $('.tag-picker-empty');
  // Diet has its own buttons, so it stays out of the tag suggestions.
  const dietKeys = dietTags.map(tag => searchKey(recipeTagLabels[tag]));
  const tags = [...new Set(foodRecipes.flatMap(recipe => recipe.tags ?? []))]
    .filter(tag => !dietTags.includes(tag))
    .map(tag => {
      const label = recipeTagLabels[tag] ?? tag;
      return {tag, label, labelKey: searchKey(label), tagKey: searchKey(tag)};
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'sv-SE'));
  let suggestions = [];
  let activeIndex = -1;

  function activateSuggestion(index) {
    list.children[activeIndex]?.setAttribute('aria-selected', 'false');
    activeIndex = index;
    const option = list.children[index];
    if (!option) {
      input.removeAttribute('aria-activedescendant');
      return;
    }
    option.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', option.id);
    option.scrollIntoView({block: 'nearest'});
  }

  function closeSuggestions() {
    activateSuggestion(-1);
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    empty.textContent = '';
  }

  function showSuggestions() {
    const query = searchKey(input.value.trim());
    suggestions = tags.filter(({tag, labelKey, tagKey}) =>
      !selectedTags.has(tag) && (labelKey.includes(query) || tagKey.includes(query))
    );
    if (query) {
      const startsWithQuery = ({labelKey, tagKey}) => labelKey.startsWith(query) || tagKey.startsWith(query);
      suggestions.sort((a, b) => Number(startsWithQuery(b)) - Number(startsWithQuery(a)));
    }
    activateSuggestion(-1);
    list.innerHTML = suggestions.map(({label}, index) =>
      `<li id="recipe-tag-option-${index}" role="option" aria-selected="false" data-index="${index}">${escapeHtml(label)}</li>`
    ).join('');
    list.hidden = !suggestions.length;
    list.scrollTop = 0;
    input.setAttribute('aria-expanded', String(!list.hidden));
    if (suggestions.length) empty.textContent = '';
    else if (query && dietKeys.some(key => key.startsWith(query))) empty.textContent = 'Kost väljer du med knapparna ovanför.';
    else empty.textContent = query ? 'Inga matchande taggar.' : 'Alla taggar är valda.';
  }

  function renderPills() {
    field.querySelectorAll('.tag-picker-pill').forEach(pill => pill.remove());
    for (const tag of selectedTags) {
      const label = escapeHtml(recipeTagLabels[tag] ?? tag);
      input.insertAdjacentHTML('beforebegin',
        `<button type="button" class="tag-picker-pill" data-tag="${escapeHtml(tag)}" aria-label="Ta bort taggen ${label}">${label}<span aria-hidden="true">×</span></button>`
      );
    }
    input.placeholder = selectedTags.size ? 'Lägg till en tagg' : 'Sök taggar, t.ex. Italienskt';
  }

  function updateTags() {
    renderPills();
    input.focus({preventScroll: true});
    closeSuggestions();
    renderArchive();
  }

  function chooseSuggestion(index) {
    selectedTags.add(suggestions[index].tag);
    input.value = '';
    updateTags();
  }

  input.addEventListener('input', showSuggestions);
  input.addEventListener('focus', showSuggestions);
  input.addEventListener('click', () => {
    if (list.hidden) showSuggestions();
  });
  input.addEventListener('blur', closeSuggestions);
  input.addEventListener('keydown', event => {
    if (event.isComposing) return;
    if (event.key === 'Escape') {
      if (!list.hidden || empty.textContent) {
        event.preventDefault();
        closeSuggestions();
      }
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (list.hidden) showSuggestions();
      if (list.hidden) return;
      const index = event.key === 'ArrowDown'
        ? Math.min(activeIndex + 1, suggestions.length - 1)
        : activeIndex < 0 ? suggestions.length - 1 : Math.max(activeIndex - 1, 0);
      activateSuggestion(index);
    } else if (event.key === 'Enter' && !list.hidden && (activeIndex >= 0 || input.value.trim())) {
      event.preventDefault();
      chooseSuggestion(Math.max(activeIndex, 0));
    } else if (event.key === 'Backspace' && !input.value && selectedTags.size) {
      event.preventDefault();
      selectedTags.delete([...selectedTags].at(-1));
      updateTags();
    }
  });
  list.addEventListener('mousedown', event => {
    // Keep the caret in the input while choosing a suggestion.
    if (event.target.closest('[data-index]')) event.preventDefault();
  });
  list.addEventListener('click', event => {
    const option = event.target.closest('[data-index]');
    if (option) chooseSuggestion(Number(option.dataset.index));
  });
  field.addEventListener('click', event => {
    const pill = event.target.closest('.tag-picker-pill');
    if (pill) {
      selectedTags.delete(pill.dataset.tag);
      updateTags();
    } else if (event.target === field) {
      input.focus();
      if (list.hidden) showSuggestions();
    }
  });

  return function clearTags() {
    selectedTags.clear();
    input.value = '';
    renderPills();
    closeSuggestions();
  };
}

if (archiveSearch) {
  const setMealFilter = setupMealPicker();
  const available = new Set(foodRecipes.flatMap(recipe => recipe.foodKeys.map(key => foods[key].group)));
  const groups = Object.entries(foodGroups).filter(([key]) => available.has(key));
  $('#food-filters').innerHTML = foodFilterButton('all', {label: 'Alla råvaror'})
    + groups.map(([key, group]) => foodFilterButton(key, group)).join('');

  document.querySelectorAll('[data-food-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const food = button.dataset.foodFilter;
      foodFilter = foodFilter === food ? 'all' : food;
      renderArchive();
    });
  });
  $('#diet-filters').innerHTML = dietTags.map(tag =>
    `<button type="button" class="food-filter" data-diet-filter="${tag}" aria-pressed="false">${recipeTagLabels[tag]}</button>`
  ).join('');
  $('#diet-filters').addEventListener('click', event => {
    const tag = event.target.closest('[data-diet-filter]')?.dataset.dietFilter;
    if (!tag) return;
    if (!dietFilter.delete(tag)) dietFilter.add(tag);
    renderArchive();
  });
  const clearTags = setupTagPicker();
  archiveSearch.addEventListener('input', renderArchive);
  $('#quick-filter').addEventListener('click', () => {
    quickOnly = !quickOnly;
    renderArchive();
  });
  $('#saved-filter').addEventListener('click', () => {
    setSavedView(!savedOnly);
    renderArchive();
  });
  function clearFilters() {
    archiveSearch.value = '';
    clearTags();
    dietFilter.clear();
    foodFilter = 'all';
    setMealFilter('all');
    quickOnly = false;
    renderArchive();
    archiveSearch.focus({preventScroll: true});
  }
  $('#clear-recipe-filters').addEventListener('click', clearFilters);
  $('#show-all').addEventListener('click', () => {
    setSavedView(false);
    clearFilters();
  });
}

// Staples (salt, pepper, oil, spices) and ingredients we don't recognise get no label.
function ingredientStatus(key, basic, available) {
  if (basic || !key || genericIngredientKeys.has(key) || stapleIngredientKeys.has(key)) return null;
  if (available.has(key)) return {label: 'Hemma', type: 'have', icon: 'check-mark'};
  return {label: 'Saknas', type: 'missing', icon: 'shopping-basket-1'};
}

// Marks each ingredient as at home or missing, from the list on the home page.
function renderPantryStatus(article) {
  const box = $('.cook-pantry', article);
  const available = new Set(loadPantry().items.map(keyForIngredient));
  const have = new Set();
  const missing = new Set();
  article.querySelectorAll('.cook-ingredient').forEach(row => {
    const element = $('.ingredient-status', row);
    const status = box && available.size ? ingredientStatus(row.dataset.key, 'basic' in row.dataset, available) : null;
    if (status) (status.type === 'have' ? have : missing).add(row.dataset.key);
    row.classList.toggle('is-missing', status?.type === 'missing');
    element.hidden = !status;
    element.className = status ? `ingredient-status ${status.type}` : 'ingredient-status';
    element.innerHTML = status ? `${squareIcon(status.icon, 16)}${status.label}` : '';
  });
  if (!box) return;
  box.hidden = !have.size && !missing.size;
  $('.cook-pantry-summary', article).textContent = `${have.size} hemma · ${missing.size ? `${missing.size} saknas` : 'inget saknas'}`;
  updateMissingButton(article);
}

// Shopping buttons for missing ingredients that aren't on the shopping list yet.
function missingToBuy(article) {
  return [...article.querySelectorAll('.cook-ingredient.is-missing [data-shopping-ingredient]')]
    .filter(button => button.getAttribute('aria-pressed') !== 'true');
}

function updateMissingButton(article) {
  const button = $('.cook-add-missing', article);
  if (!button) return;
  const anyMissing = Boolean($('.cook-ingredient.is-missing', article));
  button.hidden = !anyMissing;
  button.dataset.action = missingToBuy(article).length ? 'add' : 'show';
  button.innerHTML = button.dataset.action === 'add'
    ? `${squareIcon('plus-sign', 16)}Lägg saknade i inköpslistan`
    : `${squareIcon('check-mark', 16)}I inköpslistan · visa`;
}

function updateChecklistProgress(article) {
  const boxes = [...article.querySelectorAll('.cook-ingredient input[type="checkbox"]')];
  const checked = boxes.filter(box => box.checked).length;
  const progress = $('.cook-progress', article);
  progress.max = boxes.length;
  progress.value = checked;
  $('.cook-progress-text', article).textContent = `${checked} av ${boxes.length} avbockade`;
}

function updateSaveButtons() {
  document.querySelectorAll('.dialog-save[data-save]').forEach(button => {
    const id = button.dataset.save;
    const isSaved = saved.has(id);
    const noun = recipes.find(recipe => recipe.id === id)?.meals.includes('spa') ? 'behandling' : 'recept';
    button.setAttribute('aria-pressed', String(isSaved));
    button.innerHTML = `${heartIcon(isSaved)}${isSaved ? 'Sparat' : `Spara ${noun}`}`;
  });
}

// Wires up a recipe's interactive parts, on its own page or in the dialog.
function enhanceRecipe(article) {
  const title = $('.recipe-heading', article).textContent;
  const list = $('.cook-ingredient-columns', article);
  list.addEventListener('change', () => updateChecklistProgress(article));
  list.addEventListener('click', event => {
    const button = event.target.closest('[data-shopping-ingredient]');
    if (!button) return;
    const {shoppingIngredient: id, shoppingText: text} = button.dataset;
    shoppingItems = readShoppingItems() ?? shoppingItems;
    if (shoppingItems.get(id)?.text === text) shoppingItems.delete(id);
    else shoppingItems.set(id, {id, text, recipe: title, checked: false});
    saveShoppingItems();
  });
  $('.cook-open-shopping', article).addEventListener('click', openShoppingList);
  $('.cook-add-missing', article)?.addEventListener('click', event => {
    if (event.currentTarget.dataset.action !== 'add') {
      openShoppingList();
      return;
    }
    const buttons = missingToBuy(article);
    shoppingItems = readShoppingItems() ?? shoppingItems;
    for (const {dataset: {shoppingIngredient: id, shoppingText: text}} of buttons) {
      shoppingItems.set(id, {id, text, recipe: title, checked: false});
    }
    saveShoppingItems();
    showToast(buttons.length === 1 ? '1 råvara lades i inköpslistan' : `${buttons.length} råvaror lades i inköpslistan`);
  });
  shoppingItems = readShoppingItems() ?? shoppingItems;
  updateShoppingButtons();
  renderPantryStatus(article);
  updateChecklistProgress(article);
  updateSaveButtons();
}

const recipeDialog = $('#recipe-dialog');
let recipeRequest = 0;
let closingFromHistory = false;

// Shows a recipe in the dialog. The content comes from the recipe's own page (recept/<id>.html),
// and the address bar shows that page while the dialog is open.
async function openRecipe(id, {opener = null, url = new URL(recipeUrl(id), location.href).href, push = true} = {}) {
  const request = ++recipeRequest;
  let article;
  let title;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const page = new DOMParser().parseFromString(await response.text(), 'text/html');
    article = page.querySelector('.recipe-view');
    if (!article) throw new Error('No recipe on the page');
    title = page.title;
    // The page lives in recept/, so its image paths are resolved against its own address.
    const resolve = value => new URL(value, response.url).href;
    article.querySelectorAll('img[src]').forEach(image => image.setAttribute('src', resolve(image.getAttribute('src'))));
    article.querySelectorAll('img[srcset]').forEach(image => image.setAttribute('srcset', image.getAttribute('srcset')
      .split(',').map(entry => entry.trim().split(/\s+/)).map(([src, size]) => `${resolve(src)} ${size}`).join(', ')));
  } catch {
    // Opened from disk (file://) or offline: go to the recipe page itself.
    if (request === recipeRequest) location.href = url;
    return;
  }
  if (request !== recipeRequest) return;

  $('#dialog-content').replaceChildren(document.importNode(article, true));
  if (recipeDialog.open) {
    activeRecipe.id = id;
  } else {
    activeRecipe = {id, opener, previousTitle: document.title};
    recipeDialog.showModal();
    document.body.style.overflow = 'hidden';
  }
  enhanceRecipe($('#dialog-content .recipe-view'));
  recipeDialog.scrollTop = 0;
  // Start at the top, with the close button focused, also when switching recipes.
  $('.dialog-close', recipeDialog)?.focus({preventScroll: true});
  document.title = title;
  if (push) history.pushState({recipe: id}, '', url);
}

if (recipeDialog) {
  $('.dialog-close', recipeDialog)?.addEventListener('click', () => recipeDialog.close());
  recipeDialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    const {id, opener, previousTitle} = activeRecipe;
    document.title = previousTitle;
    const fallback = $(`[data-open="${id}"]`) ?? archiveSearch ?? $('#ingredient-input');
    (opener?.isConnected ? opener : fallback)?.focus({preventScroll: true});
    activeRecipe = null;
    // Closed with ×, Esc or a click outside: step back so the address is the list page again.
    if (!closingFromHistory && history.state?.recipe === id) history.back();
    closingFromHistory = false;
  });
  recipeDialog.addEventListener('click', event => {
    if (event.target !== recipeDialog) return;
    const bounds = recipeDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom) recipeDialog.close();
  });
  // Back closes the recipe; Forward opens it again.
  window.addEventListener('popstate', event => {
    const id = event.state?.recipe;
    if (!id && recipeDialog.open) {
      closingFromHistory = true;
      recipeDialog.close();
    } else if (id && id !== activeRecipe?.id) {
      openRecipe(id, {url: location.href, push: false});
    }
  });
}

$('#shopping-nav').addEventListener('click', openShoppingList);
$('.dialog-close', shoppingDialog).addEventListener('click', () => shoppingDialog.close());
$('#shopping-items').addEventListener('change', event => {
  const id = event.target.closest('[data-shopping-item]').dataset.shoppingItem;
  shoppingItems = readShoppingItems() ?? shoppingItems;
  const item = shoppingItems.get(id);
  if (!item) {
    renderShoppingList();
    return;
  }
  item.checked = event.target.checked;
  saveShoppingItems();
});
$('#shopping-items').addEventListener('click', event => {
  const remove = event.target.closest('.shopping-remove');
  if (!remove) return;
  const row = remove.closest('[data-shopping-item]');
  const index = [...row.parentElement.children].indexOf(row);
  shoppingItems = readShoppingItems() ?? shoppingItems;
  shoppingItems.delete(row.dataset.shoppingItem);
  saveShoppingItems();
  renderShoppingList();
  const buttons = shoppingDialog.querySelectorAll('.shopping-remove');
  (buttons[Math.min(index, buttons.length - 1)] ?? $('.dialog-close', shoppingDialog)).focus();
});

// On a recipe's own page (recept/<id>.html) the recipe is part of the page.
const pageRecipe = $('main .recipe-view');
if (pageRecipe) enhanceRecipe(pageRecipe);

refreshSavedViews();
updateShoppingButtons();
