// The Scrollstopp TikTok images (lib/scrollstopp.js), made from the originals in
// src/assets/scrollstopp/ into .cache/scrollstopp/ (ignored by Git). eleventy.config.js copies them to
// _site/assets/scrollstopp/ next to the originals. 340-cookiepizza.png gets:
//
//   340-cookiepizza.jpg         1080 × 1920 with the stamp: the file a visitor saves and posts
//   340-cookiepizza-540.webp    the same, 540 px wide: shown on the recipe's page
//   340-cookiepizza-card.webp   600 px wide without the stamp: the card on scrollstopp.html
//
// An original that isn't exactly 9:16 is cropped in the middle first (tiktokCrop), and every original
// is then scaled to TikTok's 1080 × 1920. That adds no detail, but TikTok gets its own format and
// crops nothing itself. The stamp, "oftabraefter.se", is design/scrollstopp-stamp.png
// (tools/scrollstopp-stamp.mjs), centred 210 px from the top: below TikTok's tabs, away from its
// buttons on the right and the caption at the bottom.
//
// Images whose files are newer than their original, the stamp and this script are skipped, so a new
// stamp, or a change here such as the stamp's place, makes them all again. Every build runs this first, beside tools/photos.mjs (`eleventy.before` in
// eleventy.config.js); `node tools/scrollstopp-images.mjs` runs it by itself.
import sharp from 'sharp';
import {mkdir, readdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {scrollstoppFiles, tiktokCrop} from '../lib/scrollstopp.js';

const size = {width: 1080, height: 1920};
const stampTop = 210;
const shownWidth = 540;
const cardWidth = 600;

// The three files made from the original `id`, as {save, shown, card} paths in `output`.
function outputs(id, output) {
  const {original, ...made} = scrollstoppFiles(id);
  return Object.fromEntries(Object.entries(made).map(([key, file]) => [key, path.join(output, path.basename(file))]));
}

async function upToDate(files, since) {
  try {
    const made = await Promise.all(files.map(file => stat(file)));
    return made.every(file => file.mtimeMs >= since);
  } catch {
    return false;
  }
}

export async function makeScrollstoppImages({
  input = 'src/assets/scrollstopp',
  output = '.cache/scrollstopp',
  stamp = 'design/scrollstopp-stamp.png'
} = {}) {
  const files = (await readdir(input)).filter(file => file.endsWith('.png'));
  const {width: stampWidth} = await sharp(stamp).metadata();
  const stampAt = {left: Math.round((size.width - stampWidth) / 2), top: stampTop};
  const changed = Math.max((await stat(stamp)).mtimeMs, (await stat(fileURLToPath(import.meta.url))).mtimeMs);
  await mkdir(output, {recursive: true});
  let made = 0;
  await Promise.all(files.map(async file => {
    const source = path.join(input, file);
    const {save, shown, card} = outputs(path.parse(file).name, output);
    const since = Math.max((await stat(source)).mtimeMs, changed);
    if (await upToDate([save, shown, card], since)) return;

    const {width, height} = await sharp(source).metadata();
    // Lossless in between, so each file is compressed only once.
    const base = await sharp(source).extract(tiktokCrop(width, height)).resize(size.width, size.height).png().toBuffer();
    const withStamp = await sharp(base).composite([{input: stamp, ...stampAt}]).png().toBuffer();
    await Promise.all([
      sharp(withStamp).jpeg({quality: 90, mozjpeg: true}).toFile(save),
      sharp(withStamp).resize(shownWidth).webp().toFile(shown),
      sharp(base).resize(cardWidth).webp().toFile(card)
    ]);
    made++;
  }));
  return {made, upToDate: files.length - made};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const {made, upToDate} = await makeScrollstoppImages();
  console.log(`Scrollstopp images: ${made} made, ${upToDate} already up to date.`);
}
