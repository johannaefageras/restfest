// Writes the data the Edge Functions in supabase/functions/ need from the site, so Claude works from the
// same ingredient keys, categories and tags as the build:
//
//   supabase/functions/_shared/data.ts               ingredient keys, the ones the recipes use, dinner categories, tags, example recipes
//   supabase/functions/_shared/style-references.ts   the photos in supabase/style/, as data URLs for the image model
//
//   npm run supabase-data
//
// Run it after changing src/_data/foods.json, the tags or categories in src/js/recipes.js, the recipes in
// src/recept/ (their ingredient keys, and the examples below) or the photos in supabase/style/, then
// deploy the functions again (HANDOFF.md).

import fs from 'node:fs';
import yaml from 'js-yaml';
import {recipeFoodKeys} from '../lib/foods.js';
import {taxonomy} from '../lib/taxonomy.js';
import {parseRecipeBody} from '../lib/recipe-body.js';

const root = new URL('../', import.meta.url);
const file = path => new URL(path, root);
const t = taxonomy();

// The categories the home page suggests dinners from (`dinnerMeals` in src/js/app.js). New recipes are dinners too.
const dinnerMeals = ['main', 'soup', 'salad', 'sandwich'];

// The recipes Claude sees as examples of the format and the house voice, with the scene for each photo
// (Claude writes one for every new recipe; supabase/functions/_shared/photo-prompt.ts adds the fixed
// opening and closing, and the image model draws from the whole).
const examples = {
  '45-pastafrittata': 'A thick, round pasta frittata in a black cast-iron pan, golden and crisp on top with a visible swirl of spaghetti strands, one wedge lifted out on a spatula to show the soft, eggy inside, sprinkled with chopped parsley and finely grated aged cheese. Beside it, a small plate with a served wedge topped with blistered, glossy roasted cherry tomatoes, torn basil leaves and flakes of sea salt. Setting: a cozy Scandinavian kitchen table of dark weathered wood with a red-and-white striped linen tea towel, a bowl of leftover cooked spaghetti, cherry tomatoes on the vine, two brown eggs, a wedge of aged cheese with a small grater and a slightly wilted bunch of flat-leaf parsley. Warm golden side light from a window with a strong backlight catching the crisp golden crust and the glossy tomatoes, a faint wisp of steam rising.',
  '29-shakshuka': 'A black cast-iron pan of shakshuka, a thick, glossy, deep red sauce of tomatoes and peppers bubbling around four eggs, the whites just set and the yolks bright, glowing orange, scattered with crumbled feta, chopped parsley and chili flakes. In front, thick slices of toasted sourdough with charred, crackly crusts, one piece dipped into the sauce, and a small speckled stoneware bowl of crumbled feta. Setting: a sunny Scandinavian kitchen table of weathered pale wood with a dusty-pink linen napkin, a halved red pepper, a few garlic cloves, a slightly wilted bunch of flat-leaf parsley, a tiny dish of chili flakes and two speckled stoneware mugs of black coffee. Warm golden morning light from a window with a strong backlight catching the glossy sauce and the yolks so they glow like little suns, soft steam rising.',
  '200-quesadillas': 'Quesadilla triangles stacked on a wooden board, crisp and golden-brown with toasted spots, filled with black beans, sweetcorn, diced red pepper and melted cheese, one triangle lifted away on a spatula so long strings of cheese stretch between the pieces. Behind them, small patterned ceramic bowls of chunky tomato salsa, creamy mashed avocado with lime and a cool dollop of sour cream. Setting: a bright Scandinavian kitchen table of pale oak with a colorful striped cotton cloth, a stack of soft tortillas, a small bowl of leftover sweetcorn and black beans, half a red pepper, a few chunky ends of cheese, a halved lime and a slightly wilted bunch of coriander. Warm golden afternoon light from a window with a strong backlight catching the stretching cheese and the glossy salsa so they glow, a faint wisp of steam rising.'
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

// The ingredient keys the archive's recipes use, in the order of the ingredient list. Claude is sent
// these by name instead of every food the site knows: foods.json is a whole grocery list, and with all
// of it each fridge photo and each new recipe would cost tens of thousands of tokens more.
const usedKeys = recipeFoodKeys(recipes.map(recipe => recipe.data));

const data = {
  foods: Object.fromEntries(Object.entries(t.foods).map(([key, food]) => [key, {name: food.name, aliases: food.aliases ?? []}])),
  commonFoods: Object.keys(t.foods).filter(key => usedKeys.has(key)),
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

console.log(`supabase/functions/_shared/data.ts: ${Object.keys(data.foods).length} ingredient keys (${data.commonFoods.length} used by recipes), ${data.tags.length} tags, ${data.examples.length} examples`);
console.log(`supabase/functions/_shared/style-references.ts: ${styleFiles.length} photos`);
