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
r = await as('authenticated', A, `update profiles set id = '${B}' where id = '${A}'`);
check('A cannot change the id column', denied(r), r);
r = await as('authenticated', A, `insert into profiles (id) values ('33333333-3333-4333-8333-333333333333')`);
check('A cannot insert a profile', denied(r), r);
r = await as('authenticated', A, `delete from profiles where id = '${A}'`);
check('A cannot delete a profile', denied(r), r);
for (const [name, sql] of [
  ['an unknown diet', `update profiles set diets = '{Keto}'`],
  ['31 foods', `update profiles set avoid = array(select 'f' || g from generate_series(1, 31) g)`],
  ['13 portions', `update profiles set servings = 13`],
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
await db.exec(`delete from auth.users where id = '${A}'`);
r = await db.query(`select (select count(*) from profiles where id = '${A}') p, (select count(*) from saved_recipes where user_id = '${A}') s, (select count(*) from saved_generated_recipes where user_id = '${A}') g, (select count(*) from generated_recipes) kept`);
check('deleting a user removes profile and book, and keeps the generated recipes', JSON.stringify(r.rows[0]) === JSON.stringify({p: 0, s: 0, g: 0, kept: 2}), r.rows[0]);

console.log(failures ? `${failures} failed` : 'all passed');
process.exit(failures ? 1 : 0);
