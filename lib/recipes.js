// What the build works out from a recipe's Markdown file (src/recept/<id>.md):
//   recipePage()      everything the recipe page, its cards and the recipe index need, as `recipe`
//   recipeListings()  the recipes grouped into categories, types and tags, for their pages
//
// The front matter is checked as it is read. A mistake that would break the page or the browser
// code, like an unknown category or ingredient key, stops the build with a message naming the file.

import fs from 'node:fs';
import site from '../src/_data/site.js';
import {taxonomy, backLinks} from './taxonomy.js';
import {parseRecipeBody} from './recipe-body.js';

const schemaDiets = {Vegan: 'VeganDiet', Vegetarian: 'VegetarianDiet', 'Gluten free': 'GlutenFreeDiet'};

// `ingredients` is either a plain list or, when the recipe has titled groups, a list of {title, items}.
function ingredientSections(ingredients, fail) {
  if (!Array.isArray(ingredients) || !ingredients.length) fail('`ingredients` must be a list.');
  const grouped = ingredients.filter(entry => entry && typeof entry === 'object' && 'items' in entry);
  if (grouped.length && grouped.length !== ingredients.length) {
    fail('`ingredients` must be either a plain list of ingredients or a list of groups with `items`, not a mix.');
  }
  const sections = grouped.length ? ingredients : [{items: ingredients}];
  for (const section of sections) {
    if (!Array.isArray(section.items) || !section.items.length) fail(`The ingredient group "${section.title}" has no items.`);
    for (const item of section.items) {
      if (typeof item?.name !== 'string') fail('Every ingredient needs a `name`.');
    }
  }
  return sections;
}

function check(data, t) {
  const file = data.page.inputPath;
  const fail = message => { throw new Error(`${file}: ${message}`); };
  for (const field of ['title', 'description', 'image', 'cardImage', 'alt', 'timeLabel']) {
    if (typeof data[field] !== 'string' || !data[field]) fail(`\`${field}\` is missing.`);
  }
  // Image paths are relative to src/, e.g. assets/recipes/01-rodbetspytt.webp.
  for (const field of ['image', 'cardImage']) {
    if (!fs.existsSync(new URL(`../src/${data[field]}`, import.meta.url))) fail(`\`${field}\`: there is no src/${data[field]}.`);
  }

  const categories = data.categories;
  if (!Array.isArray(categories) || !categories.length) fail('`categories` must list at least one category.');
  const unknown = categories.filter(key => !(key in t.mealTypes));
  if (unknown.length) fail(`Unknown category ${unknown.join(', ')}. The categories are in mealTypes in src/recipes.js.`);
  if (categories.some(key => t.nonFoodMeals.includes(key)) && categories.length > 1) {
    fail(`A ${t.nonFoodMeals.join(', ')} recipe has that one category only.`);
  }

  const tags = data.tags ?? [];
  const unlabelled = tags.filter(tag => !(tag in t.recipeTagLabels));
  if (unlabelled.length) {
    fail(`Tag ${unlabelled.join(', ')} has no Swedish label. Add it to recipeTagLabels in src/recipes.js.`);
  }
  if (data.time != null && !Number.isFinite(data.time)) fail('`time` must be a number of minutes, or left out.');

  const sections = ingredientSections(data.ingredients, fail);
  const keys = [...(data.pantryKeys ?? []), ...sections.flatMap(section => section.items.map(item => item.key).filter(Boolean))];
  const unknownKeys = [...new Set(keys.filter(key => !(key in t.foods)))];
  if (unknownKeys.length) {
    fail(`Unknown ingredient key ${unknownKeys.join(', ')}. The keys are in src/_data/foods.json and \`foods\` in src/recipes.js.`);
  }
  return {categories, tags, sections};
}

// Hands-on minutes for "Under 20 min" and schema.org totalTime. A label that adds a rest
// ("11 min + 1–2 veckor", "20 min + 1–3 dygn") or stores an overnight range as its long end
// is not a cook time, so those recipes leave `time` out.
function cookMinutes(recipe) {
  if (!Number.isFinite(recipe.time)) return null;
  const label = String(recipe.timeLabel ?? '');
  if (/[+]|veck|dygn|torktid|dragtid|över natten/i.test(label)) return null;
  if (recipe.time > 12 * 60 && /[–-]/.test(label)) return null;
  return recipe.time;
}

