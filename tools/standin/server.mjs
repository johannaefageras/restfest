// A stand-in for the Supabase project, for trying the site's account features in a browser without
// touching the real one: Auth, the three account tables, my_generated_recipes and the Edge Functions,
// all in memory and nothing like complete: just what the site calls. HANDOFF.md, "Konton och receptbok".
//
//   node tools/standin/server.mjs [port]        (default 54399)
//   SUPABASE_URL=http://localhost:54399 SUPABASE_PUBLISHABLE_KEY=sb_publishable_test \
//     npx @11ty/eleventy --serve --port 8765 --output=<a folder outside the project>
//
// POST /__control changes what it holds and how it behaves (see control() below): reset, add users,
// seed a recipe book, make every call fail, or get a link like the ones in the mails.
// GET /__state shows what it holds, including every request it has received.
// "Fortsätt med Google" signs in google@example.se at once.
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

const port = Number(process.argv[2] ?? 54399);
const b64 = value => Buffer.from(JSON.stringify(value)).toString('base64url');
let state;
function reset() {
  state = {
    users: new Map(),        // email → {id, email, password, confirmed, data, providers}
    tokens: new Map(),       // access token → email
    profiles: new Map(),     // user id → {display_name, diets, avoid, servings}
    saved: [],               // {user_id, recipe_id, created_at}
    savedGenerated: [],      // {user_id, recipe_id, created_at}
    generated: new Map(),    // id → {recipe, image_status, image_path, hidden, created_at}
    fail: false,             // true → every /rest and /functions call answers 503
    unsuitable: false,       // true → generate-recipe answers 422
    log: [],                 // [{method, path, auth, body}]
    mails: [],               // [{type, email}]
    deleted: []
  };
}
reset();
let clock = Date.now();
const now = () => new Date(clock += 1000).toISOString();

