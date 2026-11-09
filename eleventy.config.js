// Eleventy builds the site from src/ into _site/.
//
//   npm run build   build the site into _site/ (that folder is what gets uploaded)
//   npm start       local server at http://localhost:8080 that rebuilds and reloads on every change
//
// Pages are Nunjucks templates (*.njk) that share the layout in src/_includes/base.njk.
// Recipes are Markdown files, one per recipe, in src/recept/. src/recept/recept.11tydata.js gives them
// their layout (src/_includes/recipe.njk) and address, and lib/recipes.js works out the rest.
//
// Collections:
//   recipes            every recipe, in id order (01-…, 02-…, 135-…)
//   recipeCategories   the food categories, for kategori/<slug>.html (src/kategori.njk)
//   recipeTypes        Mat, Hemmaspa, Hushåll & städ and Husdjur, for typ/<slug>.html (src/typ.njk)
//   recipeTags         every tag, for tagg/<slug>.html (src/tagg.njk)
// Eleventy also makes a collection per tag from the recipes' `tags`, e.g. collections.Vegan.

import {recipeListings} from './lib/recipes.js';

const recipes = api => api.getFilteredByGlob('src/recept/*.md')
  .sort((a, b) => parseInt(a.fileSlug, 10) - parseInt(b.fileSlug, 10));

export default function (eleventyConfig) {
  // Copied to _site/ as they are.
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/*.css');
  eleventyConfig.addPassthroughCopy('src/app.js');
  eleventyConfig.addPassthroughCopy('src/kitchen.js');
  eleventyConfig.addPassthroughCopy('src/recipes.js');

  // The build reads the categories and tag labels from recipes.js (lib/taxonomy.js),
  // so tell the local server to rebuild when it changes.
  eleventyConfig.addWatchTarget('src/recipes.js');
  eleventyConfig.addWatchTarget('lib/');

  eleventyConfig.addCollection('recipes', recipes);
  eleventyConfig.addCollection('recipeCategories', api => recipeListings(recipes(api)).categories);
  eleventyConfig.addCollection('recipeTypes', api => recipeListings(recipes(api)).types);
  eleventyConfig.addCollection('recipeTags', api => recipeListings(recipes(api)).tags);
}

export const config = {
  dir: {input: 'src', output: '_site'},
  templateFormats: ['njk', 'md'],
  // Recipe text is plain Markdown, not run through a template language first.
  markdownTemplateEngine: false
};
