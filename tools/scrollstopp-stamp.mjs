// Draws the stamp on the Scrollstopp TikTok images (tools/scrollstopp-images.mjs): "oftabraefter.se"
// in Trio Grotesk Bold, --ink on a --lavender pill, sized for a 1080 × 1920 image. It writes
// design/scrollstopp-stamp.png, which is committed; the build only lays that PNG on the images.
//
// It is drawn once, here, because sharp sets text through fontconfig, which prints errors where it
// has no cache folder and finds fonts differently from machine to machine. Run it again after
// changing the text, font, size or colours, and look at the PNG before committing it:
//
//   node tools/scrollstopp-stamp.mjs 2>/dev/null
//
// Then rebuild: the images are made again when the stamp is newer than them.
import sharp from 'sharp';
import {fileURLToPath} from 'node:url';

const text = 'oftabraefter.se';
const font = fileURLToPath(new URL('../src/assets/fonts/TrioGrotesk-Bold.woff', import.meta.url));
const output = fileURLToPath(new URL('../design/scrollstopp-stamp.png', import.meta.url));
// The site's --ink and --lavender (src/css/styles.css).
const ink = '#151515';
const lavender = '#b7a1e6';
const size = 40;
const padding = {x: 20, y: 12};

const label = await sharp({
  text: {text: `<span foreground="${ink}">${text}</span>`, font: `Trio Grotesk Bold ${size}`, fontfile: font, rgba: true, dpi: 72}
}).png().toBuffer();
const {width, height} = await sharp(label).metadata();
const pill = {width: width + 2 * padding.x, height: height + 2 * padding.y};
const ground = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${pill.width}" height="${pill.height}"><rect width="${pill.width}" height="${pill.height}" rx="${pill.height / 2}" fill="${lavender}"/></svg>`);

await sharp(ground).composite([{input: label, left: padding.x, top: padding.y}]).png().toFile(output);
console.log(`Stamp: ${pill.width} × ${pill.height} px, saved in design/scrollstopp-stamp.png.`);
