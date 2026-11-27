// The cakes on tartor.html (src/pages/tartor.njk). They are ordinary archive recipes in src/recept/
// that also have a `tarta` block in their front matter:
//
// Each cake also has two drawings in assets/icons/tartor/, named after its recipe: the whole cake
// (317-prinsesstarta.svg), on its card on tartor.html, and a piece (317-prinsesstarta-bit.svg), in
// the box about the collection on its recipe's page and in the list on a base recipe's page. In the
// archive its card has the photo, as every recipe's has.
//
//   tarta:
//     nr: 15                    the cake's number on tartor.html; the cakes have their own numbering, 1, 2, 3 …
//     namn: "Prinsesstårta"     a short name, where the recipe's title is too long (a base recipe's list)
//     ursprung: "Sverige"       where it comes from, shown on its card; the filter uses its region (`regions`)
//     delar: [sockerbotten, vaniljkram]   what it is built with: keys from `parts` below
//
// The build uses the helpers below as filters (eleventy.config.js), and test/cakes.test.js checks every
// cake against them.

// What a cake is built with (`delar`), in the filter's order, each with its label and its icon from
// assets/icons/. A part with `grundrecept` has a base recipe in src/recept/ (its file name without .md):
// tartor.html links to it, and that recipe's page lists the cakes built with it (layouts/recipe.njk).
export const parts = {
  sockerbotten: {label: 'Sockerbotten', icon: 'cake-layers', grundrecept: '333-tartbotten'},
  gradde: {label: 'Vispgrädde', icon: 'cream'},
  vaniljkram: {label: 'Vaniljkräm', icon: 'vanilla-cream'},
  smorkram: {label: 'Smörkräm', icon: 'buttercream'},
  ganache: {label: 'Ganache', icon: 'ganache'},
  farskost: {label: 'Färskost', icon: 'cream-cheese'},
  marang: {label: 'Maräng', icon: 'meringue'},
  marsipan: {label: 'Marsipan', icon: 'marzipan'},
  sylt: {label: 'Sylt & marmelad', icon: 'jam-jar'},
  karamell: {label: 'Karamell', icon: 'caramel'}
};

// The levels in the order the filter shows them, easiest first, as the recipes write them under
// `facts: Nivå`, with their icons from assets/icons/ (the same as on a recipe's page).
export const levels = {
  Nybörjare: 'difficulty-level-beginner',
  Medelsvårt: 'difficulty-level-intermediate',
  Avancerat: 'difficulty-level-advanced',
  Mästerkock: 'difficulty-level-masterchef'
};

// Every cake, by its number. `items` is collections.recipes; the cakes are those with a `tarta` block.
export const sortCakes = items =>
  items.filter(item => item.data.tarta).sort((a, b) => a.data.tarta.nr - b.data.tarta.nr);

// The regions in the origin menu, in its order, each with the origins (`ursprung`) that belong to it.
// A cake's card shows its own origin; the menu filters on the region. A new origin goes in one of them.
export const regions = {
  Australien: ['Australien'],
  Asien: ['Filippinerna', 'Japan'],
  Europa: ['Danmark', 'Frankrike', 'Italien', 'Norge', 'Ryssland', 'Storbritannien', 'Sverige', 'Tyskland', 'Ungern', 'Österrike'],
  Sydamerika: ['Latinamerika'],
  USA: ['USA']
};

// The flag of each origin that is a country, assets/icons/flag-<code>.svg, shown beside its name on
// a cake's card and above its recipe's title. An origin without one (Latinamerika) shows no flag.
export const flags = {
  Australien: 'au',
  Danmark: 'dk',
  Filippinerna: 'ph',
  Frankrike: 'fr',
  Italien: 'it',
  Japan: 'jp',
  Norge: 'no',
  Ryssland: 'ru',
  Storbritannien: 'gb',
  Sverige: 'se',
  Tyskland: 'de',
  Ungern: 'hu',
  USA: 'us',
  Österrike: 'at'
};

// The region an origin belongs to, or undefined for one that isn't in `regions`.
export const cakeRegion = ursprung => Object.keys(regions).find(region => regions[region].includes(ursprung));

// A cake's level, as the recipe writes it.
export const cakeLevel = item => item.data.facts?.Nivå;

// The choices in the page's filter: only the values some cake has, in the orders above.
// `items` is collections.cakes.
export function cakeChoices(items) {
  const usedParts = new Set(items.flatMap(item => item.data.tarta.delar ?? []));
  const usedLevels = new Set(items.map(cakeLevel));
  return {
    levels: Object.keys(levels).filter(level => usedLevels.has(level)),
    parts: Object.keys(parts).filter(part => usedParts.has(part)),
    regions: Object.keys(regions).filter(region => items.some(item => cakeRegion(item.data.tarta.ursprung) === region))
  };
}

// Archive recipes for what baking leaves over, for "Rester i finkläder" on tartor.html, in order: the
// last piece of cake, the yolks and the whites. Their file names in src/recept/ without .md.
export const leftoverRecipes = ['287-baked-alaska', '286-creme-brulee', '99-kokostoppar'];

// The base recipes the cakes are built on, as {part, label, id}: for the links on tartor.html.
export const baseRecipes = () => Object.entries(parts)
  .filter(([, part]) => part.grundrecept)
  .map(([key, part]) => ({part: key, label: part.label, id: part.grundrecept}));

// The cakes built with a part whose base recipe is `id`, by number: for that recipe's page.
// `items` is collections.cakes.
export function cakesMadeWith(items, id) {
  const using = Object.keys(parts).filter(key => parts[key].grundrecept === id);
  return using.length ? items.filter(item => (item.data.tarta.delar ?? []).some(part => using.includes(part))) : [];
}

// The cakes before and after the cake `id` by number, as {previous, next}, for the box on its recipe's
// page; the first has no previous and the last no next. `items` is collections.cakes.
export function cakeNeighbours(items, id) {
  const index = items.findIndex(item => item.fileSlug === id);
  return index < 0 ? {} : {previous: items[index - 1], next: items[index + 1]};
}
