// Writes the data the Edge Functions in supabase/functions/ need from the site, so Claude works from the
// same ingredient keys, categories and tags as the build:
//
//   supabase/functions/_shared/data.ts               ingredient keys, dinner categories, tags, example recipes
//   supabase/functions/_shared/style-references.ts   the photos in supabase/style/, as data URLs for the image model
//
//   npm run supabase-data
//
// Run it after changing src/_data/foods.json, the tags or categories in src/js/recipes.js, the example
// recipes below or the photos in supabase/style/, then deploy the functions again (HANDOFF.md).

import fs from 'node:fs';
import yaml from 'js-yaml';
import {taxonomy} from '../lib/taxonomy.js';
import {parseRecipeBody} from '../lib/recipe-body.js';

const root = new URL('../', import.meta.url);
const file = path => new URL(path, root);
const t = taxonomy();

// The categories the home page suggests dinners from (`dinnerMeals` in src/js/app.js). New recipes are dinners too.
const dinnerMeals = ['main', 'soup', 'salad', 'sandwich'];

// The recipes Claude sees as examples of the format and the house voice, with a description of each photo
// (Claude writes one for every new recipe, and the image model draws from it).
const examples = {
  '45-pastafrittata': 'A thick, round pasta frittata on a dark wooden board, golden and crisp on top with a visible pattern of spaghetti strands, one wedge cut out to show the creamy inside. Topped with halved cherry tomatoes, basil leaves and finely grated hard cheese. Around it: cherry tomatoes on the vine, two brown eggs, a wedge of hard cheese with a grater, a cast-iron pan, a striped linen towel.',
  '29-shakshuka': 'Shakshuka in a black cast-iron pan: deep red tomato and pepper sauce with four eggs, the whites set and the yolks bright orange, crumbled feta, chopped parsley and chili flakes on top. Around it: toasted sourdough, a small bowl of feta, a halved red pepper, fresh parsley, a dusty-pink linen napkin, stoneware coffee mugs.',
  '200-quesadillas': 'Quesadilla triangles stacked on a wooden board, crisp and browned, filled with black beans, sweetcorn, red pepper and melted cheese stretching as one piece is pulled away. Small patterned bowls of salsa, mashed avocado and sour cream behind; an open tin of corn, a stack of tortillas, half a lime and coriander; a colourful striped cloth.'
};

function frontMatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error('No front matter');
  return {data: yaml.load(match[1]), body: match[2]};
}

const recipeFiles = fs.readdirSync(file('src/recept/')).filter(name => name.endsWith('.md'));
const recipes = recipeFiles.map(name => ({id: name.replace(/\.md$/, ''), ...frontMatter(fs.readFileSync(file(`src/recept/${name}`), 'utf8'))}));

// Food diet tags and tags used by archive dinners, so a new recipe can't get a spa or cleaning tag.
const dinnerRecipes = recipes.filter(recipe => (recipe.data.categories ?? []).some(key => dinnerMeals.includes(key)));
const tagKeys = [...new Set([...t.dietTags, ...dinnerRecipes.flatMap(recipe => recipe.data.tags ?? [])])]
  .sort((a, b) => t.tagLabel(a).localeCompare(t.tagLabel(b), 'sv'));

// An archive recipe in the shape Claude answers in (RecipeDraft in _shared/recipe.ts).
function draft(id, imagePrompt) {
  const recipe = recipes.find(item => item.id === id);
  if (!recipe) throw new Error(`No recipe ${id} in src/recept/`);
  const {data, body} = recipe;
  const parsed = parseRecipeBody(body, `src/recept/${id}.md`);
  const groups = (data.ingredients[0]?.items ? data.ingredients : [{items: data.ingredients}]).map(group => ({
    title: group.title ?? '',
    items: group.items.filter(item => !item.note).map(item => ({name: item.name, key: item.key ?? '', basic: item.basic === true}))
  }));
  const [tip] = parsed.directionNotes;
  return {
    title: data.title,
    shortName: id.replace(/^\d+-/, '').replace(/-/g, ' ').replace(/^./, letter => letter.toUpperCase()),
    description: data.description,
    categories: data.categories.filter(key => dinnerMeals.includes(key)),
    tags: data.tags,
    time: data.time,
    timeLabel: data.timeLabel,
    prepTime: data.facts['Förberedelse'] ?? '',
    cookTime: data.facts['Tillagning'] ?? '',
    servings: String(data.facts['Portioner'] ?? ''),
    level: data.facts['Nivå'],
    beforeYouStart: data.beforeYouStart ?? '',
    pantryKeys: data.pantryKeys,
    ingredientGroups: groups,
    steps: parsed.directionSections.flatMap(section => section.steps.map(step => step.text)),
    tip: tip ? {title: tip.title, text: tip.text} : {title: '', text: ''},
    extraSections: parsed.extraSections.map(section => ({title: section.title, items: section.items.map(item => item.text)})),
    imagePrompt
  };
}

const data = {
  foods: Object.fromEntries(Object.entries(t.foods).map(([key, food]) => [key, {name: food.name, aliases: food.aliases ?? []}])),
  dinnerMeals: dinnerMeals.map(key => ({key, name: t.mealName(key)})),
  tags: tagKeys.map(key => ({key, label: t.tagLabel(key)})),
  examples: Object.entries(examples).map(([id, imagePrompt]) => draft(id, imagePrompt))
};

const header = source => `// Generated by tools/supabase-data.mjs from ${source}.\n// Edit those and run \`npm run supabase-data\`, not this file.\n\n`;

fs.writeFileSync(file('supabase/functions/_shared/data.ts'),
  header('src/_data/foods.json, src/js/recipes.js and the example recipes in src/recept/') +
  `export const data = ${JSON.stringify(data, null, 2)} as const;\n`);

const styleFiles = fs.readdirSync(file('supabase/style/')).filter(name => /\.jpe?g$/i.test(name)).sort();
const styleReferences = styleFiles.map(name =>
  `data:image/jpeg;base64,${fs.readFileSync(file(`supabase/style/${name}`)).toString('base64')}`);
fs.writeFileSync(file('supabase/functions/_shared/style-references.ts'),
  header(`the photos in supabase/style/ (${styleFiles.join(', ')})`) +
  `// The image model gets these with every new recipe, to copy the archive's look.\n` +
  `export const styleReferences: string[] = ${JSON.stringify(styleReferences)};\n`);

console.log(`supabase/functions/_shared/data.ts: ${Object.keys(data.foods).length} ingredient keys, ${data.tags.length} tags, ${data.examples.length} examples`);
console.log(`supabase/functions/_shared/style-references.ts: ${styleFiles.length} photos`);
