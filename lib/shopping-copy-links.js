import { validateShoppingCopy, encodeShoppingCopy, decodeShoppingCopy } from './shopping-copy.js';

const codePattern = /^[A-Za-z0-9_-]{22}$/;
const connectionError = 'Listan kunde inte hämtas. Kontrollera din anslutning och öppna länken igen.';

async function request(api, { fetcher, code, copy }) {
  const url = new URL('shopping-copy', api.replace(/\/?$/, '/'));
  if (code) url.searchParams.set('code', code);
  let response;
  try {
    response = await fetcher(url.href, {
      method: copy ? 'POST' : 'GET',
      ...(copy ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(copy) } : {}),
      cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new Error(copy
      ? 'Länken kunde inte skapas. Kontrollera din anslutning och försök igen.' : connectionError);
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (!copy && response.status === 404) throw new Error('Listan finns inte. Be avsändaren om en ny länk.');
    throw new Error(data?.error || (copy ? 'Länken kunde inte skapas. Försök igen om en stund.' : connectionError));
  }
  return data;
}

export async function createShoppingCopyLink(copy, { base, api, fetcher = fetch }) {
  copy = validateShoppingCopy(copy);
  // Builds with no backend can still share self-contained copies, just like before.
  if (!api) {
    const url = new URL('delad-inkopslista.html', base);
    url.hash = await encodeShoppingCopy(copy);
    return url.href;
  }
  const data = await request(api, { fetcher, copy });
  if (typeof data?.code !== 'string' || !codePattern.test(data.code)) throw new Error('Länken kunde inte skapas. Försök igen.');
  const url = new URL('lista/', base);
  url.hash = data.code;
  return url.href;
}

export async function loadShoppingCopy(fragment, { api, storage, fetcher = fetch } = {}) {
  // Existing long links continue to work without any server request.
  if (/^(?:g1|j1)\./.test(fragment)) return decodeShoppingCopy(fragment);
  if (!codePattern.test(fragment)) throw new Error('Länken är ofullständig eller felaktig. Be om en ny kopia av listan.');
  const cacheKey = `ofta-shopping-link:${fragment}`;
  try {
    const cached = storage?.getItem(cacheKey);
    if (cached) return validateShoppingCopy(JSON.parse(cached));
  } catch { /* An unreadable cache must not stop an online visit. */ }
  if (!api) throw new Error('Listan kan inte hämtas just nu. Öppna länken igen när sidan är ansluten.');
  const copy = validateShoppingCopy(await request(api, { fetcher, code: fragment }));
  // Keep a visited immutable copy available offline, separately from recipient checkmarks.
  try { storage?.setItem(cacheKey, JSON.stringify(copy)); } catch { /* The current visit still works. */ }
  return copy;
}
