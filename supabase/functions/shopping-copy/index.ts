// POST a display snapshot → {code}; GET ?code=… → snapshot. No account is needed.
// Possession of the random code grants read access to this immutable, detached copy only.
import { db } from '../_shared/db.ts';
import { serve, VisitorError } from '../_shared/http.ts';
import { checkCap } from '../_shared/limits.ts';
import { readShoppingCopy, shoppingCode } from '../_shared/shopping-copy.ts';

serve(['GET', 'POST'], async req => {
  if (req.method === 'POST') {
    const snapshot = await readShoppingCopy(req);
    await checkCap(req, 'share');
    const code = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))))
      .replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
    const { error } = await db.from('shopping_copies').insert({ code, snapshot });
    if (error) throw error;
    return { code };
  }
  const code = new URL(req.url).searchParams.get('code') ?? '';
  if (!shoppingCode.test(code)) throw new VisitorError(404, 'Listan finns inte. Be om en ny länk.');
  const { data, error } = await db.from('shopping_copies').select('snapshot').eq('code', code).maybeSingle();
  if (error) throw error;
  if (!data) throw new VisitorError(404, 'Listan finns inte. Be om en ny länk.');
  return data.snapshot;
});
