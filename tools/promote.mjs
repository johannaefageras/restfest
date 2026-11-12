// Adds a recipe Claude wrote (nytt-recept.html?id=…) to the archive: writes src/recept/<number>-<name>.md
// in the usual format and saves its photo next to the others in src/assets/recipes/.
//
//   npm run promote -- <id, or the recipe's nytt-recept.html link>
//
// The recipe gets the next free number and today's date. Read it through before publishing: the build
// checks the format, not the cooking. With SUPABASE_SECRET_KEY in .env (Supabase: Settings → API Keys),
// the stored recipe is also marked as added, and its page links to the archive copy.

import fs from 'node:fs';
import yaml from 'js-yaml';
import ai from '../src/_data/ai.js';
import {slug} from '../lib/taxonomy.js';
import {parseRecipeBody} from '../lib/recipe-body.js';

try {
  process.loadEnvFile();
} catch {
  // No .env; SUPABASE_SECRET_KEY is optional.
}

const root = new URL('../', import.meta.url);
const file = path => new URL(path, root);
const fail = message => {
  console.error(message);
  process.exit(1);
};

const argument = process.argv[2] ?? '';
const id = (argument.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0] ?? '').toLowerCase();
if (!id) fail('Usage: npm run promote -- <id, or the nytt-recept.html?id=… link>');
if (!ai.functionsUrl) fail('Set the Supabase address in src/_data/ai.js first.');

const response = await fetch(`${ai.functionsUrl}/get-recipe?id=${id}`);
const data = await response.json().catch(() => ({}));
if (!response.ok) fail(`Couldn't fetch recipe ${id}: ${data.error ?? response.status}`);
const {recipe, image} = data;
if (data.promotedAs) fail(`Already in the archive as src/recept/${data.promotedAs}.md.`);
if (image.status !== 'done' || !image.url) {
  fail('The recipe has no photo yet. Open its page to make one, or add one by hand and write the file yourself.');
}

// The next number after the highest in src/recept/, and a short name from the dish.
const numbers = fs.readdirSync(file('src/recept/')).map(name => parseInt(name, 10)).filter(Number.isFinite);
const recipeId = `${Math.max(0, ...numbers) + 1}-${slug(recipe.shortName || recipe.title).slice(0, 40).replace(/-$/, '')}`;
const extension = new URL(image.url).pathname.split('.').pop().toLowerCase() || 'jpg';
const imagePath = `assets/recipes/${recipeId}.${extension}`;
const today = new Intl.DateTimeFormat('sv-SE', {timeZone: 'Europe/Stockholm'}).format(new Date());

// YAML: plain where that's safe, as in the other recipe files, otherwise double-quoted (a JSON string
// is valid YAML). Inside [ … ] lists, commas and brackets need quotes too.
const scalar = (value, inList = false) => {
  if (typeof value === 'number') return String(value);
  const text = String(value);
  const safe = /^[\p{L}\p{N}]/u.test(text) && !/: |:$| #|\n|\s$/.test(text) && !(inList && /[,[\]{}]/.test(text)) &&
    !/^(?:true|false|null|yes|no|on|off|~)$/i.test(text) && !/^[\d.,\s]+$/.test(text);
  return safe ? text : JSON.stringify(text);
};
const list = values => `[${values.map(value => scalar(value, true)).join(', ')}]`;

const lines = [
  '---',
  `title: ${scalar(recipe.title)}`,
  `date: ${today}`,
  `description: ${scalar(recipe.description)}`,
  `image: ${imagePath}`,
  `cardImage: ${imagePath}`,
  `alt: ${scalar(recipe.alt || recipe.title)}`,
  `categories: ${list(recipe.categories)}`,
  `tags: ${list(recipe.tags)}`,
  ...(recipe.time ? [`time: ${recipe.time}`] : []),
  `timeLabel: ${scalar(recipe.timeLabel)}`,
  'facts:',
  ...recipe.facts.map(fact => `  ${fact.label}: ${scalar(fact.value)}`),
  ...(recipe.beforeYouStart ? [`beforeYouStart: ${scalar(recipe.beforeYouStart)}`] : []),
  `pantryKeys: ${list(recipe.pantryKeys)}`,
  'ingredients:'
];
const item = (entry, indent) => [
  `${indent}- name: ${scalar(entry.name)}`,
  ...(entry.key ? [`${indent}  key: ${entry.key}`] : []),
  ...(entry.basic ? [`${indent}  basic: true`] : [])
];
// One untitled group is a plain list; otherwise a list of groups, as in the other recipes.
if (recipe.ingredients.length === 1 && !recipe.ingredients[0].title) {
  lines.push(...recipe.ingredients[0].items.flatMap(entry => item(entry, '  ')));
} else {
  for (const group of recipe.ingredients) {
    lines.push(group.title ? `  - title: ${scalar(group.title)}` : '  - items:');
    if (group.title) lines.push('    items:');
    lines.push(...group.items.flatMap(entry => item(entry, '      ')));
  }
}
lines.push('---', '');

// Markdown: the text is plain, so characters that would turn into formatting are escaped.
const markdown = text => text.replace(/([\\`*_[\]<])/g, '\\$1');
const body = [
  recipe.steps.map((step, index) => `${index + 1}. ${markdown(step)}`).join('\n'),
  ...recipe.tips.map(tip => `**${markdown(tip.title)}** ${markdown(tip.text)}`),
  ...recipe.sections.map(section => `## ${markdown(section.title)}\n\n${section.items.map(entry => `- ${markdown(entry)}`).join('\n')}`)
].join('\n\n') + '\n';

const target = file(`src/recept/${recipeId}.md`);
// Read back with the same readers as the build, so a mistake shows up here rather than in `npm start`.
const written = yaml.load(lines.slice(1, -2).join('\n'));
const writtenNames = (written.ingredients[0]?.items ? written.ingredients.flatMap(group => group.items) : written.ingredients)
  .map(entry => entry.name);
const names = recipe.ingredients.flatMap(group => group.items.map(entry => entry.name));
if (written.title !== recipe.title || written.description !== recipe.description ||
  JSON.stringify(writtenNames) !== JSON.stringify(names) ||
  recipe.facts.some(fact => String(written.facts[fact.label]) !== fact.value)) {
  fail('The front matter didn\'t read back as written. Nothing was saved; please report this recipe id.');
}
parseRecipeBody(body, target.pathname);

const photo = await fetch(image.url);
if (!photo.ok) fail(`Couldn't download the photo (${photo.status}).`);
fs.writeFileSync(file(`src/${imagePath}`), Buffer.from(await photo.arrayBuffer()));
fs.writeFileSync(target, `${lines.join('\n')}\n${body}`);
console.log(`Wrote src/recept/${recipeId}.md and src/${imagePath}.`);

const secret = process.env.SUPABASE_SECRET_KEY;
if (secret && ai.supabaseUrl) {
  const marked = await fetch(`${ai.supabaseUrl.replace(/\/+$/, '')}/rest/v1/generated_recipes?id=eq.${id}`, {
    method: 'PATCH',
    headers: {apikey: secret, 'Content-Type': 'application/json', Prefer: 'return=minimal'},
    body: JSON.stringify({promoted_as: recipeId})
  });
  console.log(marked.ok ? 'Marked as added in Supabase.' : `Couldn't mark it as added in Supabase (${marked.status}).`);
} else {
  console.log(`To link the generated page to it, set promoted_as to ${recipeId} on the recipe's row in Supabase.`);
}
console.log(`Check it with npm start: http://localhost:8080/recept/${recipeId}.html`);
