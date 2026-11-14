// Runs the migrations in an in-memory Postgres (PGlite) with stand-ins for Supabase's auth schema and
// roles, then checks what each role can reach in the account tables: a visitor's own rows and nobody
// else's, nothing without a sign-in, the limits, and what deleting a user removes.
//
//   npm install --no-save @electric-sql/pglite     (once; it isn't one of the project's dependencies)
//   node tools/standin/check-rls.mjs
//
// Run it after changing anything in supabase/migrations/. It is the only check of the row level
// security that doesn't need the real project, so add to it when a table or a policy is added.
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
const root = process.argv[2] ?? new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const db = new PGlite();
let failures = 0;
const check = (name, ok, detail) => { if (!ok) failures++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${ok || detail === undefined ? '' : ' — ' + JSON.stringify(detail)}`); };

await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  create schema auth; create schema storage;
  create table auth.users (id uuid primary key, raw_user_meta_data jsonb);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
  grant usage on schema public, auth to anon, authenticated, service_role;
  -- Supabase's default privileges: new tables and functions in public are open to all three roles.
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
`);
for (const file of readdirSync(`${root}/supabase/migrations`).filter(name => name.endsWith('.sql')).sort()) {
  await db.exec(readFileSync(`${root}/supabase/migrations/${file}`, 'utf8'));
}
check('the migrations run', true);

const A = '11111111-1111-4111-8111-111111111111', B = '22222222-2222-4222-8222-222222222222';
await db.exec(`
  insert into auth.users values ('${A}', '{"display_name": "  Anna  "}'), ('${B}', '{"full_name": "${'x'.repeat(100)}"}');
  insert into generated_recipes (id, recipe) values
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '{"title": "Gratäng", "description": "d", "timeLabel": "40 min", "categories": ["main"], "tags": ["Vegetarian"]}'),
    ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '{"title": "Dold", "description": "d", "timeLabel": "1 min", "categories": [], "tags": []}');
  update generated_recipes set hidden = true where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
`);
let r = await db.query(`select id, display_name from profiles order by id`);
check('a profile is made for each new user, name trimmed and cut to 80', r.rows.length === 2 && r.rows[0].display_name === 'Anna' && r.rows[1].display_name.length === 80, r.rows);

// Runs `sql` as a role, with `uid` as the signed-in user. Returns rows, or the error message.
async function as(role, uid, sql, params = []) {
  try {
    return await db.transaction(async tx => {
      await tx.query(`select set_config('request.jwt.claim.sub', $1, true)`, [uid ?? '']);
      await tx.exec(`set local role ${role}`);
      return (await tx.query(sql, params)).rows;
    });
  } catch (error) { return `ERROR: ${error.message}`; }
}
const denied = result => typeof result === 'string' && /permission denied|row-level security/.test(result);

