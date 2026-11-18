import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import {taxonomy} from '../lib/taxonomy.js';

const read = path => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');
const app = read('js/app.js');
const kitchen = read('js/kitchen.js');
const helpers = app.slice(app.indexOf('function searchKey('), app.indexOf('function loadPantry('));
const capitalize = kitchen.slice(kitchen.indexOf('function capitalize('), kitchen.indexOf('// The names that match'));
const {foods, foodGroups} = taxonomy();

function page(globals = {}) {
  const context = vm.createContext({foods, foodGroups, ...globals});
  vm.runInContext(helpers + capitalize + read('js/food-icons.js'), context);
  return context;
}

test('reviewed food pairings use existing foods and SVGs, with no conflicting keys or names', () => {
  const p = page();
  const groups = JSON.parse(vm.runInContext('JSON.stringify(pantryIconFoods)', p));
  const names = JSON.parse(vm.runInContext('JSON.stringify(pantryIconNames)', p));
  const keys = new Set(), words = new Set();
  for (const [icon, entries] of Object.entries(groups)) {
    assert.ok(existsSync(new URL(`../src/assets/icons/${icon}.svg`, import.meta.url)), icon);
    for (const key of entries) {
      assert.ok(foods[key], key);
      assert.ok(!keys.has(key), `${key} has only one pairing`);
      keys.add(key);
      assert.equal(p.iconForPantryFood(foods[key].name), icon, foods[key].name);
    }
  }
  for (const [icon, entries] of Object.entries(names)) {
    assert.ok(existsSync(new URL(`../src/assets/icons/${icon}.svg`, import.meta.url)), icon);
    for (const name of entries) {
      const folded = p.searchKey(name);
      assert.ok(!words.has(folded), `${name} has only one pairing`);
      words.add(folded);
      assert.ok(foods[p.keyForIngredient(name)], `${name} is recognised`);
      assert.equal(p.iconForPantryFood(name), icon, name);
    }
  }
});

test('specific groceries keep their pictures while sharing the existing recipe keys', () => {
  const p = page();
  for (const [name, key, icon] of [
    ['Basilika', 'orter', 'basil'], ['Koriander', 'orter', 'cilantro'],
    ['Persilja', 'orter', 'parsley'], ['Oregano', 'kryddor', 'oregano'],
    ['Rödkål', 'kal', 'red-cabbage'], ['Vitkål', 'kal', 'green-cabbage'],
    ['Ruccola', 'sallad', 'rocket'], ['Palsternackor', 'rotfrukter', 'parsnips'],
    ['Farfalle', 'pasta', 'farfalle'], ['Spaghetti', 'pasta', 'spagheti'],
    ['Baguette', 'brod', 'baguette'],
    ['  RODKAL  ', 'kal', 'red-cabbage'], ['morötterna', 'morot', 'carrot'],
  ]) {
    assert.equal(p.keyForIngredient(name), key, name);
    assert.equal(p.iconForPantryFood(name), icon, name);
    assert.equal(p.iconForPantryFood(p.nameForPantryFood(name)), icon, `${name} after adding`);
  }
});

test('typed names stay as typed unless they are a form of the food\'s own name', () => {
  const p = page();
  for (const [typed, key, shown] of [
    ['Skinka', 'julskinka', 'Skinka'], ['kokt skinka', 'julskinka', 'Kokt skinka'],
    ['nötfärs', 'blandfars', 'Nötfärs'], ['kyckling', 'kyckling', 'Kyckling'],
    ['körsbärstomater', 'tomat', 'Körsbärstomater'],
    ['julskinka', 'julskinka', 'Julskinka'], ['JULSKINKAN', 'julskinka', 'Julskinka'],
    ['agg', 'agg', 'Ägg'], ['tomat', 'tomat', 'Tomater'], ['gurkor', 'gurka', 'Gurka'],
    ['morot', 'morot', 'Morötter'], ['morötterna', 'morot', 'Morötter'],
  ]) {
    assert.equal(p.keyForIngredient(typed), key, typed);
    assert.equal(p.nameForPantryFood(typed), shown, typed);
  }
});

