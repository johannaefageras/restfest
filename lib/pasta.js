// The pasta sorts in src/pasta/: one Markdown file each, src/pasta/<slug>.md becomes pasta/<slug>.html,
// and pastasorter.html lists them all (src/pages/pastasorter.njk). src/pasta/_mall.md explains the
// fields. The build uses the helpers below as filters (eleventy.config.js), and test/pasta.test.js
// checks every file against the lists.

// The forms (`kategori`), in the order the filter shows them: long shapes first, sheets last. Each has
// a drawing from assets/icons/pasta/ for its box on a sort's page.
export const forms = {
  lång: 'spaghetti',
  band: 'tagliatelle',
  rör: 'penne',
  kort: 'fusilli',
  liten: 'orzo',
  fylld: 'ravioli',
  ark: 'lasagne'
};

// What a sort goes with (`saser`), in the filter's order, each with its icon from assets/icons/.
export const sauces = {
  olivolja: 'olive-oil',
  tomater: 'tomatoes',
  ost: 'cheese',
  grädde: 'cream',
  smör: 'butter',
  kött: 'steak-1',
  fisk: 'fish',
  kyckling: 'chicken-fillets',
  skaldjur: 'shrimp',
  svamp: 'mushrooms',
  sallad: 'salad'
};

// Short display labels; the stored values and filter links stay the same.
export const sauceLabels = {tomater: 'tomat'};

// The doughs (`deg`): how the filter and a sort's page write them, and their icons from assets/icons/.
export const doughs = {
  torkad: {label: 'torkad', icon: 'wheat'},
  färsk: {label: 'färsk', icon: 'eggs'},
  båda: {label: 'färsk eller torkad', icon: 'flour'},
  potatis: {label: 'potatis', icon: 'potato'}
};

// The fresh-pasta recipe, a file name in src/recept/ without .md. A sort with deg färsk or båda links
// to it under "Går att göra hemma" (pasta.11tydata.js), and pastasorter.html links to it in its intro.
// A sort whose dough is not egg pasta sets `grundrecept: ""` and gets no link.
export const freshPastaRecipe = '302-farsk-aggpasta';

// The other way: the sorts a recipe's page lists as made from its dough (layouts/recipe.njk), those
// with deg färsk or båda whose grundrecept is that recipe, A–Ö as `items` is. `items` is collections.pastas.
export const pastasMadeWith = (items, id) =>
  items.filter(item => (item.data.deg === 'färsk' || item.data.deg === 'båda') && item.data.grundrecept === id);

// Every sort, A–Ö by name. `items` is the pasta files from the collection API.
export const sortPastas = items => [...items].sort((a, b) => a.data.namn.localeCompare(b.data.namn, 'sv'));

// The doughs a sort counts as in the filter: one sold both fresh and dried shows under both.
export const filterDoughs = deg => deg === 'båda' ? ['färsk', 'torkad'] : [deg];

// The choices in the index page's filter: only the values some sort has, in the orders above, and
// the regions A–Ö. `items` is collections.pastas.
export function pastaChoices(items) {
  const data = items.map(item => item.data);
  const used = new Set([
    ...data.map(d => d.kategori),
    ...data.flatMap(d => d.saser),
    ...data.flatMap(d => filterDoughs(d.deg))
  ]);
  return {
    forms: Object.keys(forms).filter(form => used.has(form)),
    sauces: Object.keys(sauces).filter(sauce => used.has(sauce)),
    doughs: Object.keys(doughs).filter(dough => used.has(dough)),
    regions: [...new Set(data.map(d => d.region).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'sv'))
  };
}

// The sorts a page names in `bytMot`, in the order given. A slug without a page is left out here
// and reported by test/pasta.test.js.
export const pastasBySlug = (items, slugs = []) =>
  slugs.map(slug => items.find(item => item.fileSlug === slug)).filter(Boolean);

// The ground behind a sort's drawing: its card's on pastasorter.html, where the cards take pink,
// lavender and sage in turn (kitchen.css), so the cover on its page and in the dialog matches the card.
const grounds = ['pink', 'lavender', 'sage'];
export function pastaGround(items, slug) {
  const index = items.findIndex(item => item.fileSlug === slug);
  return grounds[Math.max(index, 0) % grounds.length];
}

// The sorts before and after this one among those of the same form, A–Ö, for the links under its page.
export function pastaNeighbours(items, slug) {
  const self = items.find(item => item.fileSlug === slug);
  if (!self) return {};
  const same = sortPastas(items.filter(item => item.data.kategori === self.data.kategori));
  const index = same.indexOf(self);
  return {previous: same[index - 1], next: same[index + 1]};
}

// The cooking time, "9–11 min". With `detail`, a sort that is fresh, or sold both fresh and dried,
// also says which the time is for: "3–5 min, färsk", "6–8 min, torkad".
export function cookingTime({koktid: [min, max], deg}, detail = false) {
  const range = min === max ? `${min} min` : `${min}–${max} min`;
  if (!detail) return range;
  return range + (deg === 'färsk' ? ', färsk' : deg === 'båda' ? ', torkad' : '');
}
