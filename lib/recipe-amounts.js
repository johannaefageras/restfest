// Keep the recipe's wording, and mark just the quantities the browser may scale.
// Original names still supply structured data, search and stable shopping-list ids.
const fractions = {
  '¼': 1 / 4, '½': 1 / 2, '¾': 3 / 4,
  '⅓': 1 / 3, '⅔': 2 / 3,
  '⅛': 1 / 8, '⅜': 3 / 8, '⅝': 5 / 8, '⅞': 7 / 8,
};
const fractionChars = Object.keys(fractions).join('');
const number = `(?:\\d+\\s+\\d+/\\d+|\\d+/\\d+|\\d+(?:[.,]\\d+)?(?:\\s?[${fractionChars}])?|[${fractionChars}])`;
const quantity = new RegExp(`(?<![\\p{L}\\p{N}])${number}(?:\\s*[–-]\\s*${number})?`, 'gu');

function readNumber(text) {
  const fraction = fractions[text.at(-1)] ?? 0;
  if (fraction) return Number(text.slice(0, -1).trim() || 0) + fraction;
  if (text.includes('/')) {
    const [whole, numerator, denominator] = text.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/).slice(1);
    return Number(whole || 0) + Number(numerator) / Number(denominator);
  }
  return Number(text.replace(',', '.'));
}

export function amountParts(text) {
  const parts = [];
  let cursor = 0;
  for (const match of text.matchAll(quantity)) {
    const before = text.slice(0, match.index);
    const after = text.slice(match.index + match[0].length);
    // Percentages, recipe references (also "recept 111 eller 176"), package sizes, what something holds
    // ("äggkartong för 12 ägg") and per-unit ratios stay fixed.
    // A length of ginger is an amount; other later lengths describe a piece or tin.
    if (/recept\s+(?:nr\.?\s*)?(?:\d+\s*(?:,|och|eller)\s*)*$/i.test(before) ||
        /(?<!\p{L})för\s*$/iu.test(before) ||
        /à\s*(?:ca\s*)?$/i.test(before) ||
        /^\s*%/.test(after) ||
        /^\s*(?:×|x\b)/.test(after) || /(?:×|\bx)\s*$/.test(before) ||
        (/^\s*(?:cm|mm)\b/.test(after) && !/^(?:ca\s*)?$/i.test(before) &&
          !/^\s*(?:cm|mm)\s+färsk\s+ingefära\b/i.test(after)) ||
        /^[^,;)]*\bper\s+(?:liter|dl|flaska|portion|styck)\b/i.test(after)) continue;

    parts.push({ text: text.slice(cursor, match.index) });
    for (const token of match[0].split(/(\s*[–-]\s*)/)) {
      const amount = readNumber(token);
      parts.push(Number.isFinite(amount) && amount > 0 ? { text: token, amount } : { text: token });
    }
    cursor = match.index + match[0].length;
  }
  parts.push({ text: text.slice(cursor) });
  return parts;
}

export function recipeServings(value) {
  if (value == null) return null;
  const parts = amountParts(String(value));
  const index = parts.findIndex(part => part.amount != null);
  if (index < 0) return null;
  return {
    value: parts[index].amount,
    prefix: parts.slice(0, index),
    suffix: parts.slice(index + 1),
  };
}
