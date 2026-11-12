// POST {images: [base64 JPEG, …]} → {keys: [ingredient keys], other: [Swedish names]}
//
// Claude looks at one to three photos of an open fridge, freezer or pantry and lists the foods it can
// see: `keys` for those in the site's ingredient list (src/_data/foods.json), `other` for the rest.
// The home page adds them to the visitor's fridge list (src/js/fridge-ai.js). The photos aren't stored.
import {askClaude, models} from '../_shared/claude.ts';
import {data} from '../_shared/data.ts';
import {checkCap} from '../_shared/limits.ts';
import {readJson, serve, VisitorError} from '../_shared/http.ts';

const foodKeys = Object.keys(data.foods);

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['keys', 'other'],
  properties: {
    keys: {type: 'array', items: {type: 'string', enum: foodKeys}},
    other: {type: 'array', items: {type: 'string'}}
  }
};

const system = `You look at photos of an open fridge, freezer or pantry for Ofta bra efter, a Swedish website that suggests dinners from what people have at home. List the foods you can see.

- keys: the key from the list below for each food you can see with reasonable certainty. Use the closest key: any pasta → pasta, grated or sliced cheese → cheddar, fresh herbs → orter, dried spices → kryddor. Read labels where you can; don't guess what's inside an opaque box or jar without a readable label.
- other: foods that are clearly there but have no key, as short Swedish names the way they'd be written on a shopping list ("Halloumi", "Sriracha", "Gräddfil"). At most eight, most useful for cooking first.
- Leave out salt, pepper, water and drinks that aren't used in cooking (soft drinks, beer, juice). Milk and cream count as food.
- Photos that show no food give two empty lists.

INGREDIENT KEYS (key: name (other words for it))
${Object.entries(data.foods).map(([key, food]) => `${key}: ${food.name}${food.aliases.length ? ` (${food.aliases.slice(0, 5).join(', ')})` : ''}`).join('\n')}`;

// A phone photo shrunk to about 1500 px on its longest side (src/js/fridge-ai.js) is well under this.
const maxImageLength = 3_000_000;

serve(['POST'], async req => {
  const body = await readJson(req);
  const images = Array.isArray(body.images) ? body.images.filter(image => typeof image === 'string' && image) : [];
  if (!images.length || images.length > 3) throw new VisitorError(400, 'Skicka en till tre bilder.');
  if (images.some(image => image.length > maxImageLength || !/^[A-Za-z0-9+/=]+$/.test(image.slice(0, 200)))) {
    throw new VisitorError(413, 'Bilden är för stor eller går inte att läsa.');
  }
  await checkCap(req, 'detect');

  const answer = await askClaude<{keys: string[]; other: string[]}>({
    model: models.detect(),
    system,
    content: [
      ...images.map(data => ({type: 'image' as const, source: {type: 'base64' as const, media_type: 'image/jpeg' as const, data}})),
      {type: 'text', text: images.length > 1 ? 'Vilka råvaror syns på bilderna?' : 'Vilka råvaror syns på bilden?'}
    ],
    schema,
    maxTokens: 1024
  });

  // Keys in any capitalisation, and names under `other` that are really a known food, go under that key.
  const byKey = new Map(foodKeys.map(key => [key.toLowerCase(), key]));
  const byName = new Map(Object.entries(data.foods)
    .flatMap(([key, food]) => [food.name, ...food.aliases].map(name => [name.toLowerCase(), key] as const)));
  const keys = new Set((answer.keys ?? []).map(key => byKey.get(String(key).toLowerCase())).filter(key => key != null));
  const other = new Set<string>();
  for (const value of answer.other ?? []) {
    const name = String(value).replace(/\s+/g, ' ').trim().slice(0, 40);
    const key = byName.get(name.toLowerCase());
    if (key) keys.add(key);
    else if (name) other.add(name);
  }
  return {keys: [...keys], other: [...other].slice(0, 8)};
});
