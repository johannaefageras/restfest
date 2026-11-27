import { amountParts } from './recipe-amounts.js';

// A view of the source entries, never a replacement for them. Recipe membership, offline edits
// and removals continue to address the original ids through the existing sync protocol.
const fractions = [[1/8, '⅛'], [1/4, '¼'], [1/3, '⅓'], [3/8, '⅜'], [1/2, '½'], [5/8, '⅝'], [2/3, '⅔'], [3/4, '¾'], [7/8, '⅞']];
const number = '(?:\\d+\\s+\\d+/\\d+|\\d+/\\d+|\\d+(?:[.,]\\d+)?(?:\\s?[¼½¾⅓⅔⅛⅜⅝⅞])?|[¼½¾⅓⅔⅛⅜⅝⅞])';
const leading = new RegExp(`^(?:(ca\\.?|cirka)\\s+)?(${number})(?:\\s*[–-]\\s*(${number}))?\\s*(.+)$`, 'iu');
const normalized = text => text.normalize('NFC').toLocaleLowerCase('sv-SE').trim().replace(/\s+/g, ' ');
const units = new Map();
function unit(names, dimension, factor, singular, plural = singular) {
  for (const name of names.split('|')) units.set(name, { dimension, factor, singular, plural });
}
unit('kg|kilo|kilogram', 'weight', 1000, 'kg');
unit('hg|hekto|hektogram', 'weight', 100, 'hg');
unit('g|gram', 'weight', 1, 'g');
unit('mg|milligram', 'weight', 0.001, 'mg');
unit('l|liter', 'volume', 1000, 'l');
unit('dl|deciliter', 'volume', 100, 'dl');
unit('cl|centiliter', 'volume', 10, 'cl');
unit('ml|milliliter', 'volume', 1, 'ml');
unit('msk|matsked|matskedar', 'volume', 15, 'msk');
unit('tsk|tesked|teskedar', 'volume', 5, 'tsk');
unit('krm|kryddmått', 'volume', 1, 'krm');
unit('st|styck|stycken', 'count', 1, '');
for (const [singular, plural] of [['burk', 'burkar'], ['paket', 'paket'], ['förpackning', 'förpackningar'], ['påse', 'påsar'], ['kruka', 'krukor'], ['flaska', 'flaskor'], ['ask', 'askar'], ['knippe', 'knippen'], ['klyfta', 'klyftor']]) {
  unit(`${singular}|${plural}`, `package:${singular}`, 1, singular, plural);
}
const unitPattern = new RegExp(`^(${[...units.keys()].sort((a,b) => b.length-a.length).join('|')})\\.?(?:\\s+|$)`, 'iu');
const plurals = new Map();
for (const [singular, plural] of [['gul lök', 'gula lökar'], ['röd lök', 'röda lökar'], ['lök', 'lökar'], ['rödlök', 'rödlökar'], ['morot', 'morötter'], ['tomat', 'tomater'], ['citron', 'citroner'], ['lime', 'limefrukter'], ['paprika', 'paprikor'], ['röd paprika', 'röda paprikor'], ['grön paprika', 'gröna paprikor'], ['gul paprika', 'gula paprikor'], ['äpple', 'äpplen'], ['banan', 'bananer'], ['vitlöksklyfta', 'vitlöksklyftor'], ['purjolök', 'purjolökar'], ['salladslök', 'salladslökar'], ['champinjon', 'champinjoner']]) {
  const forms = { singular, plural };
  plurals.set(singular, forms); plurals.set(plural, forms);
}

function ingredientName(text) {
  // Preparation may be omitted from the buying name; product variants such as cooked, fresh,
  // dried, lactose-free, fat percentage and package size must remain distinct.
  const name = normalized(text).replace(/,\s*(?:(?:fin|grov|tunt? )?(?:hackad[et]?|riven|rivna|skivad[et]?|tärnad[et]?|skalad[et]?|strimlad[et]?)|i klyftor|rumstemperera(?:de?|t))\.?$/u, '');
  const forms = plurals.get(name);
  return { key: forms?.singular ?? name, singular: forms?.singular ?? name, plural: forms?.plural ?? name };
}

function parse(text) {
  const clean = text.normalize('NFC').trim();
  const match = clean.match(leading);
  if (!match) {
    // Embedded quantities ("saft av ½ citron") cannot safely be turned into a summed amount.
    if (/[\d¼½¾⅓⅔⅛⅜⅝⅞]/u.test(clean)) return null;
    return { name: ingredientName(clean), dimension: 'unspecified', low: 0, high: 0, approximate: false };
  }
  const low = amountParts(match[2]).find(part => part.amount != null)?.amount;
  const high = match[3] ? amountParts(match[3]).find(part => part.amount != null)?.amount : low;
  if (!low || !high || !Number.isFinite(low + high) || high < low) return null;
  let rest = match[4];
  const measure = rest.match(unitPattern);
  const spec = measure ? units.get(normalized(measure[1])) : { dimension: 'count', factor: 1, singular: '', plural: '' };
  if (measure) rest = rest.slice(measure[0].length);
  if (!rest.trim() || /\b(?:eller|och|plus|per)\b/iu.test(rest)) return null;
  // Percentages and named product/package sizes are identifiers, not extra amounts to add.
  // Other embedded numbers can describe an alternative or an equivalent amount: leave them alone.
  const withoutSize = rest.replace(/\d+(?:[.,]\d+)?\s*%/g, '').replace(/\(\s*(?:à\s*)?\d+(?:[.,]\d+)?\s*(?:g|kg|ml|cl|dl|l)\s*\)/giu, '');
  if (/[\d¼½¾⅓⅔⅛⅜⅝⅞]/u.test(withoutSize)) return null;
  return { name: ingredientName(rest), ...spec, low: low * spec.factor, high: high * spec.factor, approximate: Boolean(match[1]) };
}

