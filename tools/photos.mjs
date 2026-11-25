// WebP copies of the recipe photos for the website, in .cache/recipe-photos/ (ignored by Git).
// eleventy.config.js copies them to _site/assets/recipes/ next to the originals: 29-shakshuka.png
// gets 29-shakshuka-600.webp, -1200.webp and -1600.webp. The templates and the browser scripts
// build those addresses from the PNG's name (the `webp` filters in eleventy.config.js and
// webpUrl() in src/js/app.js), so keep the widths in all three places the same.
//
// Photos whose copies are newer than the original are skipped, so only new or changed photos take
// time. Every build runs this first, also while the local server is running (`eleventy.before` in
// eleventy.config.js); `npm run photos` runs it by itself.
import Image from '@11ty/eleventy-img';
import {readdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// The narrowest originals are about 1670 px wide, and eleventy-img doesn't enlarge a photo, so a
// wider copy would be missing for them.
const widths = [600, 1200, 1600];

export async function makePhotos({input = 'src/assets/recipes', output = '.cache/recipe-photos'} = {}) {
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
      // The copies keep their names when a photo is replaced, and with its cache eleventy-img leaves
      // a file that already exists as it is.
      useCache: false,
      filenameFormat: (id, src, width, format) => `${name}-${width}.${format}`
    });
    made++;
  }));
  return {made, upToDate: files.length - made};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const {made, upToDate} = await makePhotos();
  console.log(`Recipe photos: ${made} made, ${upToDate} already up to date.`);
}
