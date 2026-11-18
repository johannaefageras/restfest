import { VisitorError } from './http.ts';

const maxBytes = 128000;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const shoppingCode = /^[A-Za-z0-9_-]{22}$/;

// Match the v1 display format in lib/shopping-copy.js. Whitelist every saved field so even
// a caller bypassing the browser cannot publish account ids, source records or recipe labels.
export function shoppingCopy(value: unknown) {
  const invalid = () => { throw new VisitorError(400, 'Listan är ofullständig eller felaktig. Försök dela den igen.'); };
  if (!value || typeof value !== 'object') return invalid();
  const copy = value as Record<string, unknown>;
  if (copy.v !== 1 || typeof copy.id !== 'string' || !uuid.test(copy.id)
    || typeof copy.t !== 'string' || !copy.t.trim() || copy.t.length > 80
    || !Array.isArray(copy.i) || !copy.i.length || copy.i.length > 500) return invalid();
  const rows = copy.i.map((row: unknown) => {
    if (!Array.isArray(row) || row.length !== 3 || row.some(v => typeof v !== 'string')
      || !row[0].trim() || row[0].length > 4000 || row[1].length > 500 || row[2].length > 4000) return invalid();
    return [row[0], row[1], ''];
  });
  return { v: 1, id: copy.id, t: copy.t.trim(), i: rows };
}

export async function readShoppingCopy(req: Request) {
  // Check the actual streamed body, including callers without a Content-Length header.
  const reader = req.body?.getReader();
  if (!reader) throw new VisitorError(400, 'Anropet saknar en lista.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBytes) {
        await reader.cancel();
        throw new VisitorError(413, 'Listan är för stor. Dela en mindre lista.');
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  let value;
  try { value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new VisitorError(400, 'Anropet saknar en giltig lista.'); }
  return shoppingCopy(value);
}
