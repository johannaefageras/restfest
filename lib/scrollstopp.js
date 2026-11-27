// Scrollstopp (src/pages/scrollstopp.njk): baking, desserts and drinks for teenagers. Like the cakes
// (lib/cakes.js), they are ordinary archive recipes in src/recept/ that also have a block in their
// front matter:
//
//   scrollstopp:
//     nr: 3                     its number in Scrollstopp, 1, 2, 3 … without gaps
//     namn: "Kanelbullar på pinne"   a short name, for the previous and next links on a recipe's page
//
// Each one also has a portrait TikTok image, src/assets/scrollstopp/<id>.png, that a visitor can save
// and post when she tells people about what she baked. It is not in src/assets/recipes/: every PNG
// there gets 600, 1200 and 1600 px wide copies (tools/photos.mjs), and a portrait about 940 px wide
// would be missing the wider ones the pages link to. Instead tools/scrollstopp-images.mjs crops it to
// exactly 9:16, scales it to 1080 × 1920 and makes the files `scrollstoppFiles` names: the JPEG to
// save and a smaller WebP to show, both with "oftabraefter.se" on them, and an unstamped WebP for the
// cards.
//
// The build uses the helpers below (eleventy.config.js), and test/scrollstopp.test.js checks every
// Scrollstopp recipe against them.

// Every Scrollstopp recipe, by its number. `items` is collections.recipes.
export const sortScrollstopp = items =>
  items.filter(item => item.data.scrollstopp).sort((a, b) => a.data.scrollstopp.nr - b.data.scrollstopp.nr);

// The recipes before and after `id` by number, as {previous, next}, for the box at the end of its
// page; the first has no previous and the last no next. `items` is collections.scrollstopp.
export function scrollstoppNeighbours(items, id) {
  const index = items.findIndex(item => item.fileSlug === id);
  return index < 0 ? {} : {previous: items[index - 1], next: items[index + 1]};
}

// A recipe's TikTok files, as paths from the site root like a recipe's `image`: the original in
// src/assets/, and what the build makes from it in assets/scrollstopp/.
export function scrollstoppFiles(id) {
  const folder = 'assets/scrollstopp/';
  return {
    original: `${folder}${id}.png`,
    save: `${folder}${id}.jpg`,
    shown: `${folder}${id}-540.webp`,
    card: `${folder}${id}-card.webp`
  };
}

// The largest 9:16 box in the middle of a width × height image, as sharp's extract() takes it. An
// image that is too tall loses as much at the top as at the bottom, and one that is too wide as much
// on each side; nothing is squashed.
export function tiktokCrop(width, height) {
  if (width / height > 9 / 16) {
    const cropped = Math.round(height * 9 / 16);
    return {left: Math.floor((width - cropped) / 2), top: 0, width: cropped, height};
  }
  const cropped = Math.round(width * 16 / 9);
  return {left: 0, top: Math.floor((height - cropped) / 2), width, height: cropped};
}
