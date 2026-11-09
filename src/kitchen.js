'use strict';

const sampleItems = ['Pasta', 'Ägg', 'Lagrad ost', 'Mjölk', 'Spenat', 'Krossade tomater'];
const pantryInput = $('#ingredient-input');
const moreMatchCount = 3;

function capitalize(value) {
  return value.charAt(0).toLocaleUpperCase('sv-SE') + value.slice(1);
}

function isUnknownIngredient(name) {
  return keyForIngredient(name).startsWith('custom:');
}

// "a", "a eller b", "a, b eller c"
function joinWords(words, last = 'eller') {
  return words.length < 2 ? words.join('') : `${words.slice(0, -1).join(', ')} ${last} ${words.at(-1)}`;
}

// "Bröd, Vitlök, Citron och 2 till"
function listFoods(keys, {max = 3, lower = false} = {}) {
  const names = keys.slice(0, max).map(key => lower ? foods[key].name.toLocaleLowerCase('sv-SE') : foods[key].name);
  const rest = keys.length - names.length;
  return escapeHtml(rest ? `${names.join(', ')} och ${rest} till` : names.join(', '));
}

function updatePantry(message) {
  try {
    localStorage.setItem(pantryKey, JSON.stringify(pantry));
  } catch {}
  renderPantry();
  $('#pantry-status').textContent = message;
}

function renderPantry() {
  const list = $('#pantry-list');
  list.replaceChildren();
  pantry.items.forEach((name, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    const unknown = isUnknownIngredient(name);
    button.type = 'button';
    button.className = unknown ? 'pantry-chip is-unknown' : 'pantry-chip';
    button.setAttribute('aria-label', unknown ? `Ta bort ${name} (känns inte igen)` : `Ta bort ${name}`);
    const artwork = foodGroups[foods[keyForIngredient(name)]?.group]?.icon;
    if (artwork) {
      const image = document.createElement('img');
      image.src = squareIconPath(artwork);
      image.alt = '';
      image.width = 20;
      image.height = 20;
      button.append(image);
    }
    button.append(name);
    const remove = document.createElement('span');
    remove.setAttribute('aria-hidden', 'true');
    remove.textContent = '×';
    button.append(remove);
    button.addEventListener('click', () => {
      pantry.items.splice(index, 1);
      updatePantry(`${name} togs bort.`);
      const buttons = list.querySelectorAll('button');
      (buttons[Math.min(index, buttons.length - 1)] ?? pantryInput).focus({preventScroll: true});
    });
    item.append(button);
    list.append(item);
  });
  $('#pantry-count').textContent = pantry.items.length;
  $('#clear-pantry').hidden = pantry.items.length === 0;
  $('#pantry-help').textContent = pantry.example
    ? 'Listan innehåller exempelråvaror. Ändra den för att testa en annan middag.'
    : 'Lägg till råvaror från kyl, frys eller skafferi. Tryck på en råvara för att ta bort den.';
  renderUnknownIngredients();
  renderFeaturedRecipe();
}

function renderUnknownIngredients() {
  const box = $('#pantry-unknown');
  const unknown = pantry.items.map((name, index) => ({name, index})).filter(({name}) => isUnknownIngredient(name));
  box.hidden = unknown.length === 0;
  box.innerHTML = unknown.map(({name, index}) => {
    const label = `<strong>${escapeHtml(name)}</strong>`;
    const suggestions = suggestIngredients(name).map(key => foods[key].name);
    if (!suggestions.length) return `<li>Känner inte igen ${label}. Den räknas inte med i förslagen.</li>`;
    const buttons = suggestions.map(suggestion =>
      `<button type="button" class="pantry-suggestion" data-replace="${index}" data-with="${escapeHtml(suggestion)}">${escapeHtml(suggestion)}</button>`);
    return `<li>Känner inte igen ${label}. Menade du ${joinWords(buttons)}?</li>`;
  }).join('');
}

function matchItem(match) {
  const {recipe} = match;
  const missing = match.missing.length ? `Saknas: ${listFoods(match.missing)}` : 'Du har alla huvudråvaror';
  return `<li class="match-item">
    <img src="${assetUrl(recipe.cardImage ?? recipe.image)}" width="600" height="338" alt="" loading="lazy" decoding="async">
    <div>
      <h4><a class="recipe-main-link" href="${recipeUrl(recipe.id)}" data-open="${recipe.id}">${escapeHtml(recipe.title)}</a></h4>
      <p class="match-item-count">${match.have.length} av ${match.mainCount} huvudråvaror · <span>${escapeHtml(recipe.timeLabel)}</span></p>
      <p class="match-item-missing">${missing}</p>
    </div>
  </li>`;
}

function findMatches(available) {
  const time = recipe => recipe.time ?? Number.MAX_SAFE_INTEGER;
  return recipes
    .filter(recipe => recipe.pantryKeys.length && recipe.meals.some(meal => dinnerMeals.includes(meal)))
    .map(recipe => matchRecipe(recipe, available))
    .filter(match => match.ownMatches > 0)
    .sort((a, b) => b.score - a.score || b.have.length - a.have.length || time(a.recipe) - time(b.recipe));
}

