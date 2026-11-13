// Runs generate-recipe and delete-account with Claude, Supabase Auth and the database replaced by an
// in-memory fetch, and checks what they answer and what they store: no sign-in, a valid one with and
// without preferences, an invalid one, an unsuitable fridge list, a failing book insert, the day's cap,
// CORS, and deleting an account. Deno.serve is replaced too, which hands us each function's handler.
//
//   DENO_NO_PACKAGE_JSON=1 npx -y deno run -A tools/standin/check-functions.ts
//
// Run it after changing those functions or supabase/functions/_shared/. Nothing real is called.
const root = Deno.args[0] ?? new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
Deno.env.set('SUPABASE_URL', 'http://standin.local');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'secret');
Deno.env.set('ANTHROPIC_API_KEY', 'x');

const handlers: Array<(req: Request) => Promise<Response>> = [];
// deno-lint-ignore no-explicit-any
(Deno as any).serve = (handler: (req: Request) => Promise<Response>) => { handlers.push(handler); return {}; };

const state = {
  draft: {} as Record<string, unknown>,
  profile: null as Record<string, unknown> | null,
  claudePrompts: [] as string[],
  savedInserts: [] as unknown[],
  recipeInserts: 0,
  deleted: [] as string[],
  failSaved: false,
  claudeCalls: 0,
  capReached: false,
  signInChecks: 0,
  profileReads: 0
};
const goodDraft = {
  title: 'Potatisgratäng', shortName: 'Gratäng', description: 'En gratäng.', categories: ['main'], tags: ['Vegetarian'],
  time: 40, timeLabel: '40 min', prepTime: '10 min', cookTime: '30 min', servings: '2', level: 'Nybörjare',
  beforeYouStart: '', pantryKeys: ['potatis'],
  ingredientGroups: [{title: '', items: [{name: '800 g potatis', key: 'potatis', basic: false}]}],
  steps: ['Skiva potatisen.'], tip: {title: '', text: ''}, extraSections: [], imagePrompt: 'A gratin.', unsuitable: false
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json'}});

globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const req = new Request(input, init);
  const url = new URL(req.url);
  if (url.hostname === 'api.anthropic.com') {
    const body = await req.json();
    state.claudeCalls++;
    state.claudePrompts.push(body.messages[0].content[0].text);
    return json({stop_reason: 'end_turn', content: [{type: 'text', text: JSON.stringify(state.draft)}]});
  }
  if (url.pathname === '/auth/v1/user') {
    state.signInChecks++;
    return req.headers.get('authorization') === 'Bearer good-token'
      ? json({id: '11111111-1111-4111-8111-111111111111', aud: 'authenticated', email: 'a@example.se'})
      : json({code: 403, error_code: 'bad_jwt', msg: 'invalid JWT'}, 403);
  }
  // supabase-js looks the user up before deleting.
  if (url.pathname.startsWith('/auth/v1/admin/users/') && req.method === 'GET') {
    return json({id: url.pathname.split('/').pop(), aud: 'authenticated', email: 'a@example.se'});
  }
  if (url.pathname.startsWith('/auth/v1/admin/users/') && req.method === 'DELETE') {
    state.deleted.push(url.pathname.split('/').pop()!);
    return json({});
  }
  if (url.pathname === '/rest/v1/rpc/ai_allow') return json(!state.capReached);
  if (url.pathname === '/rest/v1/profiles') state.profileReads++;
  if (url.pathname === '/rest/v1/profiles') return state.profile ? json(state.profile) : json({code: 'PGRST116', message: 'no rows'}, 406);
  if (url.pathname === '/rest/v1/generated_recipes') { state.recipeInserts++; return json({id: '22222222-2222-4222-8222-222222222222'}, 201); }
  if (url.pathname === '/rest/v1/saved_generated_recipes') {
    if (state.failSaved) return json({message: 'boom'}, 500);
    state.savedInserts.push(await req.json());
    return new Response(null, {status: 201});
  }
  throw new Error(`Unexpected request: ${req.method} ${req.url}`);
};

await import(`file://${root}/supabase/functions/generate-recipe/index.ts`);
await import(`file://${root}/supabase/functions/delete-account/index.ts`);
const [generate, remove] = handlers;

