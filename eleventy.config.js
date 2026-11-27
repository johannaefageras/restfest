// Eleventy builds the site from src/ into _site/.
//
//   npm run build   build the site into _site/ (that folder is what gets uploaded)
//   npm start       local server at http://localhost:8080 that rebuilds and reloads on every change
//
// What's in src/:
//   pages/             the page templates (*.njk). Each sets its own `permalink`, as the folder name
//                      isn't part of the address: pages/receptarkiv.njk builds receptarkiv.html
//   recept/            the recipes, one Markdown file each
//   guider/            the guides (tips, facts and collectible cards), one Markdown file each:
//                      see guider/guider.11tydata.js
//   pasta/             the pasta sorts, one Markdown file each, listed on pastasorter.html: see
//                      pasta/pasta.11tydata.js and pasta/_mall.md
//                      The cakes on tartor.html are recipes in recept/ with a `tarta` block: see lib/cakes.js
//   _includes/layouts/ base.njk (every page shares it), recipe.njk, listing.njk, guide.njk and pasta.njk
//   _includes/         snippets the layouts include, e.g. recipe-card.njk
//   _data/             foods.json (the ingredient list, divided between two files: lib/foods.js), site.js (the site's address) and ai.js (the
//                      Supabase project behind the fridge photo and the new recipes)
//   css/, js/          stylesheets and browser scripts, copied as they are to css/ and js/
//   assets/            fonts, icons and photos, copied as they are. The recipe photos also get WebP
//                      copies, made by tools/photos.mjs in .cache/recipe-photos/ before every build
//
// src/recept/recept.11tydata.js gives the recipes their layout (_includes/layouts/recipe.njk) and
// address, and lib/recipes.js works out the rest.
//
// Collections:
//   recipes            every recipe, in id order (01-…, 02-…, 135-…)
//   recipeCategories   the food categories, for kategori/<slug>.html (src/pages/kategori.njk)
//   recipeTypes        Mat, Hemmaspa, Hushåll & rengöring and Husdjur, for typ/<slug>.html (src/pages/typ.njk)
//   recipeTags         every tag, for tagg/<slug>.html (src/pages/tagg.njk)
//   pastas             every pasta sort, A–Ö by name (lib/pasta.js)
//   cakes              the recipes on tartor.html, by their number there (lib/cakes.js)
//   scrollstopp        the recipes on scrollstopp.html, by their number there (lib/scrollstopp.js)
// Eleventy also makes a collection per tag from the recipes' `tags`, e.g. collections.Vegan.

import {otherFoods, recipeFoodKeys, recipeFoods} from './lib/foods.js';
import {recipeListings} from './lib/recipes.js';
import {taxonomy} from './lib/taxonomy.js';
import ai from './src/_data/ai.js';
import {shoppingDepartmentNames} from './lib/shopping-departments.js';
import {pageStructuredData} from './lib/metadata.js';
import {makePhotos} from './tools/photos.mjs';
import {makeScrollstoppImages} from './tools/scrollstopp-images.mjs';
import {scrollstoppFiles, sortScrollstopp} from './lib/scrollstopp.js';
import {baseRecipes, cakeChoices, cakeNeighbours, cakeRegion, cakesMadeWith, flags as cakeFlags, leftoverRecipes, levels as cakeLevels, parts as cakeParts, sortCakes} from './lib/cakes.js';
import {cookingTime, doughs, filterDoughs, forms, freshPastaRecipe, pastaChoices, pastaGround, pastaNeighbours, pastasBySlug, pastasMadeWith, sauceLabels, sauces, sortPastas} from './lib/pasta.js';

const recipes = api => api.getFilteredByGlob('src/recept/*.md')
  .sort((a, b) => parseInt(a.fileSlug, 10) - parseInt(b.fileSlug, 10));

// Sign-in, the recipe book and the pages around them (HANDOFF.md, "Konton och receptbok").
const accountPages = ['logga-in', 'nytt-losenord', 'receptbok', 'profil', 'konto', 'integritet'];