function amount(value) {
  const whole = Math.floor(value + 1e-9);
  const fraction = fractions.find(([n]) => Math.abs(value - whole - n) < 1e-8);
  return fraction ? `${whole || ''}${fraction[1]}` : new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 6, useGrouping: false }).format(value);
}

function totalText(group) {
  const { parsed } = group;
  if (parsed.dimension === 'unspecified') return group.items[0].customText || group.items[0].text;
  const low = group.parts.reduce((sum, part) => sum + part.low, 0);
  const high = group.parts.reduce((sum, part) => sum + part.high, 0);
  let factor = 1, label = '';
  if (parsed.dimension === 'weight') {
    [factor, label] = high >= 1000 ? [1000, 'kg'] : high >= 1 ? [1, 'g'] : [0.001, 'mg'];
  } else if (parsed.dimension === 'volume') {
    if (high >= 1000) [factor, label] = [1000, 'l'];
    else if (high >= 100) [factor, label] = [100, 'dl'];
    else if (group.parts.every(part => part.singular === parsed.singular)) [factor, label] = [parsed.factor, parsed.singular];
    else [factor, label] = [1, 'ml'];
  } else if (parsed.dimension.startsWith('package:')) label = high <= 1 ? parsed.singular : parsed.plural;
  const name = parsed.dimension === 'count' && high <= 1 ? parsed.name.singular : parsed.name.plural;
  const range = Math.abs(high - low) < 1e-9 ? amount(low / factor) : `${amount(low / factor)}–${amount(high / factor)}`;
  return `${group.parts.some(part => part.approximate) ? 'ca ' : ''}${range} ${label ? label + ' ' : ''}${name}`;
}

export function groupShoppingItems(items, { separateNotes = false } = {}) {
  const groups = new Map();
  for (const item of items) {
    const text = item.customText || item.text;
    const parsed = parse(text);
    const note = item.note || '';
    const noteKey = normalized(note);
    // Purchase states stay separate. Copies also separate notes because each shared row has one note field.
    const key = parsed ? JSON.stringify([parsed.name.key, parsed.dimension, item.checked, separateNotes ? noteKey : '']) : `single:${item.id}`;
    let group = groups.get(key);
    if (!group) {
      group = { id: item.id, items: [], parts: [], parsed, text, checked: item.checked, note, noteKey };
      groups.set(key, group);
    }
    if (group.noteKey !== noteKey) group.note = '';
    group.items.push(item);
    group.parts.push(parsed);
  }
  return [...groups.values()].map(group => ({
    id: group.id, items: group.items, checked: group.checked, note: group.note,
    text: group.items.length > 1 ? totalText(group) : group.text,
    recipe: [...new Set(group.items.map(item => item.recipe).filter(Boolean))].join(' · '),
  }));
}

const archiveSource = /^archive:([a-z0-9][a-z0-9-]{0,199})$/;
const generatedSource = /^generated:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;

export function shoppingRecipeSources(items, archive = [], generated = []) {
  const sources = new Map();
  for (const item of items) {
    if (!item.recipe?.trim() && !item.source) continue;
    let source = item.source || '';
    let identity;
    try { identity = JSON.parse(item.id); } catch {}
    if (!archiveSource.test(source) && !generatedSource.test(source)) {
      source = '';
      if (Array.isArray(identity) && typeof identity[0] === 'string') {
        if (/^\d+-[a-z0-9-]+$/.test(identity[0])) source = `archive:${identity[0]}`;
        else if (/^ny-[0-9a-f]{8}$/.test(identity[0])) {
          const matches = generated.filter(recipe => recipe.id.startsWith(identity[0].slice(3)));
          if (matches.length === 1) source = `generated:${matches[0].id}`;
          else source = `generated-prefix:${identity[0]}`;
        } else if (identity[0] === 'week') source = 'legacy-week';
      }
    }
    let title = item.recipe, path = null, kind = 'legacy';
    const archiveMatch = source.match(archiveSource), generatedMatch = source.match(generatedSource);
    if (archiveMatch) {
      kind = 'archive';
      title = archive.find(recipe => recipe.id === archiveMatch[1])?.title || title;
      path = `recept/${archiveMatch[1]}.html`;
    } else if (generatedMatch) {
      kind = 'generated';
      title = generated.find(recipe => recipe.id === generatedMatch[1])?.title || title;
      path = `nytt-recept.html?id=${generatedMatch[1]}`;
    } else if (source === 'legacy-week') { kind = 'legacy-week'; title = 'Äldre veckoplan'; }
    // Historical entries without an id can still be managed by their stored recipe name. Never
    // guess a destination URL, or conflate known recipes merely because their titles are equal.
    const key = source || `legacy:${title}`;
    if (!sources.has(key)) sources.set(key, { key, title: title || 'Recept', path, kind, items: [] });
    sources.get(key).items.push(item);
  }
  return [...sources.values()].map(source => ({ ...source, remaining: source.items.filter(item => !item.checked).length }));
}

// A recipe action targets only the rows that were displayed when it was chosen. Undo restores
// missing entries only, preserving any newer edits or purchases already restored on another device.
export function removeShoppingRecipe(items, ids) {
  const selected = new Set(ids);
  const removed = items.filter(item => selected.has(item.id)).map(item => ({ ...item }));
  return { removed, changes: removed.map(item => ({ kind: 'remove', id: item.id })) };
}

export function restoreShoppingRecipe(items, removed) {
  const present = new Set(items.map(item => item.id));
  return removed.filter(item => !present.has(item.id)).map(item => ({ kind: 'add', id: item.id, item: { ...item } }));
}
