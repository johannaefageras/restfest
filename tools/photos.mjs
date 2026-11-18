// WebP copies of the recipe photos for the website, in .cache/recipe-photos/ (ignored by Git).
// eleventy.config.js copies them to _site/assets/recipes/ next to the originals: 29-shakshuka.png
// gets 29-shakshuka-600.webp, -1200.webp and -1600.webp. The templates and the browser scripts
// build those addresses from the PNG's name (the `webp` filters in eleventy.config.js and
// webpUrl() in src/js/app.js), so keep the widths in all three places the same.
//
// Photos whose copies are newer than the original are skipped, so only new or changed photos take
// time. npm runs this before `npm run build` and `npm start`; run `npm run photos` by itself after
// adding a photo while the local server is running.
import Image from '@11ty/eleventy-img';
import {readdir, stat} from 'node:fs/promises';
import path from 'node:path';

const input = 'src/assets/recipes';
const output = '.cache/recipe-photos';
// The narrowest originals are about 1670 px wide, and eleventy-img doesn't enlarge a photo, so a
// wider copy would be missing for them.
const widths = [600, 1200, 1600];

async function upToDate(source, name) {
  const {mtimeMs} = await stat(source);
  try {
    const copies = await Promise.all(widths.map(width => stat(path.join(output, `${name}-${width}.webp`))));
    return copies.every(copy => copy.mtimeMs >= mtimeMs);
  } catch {
    return false;
  }
}

const files = (await readdir(input)).filter(file => file.endsWith('.png'));
let made = 0;
await Promise.all(files.map(async file => {
  const source = path.join(input, file);
  const name = path.parse(file).name;
  if (await upToDate(source, name)) return;
  await Image(source, {
    widths,
    formats: ['webp'],
    outputDir: output,
    filenameFormat: (id, src, width, format) => `${name}-${width}.${format}`
  });
  made++;
}));
console.log(`Recipe photos: ${made} made, ${files.length - made} already up to date.`);
