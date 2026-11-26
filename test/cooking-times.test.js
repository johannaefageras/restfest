// The cooking-time parser in src/js/cooking-times.js: which phrases in a recipe's steps become timer
// buttons, and for how long. Ranges ring at the low end; only 30 seconds to 2 hours count.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../src/js/cooking-times.js', import.meta.url), 'utf8');
const context = {};
vm.runInNewContext(source, context);
const { cookingFindTimes, cookingDurationWords } = context;
// The results come from the script's own realm; copy them into this one before comparing.
const plain = (value) => JSON.parse(JSON.stringify(value));
const found = (text) => plain(cookingFindTimes(text)).map((match) => [match.text, match.seconds]);

test('finds times as written', () => {
  for (const [input, expected] of [
    ['Koka i 10 minuter.', [['10 minuter', 600]]],
    ['ca 5 minuter', [['5 minuter', 300]]],
    ['Stek 1 minut', [['1 minut', 60]]],
    ['vispa 30 sekunder', [['30 sekunder', 30]]],
    ['i 1 timme', [['1 timme', 3600]]],
    ['minst 2 timmar', [['2 timmar', 7200]]],
    ['1½ timme', [['1½ timme', 5400]]],
    ['1 ½ timme', [['1 ½ timme', 5400]]],
    ['1,5 timmar', [['1,5 timmar', 5400]]],
    ['¾ timme', [['¾ timme', 2700]]],
    ['4–5 minuter', [['4–5 minuter', 240]]],
    ['4-5 minuter', [['4-5 minuter', 240]]],
    ['4 till 5 minuter', [['4 till 5 minuter', 240]]],
    ['15 minuter till 1 timme', [['15 minuter till 1 timme', 900]]],
    ['45 minuter–1 timme', [['45 minuter–1 timme', 2700]]],
    ['1 timme och 15 minuter', [['1 timme och 15 minuter', 4500]]],
    ['i en minut', [['en minut', 60]]],
    ['en timme', [['en timme', 3600]]],
    ['en halvtimme', [['en halvtimme', 1800]]],
    ['en kvart', [['en kvart', 900]]],
    ['en halv minut', [['en halv minut', 30]]],
    ['med 15 minuters vila', [['15 minuters', 900]]],
    ['10 min', [['10 min', 600]]],
    ['1 tim', [['1 tim', 3600]]],
  ]) assert.deepEqual(found(input), expected, input);
});

test('leaves non-times alone', () => {
  for (const input of [
    'några minuter', 'ett par timmar', 'någon minut', 'de sista 12–15 minuterna',
    'de första 15 minuterna', 'i 3 timmar', '2½ timmar', '10 sekunder', 'över natten', '2 dygn',
    '3 dagar', '2 veckor', '1 tsk spiskummin', 'minska värmen', 'laminat', '1¼ dl vatten',
    'vrid den ett kvarts varv', 'efter några minuters knådning', '200 grader',
  ]) assert.deepEqual(found(input), [], input);
});

test('real sentences', () => {
  assert.deepEqual(
    found('Hetta upp 2 msk smör och oljan i en stor stekpanna (minst 28 cm) på medelhög värme. Lägg i potatisen i ett jämnt lager och låt den steka orörd i 4–5 minuter innan du vänder. Stek totalt 12–15 minuter tills den är gyllene och krispig.'),
    [['4–5 minuter', 240], ['12–15 minuter', 720]],
  );
  assert.deepEqual(
    found('Koka 1 dl grötris i 1¼ dl vatten i 10 minuter. Tillsätt 5 dl mjölk och låt sjuda under lock på låg värme i ca 40 minuter.'),
    [['10 minuter', 600], ['40 minuter', 2400]],
  );
  assert.deepEqual(found('Knåda i 8–10 minuter.'), [['8–10 minuter', 480]]);
  const sentence = 'Stek i 4–5 minuter.';
  const [match] = plain(cookingFindTimes(sentence));
  assert.equal(sentence.slice(match.start, match.end), '4–5 minuter');
});

test('every recipe body gives only sane timers', () => {
  const folder = new URL('../src/recept/', import.meta.url);
  let total = 0;
  for (const file of readdirSync(folder).filter((name) => name.endsWith('.md'))) {
    const body = readFileSync(new URL(file, folder), 'utf8').split(/^---$/m).slice(2).join('---');
    for (const { text, seconds } of plain(cookingFindTimes(body))) {
      total++;
      assert.ok(seconds >= 30 && seconds <= 7200, `${file}: ${text} → ${seconds}`);
      assert.match(text, /sekund|minut|tim|kvart|min/, `${file}: ${text}`);
      assert.doesNotMatch(text, /natt|dygn|dag|veck/, `${file}: ${text}`);
    }
  }
  assert.ok(total > 700, `only ${total} timers in all recipes`);
});

test('duration words', () => {
  for (const [seconds, words] of [
    [240, '4 minuter'], [60, '1 minut'], [30, '30 sekunder'], [3600, '1 timme'],
    [7200, '2 timmar'], [4500, '1 timme 15 minuter'], [90, '1 minut 30 sekunder'],
    [5400, '1 timme 30 minuter'],
  ]) assert.equal(cookingDurationWords(seconds), words);
});