test('product forms choose suitable pictures and unknown items remain unillustrated', () => {
  const p = page();
  for (const [name, icon] of [
    ['Majskolv', 'corn'], ['Majsmjöl', 'flour'],
    ['Färsk ingefära', 'ginger'], ['Malen ingefära', 'ground-spice'],
    ['Jordgubbar', 'strawberries'], ['Jordgubbssylt', 'jam-jar'],
    ['Keso med sylt', 'cottage-cheese'], ['Dijonsenap', 'mustard'],
    ['Senapspulver', 'ground-spice'], ['Havregryn', 'oats'],
    ['Havredryck', 'oat-milk'], ['Fryst tärnad sötpotatis', 'sweet-potatoes'],
    ['Tonfisk i olja', 'canned-fish'], ['Tonfisk', 'fish'],
    ['Laxfilé', 'salmon-fillet'], ['Popcorn', 'popcorn'],
    ['Linser', 'lentils'], ['Gröna linser', 'lentils'], ['Belugalinser', 'lentils'],
    ['Linssoppa', 'soup-bowl'], ['Mung dal', 'beans'],
    ['Köttfärs', 'minced-meat'], ['Kycklingfärs', 'minced-meat'],
    ['Majonnäs', 'mayonnaise'], ['Vegansk majonnäs', 'mayonnaise'], ['Aioli', 'mayonnaise'],
    ['Jordnötter', 'peanuts'], ['Jordnötssmör', 'peanuts'], ['Jordnötsolja', 'olive-oil'],
    ['Pumpafrön', 'seeds'], ['Sesamfrön', 'seeds'], ['Chiafrön', 'seeds'],
    ['Tomatpuré', 'tomato-puree'], ['Krossade tomater', 'canned-tomatoes'],
    ['Apelsin', 'oranges'], ['Natto', 'beans'],
    ['Vinterportlak', 'broccoli'], ['Påhittad råvara', null], ['Diskborste', null],
  ]) assert.equal(p.iconForPantryFood(name), icon, name);
});

test('the actual add form retains specific names and the renderer uses their SVGs', () => {
  const elements = new Map();
  const node = () => ({
    value: '', children: [], handlers: {}, classList: {toggle() {}},
    addEventListener(type, handler) { this.handlers[type] = handler; },
    append(...children) { this.children.push(...children); },
    replaceChildren(...children) { this.children = children; },
    closest() { return this; }, setAttribute() {}, insertAdjacentHTML() {}, focus() {}, select() {},
  });
  const $ = selector => {
    if (!elements.has(selector)) elements.set(selector, node());
    return elements.get(selector);
  };
  const pantry = {items: []};
  const p = page({
    $, pantry, pantryInput: $('#ingredient-input'),
    document: {createElement: node, querySelector: () => null, dispatchEvent() {}},
    Event: class {}, squareIconPath: icon => `assets/icons/${icon}.svg`, faIcon: () => '',
    updateIngredientOptions() {}, updatePantry() {}, renderUnknownIngredients() {}, renderFeaturedRecipe() {},
  });
  vm.runInContext(kitchen.slice(kitchen.indexOf('function isUnknownIngredient('), kitchen.indexOf('// "a",')), p);
  vm.runInContext(kitchen.slice(kitchen.indexOf('function renderPantry('), kitchen.indexOf('function renderUnknownIngredients(')), p);
  vm.runInContext(kitchen.slice(kitchen.indexOf('$("#pantry-form").addEventListener'), kitchen.indexOf('$("#pantry-unknown").addEventListener')), p);
  for (const name of ['farfalle', 'baguette', 'rödkål', 'basilika', 'morot', 'Påhittad råvara']) {
    $('#ingredient-input').value = name;
    $('#pantry-form').handlers.submit({preventDefault() {}});
  }
  assert.deepEqual(pantry.items, ['Farfalle', 'Baguette', 'Rödkål', 'Basilika', 'Morötter', 'Påhittad råvara']);
  p.renderPantry();
  const buttons = $('#pantry-list').children.map(li => li.children[0]);
  assert.deepEqual(buttons.slice(0, 5).map(button => button.children[0].src),
    ['farfalle', 'baguette', 'red-cabbage', 'basil', 'carrot'].map(icon => `assets/icons/${icon}.svg`));
  assert.equal(buttons[0].children[0].alt, '');
  assert.equal(buttons[0].children[0].width, 20);
  assert.equal(buttons.at(-1).className, 'pantry-chip is-unknown');
  assert.deepEqual(buttons.at(-1).children, ['Påhittad råvara']);
});
