// Eleventy builds the site from src/ into _site/.
//
//   npm run build   build the site into _site/ (that folder is what gets uploaded)
//   npm start       local server at http://localhost:8080 that rebuilds and reloads on every change
//
// What's in src/:
//   pages/             the page templates (*.njk). Each sets its own `permalink`, as the folder name
//                      isn't part of the address: pages/receptarkiv.njk builds receptarkiv.html
//   recept/            the recipes, one Markdown file each
//   _includes/layouts/ base.njk (every page shares it), recipe.njk and listing.njk
//   _includes/         snippets the layouts include, e.g. recipe-card.njk
//   _data/             foods.json (the ingredient list), site.js (the site's address) and ai.js (the
//                      Supabase project behind the fridge photo and the new recipes)
//   css/, js/          stylesheets and browser scripts, copied as they are to css/ and js/
//   assets/            fonts, icons and photos, copied as they are
//
// src/recept/recept.11tydata.js gives the recipes their layout (_includes/layouts/recipe.njk) and
// address, and lib/recipes.js works out the rest.
//
// Collections:
//   recipes            every recipe, in id order (01-…, 02-…, 135-…)
//   recipeCategories   the food categories, for kategori/<slug>.html (src/pages/kategori.njk)
//   recipeTypes        Mat, Hemmaspa, Hushåll & städ and Husdjur, for typ/<slug>.html (src/pages/typ.njk)
//   recipeTags         every tag, for tagg/<slug>.html (src/pages/tagg.njk)
// Eleventy also makes a collection per tag from the recipes' `tags`, e.g. collections.Vegan.

import {recipeListings} from './lib/recipes.js';

const recipes = api => api.getFilteredByGlob('src/recept/*.md')
  .sort((a, b) => parseInt(a.fileSlug, 10) - parseInt(b.fileSlug, 10));

export default function (eleventyConfig) {
  // Copied to _site/ as they are.
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/js');
  // The quantity parser the build uses, for the new-recipe page (src/js/new-recipe.js), which marks
  // the amounts in the browser.
  eleventyConfig.addPassthroughCopy({'lib/recipe-amounts.js': 'js/recipe-amounts.js'});

  // The build reads the categories and tag labels from js/recipes.js (lib/taxonomy.js),
  // so tell the local server to rebuild when it changes.
  eleventyConfig.addWatchTarget('src/js/recipes.js');
  eleventyConfig.addWatchTarget('lib/');

  eleventyConfig.addCollection('recipes', recipes);
  eleventyConfig.addCollection('recipeCategories', api => recipeListings(recipes(api)).categories);
  eleventyConfig.addCollection('recipeTypes', api => recipeListings(recipes(api)).types);
  eleventyConfig.addCollection('recipeTags', api => recipeListings(recipes(api)).tags);

  // Keeps a range like "1–3" or "15–20" on one line: a word joiner (U+2060) either side of the dash
  // stops the browser breaking there. For the narrow boxes under a recipe's description (recipe.njk).
  eleventyConfig.addFilter('keepRanges', text => String(text).replace(/(\d)–(\d)/g, '$1⁠–⁠$2'));
}

export const config = {
  dir: {input: 'src', output: '_site'},
  templateFormats: ['njk', 'md'],
  // Recipe text is plain Markdown, not run through a template language first.
  markdownTemplateEngine: false
};