function structuredData(recipe, t) {
  const diets = t.allTags(recipe).filter(tag => tag in schemaDiets).map(tag => `https://schema.org/${schemaDiets[tag]}`);
  const minutes = cookMinutes(recipe);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: [site.absolute(recipe.image) ?? `../${recipe.image}`],
    recipeCategory: t.mealName(recipe.meals[0]),
    keywords: recipe.tags.map(t.tagLabel).join(', '),
    ...(diets.length && {suitableForDiet: diets}),
    ...(recipe.facts.Portioner && {recipeYield: recipe.facts.Portioner}),
    ...(minutes != null && {totalTime: `PT${minutes}M`}),
    recipeIngredient: recipe.ingredients.filter(item => !item.note).map(item => item.name),
    recipeInstructions: recipe.steps.map(step => ({'@type': 'HowToStep', text: step.text}))
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function recipePage(data) {
  const t = taxonomy();
  const {categories, tags, sections} = check(data, t);
  const id = data.page.fileSlug;
  const {image, cardImage} = data;
  const food = t.isFood({meals: categories});
  const meal = t.mealTypes[categories[0]];
  const ingredients = sections.flatMap(section => section.items);
  const body = parseRecipeBody(data.page.rawInput, data.page.inputPath);

  const recipe = {
    id,
    title: data.title,
    description: data.description,
    image,
    cardImage,
    alt: data.alt,
    meals: categories,
    tags,
    type: t.typeOf(categories),
    time: data.time ?? null,
    timeLabel: data.timeLabel,
    // Shown as label: value pairs. Numbers written without quotes in the front matter print the same.
    facts: Object.fromEntries(Object.entries(data.facts ?? {}).map(([label, value]) => [label, String(value)])),
    beforeYouStart: data.beforeYouStart,
    pantryKeys: data.pantryKeys ?? [],
    ingredients,
    steps: body.directionSections.flatMap(section => section.steps),
    ...body
  };

  return {
    ...recipe,
    food,
    url: site.absolute(`recept/${id}.html`),
    imageUrl: site.absolute(image),
    badge: meal.badge,
    noun: categories.includes('spa') ? 'behandling' : 'recept',
    // Food recipes link to their category pages; the others show their type as a badge.
    categoryLinks: food ? categories.map(key => ({label: t.mealName(key), path: t.categoryPath(key)})) : [],
    tagLinks: tags.map(tag => ({label: t.tagLabel(tag), path: t.tagPath(tag)})),
    ingredientCount: ingredients.filter(item => !item.note).length,
    ingredientGroups: sections.map((section, groupIndex) => ({
      title: section.title,
      items: section.items.map((item, index) => ({
        ...item,
        // Same id format as before, so shopping lists people already have keep working.
        shoppingId: JSON.stringify([id, `${groupIndex}-${index}-${item.key ?? 'unmatched'}`, item.name])
      }))
    })),
    structuredData: food ? structuredData(recipe, t) : null,

    // The card on category, type and tag pages (src/_includes/recipe-card.njk).
    card: {
      id,
      title: data.title,
      description: data.description,
      cardImage,
      timeLabel: data.timeLabel,
      mealIcon: meal.icon,
      mealName: t.mealName(categories[0]),
      chips: tags.slice(0, 3).map(t.tagLabel),
      action: meal.action ?? 'Visa recept'
    },

    // This recipe's entry in data/recipe-index.js, which the home page and the archive load:
    // no amounts and no instructions. The browser code calls the categories `meals`.
    index: {
      id,
      title: data.title,
      description: data.description,
      image,
      cardImage,
      meals: categories,
      tags,
      time: data.time ?? null,
      timeLabel: data.timeLabel,
      pantryKeys: data.pantryKeys ?? [],
      foodKeys: [...new Set(ingredients.filter(item => item.key).map(item => item.key))],
      search: ingredients.map(item => item.name).join(' ')
    }
  };
}

// The recipes grouped for their pages. `items` are Eleventy collection items in recipe order.
//   categories   one per food category with recipes, e.g. Soppor → kategori/soppor.html
//   types        Mat, Hemmaspa, Hushåll & städ and Husdjur → typ/mat.html, …
//   tags         one per tag, including tags a recipe gets through another (Vegan → Vegetarian)
export function recipeListings(items) {
  const t = taxonomy();
  const categoriesOf = item => item.data.categories ?? [];

  const categories = t.foodCategories
    .map(key => ({key, recipes: items.filter(item => categoriesOf(item).includes(key))}))
    .filter(category => category.recipes.length)
    .map(({key, recipes}) => {
      const label = t.mealTypes[key].label;
      return {
        kind: 'category', key, label, recipes,
        path: t.categoryPath(key),
        icon: t.mealTypes[key].icon,
        intro: `Alla recept i kategorin ${label}.`,
        description: `Alla recept i kategorin ${label} på Restfest.`,
        back: backLinks.archive
      };
    });
  // Every category page and the Mat page link to all the categories.
  const categoryLinks = categories.map(({key, label, path, icon}) => ({key, label, path, icon}));
  for (const category of categories) category.links = categoryLinks;

  const types = t.recipeTypes
    .map(type => ({...type, recipes: items.filter(item => t.typeOf(categoriesOf(item)) === type.key)}))
    .filter(type => type.recipes.length)
    .map(({key, label, path, icon, intro, back, recipes}) => ({
      kind: 'type', key, label, path, icon, intro, recipes,
      description: intro,
      back: backLinks[back],
      ...(key === 'food' && {links: categoryLinks})
    }));

  const tagNames = [...new Set(items.flatMap(item => t.allTags({tags: item.data.tags ?? []})))]
    .sort((a, b) => t.tagLabel(a).localeCompare(t.tagLabel(b), 'sv'));
  const tags = tagNames.map(tag => {
    const label = t.tagLabel(tag);
    const recipes = items.filter(item => t.allTags({tags: item.data.tags ?? []}).includes(tag));
    return {
      kind: 'tag', key: tag, label, recipes,
      path: t.tagPath(tag),
      icon: 'recipes',
      intro: `Alla recept med taggen ${label}.`,
      description: `Alla recept med taggen ${label} på Restfest.`,
      // Tags used only by spa, cleaning and pet recipes lead back to Mer än mat.
      back: recipes.some(item => t.typeOf(categoriesOf(item)) === 'food') ? backLinks.archive : backLinks.more
    };
  });

  // Two labels that make the same address would overwrite each other's page.
  const paths = [...categories, ...types, ...tags].map(listing => listing.path);
  const clash = paths.find((path, index) => paths.indexOf(path) !== index);
  if (clash) throw new Error(`Two categories, types or tags share the address ${clash}. Rename one of their labels.`);

  return {categories, types, tags};
}