// As A
r = await as('authenticated', A, `select id from profiles`);
check('A reads only their own profile', Array.isArray(r) && r.length === 1 && r[0].id === A, r);
r = await as('authenticated', A, `update profiles set diets = '{Vegan}', avoid = '{koriander}', servings = 2, display_name = 'A' returning id`);
check('A updates only their own profile', Array.isArray(r) && r.length === 1 && r[0].id === A, r);
r = await as('authenticated', A, `update profiles set servings = 3 where id = '${B}' returning id`);
check("A's update of B's profile changes nothing", Array.isArray(r) && r.length === 0, r);
for (const minutes of [15, 30, 45, null]) {
  r = await as('authenticated', A, `update profiles set max_cooking_minutes = $1 where id = '${A}' returning max_cooking_minutes`, [minutes]);
  check(`A can save the cooking-time preference ${minutes ?? 'no hurry'}`, Array.isArray(r) && r.length === 1 && r[0].max_cooking_minutes === minutes, r);
}
r = await as('authenticated', A, `update profiles set max_cooking_minutes = 15 where id = '${B}' returning id`);
check("A cannot change B's cooking-time preference", Array.isArray(r) && r.length === 0, r);
r = await as('authenticated', A, `update profiles set diets = '{Lactose free}' where id = '${A}' returning diets`);
check('A can save lactose-free as their only diet', Array.isArray(r) && JSON.stringify(r[0]?.diets) === '["Lactose free"]', r);
r = await as('authenticated', A, `update profiles set diets = '{Vegetarian,Vegan,Dairy free,Egg free,Gluten free,Lactose free}' where id = '${A}' returning diets`);
check('A can save all six diets', Array.isArray(r) && r[0]?.diets.length === 6, r);
r = await as('authenticated', A, `update profiles set id = '${B}' where id = '${A}'`);
check('A cannot change the id column', denied(r), r);
r = await as('authenticated', A, `insert into profiles (id) values ('33333333-3333-4333-8333-333333333333')`);
check('A cannot insert a profile', denied(r), r);
r = await as('authenticated', A, `delete from profiles where id = '${A}'`);
check('A cannot delete a profile', denied(r), r);
for (const [name, sql] of [
  ['an unknown diet', `update profiles set diets = '{Keto}'`],
  ['31 foods', `update profiles set avoid = array(select 'f' || g from generate_series(1, 31) g)`],
  ['the same diet many times over', `update profiles set diets = array(select 'Vegan' from generate_series(1, 7))`],
  ['13 portions', `update profiles set servings = 13`],
  ['an unsupported cooking time', `update profiles set max_cooking_minutes = 20`],
  ['a name of 81 characters', `update profiles set display_name = repeat('x', 81)`]
]) {
  r = await as('authenticated', A, sql);
  check(`the profile refuses ${name}`, typeof r === 'string' && /check constraint/.test(r), r);
}

r = await as('authenticated', A, `insert into saved_recipes (recipe_id) values ('01-rodbetspytt'), ('29-shakshuka') returning user_id`);
check('A hearts archive recipes; user_id defaults to A', Array.isArray(r) && r.length === 2 && r.every(row => row.user_id === A), r);
r = await as('authenticated', A, `insert into saved_recipes (user_id, recipe_id) values ('${B}', '01-rodbetspytt')`);
check("A cannot add to B's book", denied(r), r);
r = await as('authenticated', A, `insert into saved_recipes (recipe_id) values ('../etc/passwd')`);
check('an id of the wrong shape is refused', typeof r === 'string' && /check constraint/.test(r), r);
r = await as('authenticated', A, `update saved_recipes set recipe_id = 'x'`);
check('saved rows cannot be updated', denied(r), r);
r = await as('authenticated', A, `insert into saved_generated_recipes (recipe_id) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'), ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb') returning recipe_id`);
check('A saves generated recipes', Array.isArray(r) && r.length === 2, r);
r = await as('authenticated', A, `insert into saved_generated_recipes (recipe_id) values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc')`);
check('a generated recipe that does not exist is refused', typeof r === 'string' && /foreign key/.test(r), r);
r = await as('authenticated', A, `select * from generated_recipes`);
check('A cannot read generated_recipes directly', (Array.isArray(r) && r.length === 0) || denied(r), r);
r = await as('authenticated', A, `select * from my_generated_recipes()`);
check('my_generated_recipes gives A their saved, non-hidden recipes with card fields', Array.isArray(r) && r.length === 1 && r[0].title === 'Gratäng' && r[0].time_label === '40 min' && JSON.stringify(r[0].tags) === '["Vegetarian"]' && r[0].image_status === 'pending', r);

// The functions a visitor can call that run with the owner's rights (the server's own, like ai_allow,
// are closed to visitors and not counted).
r = await db.query(`select proname, proconfig from pg_proc where pronamespace = 'public'::regnamespace and prosecdef
  and (has_function_privilege('authenticated', oid, 'execute') or has_function_privilege('anon', oid, 'execute')) order by proname`);
check('a function that visitors can call with the owner\'s rights has an empty search path',
  r.rows.length >= 1 && r.rows.every(row => (row.proconfig ?? []).some(setting => /^search_path=("")?$/.test(setting))), r.rows);

