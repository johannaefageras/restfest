// Settings for every guide in this folder: tips, facts and collectible cards that end in recipes
// from the archive. Each guide is one Markdown file: src/guider/<namn>.md becomes guider/<namn>.html,
// drawn by _includes/layouts/guide.njk.
//
// A guide's front matter:
//   heading, intro      the page title (h1) and the line under it; `title` and `description` are for
//                       the browser tab and sharing, as on other pages
//   imageDir, lineup    the folder of the card pictures, e.g. assets/icons/pasta/, and the three that
//                       stand beside the title
//   sections            the cards in groups: {id, title, icon, intro, items}. Each item is a card:
//                       slug (also the picture's file name and the card's #anchor), name, meaning,
//                       region, text and fact (the last three optional), and recipes: recipe ids
//                       (file names in src/recept/) picked by hand
//   foodKeys            the ingredient keys (src/_data/foods.json) whose recipes end the page
//   recipesHeading      the heading above those recipes
// The Markdown body is the text between the cards and the recipes. It is plain Markdown, so links
// to recipes are written relative to the guide: ../recept/<id>.html.
// test/guides.test.js checks that every picture, recipe id and food key exists.

import {types} from 'node:util';

export default {
  layout: 'layouts/guide.njk',
  base: '../',
  // The back link above the title, also the middle step of the breadcrumb (lib/metadata.js).
  back: {path: 'receptarkiv.html', label: 'Till receptarkivet'},
  eleventyComputed: {
    permalink: data => `guider/${data.page.fileSlug}.html`,
    // The sections with every card numbered across them, 01, 02 … for the corner of the card.
    // Eleventy first calls computed values with stand-in data to see what they read; skip that call.
    cards: data => {
      if (types.isProxy(data)) return undefined;
      let number = 0;
      return (data.sections ?? []).map(section => ({
        ...section,
        items: section.items.map(item => ({...item, number: String(++number).padStart(2, '0')}))
      }));
    }
  }
};