let failures = 0;
function check(name: string, ok: boolean, detail?: unknown) {
  if (!ok) failures++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${ok || detail === undefined ? '' : ` — ${JSON.stringify(detail)}`}`);
}
function reset() {
  Object.assign(state, {draft: goodDraft, profile: null, claudePrompts: [], savedInserts: [], recipeInserts: 0, deleted: [], failSaved: false, claudeCalls: 0, capReached: false, signInChecks: 0, profileReads: 0});
}
const items = {items: [{name: 'potatis', key: 'potatis'}, {name: 'kyckling', key: 'kyckling'}]};
async function call(handler: (req: Request) => Promise<Response>, {token, body = items, method = 'POST'}: {token?: string; body?: unknown; method?: string} = {}) {
  const headers: Record<string, string> = {'content-type': 'application/json', origin: 'http://localhost:8765'};
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await handler(new Request('http://fn.local/', {method, headers, body: method === 'POST' ? JSON.stringify(body) : undefined}));
  return {status: response.status, headers: response.headers, body: response.status === 204 ? null : await response.json()};
}

reset();
let r = await call(generate);
check('no sign-in: 200 with a recipe', r.status === 200 && r.body.recipe?.title === 'Potatisgratäng', r);
check('no sign-in: saved is false', r.body.saved === false, r.body.saved);
check('no sign-in: prompt has no preferences', !state.claudePrompts[0]?.includes('preferenserna'), state.claudePrompts[0]);
check('no sign-in: nothing added to a book', state.savedInserts.length === 0);

reset();
state.profile = {diets: ['Vegetarian'], avoid: ['koriander'], servings: 2};
r = await call(generate, {token: 'good-token'});
check('signed in: saved is true', r.status === 200 && r.body.saved === true, r);
check('signed in: prompt has the diet line', state.claudePrompts[0]?.includes('- Kost: vegetariskt.'), state.claudePrompts[0]);
check('signed in: prompt has the foods and portions', state.claudePrompts[0]?.includes('"koriander"') && state.claudePrompts[0]?.includes('- Portioner: 2.'));
check('signed in: recipe added to the caller\'s book', JSON.stringify(state.savedInserts) === JSON.stringify([{user_id: '11111111-1111-4111-8111-111111111111', recipe_id: '22222222-2222-4222-8222-222222222222'}]), state.savedInserts);

reset();
r = await call(generate, {token: 'good-token'});
check('signed in without a profile row: recipe written without preferences, still saved', r.status === 200 && r.body.saved === true && !state.claudePrompts[0]?.includes('preferenserna'), r);

reset();
state.profile = {diets: ['Vegan'], avoid: [], servings: null};
r = await call(generate, {token: 'expired-token'});
check('invalid token: handled as signed out', r.status === 200 && r.body.saved === false && !state.claudePrompts[0]?.includes('preferenserna') && state.savedInserts.length === 0, r);

reset();
state.profile = {diets: ['Vegan'], avoid: [], servings: null};
state.draft = {...goodDraft, title: '', description: '', unsuitable: true};
r = await call(generate, {token: 'good-token'});
check('unsuitable: 422 with the preferences text', r.status === 422 && r.body.error === 'Det som finns i kyllistan passar inte dina preferenser. Lägg till fler råvaror, eller ändra preferenserna på din profil.', r);
check('unsuitable: one Claude call, nothing stored', state.claudeCalls === 1 && state.recipeInserts === 0, {calls: state.claudeCalls, inserts: state.recipeInserts});

// The flag only means something when preferences were sent. Without them it is ignored.
reset();
state.draft = {...goodDraft, unsuitable: true};
r = await call(generate);
check('unsuitable without preferences: ignored, the recipe is returned', r.status === 200 && r.body.recipe?.title === 'Potatisgratäng', r);
reset();
state.draft = {...goodDraft, unsuitable: true};
r = await call(generate, {token: 'good-token'});
check('unsuitable for a signed-in visitor without preferences: ignored too', r.status === 200 && r.body.saved === true, r);

reset();
state.failSaved = true;
r = await call(generate, {token: 'good-token'});
check('book insert fails: the recipe is still returned, saved false', r.status === 200 && r.body.saved === false && Boolean(r.body.id), r);

// Once the day's recipes are used up, nothing more is looked up or paid for.
reset();
state.capReached = true;
state.profile = {diets: ['Vegan'], avoid: [], servings: null};
r = await call(generate, {token: 'good-token'});
check('cap reached: 429 with the cap text', r.status === 429 && r.body.error === 'Dagens nya recept är slut. Prova igen i morgon, eller hitta en middag i receptarkivet.', r);
check('cap reached: no sign-in check, no profile read, no Claude call', state.signInChecks === 0 && state.profileReads === 0 && state.claudeCalls === 0,
  {signInChecks: state.signInChecks, profileReads: state.profileReads, claudeCalls: state.claudeCalls});

r = await call(generate, {method: 'OPTIONS'});
check('preflight allows the authorization header', r.status === 204 && /authorization/i.test(r.headers.get('access-control-allow-headers') ?? ''), r.headers.get('access-control-allow-headers'));

reset();
r = await call(remove, {body: {}});
check('delete-account without sign-in: 401', r.status === 401 && r.body.error === 'Du behöver vara inloggad.' && state.deleted.length === 0, r);
r = await call(remove, {token: 'expired-token', body: {}});
check('delete-account with an invalid token: 401', r.status === 401 && state.deleted.length === 0, r);
r = await call(remove, {token: 'good-token', body: {}});
check('delete-account signed in: deletes that user', r.status === 200 && r.body.deleted === true && state.deleted.join() === '11111111-1111-4111-8111-111111111111', {r, deleted: state.deleted});

console.log(failures ? `${failures} failed` : 'all passed');
Deno.exit(failures ? 1 : 0);
