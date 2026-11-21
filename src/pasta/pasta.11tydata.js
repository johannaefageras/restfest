// Settings for every pasta sort in this folder. Each sort is one Markdown file: src/pasta/<slug>.md
// becomes pasta/<slug>.html, drawn by _includes/layouts/pasta.njk, with its wide cover from
// assets/covers/pasta/<slug>.svg; its card on pastasorter.html has the square drawing from
// assets/icons/pasta/<slug>.svg. pastasorter.html lists them all and opens a sort in a dialog that
// shows this page's article (src/js/pasta.js). _mall.md is the template for a new sort, explaining
// the fields; the build skips it. lib/pasta.js has the allowed values, and test/pasta.test.js checks
// every file against them.

import {freshPastaRecipe} from '../../lib/pasta.js';

export default {
  layout: 'layouts/pasta.njk',
  base: '../',
  // The back link above the sort, also the middle step of the breadcrumb (lib/metadata.js).
  back: {path: 'pastasorter.html', label: 'Till pastasorterna'},
  // The recipe a fresh sort (deg: färsk or båda) links to under "Går att göra hemma": a file name in
  // src/recept/ without .md (lib/pasta.js). A sort whose dough is not egg pasta sets `grundrecept: ""`
  // in its front matter and gets no link.
  grundrecept: freshPastaRecipe,
  eleventyComputed: {
    permalink: data => `pasta/${data.page.fileSlug}.html`,
    // For the browser tab, search and sharing.
    title: data => data.namn,
    description: data => data.intro
  }
};
