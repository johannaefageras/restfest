// Daily caps on the paid API calls. Each visitor gets a few a day, and everyone together a fixed number,
// so an open page can't run up the Anthropic and OpenAI bills. The numbers can be changed with secrets
// (DETECT_PER_VISITOR, DETECT_PER_DAY, RECIPE_PER_VISITOR, RECIPE_PER_DAY) without deploying again.
// A new recipe also gets one photo, so RECIPE_PER_DAY caps the photos too.
import {db} from './db.ts';
import {envNumber, VisitorError} from './http.ts';

const caps = {
  detect: {
    perVisitor: () => envNumber('DETECT_PER_VISITOR', 15),
    perDay: () => envNumber('DETECT_PER_DAY', 150),
    message: 'Kylfotot har använts många gånger i dag. Skriv in råvarorna, eller prova igen i morgon.'
  },
  recipe: {
    perVisitor: () => envNumber('RECIPE_PER_VISITOR', 5),
    perDay: () => envNumber('RECIPE_PER_DAY', 40),
    message: 'Dagens nya recept är slut. Prova igen i morgon, eller hitta en middag i receptarkivet.'
  }
};

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// The visitor, as a hash of their address and today's date: enough to count today's requests, and
// nothing that can be traced back afterwards. RATE_LIMIT_SALT (any long random text) makes the hash
// impossible to reverse by trying every address.
function visitor(req: Request): Promise<string> {
  const address = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
  const day = new Date().toISOString().slice(0, 10);
  return sha256(`${Deno.env.get('RATE_LIMIT_SALT') ?? ''}|${day}|${address}`);
}

// Counts the request, or stops it with a 429 when today's cap is reached.
export async function checkCap(req: Request, kind: keyof typeof caps): Promise<void> {
  const cap = caps[kind];
  const {data, error} = await db.rpc('ai_allow', {
    p_kind: kind,
    p_ip_hash: await visitor(req),
    p_per_ip: cap.perVisitor(),
    p_per_day: cap.perDay()
  });
  if (error) throw error;
  if (data !== true) throw new VisitorError(429, cap.message);
}