// As B
r = await as('authenticated', B, `select * from saved_recipes`);
check("B sees none of A's hearts", Array.isArray(r) && r.length === 0, r);
r = await as('authenticated', B, `select * from saved_generated_recipes`);
check("B sees none of A's generated recipes", Array.isArray(r) && r.length === 0, r);
r = await as('authenticated', B, `delete from saved_recipes where user_id = '${A}' returning recipe_id`);
check("B's delete of A's hearts removes nothing", Array.isArray(r) && r.length === 0, r);
r = await as('authenticated', B, `select * from my_generated_recipes()`);
check('my_generated_recipes is empty for B', Array.isArray(r) && r.length === 0, r);

// Signed out
for (const sql of [`select * from profiles`, `select * from saved_recipes`, `select * from saved_generated_recipes`,
  `select * from my_generated_recipes()`, `insert into saved_recipes (user_id, recipe_id) values ('${A}', 'x')`]) {
  r = await as('anon', null, sql);
  check(`signed out is refused: ${sql.slice(0, 45)}`, denied(r), r);
}

// The server (generate-recipe) adds to a book with an explicit user_id.
r = await as('service_role', null, `insert into saved_generated_recipes (user_id, recipe_id) values ('${B}', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa') returning user_id`);
check('the server can add a recipe to a book', Array.isArray(r) && r.length === 1, r);

// The limit
await db.exec(`insert into saved_recipes (user_id, recipe_id) select '${B}', 'r-' || g from generate_series(1, 999) g`);
r = await as('authenticated', B, `insert into saved_recipes (recipe_id) values ('number-1000') returning recipe_id`);
check('the 1000th recipe is accepted', Array.isArray(r) && r.length === 1, r);
r = await as('authenticated', B, `insert into saved_recipes (recipe_id) values ('number-1001')`);
check('the 1001st is refused', typeof r === 'string' && /recipe book is full/.test(r), r);
r = await as('authenticated', A, `insert into saved_recipes (recipe_id) values ('still-room') returning recipe_id`);
check("B's full book doesn't stop A", Array.isArray(r) && r.length === 1, r);

