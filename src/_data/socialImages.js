// Landscape cards used for website link previews. Square and portrait versions are for posting
// directly to social platforms. All three folders are copied to the built site's assets/social/.
import fs from 'node:fs';

// Cards whose filenames differ from their public page address. Recipe IDs stay unchanged.
const aliases = {
  startsida: '/',
  'typ-hushall': '/typ/hushall-och-rengoring.html',
  'recept-rodbetspytt': '/recept/01-rodbetspytt.html',
  'recept-bolognese': '/recept/216-langkokt-bolognese.html'
};

export default function () {
  const directory = new URL('../assets/social/1200x630/', import.meta.url);
  const images = {};
  for (const file of fs.readdirSync(directory).sort()) {
    // Keep the alternative photo-only exports available without selecting them as preview cards.
    if (!file.endsWith('.png') || file.endsWith('-foto.png')) continue;
    const name = file.slice(0, -4);
    const page = aliases[name] ?? `/${name.replace(/^(kategori|typ|recept)-/, '$1/')}.html`;
    if (images[page]) throw new Error(`More than one social preview card maps to ${page}.`);
    images[page] = {
      path: `assets/social/1200x630/${file}`,
      width: 1200,
      height: 630,
      type: 'image/png'
    };
  }
  return images;
}
