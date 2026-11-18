// Store departments are a view of the list, independent of recipe taxonomy and saved item ids.
export const shoppingDepartments = [
  ['produce', 'Frukt & grönt'], ['bread', 'Bröd & bageri'], ['meat', 'Kött & fågel'],
  ['fish', 'Fisk & skaldjur'], ['vegetarian', 'Vegetariskt & kylvaror'], ['dairy', 'Mejeri & ägg'],
  ['pantry', 'Skafferi'], ['spices', 'Kryddor & smaksättning'], ['drinks', 'Drycker'],
  ['snacks', 'Snacks & sötsaker'], ['frozen', 'Frys'], ['household', 'Hushåll & städ'],
  ['hygiene', 'Hygien & hälsa'], ['baby', 'Barn & baby'], ['pets', 'Husdjur'], ['other', 'Övrigt'],
].map(([id, label]) => ({ id, label }));
const ids = new Set(shoppingDepartments.map(department => department.id));
const fold = value => String(value ?? '').toLocaleLowerCase('sv-SE').normalize('NFD')
  .replace(/\p{M}/gu, '').replaceAll('ø', 'o').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
const defaults = {
  vegetables: 'produce', fruit: 'produce', mushrooms: 'produce', herbs: 'spices',
  meat: 'meat', poultry: 'meat', fish: 'fish', dairy: 'dairy', eggs: 'dairy',
  pantry: 'pantry', grains: 'pantry', nuts: 'pantry', legumes: 'pantry',
  household: 'household', health: 'hygiene', hygiene: 'hygiene', 'baby-care': 'baby', pets: 'pets',
};

function departmentForForm(text, fallback = 'other') {
  // These aisles retain their identity even for frozen pet food or food-scented toiletries.
  if (['household', 'hygiene', 'baby', 'pets'].includes(fallback)) return fallback;
  if (/\b(?:diskmedel|tvattmedel|toalettpapper|hushallspapper|stadmedel|rengoringsmedel|bakplatspapper|plastfolie|aluminiumfolie|avfallspasar|soppasar|glasskal)\b/.test(text)) return 'household';
  if (/\b(?:fryst|frysta|djupfryst\w*|glass|vaniljglass|chokladglass|graddglass|sorbet|glasspinnar|glasspinne|fiskpinnar|pommes\s+frites)\b/.test(text)) return 'frozen';
  if (/\b(?:konserverad\w*|konserv\w*|inlagd\w*|soltorkad\w*|pa burk|krossade tomater|passerade tomater|tomatpure|kokosmjolk|kokosgradde)\b/.test(text)) return 'pantry';
  if (/\b(?:tonfisk|sardiner|sardeller|ansjovis|makrill i tomatsas)\b/.test(text) && !/\b(?:farsk|farska|file|fileer)\b/.test(text)) return 'pantry';
  if (/\b(?:brod|knackebrod|tunnbrod|surdegsbrod|hamburgerbrod|korvbrod|tortillabrod|pita|pitabrod|baguette\w*|frall\w*|limpa|limpor|brioche|kanelbull\w*)\b/.test(text)) return 'bread';
  if (/\b(?:tofu|tempeh|quorn|seitan|vegofars|vegoburgare|(?:vegetarisk\w*|vegansk\w*)\s+(?:fars|bullar|burgare|korv|biffar|ost|farskost|palegg)|farsk smordeg|farsk pasta)\b/.test(text)) return 'vegetarian';
  if (/\b(?:(?:havre|soja|mandel|ris|art|cashew)(?:dryck|mjolk|yoghurt|gradde|fraiche)|vaxtbaserad\s+(?:dryck|gradde|yoghurt))\b/.test(text)) return 'dairy';
  if (/\b(?:kaffe(?:bonor|pulver|kapslar)?|bryggkaffe|snabbkaffe|espresso|te|gront te|svart te|juice\w*|saft|lask|mineralvatten|kolsyrat vatten|energidryck|sportdryck|cider|ol|vin|rodvin|vitvin|alkoholfri\w*)\b/.test(text)) return 'drinks';
  if (fallback !== 'dairy' && /\b(?:\w*choklad\w*|godis|karamell\w*|lakrits|chips|popcorn|ostbagar|smagodis)\b/.test(text)) return 'snacks';
  if (/\b(?:torkad\w*|mald\w*|pulver)\b/.test(text)) {
    if (/\b(?:ingefara|vitlok|orter|basilika|dill|persilja|koriander|graslok|timjan|rosmarin|mynta|oregano|chili)\b/.test(text)) return 'spices';
    if (fallback === 'produce') return 'pantry';
  }
  if (/\b(?:vitlok|vitloksklyft\w*|ingefara|citrongras)\b/.test(text)
    && !/\b(?:torkad\w*|mald\w*|pulver|inlagd\w*)\b/.test(text)) return 'produce';
  if (/\b(?:farsk\w*|kruka|krukor|knippe|knippen)\b/.test(text)
    && /\b(?:orter|basilika|dill|persilja|koriander|graslok|timjan|rosmarin|mynta|oregano)\b/.test(text)) return 'produce';
  if (/\b(?:sockerartor|sugarsnaps|haricots verts|brytbonor|vaxbonor|bongroddar)\b/.test(text)) return 'produce';
  return fallback;
}