function addUser(email, password, { confirmed = true, name = '', providers = ['email'] } = {}) {
  const user = { id: randomUUID(), email, password, confirmed, data: { display_name: name }, providers };
  state.users.set(email, user);
  state.profiles.set(user.id, { display_name: name || null, diets: [], avoid: [], servings: null });
  return user;
}
const publicUser = user => ({
  id: user.id, aud: 'authenticated', role: 'authenticated', email: user.email,
  email_confirmed_at: user.confirmed ? '2026-11-13T00:00:00Z' : null,
  app_metadata: { provider: user.providers[0], providers: user.providers },
  user_metadata: user.data,
  identities: user.providers.map(provider => ({ id: randomUUID(), user_id: user.id, provider, identity_data: { email: user.email } })),
  created_at: '2026-11-13T00:00:00Z'
});
function session(user) {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const token = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: user.id, email: user.email, role: 'authenticated', aud: 'authenticated', exp, jti: randomUUID() })}.sig`;
  state.tokens.set(token, user.email);
  return { access_token: token, token_type: 'bearer', expires_in: 3600, expires_at: exp, refresh_token: randomUUID(), user: publicUser(user) };
}
const caller = req => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const email = state.tokens.get(token);
  return email ? state.users.get(email) ?? null : null;
};
const authError = (code, message, status = 400) => [status, { code: status, error_code: code, msg: message }];

function recipeDoc(title) {
  return {
    title, shortName: title, description: `${title}, hopkokt av det som fanns.`, alt: title, categories: ['main'], tags: ['Vegetarian'],
    time: 30, timeLabel: '30 min', facts: [{ label: 'Förberedelse', value: '10 min' }, { label: 'Portioner', value: '2' }],
    pantryKeys: ['potatis'], ingredients: [{ items: [{ name: '800 g potatis', key: 'potatis' }, { name: '1 tsk salt', basic: true }] }],
    steps: ['Koka potatisen.', 'Servera.'], tips: [], sections: [], imagePrompt: 'Potatoes.'
  };
}

async function handle(req, url, body) {
  const path = url.pathname;
  const q = url.searchParams;
  // Auth
  if (path === '/auth/v1/token' && q.get('grant_type') === 'password') {
    const user = state.users.get(body.email);
    if (!user || user.password !== body.password) return authError('invalid_credentials', 'Invalid login credentials');
    if (!user.confirmed) return authError('email_not_confirmed', 'Email not confirmed');
    return [200, session(user)];
  }
  if (path === '/auth/v1/token' && q.get('grant_type') === 'refresh_token') {
    const user = [...state.users.values()][0];
    return user ? [200, session(user)] : authError('refresh_token_not_found', 'Invalid Refresh Token');
  }
  if (path === '/auth/v1/signup') {
    if ((body.password ?? '').length < 8) return authError('weak_password', 'Password should be at least 8 characters', 422);
    // Like Supabase with mail confirmation on: the same answer whether or not the address is taken.
    const user = state.users.get(body.email) ?? addUser(body.email, body.password, { confirmed: false, name: body.data?.display_name ?? '' });
    state.mails.push({ type: 'signup', email: body.email, redirect: q.get('redirect_to') });
    return [200, { ...publicUser(user), email_confirmed_at: null, identities: user.confirmed ? [] : publicUser(user).identities }];
  }
  if (path === '/auth/v1/recover') { state.mails.push({ type: 'recovery', email: body.email, redirect: q.get('redirect_to') }); return [200, {}]; }
  if (path === '/auth/v1/resend') { state.mails.push({ type: 'resend', email: body.email }); return [200, {}]; }
  if (path === '/auth/v1/logout') return [204, null];
  if (path === '/auth/v1/user') {
    const user = caller(req);
    if (!user) return authError('bad_jwt', 'invalid JWT', 403);
    if (req.method === 'PUT') {
      if (body.password != null) {
        if (body.password.length < 8) return authError('weak_password', 'Password should be at least 8 characters', 422);
        if (body.password === user.password) return authError('same_password', 'New password should be different', 422);
        user.password = body.password;
        if (!user.providers.includes('email')) user.providers.push('email');
      }
      if (body.email) state.mails.push({ type: 'email_change', email: body.email });
      if (body.data) Object.assign(user.data, body.data);
    }
    return [200, publicUser(user)];
  }
  // "Google": signs in google@example.se at once and returns to the site, as the real flow ends.
  if (path === '/auth/v1/authorize') {
    const user = state.users.get('google@example.se') ?? addUser('google@example.se', null, { name: 'Greta Google', providers: ['google'] });
    const s = session(user);
    const back = new URL(q.get('redirect_to'));
    back.hash = new URLSearchParams({ access_token: s.access_token, refresh_token: s.refresh_token, expires_in: '3600', expires_at: String(s.expires_at), token_type: 'bearer', type: 'signup' }).toString();
    return [302, null, { location: back.href }];
  }

  if (state.fail && (path.startsWith('/rest/') || path.startsWith('/functions/'))) return [503, { message: 'stand-in is down' }];
  const user = caller(req);

  // Tables
  const tables = { '/rest/v1/saved_recipes': state.saved, '/rest/v1/saved_generated_recipes': state.savedGenerated };
  if (tables[path]) {
    if (!user) return [401, { message: 'permission denied' }];
    const rows = tables[path];
    if (req.method === 'GET') return [200, rows.filter(row => row.user_id === user.id).sort((a, b) => b.created_at.localeCompare(a.created_at))];
    if (req.method === 'POST') {
      for (const item of [].concat(body)) {
        if (rows.some(row => row.user_id === user.id && row.recipe_id === item.recipe_id)) {
          if (!/ignore-duplicates/.test(req.headers.prefer ?? '')) return [409, { code: '23505', message: 'duplicate key' }];
          continue;
        }
        rows.push({ user_id: user.id, recipe_id: item.recipe_id, created_at: now() });
      }
      return [201, null];
    }
    if (req.method === 'DELETE') {
      const id = q.get('recipe_id')?.replace(/^eq\./, '');
      for (let i = rows.length - 1; i >= 0; i--) if (rows[i].user_id === user.id && rows[i].recipe_id === id) rows.splice(i, 1);
      return [204, null];
    }
  }
  if (path === '/rest/v1/profiles') {
    if (!user) return [401, { message: 'permission denied' }];
    const profile = state.profiles.get(user.id);
    if (req.method === 'PATCH') {
      if ((body.avoid ?? []).length > 30) return [400, { code: '23514', message: 'violates check constraint' }];
      Object.assign(profile, body);
    }
    const row = { id: user.id, ...profile };
    return [200, /vnd\.pgrst\.object/.test(req.headers.accept ?? '') ? row : [row]];
  }
  if (path === '/rest/v1/rpc/my_generated_recipes') {
    if (!user) return [401, { message: 'permission denied' }];
    return [200, state.savedGenerated.filter(row => row.user_id === user.id && !state.generated.get(row.recipe_id)?.hidden)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map(row => { const g = state.generated.get(row.recipe_id); return { id: row.recipe_id, saved_at: row.created_at, title: g.recipe.title, description: g.recipe.description, time_label: g.recipe.timeLabel, categories: g.recipe.categories, tags: g.recipe.tags, image_status: g.image_status, image_path: g.image_path, promoted_as: null }; })];
  }

  // Edge Functions
  if (path === '/functions/v1/generate-recipe') {
    if (state.unsuitable) return [422, { error: 'Det som finns i kyllistan passar inte dina preferenser. Lägg till fler råvaror, eller ändra preferenserna på din profil.' }];
    const id = randomUUID();
    const recipe = recipeDoc(`Potatisfest ${state.generated.size + 1}`);
    state.generated.set(id, { recipe, image_status: 'pending', image_path: null, hidden: false, created_at: now() });
    if (user) state.savedGenerated.push({ user_id: user.id, recipe_id: id, created_at: now() });
    return [200, { id, recipe, saved: Boolean(user) }];
  }
  if (path === '/functions/v1/get-recipe') {
    const g = state.generated.get(q.get('id'));
    if (!g || g.hidden) return [404, { error: 'Receptet finns inte.' }];
    return [200, { id: q.get('id'), createdAt: g.created_at, recipe: g.recipe, image: { status: g.image_status === 'pending' ? 'failed' : g.image_status, url: null }, promotedAs: null }];
  }
  if (path === '/functions/v1/recipe-image') return [200, { status: 'failed', url: null }];
  if (path === '/functions/v1/delete-account') {
    if (!user) return [401, { error: 'Du behöver vara inloggad.' }];
    state.deleted.push(user.email);
    state.users.delete(user.email);
    state.saved = state.saved.filter(row => row.user_id !== user.id);
    state.savedGenerated = state.savedGenerated.filter(row => row.user_id !== user.id);
    return [200, { deleted: true }];
  }
  return [404, { message: `stand-in has no ${req.method} ${path}` }];
}

function control(body) {
  if (body.reset) reset();
  for (const key of ['fail', 'unsuitable']) if (key in body) state[key] = body[key];
  for (const user of body.users ?? []) addUser(user.email, user.password, user);
  if (body.confirm) state.users.get(body.confirm).confirmed = true;
  for (const [email, ids] of Object.entries(body.saved ?? {})) for (const id of ids) state.saved.push({ user_id: state.users.get(email).id, recipe_id: id, created_at: now() });
  for (const [email, titles] of Object.entries(body.generated ?? {})) for (const title of titles) {
    const id = randomUUID();
    state.generated.set(id, { recipe: recipeDoc(title), image_status: 'pending', image_path: null, hidden: false, created_at: now() });
    state.savedGenerated.push({ user_id: state.users.get(email).id, recipe_id: id, created_at: now() });
  }
  if (body.profile) Object.assign(state.profiles.get(state.users.get(body.profile.email).id), body.profile.values);
  // A link like the ones in the mails: lands on `to` signed in as `email`.
  if (body.link) {
    const s = session(state.users.get(body.link.email));
    const to = new URL(body.link.to);
    to.hash = new URLSearchParams({ access_token: s.access_token, refresh_token: s.refresh_token, expires_in: '3600', expires_at: String(s.expires_at), token_type: 'bearer', type: body.link.type ?? 'signup' }).toString();
    return { link: to.href };
  }
  return { ok: true };
}
function snapshot() {
  const byEmail = rows => Object.fromEntries([...state.users.values()].map(user => [user.email, rows.filter(row => row.user_id === user.id).map(row => row.recipe_id)]));
  return {
    users: [...state.users.values()].map(({ email, confirmed, password, providers, data }) => ({ email, confirmed, password, providers, data })),
    saved: byEmail(state.saved), savedGenerated: byEmail(state.savedGenerated),
    profiles: Object.fromEntries([...state.users.values()].map(user => [user.email, state.profiles.get(user.id)])),
    generated: [...state.generated.entries()].map(([id, g]) => ({ id, title: g.recipe.title })),
    mails: state.mails, deleted: state.deleted, log: state.log
  };
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS', 'access-control-expose-headers': '*' };
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); res.end(); return; }
  let raw = '';
  for await (const chunk of req) raw += chunk;
  let body = {};
  try { body = raw ? JSON.parse(raw) : {}; } catch {}
  let status, payload, headers = {};
  if (url.pathname === '/__control') [status, payload] = [200, control(body)];
  else if (url.pathname === '/__state') [status, payload] = [200, snapshot()];
  else {
    state.log.push({ method: req.method, path: url.pathname + url.search, auth: Boolean(req.headers.authorization && caller(req)), body });
    [status, payload, headers = {}] = await handle(req, url, body);
  }
  res.writeHead(status, { ...cors, 'content-type': 'application/json', ...headers });
  res.end(payload == null ? '' : JSON.stringify(payload));
}).listen(port, () => console.log(`stand-in on http://localhost:${port}`));