// Deleting the account
// Shopping list: isolated owners, delta writes, safe retries and imports from old browser lists.
let operation = 0;
const change = (kind, id, extra = {}) => ({ op: `99999999-9999-4999-8999-${String(++operation).padStart(12, '0')}`, kind, id, ...extra });
const shoppingItem = (id, checked = false) => ({ id, text: `Vara ${id}`, recipe: 'Middag', checked });
const shop = async (uid, changes = []) => {
  const result = await as('authenticated', uid, 'select public.sync_shopping_list($1::jsonb) as items', [JSON.stringify(changes)]);
  return Array.isArray(result) ? result[0].items : result;
};
const initial = change('add', 'a', { item: shoppingItem('a') });
r = await shop(A, [initial]);
check('A adds to their shopping list through the sync function', Array.isArray(r) && r.length === 1 && r[0].id === 'a', r);
r = await shop(B);
check('B cannot read A shopping items through the function', Array.isArray(r) && r.length === 0, r);
r = await as('authenticated', B, 'select * from public.shopping_list_items');
check('B cannot read A shopping items directly', Array.isArray(r) && r.length === 0, r);
r = await as('authenticated', B, `insert into public.shopping_list_items (user_id, id) values ('${A}', 'bad')`);
check('direct shopping writes, including another owner, are refused', denied(r), r);
r = await as('authenticated', A, 'select * from public.shopping_list_operations');
check('operation receipts are private to the sync function', denied(r), r);
r = await shop(A, [change('check', 'a', { checked: true })]);
check('A can check an item', Array.isArray(r) && r[0]?.checked === true, r);
r = await shop(A, [initial]);
check('replaying a lost response does not undo a later purchase', Array.isArray(r) && r[0]?.checked === true, r);
r = await shop(A, [change('import', 'a', { item: shoppingItem('a') })]);
check('a guest import preserves an existing purchase', Array.isArray(r) && r[0]?.checked === true, r);
r = await shop(A, [change('add', 'b', { item: shoppingItem('b') })]);
check('adding another item does not overwrite existing rows', Array.isArray(r) && r.length === 2 && r[0]?.checked === true, r);
await shop(A, [change('remove', 'a')]);
r = await shop(A, [change('check', 'a', { checked: false }), change('import', 'a', { item: shoppingItem('a') })]);
check('stale checks and imports cannot resurrect a removed item', Array.isArray(r) && r.length === 1 && r[0]?.id === 'b', r);
r = await shop(A, [change('add', 'a', { item: shoppingItem('a') })]);
check('explicitly adding a removed item brings it back', Array.isArray(r) && r.length === 2, r);
r = await shop(A, [change('add', 'z-last', { item: shoppingItem('z-last') }), change('add', 'a-after-z', { item: shoppingItem('a-after-z') })]);
check('a batch keeps insertion order rather than sorting ingredient ids', Array.isArray(r) && r.slice(-2).map(item => item.id).join() === 'z-last,a-after-z', r);
for (const bad of [null, {}, Array.from({ length: 101 }, () => initial), [change('check', 'a', { checked: 'yes' })], [change('bad', 'a')], [change('add', 'invalid', { item: { text: 'x' } })]]) {
  r = await as('authenticated', A, 'select * from public.sync_shopping_list($1::jsonb)', [JSON.stringify(bad)]);
  check('invalid shopping input is refused', typeof r === 'string' && r.startsWith('ERROR:'), r);
}
r = await shop(B, [change('add', 'b-only', { item: shoppingItem('b-only') })]);
check('B has an independent shopping list', Array.isArray(r) && r.length === 1 && r[0]?.id === 'b-only', r);
const manualId = 'manual:milk';
r = await shop(A, [change('add', manualId, { item: { id: manualId, text: '2 l mjölk', recipe: '', checked: false, note: 'Laktosfri' } })]);
check('a manual item stores its optional note without needing a recipe', r.find?.(item => item.id === manualId)?.note === 'Laktosfri', r);
await shop(A, [change('check', 'a', { checked: true }), change('edit', 'a', { fields: { note: 'Ekologisk' } })]);
const rename = change('edit', 'a', { fields: { customText: '3 dl grädde' } });
r = await shop(A, [rename]);
let edited = r.find?.(item => item.id === 'a');
check('an amount edit preserves source text, recipe, purchase and independently edited note', edited?.customText === '3 dl grädde' && edited?.text === 'Vara a' && edited?.recipe === 'Middag' && edited?.checked && edited?.note === 'Ekologisk', edited);
r = await shop(A, [change('edit', 'a', { fields: { customText: '4 dl grädde', note: '' } }), rename]);
edited = r.find?.(item => item.id === 'a');
check('notes can be cleared and replaying an old edit leaves the newer value intact', edited?.customText === '4 dl grädde' && edited?.note === '', edited);
await shop(A, [change('remove', manualId)]);
r = await shop(A, [change('edit', manualId, { fields: { note: 'Försenad ändring' } })]);
check('a stale edit cannot resurrect a deleted manual item', Array.isArray(r) && !r.some(item => item.id === manualId), r);
for (const fields of [null, [], { checked: false }, { text: 'replace source' }, { note: null }, { note: 'x'.repeat(501) }, { customText: 42 }, { customText: 'x'.repeat(4001) }]) {
  r = await shop(A, [change('edit', 'a', { fields })]);
  check('invalid edit fields cannot alter shopping data', typeof r === 'string' && r.startsWith('ERROR:'), r);
}
for (const details of [{ note: false }, { note: 'x'.repeat(501) }, { customText: null }]) {
  r = await shop(A, [change('add', 'invalid-details', { item: { ...shoppingItem('invalid-details'), ...details } })]);
  check('invalid details on newly added shopping items are refused', typeof r === 'string' && r.startsWith('ERROR:'), r);
}
r = await shop(B, [change('edit', 'a', { fields: { customText: 'Other user' } })]);
check('editing another owner row exposes or changes nothing', Array.isArray(r) && r.length === 1 && r[0].id === 'b-only', r);
for (const source of ['archive:01-rodbetspytt', 'generated:aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa']) {
  r = await shop(A, [change('add', 'source-test', { item: { ...shoppingItem('source-test'), source } })]);
  check('recipe identity survives adding and fetching shopping contributions', r.find?.(item => item.id === 'source-test')?.source === source, r);
  r = await shop(A, [change('check', 'source-test', { checked: true }), change('edit', 'source-test', { fields: { note: 'Behåll receptet' } })]);
  check('checking or editing a contribution preserves its recipe identity', r.find?.(item => item.id === 'source-test')?.source === source, r);
}
for (const source of [null, false, {}, 'javascript:alert(1)', 'archive:../../konto', 'generated:short']) {
  r = await shop(A, [change('add', 'invalid-source', { item: { ...shoppingItem('invalid-source'), source } })]);
  check('invalid recipe identities are refused', typeof r === 'string' && r.startsWith('ERROR:'), r);
}
r = await shop(A, [change('edit', 'source-test', { fields: { source: 'archive:another' } })]);
check('an ordinary item edit cannot silently move its recipe identity', typeof r === 'string' && r.startsWith('ERROR:'), r);
await db.query(`insert into public.shopping_list_items (user_id, id, text) select $1::uuid, 'large-' || n, 'Vara' from generate_series(1, 1001) n`, [B]);
r = await shop(B);
check('a large shopping list is returned as a complete JSON array', Array.isArray(r) && r.length === 1002, { length: r?.length });
for (const sql of ['select * from public.shopping_list_items', 'select * from public.shopping_list_operations', 'select * from public.sync_shopping_list()']) {
  r = await as('anon', null, sql);
  check('shopping data is inaccessible without a sign-in', denied(r), r);
}

