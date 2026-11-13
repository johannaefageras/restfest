// Responses, CORS and error handling shared by the Edge Functions.

// The site's address, so other sites can't call the functions from their pages, e.g.
// ALLOWED_ORIGINS=https://oftabraefter.se,http://localhost:8080. Leave it unset to allow any origin.
const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? '*')
  .split(',').map(origin => origin.trim()).filter(Boolean);

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  const allow = allowedOrigins.includes('*') ? '*' : allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    // authorization carries a signed-in visitor's access token (auth.ts); supabase-js adds the other two.
    'Access-Control-Allow-Headers': 'content-type, authorization, apikey, x-client-info',
    'Vary': 'Origin'
  };
}

// A problem to tell the visitor about, in Swedish, with an HTTP status. Anything else is logged and
// answered with a general message.
export class VisitorError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export type Handler = (req: Request) => Promise<unknown>;

// Wraps a handler: answers CORS preflights, turns its return value into JSON and its errors into
// { error } with a status. The visitor-facing texts are Swedish, like the site.
export function serve(methods: string[], handler: Handler) {
  Deno.serve(async req => {
    const cors = corsHeaders(req);
    const respond = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
      status,
      headers: {...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'}
    });
    if (req.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors});
    if (!methods.includes(req.method)) return respond({error: 'Fel sorts anrop.'}, 405);
    try {
      return respond(await handler(req));
    } catch (error) {
      if (error instanceof VisitorError) return respond({error: error.message}, error.status);
      console.error(error);
      return respond({error: 'Något gick fel hos oss. Prova igen om en stund.'}, 500);
    }
  });
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new VisitorError(400, 'Anropet saknar innehåll.');
  return body as Record<string, unknown>;
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function recipeId(value: unknown): string {
  if (typeof value !== 'string' || !uuid.test(value)) throw new VisitorError(404, 'Receptet finns inte.');
  return value.toLowerCase();
}

export function env(name: string, fallback?: string): string {
  const value = Deno.env.get(name) ?? fallback;
  if (value == null || value === '') throw new Error(`The secret ${name} is not set. See HANDOFF.md, "Kylfoto och nya recept".`);
  return value;
}

export function envNumber(name: string, fallback: number): number {
  const value = Number(Deno.env.get(name));
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}