// Build a compact name/alias index from the existing full grocery catalogue, including non-foods.
// Prefer an actual product name over a broad recipe alias; ambiguous equal-priority names stay other.
export function shoppingDepartmentNames(foods) {
  const words = new Map();
  function add(value, group, priority) {
    const name = fold(value);
    if (!name) return;
    const id = departmentForForm(name, defaults[group] ?? 'other');
    const previous = words.get(name);
    if (!previous || priority > previous.priority) words.set(name, { id, priority });
    else if (priority === previous.priority && id !== previous.id) previous.id = 'other';
  }
  for (const [key, food] of Object.entries(foods)) {
    add(food.name, food.group, 2);
    for (const alias of food.aliases ?? []) add(alias, food.group, 1);
    add(key, food.group, 0);
  }
  return shoppingDepartments.map(({ id }) => [id, [...words].filter(([, value]) => value.id === id).map(([name]) => name)]);
}

export function createShoppingDepartmentClassifier(index) {
  const names = new Map(index.flatMap(([id, words]) => words.map(word => [word, id])));
  const maxWords = Math.min(20, Math.max(1, ...Array.from(names.keys(), name => name.split(' ').length)));
  const endings = ['arna', 'erna', 'orna', 'na', 'en', 'et', 'er', 'ar', 'or', 'n', 'r'];
  function lookup(name) {
    if (names.has(name)) return names.get(name);
    for (const ending of endings) {
      if (!name.endsWith(ending)) continue;
      const stem = name.slice(0, -ending.length);
      if (stem.length < 3) continue;
      for (const candidate of [stem, stem + 'a', stem + 'e']) if (names.has(candidate)) return names.get(candidate);
    }
  }
  return value => {
    const text = fold(value);
    const direct = lookup(text);
    if (direct) return departmentForForm(text, direct);
    const tokens = text.split(' ');
    let best = 'other', score = 0;
    // Whole phrases avoid treating e.g. smördeg as smör or potatismjöl as potatis.
    for (let start = 0; start < tokens.length; start++) {
      for (let length = 1; length <= Math.min(maxWords, tokens.length - start); length++) {
        const name = tokens.slice(start, start + length).join(' ');
        const id = lookup(name);
        if (!id) continue;
        const next = length * 100 + name.length;
        if (next > score) { best = id; score = next; }
        else if (next === score && best !== id) best = 'other';
      }
    }
    return departmentForForm(text, best);
  };
}

export function groupShoppingDepartments(items, classify, text = item => item.customText || item.text) {
  const groups = new Map();
  for (const item of items) {
    const id = ids.has(item.department) ? item.department : classify(text(item));
    const key = ids.has(id) ? id : 'other';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return shoppingDepartments.filter(({ id }) => groups.has(id)).map(department => ({ ...department, items: groups.get(department.id) }));
}

let classifier;
export async function loadShoppingDepartmentClassifier() {
  if (!classifier) classifier = import('../data/shopping-departments.js')
    .then(module => createShoppingDepartmentClassifier(module.default));
  return classifier;
}
