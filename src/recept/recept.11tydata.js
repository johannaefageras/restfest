// Settings for every recipe in this folder. Each recipe is one Markdown file: src/recept/<id>.md
// becomes recept/<id>.html. The id is the file name, a number and a name, e.g. 01-rodbetspytt.
// Don't rename existing files: saved recipes and shopping lists in visitors' browsers use the id.
// The format is described in HANDOFF.md under "Recipes".

import {types} from 'node:util';
import {recipePage} from '../../lib/recipes.js';

export default {
  layout: 'recipe.njk',
  base: '../',
  titleSuffix: ' · Restfest',
  eleventyComputed: {
    permalink: data => `recept/${data.page.fileSlug}.html`,
    // Everything the page, its card and the recipe index need (lib/recipes.js).
    // Eleventy first calls computed values with stand-in data to see what they read; skip that call.
    recipe: data => types.isProxy(data) ? undefined : recipePage(data)
  }
};