// Both kinds of recipe-book entries use the same operation protocol and isolated snapshots.
const book = async (uid, changes = []) => {
  const result = await as('authenticated', uid, 'select public.sync_recipe_book($1::jsonb) as book', [JSON.stringify(changes)]);
  return Array.isArray(result) ? result[0].book : result;
};
let br = await book(A);
check('the recipe-book snapshot contains existing archive and visible generated recipes', Array.isArray(br.archive) && br.archive.length === 3 && br.generated.length === 1, br);
const archiveAdd = change('archive', 'sync-test', { saved: true });
br = await book(A, [archiveAdd]);
check('archive favorites sync through the book endpoint', br.archive?.some(row => row.recipe_id === 'sync-test'), br);
await book(A, [change('archive', 'sync-test', { saved: false })]);
br = await book(A, [archiveAdd, change('archive', 'sync-test', { saved: true, import: true })]);
check('retries and stale guest favorites cannot restore a removed archive recipe', !br.archive?.some(row => row.recipe_id === 'sync-test'), br);
br = await book(A, [change('archive', 'sync-test', { saved: true })]);
check('an explicit favorite can restore a deliberately removed recipe', br.archive?.some(row => row.recipe_id === 'sync-test'), br);
const genId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const generatedAdd = change('generated', genId, { saved: true });
await book(A, [generatedAdd]);
await book(A, [change('generated', genId, { saved: false })]);
br = await book(A, [generatedAdd, change('generated', genId, { saved: true, import: true })]);
check('generated recipes have the same safe retry and removal behavior', br.generated?.length === 0, br);
br = await book(A, [change('generated', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', { saved: true }), change('archive', 'after-hidden', { saved: true })]);
check('a hidden generated recipe is rejected without blocking other favorites', br.rejected?.[0]?.reason === 'missing' && br.archive?.some(row => row.recipe_id === 'after-hidden'), br);
const bBook = await book(B);
check('a different account receives none of A recipe-book changes', !bBook.archive?.some(row => row.recipe_id === 'sync-test'), bBook);
for (const sql of ['select * from public.recipe_book_operations', 'select * from public.recipe_book_removed', 'select * from public.generated_recipe_save_queue']) {
  const deniedResult = await as('authenticated', A, sql);
  check('book operation and recovery tables cannot be read directly', denied(deniedResult), deniedResult);
}
r = await as('anon', null, 'select public.sync_recipe_book()');
check('signed-out visitors cannot access the recipe-book sync endpoint', denied(r), r);
r = await as('authenticated', B, `select public.store_generated_recipe('{"title":"Not allowed"}', '{}', '${A}')`);
check('a browser cannot create server recipes for another user', denied(r), r);
let stored = await as('service_role', null, 'select public.store_generated_recipe($1::jsonb, $2::text[], $3::uuid) as recipe', [JSON.stringify({ title: 'Automatically saved' }), ['potatis'], A]);
const createdId = stored?.[0]?.recipe?.id;
check('server stores a generated recipe and its first save atomically', stored?.[0]?.recipe?.saved === true && Boolean(createdId), stored);
br = await book(A);
check('the automatically saved recipe is included on a fresh device', br.generated?.some(row => row.id === createdId), br);
// Force the initial save to fail because the book is full. Its queue must outlive the response.
await db.exec(`insert into public.generated_recipes (recipe) select '{"title":"Filler"}' from generate_series(1,999)`);
await db.exec(`insert into public.saved_generated_recipes (user_id, recipe_id) select '${B}', id from public.generated_recipes where recipe ->> 'title' = 'Filler'`);
stored = await as('service_role', null, 'select public.store_generated_recipe($1::jsonb, $2::text[], $3::uuid) as recipe', [JSON.stringify({ title: 'Retry me' }), ['potatis'], B]);
const pendingId = stored?.[0]?.recipe?.id;
check('a failed first auto-save retains a durable recovery record', stored?.[0]?.recipe?.saved === false && Boolean(pendingId), stored);
br = await book(B);
check('a full book reports its waiting generated recipe', br.pendingGenerated === 1, br.pendingGenerated);
br = await book(B, [change('generated', genId, { saved: false })]);
check('the next sync recovers the auto-save after room is made', br.pendingGenerated === 0 && br.generated?.some(row => row.id === pendingId), { pending: br.pendingGenerated, recovered: br.generated?.some(row => row.id === pendingId) });
stored = await as('service_role', null, 'select public.store_generated_recipe($1::jsonb, $2::text[], $3::uuid) as recipe', [JSON.stringify({ title: 'Cancel pending save' }), [], B]);
const cancelledId = stored?.[0]?.recipe?.id;
br = await book(B, [change('generated', cancelledId, { saved: false })]);
check('removing a pending generated recipe cancels its automatic retry', br.pendingGenerated === 0 && !br.generated?.some(row => row.id === cancelledId), { pending: br.pendingGenerated });
await db.query('insert into public.generated_recipe_save_queue (user_id, recipe_id) values ($1::uuid, $2::uuid)', [A, cancelledId]);
const generatedBeforeDelete = Number((await db.query('select count(*) as n from public.generated_recipes')).rows[0].n);
await db.exec(`delete from auth.users where id = '${A}'`);
r = await db.query(`select (select count(*) from profiles where id = '${A}') p, (select count(*) from saved_recipes where user_id = '${A}') s, (select count(*) from saved_generated_recipes where user_id = '${A}') g, (select count(*) from generated_recipes) kept`);
check('deleting a user removes profile and book, and keeps the generated recipes', JSON.stringify(r.rows[0]) === JSON.stringify({p: 0, s: 0, g: 0, kept: generatedBeforeDelete}), r.rows[0]);
r = await db.query(`select (select count(*) from public.shopping_list_items where user_id = '${A}') items, (select count(*) from public.shopping_list_operations where user_id = '${A}') operations`);
check('deleting the account removes its shopping list and operation receipts', Number(r.rows[0].items) === 0 && Number(r.rows[0].operations) === 0, r.rows[0]);
r = await db.query(`select (select count(*) from public.recipe_book_operations where user_id = '${A}') operations, (select count(*) from public.recipe_book_removed where user_id = '${A}') removed, (select count(*) from public.generated_recipe_save_queue where user_id = '${A}') queued`);
check('account deletion clears book receipts, removals and pending auto-saves', Object.values(r.rows[0]).every(value => Number(value) === 0), r.rows[0]);

console.log(failures ? `${failures} failed` : 'all passed');
process.exit(failures ? 1 : 0);
