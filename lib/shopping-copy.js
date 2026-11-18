import { groupShoppingItems } from './shopping-groups.js';

// Immutable, portable snapshots. Only display data travels in the fragment, never account ids,
// source ids, recipe names or purchase state. The server doesn't need to store a public copy of a private list.
const maxItems = 500;
const maxBytes = 128000;
const maxFragment = 16000;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });

function invalid() { throw new Error('Länken är ofullständig eller felaktig. Be om en ny kopia av listan.'); }
function tooLarge() { throw new Error('Listan är för stor för en delningslänk. Dela en mindre lista.'); }

export function validateShoppingCopy(copy) {
  if (!copy || copy.v !== 1 || typeof copy.id !== 'string' || !uuid.test(copy.id)
    || typeof copy.t !== 'string' || !copy.t.trim() || copy.t.length > 80
    || !Array.isArray(copy.i) || !copy.i.length || copy.i.length > maxItems) invalid();
  const rows = copy.i.map(row => {
    if (!Array.isArray(row) || row.length !== 3
      || row.some(value => typeof value !== 'string') || !row[0].trim()
      || row[0].length > 4000 || row[1].length > 500 || row[2].length > 4000) invalid();
    // Keep the v1 tuple readable, but discard its legacy recipe label, including in older links.
    return [row[0], row[1], ''];
  });
  return { v: 1, id: copy.id, t: copy.t.trim(), i: rows };
}

export function createShoppingCopy(items, title = 'Inköpslista') {
  const rows = groupShoppingItems(items.filter(item => !item.checked));
  if (!rows.length) throw new Error('Det finns inga varor kvar att dela.');
  if (rows.length > maxItems) tooLarge();
  return validateShoppingCopy({ v: 1, id: crypto.randomUUID(), t: title,
    i: rows.map(row => [row.text, row.note || '', '']) });
}

async function boundedBytes(stream, limit) {
  const reader = stream.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) { await reader.cancel(); tooLarge(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}

function base64(bytes) {
  return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''))
    .replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export async function encodeShoppingCopy(copy) {
  let bytes = encoder.encode(JSON.stringify(validateShoppingCopy(copy)));
  if (bytes.length > maxBytes) tooLarge();
  let format = 'j1';
  if (typeof CompressionStream === 'function' && typeof DecompressionStream === 'function') {
    const zipped = await boundedBytes(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip')), maxBytes);
    if (zipped.length < bytes.length) { bytes = zipped; format = 'g1'; }
  }
  const fragment = `${format}.${base64(bytes)}`;
  if (fragment.length > maxFragment) tooLarge();
  return fragment;
}

export async function decodeShoppingCopy(fragment) {
  if (fragment.length > maxFragment) tooLarge();
  const match = /^(g1|j1)\.([A-Za-z0-9_-]+)$/.exec(fragment);
  if (!match || match[2].length % 4 === 1) invalid();
  let bytes;
  try { bytes = Uint8Array.from(atob(match[2].replaceAll('-', '+').replaceAll('_', '/')), char => char.charCodeAt(0)); }
  catch { invalid(); }
  if (match[1] === 'g1') {
    if (typeof DecompressionStream !== 'function') throw new Error('Öppna länken i en nyare webbläsare för att se listan.');
    try { bytes = await boundedBytes(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')), maxBytes); }
    catch { invalid(); }
  }
  if (bytes.length > maxBytes) tooLarge();
  let copy;
  try { copy = JSON.parse(decoder.decode(bytes)); } catch { invalid(); }
  return validateShoppingCopy(copy);
}

export function shoppingCopyKey(copy) { return `ofta-shopping-copy:${copy.id}`; }

export function readCopyChecks(storage, copy) {
  try {
    const values = JSON.parse(storage.getItem(shoppingCopyKey(copy)));
    return new Set(Array.isArray(values) ? values.filter(index => Number.isInteger(index) && index >= 0 && index < copy.i.length) : []);
  } catch { return new Set(); }
}

export function writeCopyChecks(storage, copy, checked) {
  try { storage.setItem(shoppingCopyKey(copy), JSON.stringify([...checked])); return true; }
  catch { return false; }
}