function renderFeaturedRecipe() {
  const available = new Set(pantry.items.map(keyForIngredient));
  const [match, ...others] = findMatches(available);
  const more = others.slice(0, moreMatchCount);
  const recipe = match?.recipe ?? recipes[0];
  const label = match ? 'BÄSTA MATCHEN' : 'UR RECEPTARKIVET';
  let explanation = '<p>Lägg till en råvara eller prova exempelkylskåpet för att hitta en match.</p>';
  if (match) {
    let missing = '';
    if (match.missing.length) missing = `<strong>Saknas</strong> · ${listFoods(match.missing, {max: 4})}`;
    else if (match.swap) missing = 'Med bytet har du det du behöver.';
    else if (!match.otherMissing.length) missing = 'Du har allt som behövs.';
    explanation = `<p class="match-count">Du har ${match.have.length} av ${match.mainCount} huvudråvaror</p>
      ${missing ? `<p>${missing}</p>` : ''}
      ${match.otherMissing.length ? `<p class="match-extra">Kolla också: ${listFoods(match.otherMissing, {lower: true})}.</p>` : ''}
      ${match.swap ? `<p class="recipe-swap"><strong>Bytestips</strong> · ${escapeHtml(match.swap.text)}</p>` : ''}`;
  } else if (pantry.items.length) {
    explanation = '<p>Inget recept matchar listan än. Lägg till fler råvaror eller bläddra i arkivet.</p>';
  }
  $('#featured-recipe').innerHTML = `<article class="featured-card">
    <div class="featured-art${recipe.cardImage ? ' has-photo' : ''}">
      <span class="sticker">${label}</span>
      ${recipe.cardImage
        ? `<img src="${assetUrl(recipe.cardImage)}" srcset="${assetUrl(recipe.cardImage)} 600w, ${assetUrl(recipe.image)} 1200w" sizes="(min-width: 900px) 460px, calc(100vw - 40px)" width="600" height="338" alt="">`
        : `<div class="featured-plate"><img src="${assetUrl(recipe.image)}" width="112" height="112" alt=""></div>`}
      <span class="featured-time">${escapeHtml(recipe.timeLabel)}</span>
      ${saveButton(recipe)}
    </div>
    <div class="featured-body">
      <h3>${escapeHtml(recipe.title)}</h3>
      <p class="featured-description">${escapeHtml(recipe.description)}</p>
      <div class="match-info">${explanation}</div>
      <a class="button primary" href="${recipeUrl(recipe.id)}" data-open="${recipe.id}">Visa recept <span aria-hidden="true">↗</span></a>
      <p class="meta featured-note">${match
        ? 'Förslaget jämför din lista med receptets råvaror. Salt, peppar, vatten, olja och kryddor räknas som basvaror.'
        : 'Lägg till det du har så letar vi bland middagsrecepten.'}</p>
    </div>
  </article>
  ${more.length ? `<section class="more-matches" aria-labelledby="more-matches-title">
    <h3 id="more-matches-title" class="eyebrow">Fler förslag</h3>
    <ul class="match-list">${more.map(matchItem).join('')}</ul>
  </section>` : ''}`;
  $('#match-status').textContent = match
    ? `Bästa matchen: ${recipe.title}. Du har ${match.have.length} av ${match.mainCount} huvudråvaror.${more.length ? ` ${more.length} fler förslag.` : ''}`
    : 'Inget matchat recept.';
}

Object.values(foods).sort((a, b) => a.name.localeCompare(b.name, 'sv-SE')).forEach(food => {
  const option = document.createElement('option');
  option.value = food.name;
  $('#ingredient-options').append(option);
});

$('#pantry-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = cleanIngredient(pantryInput.value);
  if (!name) {
    $('#pantry-status').textContent = 'Skriv namnet på en råvara först.';
    pantryInput.focus();
    return;
  }
  if (basicIngredientWords.has(normalizeIngredient(name))) {
    $('#pantry-status').textContent = 'Salt, peppar och vatten räknas alltid som hemma, så de behövs inte i listan.';
    pantryInput.select();
    return;
  }
  const key = keyForIngredient(name);
  const food = foods[key];
  const displayName = food && !genericIngredientKeys.has(key) ? food.name : capitalize(name);
  if (pantry.items.some(item => sameIngredient(item, displayName))) {
    $('#pantry-status').textContent = 'Råvaran finns redan i listan.';
    pantryInput.select();
    return;
  }
  if (pantry.items.length >= 60) {
    $('#pantry-status').textContent = 'Listan rymmer 60 råvaror. Ta bort en för att lägga till fler.';
    return;
  }
  pantry.items.push(displayName);
  pantryInput.value = '';
  updatePantry(food ? `${displayName} lades till.` : `${displayName} lades till, men känns inte igen.`);
  pantryInput.focus();
});

$('#pantry-unknown').addEventListener('click', event => {
  const button = event.target.closest('[data-replace]');
  if (!button) return;
  const index = Number(button.dataset.replace);
  const original = pantry.items[index];
  const replacement = button.dataset.with;
  if (pantry.items.some((item, other) => other !== index && sameIngredient(item, replacement))) {
    pantry.items.splice(index, 1);
  } else {
    pantry.items[index] = replacement;
  }
  updatePantry(`${original} ändrades till ${replacement}.`);
  pantryInput.focus({preventScroll: true});
});

$('#clear-pantry').addEventListener('click', () => {
  pantry = {items: [], example: false};
  updatePantry('Listan är tömd.');
  pantryInput.focus({preventScroll: true});
});

$('#try-example').addEventListener('click', () => {
  const additions = sampleItems.filter(name => !pantry.items.some(item => sameIngredient(item, name)));
  pantry.items = [...pantry.items, ...additions].slice(0, 60);
  pantry.example = true;
  updatePantry('Exempelråvarorna är tillagda.');
});

document.addEventListener('restfest:saved', renderFeaturedRecipe);
renderPantry();