export default function (eleventyConfig) {
  // The account pages are built only when the site has accounts (src/_data/ai.js): without a
  // publishable key these templates are skipped, and the layout leaves out the account button.
  if (!ai.accounts) {
    for (const page of accountPages) eleventyConfig.ignores.add(`src/pages/${page}.njk`);
  }
  // The template for a new pasta sort, not a sort of its own.
  eleventyConfig.ignores.add('src/pasta/_mall.md');

  // Copied to _site/ as they are.
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/js');
  // The quantity parser the build uses, for the new-recipe page (src/js/new-recipe.js), which marks
  // the amounts in the browser.
  eleventyConfig.addPassthroughCopy({'lib/recipe-amounts.js': 'js/recipe-amounts.js'});
  // For the accounts (src/js/account.js): the helpers the tests also use, and supabase-js as one
  // file for the browser. Only signed-in visitors and the account pages load the library, and a site
  // without accounts doesn't get it at all.
  eleventyConfig.addPassthroughCopy({'lib/account-helpers.js': 'js/account-helpers.js'});
  eleventyConfig.addPassthroughCopy({'lib/shopping-sync.js': 'js/shopping-sync.js'});
  eleventyConfig.addPassthroughCopy({'lib/shopping-groups.js': 'js/shopping-groups.js'});
  eleventyConfig.addPassthroughCopy({'lib/shopping-copy.js': 'js/shopping-copy.js'});
  eleventyConfig.addPassthroughCopy({'lib/shopping-copy-links.js': 'js/shopping-copy-links.js'});
  eleventyConfig.addPassthroughCopy({'lib/shopping-departments.js': 'js/shopping-departments.js'});
  eleventyConfig.addPassthroughCopy({'lib/account-sync.js': 'js/account-sync.js'});
  eleventyConfig.addPassthroughCopy({'lib/recipe-book-sync.js': 'js/recipe-book-sync.js'});
  if (ai.accounts) {
    eleventyConfig.addPassthroughCopy({'node_modules/@supabase/supabase-js/dist/umd/supabase.js': 'js/vendor/supabase.js'});
    eleventyConfig.addPassthroughCopy({'src/shopping-worker.js': 'shopping-worker.js'});
  }

  // The build reads the categories and tag labels from js/recipes.js (lib/taxonomy.js),
  // so tell the local server to rebuild when it changes.
  eleventyConfig.addWatchTarget('src/js/recipes.js');
  eleventyConfig.addWatchTarget('lib/');

  eleventyConfig.addCollection('recipes', recipes);
  eleventyConfig.addCollection('recipeCategories', api => recipeListings(recipes(api)).categories);
  eleventyConfig.addCollection('recipeTypes', api => recipeListings(recipes(api)).types);
  eleventyConfig.addCollection('recipeTags', api => recipeListings(recipes(api)).tags);
  eleventyConfig.addCollection('pastas', api => sortPastas(api.getFilteredByGlob('src/pasta/*.md')));
  eleventyConfig.addCollection('cakes', api => sortCakes(recipes(api)));
  eleventyConfig.addCollection('scrollstopp', api => sortScrollstopp(recipes(api)));

  // foods.json divided between data/recipe-index.js (the foods the recipes use, on every page) and
  // data/foods.js (the rest of the food list, on the pages that need it). `items` is collections.recipes.
  const frontMatter = items => items.map(item => item.data);
  eleventyConfig.addFilter('recipeFoods', (foods, items) => recipeFoods(foods, frontMatter(items), taxonomy()));
  eleventyConfig.addFilter('otherFoods', (foods, items) => otherFoods(foods, frontMatter(items), taxonomy()));
  eleventyConfig.addFilter('shoppingDepartmentNames', foods => shoppingDepartmentNames({...foods, ...taxonomy().foods}));
  eleventyConfig.addFilter('pageStructuredData', pageStructuredData);

  // For the guides (layouts/guide.njk, src/guider/): the recipes that use any of a guide's foodKeys,
  // in id order, and the recipes a card names by id, in the order given. `items` is collections.recipes.
  eleventyConfig.addFilter('recipesUsing', (items, keys = []) =>
    items.filter(item => [...recipeFoodKeys([item.data])].some(key => keys.includes(key))));
  eleventyConfig.addFilter('recipesById', (items, ids = []) =>
    ids.map(id => items.find(item => item.fileSlug === id)).filter(Boolean));

  // For the pasta sorts (lib/pasta.js): the index page's filter choices and the doughs a sort counts
  // as there, the sorts a page names in bytMot, the sorts before and after one of the same form, the
  // ground behind a sort's cover, and the cooking time as it is shown. `items` is collections.pastas.
  eleventyConfig.addFilter('pastaChoices', pastaChoices);
  eleventyConfig.addFilter('filterDoughs', filterDoughs);
  eleventyConfig.addFilter('pastasBySlug', pastasBySlug);
  eleventyConfig.addFilter('pastaNeighbours', pastaNeighbours);
  eleventyConfig.addFilter('pastaGround', pastaGround);
  eleventyConfig.addFilter('cookingTime', cookingTime);
  // On a recipe's page: the fresh sorts whose grundrecept it is.
  eleventyConfig.addFilter('pastasMadeWith', pastasMadeWith);
  // The forms, sauces and doughs with their icons (lib/pasta.js), for the filter and a sort's page.
  eleventyConfig.addGlobalData('pastaForms', forms);
  eleventyConfig.addGlobalData('pastaSauces', sauces);
  eleventyConfig.addGlobalData('pastaSauceLabels', sauceLabels);
  eleventyConfig.addGlobalData('pastaDoughs', doughs);
  // The fresh-pasta recipe's id, for the link in pastasorter.html's intro.
  eleventyConfig.addGlobalData('pastaGrundrecept', freshPastaRecipe);

  // For the cakes (lib/cakes.js): tartor.html's filter choices, the region a cake's origin belongs to,
  // on a base recipe's page the cakes built with it, and on a cake's page the cakes before and after
  // it. `items` is collections.cakes. Then the parts and levels with their labels and icons, the
  // origins' flags, the base recipes the cakes are built on and the leftover recipes, for tartor.html,
  // the cards and a cake's recipe page.
  eleventyConfig.addFilter('cakeChoices', cakeChoices);
  eleventyConfig.addFilter('cakeRegion', cakeRegion);
  eleventyConfig.addFilter('cakesMadeWith', cakesMadeWith);
  eleventyConfig.addFilter('cakeNeighbours', cakeNeighbours);
  eleventyConfig.addGlobalData('cakeParts', cakeParts);
  eleventyConfig.addGlobalData('cakeLevels', cakeLevels);
  eleventyConfig.addGlobalData('cakeFlags', cakeFlags);
  eleventyConfig.addGlobalData('cakeBaseRecipes', baseRecipes());
  eleventyConfig.addGlobalData('cakeLeftovers', leftoverRecipes);

  // For Scrollstopp (lib/scrollstopp.js): a recipe's TikTok files, for its page and its card.
  eleventyConfig.addFilter('scrollstoppFiles', scrollstoppFiles);

  // Keeps a range like "1–3" or "15–20" on one line: a word joiner (U+2060) either side of the dash
  // stops the browser breaking there. For the narrow boxes under a recipe's description (recipe.njk).
  eleventyConfig.addFilter('keepRanges', text => String(text).replace(/(\d)–(\d)/g, '$1⁠–⁠$2'));

  // The WebP copies of the recipe photos (tools/photos.mjs), made before each build and copied next
  // to the PNGs in assets/recipes/, where the service worker also caches them for offline recipe pages.
  // The local server ignores changes in .cache/ as Git does, so it's the PNG that makes it rebuild.
  // `webp` gives one copy's address and `webpSrcset` all of them for srcset, both relative to the
  // site root; anything that isn't a PNG gets its own address and no srcset. The browser builds the
  // same addresses in photoAttributes() (src/js/app.js), so keep the widths the same in all three.
  // The Scrollstopp TikTok images (tools/scrollstopp-images.mjs) are made the same way, in
  // .cache/scrollstopp/, and copied next to their originals in assets/scrollstopp/.
  eleventyConfig.on('eleventy.before', () => Promise.all([makePhotos(), makeScrollstoppImages()]));
  eleventyConfig.addPassthroughCopy({'.cache/recipe-photos': 'assets/recipes'});
  eleventyConfig.addPassthroughCopy({'.cache/scrollstopp': 'assets/scrollstopp'});
  const photoWidths = [600, 1200, 1600];
  const isPhoto = image => /\.png$/.test(image ?? '');
  const webp = (image, width) => image.replace(/\.png$/, `-${width}.webp`);
  eleventyConfig.addFilter('webp', (image, width = 600) => isPhoto(image) ? webp(image, width) : image);
  eleventyConfig.addFilter('webpSrcset', (image, base = '') => isPhoto(image)
    ? photoWidths.map(width => `${base}${webp(image, width)} ${width}w`).join(', ')
    : '');
}

export const config = {
  dir: {input: 'src', output: '_site'},
  templateFormats: ['njk', 'md'],
  // Recipe text is plain Markdown, not run through a template language first.
  markdownTemplateEngine: false
};
