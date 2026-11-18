// The real shopping-copy Edge Function against an in-memory database, without live credentials.
// DENO_NO_PACKAGE_JSON=1 npx deno test -A tools/standin/check-shopping-copies.ts
import assert from 'node:assert/strict';

Deno.env.set('SUPABASE_URL', 'http://standin.local');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'test-only');
Deno.env.delete('SUPABASE_SECRET_KEYS');
let handler: (req: Request) => Promise<Response>;
// deno-lint-ignore no-explicit-any
(Deno as any).serve = (fn: typeof handler) => { handler = fn; return {}; };
const rows = new Map<string, unknown>();
const reads: string[] = [];
let capped = false;
let capCalls = 0;
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } });
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const req = new Request(input, init);
  const url = new URL(req.url);
  assert.equal(url.origin, 'http://standin.local');
  if (url.pathname === '/rest/v1/rpc/ai_allow') {
    const args = await req.json();
    assert.equal(args.p_kind, 'share');
    assert.match(args.p_ip_hash, /^[0-9a-f]{64}$/);
    capCalls++;
    return json(!capped);
  }
  assert.equal(url.pathname, '/rest/v1/shopping_copies');
  if (req.method === 'POST') {
    const row = await req.json();
    assert.deepEqual(Object.keys(row).sort(), ['code', 'snapshot']);
    assert.match(row.code, /^[A-Za-z0-9_-]{22}$/);
    rows.set(row.code, row.snapshot);
    return new Response(null, { status: 201 });
  }
  assert.equal(req.method, 'GET');
  assert.equal(url.searchParams.get('select'), 'snapshot');
  const code = url.searchParams.get('code')?.replace(/^eq\./, '') ?? '';
  assert.match(code, /^[A-Za-z0-9_-]{22}$/, 'every read must select exactly one random code');
  reads.push(code);
  return json(rows.has(code) ? [{ snapshot: rows.get(code) }] : []);
};
await import('../../supabase/functions/shopping-copy/index.ts');
const copy = { v: 1, id: crypto.randomUUID(), t: '  Till helgen  ', i: [['2 l mjölk 🥛', 'Laktosfri', 'Hemligt recept']] };
const post = (value: unknown) => handler(new Request('http://edge.test/shopping-copy', {
  method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '192.0.2.1' }, body: JSON.stringify(value),
}));

Deno.test('public creation stores only validated display data and public reads require the full random code', async () => {
  const first = await post({ ...copy, user_id: 'private-user', source: 'private-source' });
  assert.equal(first.status, 200);
  assert.equal(first.headers.get('cache-control'), 'no-store');
  const { code } = await first.json();
  const result = await handler(new Request(`http://edge.test/shopping-copy?code=${code}`));
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ...copy, t: 'Till helgen', i: [['2 l mjölk 🥛', 'Laktosfri', '']] });
  const second = await post(copy);
  assert.notEqual((await second.json()).code, code, 'each copy gets a fresh random capability');
});

Deno.test('invalid snapshots and oversized streamed bodies never reach storage or use a daily share', async () => {
  const before = { rows: rows.size, caps: capCalls };
  for (const invalid of [null, {}, { ...copy, v: 2 }, { ...copy, id: 'bad' }, { ...copy, i: [] },
    { ...copy, i: [['Mjölk', {}, '']] }, { ...copy, t: 'x'.repeat(81) },
    { ...copy, i: Array.from({ length: 501 }, () => ['Mjölk', '', '']) }]) {
    const response = await post(invalid);
    assert.equal(response.status, 400);
    await response.json();
  }
  const response = await post({ ...copy, i: Array.from({ length: 40 }, () => ['x'.repeat(4000), '', '']) });
  assert.equal(response.status, 413);
  await response.json();
  assert.deepEqual({ rows: rows.size, caps: capCalls }, before);
});

Deno.test('missing copies, unsupported methods and capped creation return recoverable errors', async () => {
  for (const code of ['', '../list', 'x'.repeat(22)]) {
    const response = await handler(new Request(`http://edge.test/shopping-copy?code=${encodeURIComponent(code)}`));
    assert.equal(response.status, 404);
    await response.json();
  }
  const before = rows.size;
  capped = true;
  try {
    const response = await post(copy);
    assert.equal(response.status, 429);
    assert.match((await response.json()).error, /i morgon/);
    assert.equal(rows.size, before);
  } finally { capped = false; }
  for (const method of ['PUT', 'DELETE']) {
    const response = await handler(new Request('http://edge.test/shopping-copy', { method }));
    assert.equal(response.status, 405);
    await response.json();
  }
  const options = await handler(new Request('http://edge.test/shopping-copy', { method: 'OPTIONS' }));
  assert.equal(options.status, 204);
  assert.ok(options.headers.get('access-control-allow-methods')?.includes('POST'));
  assert.ok(reads.length > 0);
});
