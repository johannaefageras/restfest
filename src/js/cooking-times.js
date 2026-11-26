"use strict";

// Finds the cooking times in a recipe step ("stek i 4–5 minuter", "en halvtimme", "1 timme och 15
// minuter"), so cooking.js can turn each into a timer button. A range rings at its low end. Only 30
// seconds to 2 hours count: "10 sekunder" is quicker to count than to start, and "över natten",
// "2 dygn" or "3 timmar i kylen" are not timers. Classic script, loaded before cooking.js and app.js,
// so every top-level name starts with "cooking" (see docs/superpowers/specs/2026-11-26-cooking-steps-design.md).

const cookingMinSeconds = 30;
const cookingMaxSeconds = 2 * 60 * 60;

// A number as recipes write it: 10, 1,5, 1½, 1 ½ or ¾.
const cookingNumber = String.raw`(?:\d+(?:,\d+)?(?: ?[½¼¾])?|[½¼¾])`;
// The units, longest spelling first. Nothing may follow but a non-letter, so the definite forms
// ("de sista 2 minuterna") and words like "spiskummin" or "kvarts" never match.
const cookingUnit = String.raw`(?:sekunders|sekunder|sekund|minuters|minuter|minuts|minut|min|timmars|timmar|timmes|timme|tim)(?!\p{L})`;
const cookingRangeTo = String.raw`(?:\s?[–-]\s?|\s+till\s+)`;
// The alternatives are tried in order at each position, so the longer forms come first. The first
// group is the character before the time (or the start), standing in for a lookbehind, which Safari
// before 16.4 can't parse.
const cookingTimePattern = new RegExp(
  String.raw`(^|[^\p{L}\d,½¼¾])(` +
    [
      String.raw`${cookingNumber}\s+tim(?:me|mar)\s+och\s+${cookingNumber}\s+minut(?:er)?(?!\p{L})`,
      String.raw`${cookingNumber}\s+${cookingUnit}${cookingRangeTo}${cookingNumber}\s+${cookingUnit}`,
      String.raw`${cookingNumber}${cookingRangeTo}${cookingNumber}\s+${cookingUnit}`,
      String.raw`${cookingNumber}\s+${cookingUnit}`,
      String.raw`en\s+(?:halv\s+minut|halv\s+timme|halvtimme|minut|timme|kvart)(?!\p{L})`,
    ].join("|") +
    ")",
  "gu",
);
const cookingWordTimes = {
  "halv minut": 30,
  "halv timme": 1800,
  halvtimme: 1800,
  minut: 60,
  timme: 3600,
  kvart: 900,
};
const cookingFractions = { "½": 0.5, "¼": 0.25, "¾": 0.75 };

function cookingParseNumber(text) {
  const [, whole = "", decimals, fraction] = text.match(/^(\d*)(?:,(\d+))? ?([½¼¾])?$/);
  return (
    Number(whole || 0) +
    (decimals ? Number(`0.${decimals}`) : 0) +
    (fraction ? cookingFractions[fraction] : 0)
  );
}

function cookingUnitSeconds(unit) {
  if (unit.startsWith("sek")) return 1;
  if (unit.startsWith("min")) return 60;
  return 3600;
}

// The low end of a matched phrase, in seconds.
function cookingPhraseSeconds(phrase) {
  if (phrase.startsWith("en"))
    return cookingWordTimes[phrase.replace(/^en\s+/, "").replace(/\s+/g, " ")];
  const pairs = [
    ...phrase.matchAll(new RegExp(`(${cookingNumber})(?:\\s+(${cookingUnit}))?`, "gu")),
  ].map(([, number, unit]) => ({ number: cookingParseNumber(number), unit }));
  // "1 timme och 15 minuter": both parts add up.
  if (/\soch\s/.test(phrase))
    return pairs.reduce((sum, { number, unit }) => sum + number * cookingUnitSeconds(unit), 0);
  // A single time or a range: the first number, in the first unit written ("4–5 minuter",
  // "15 minuter till 1 timme").
  const unit = pairs.find((pair) => pair.unit).unit;
  return pairs[0].number * cookingUnitSeconds(unit);
}

function cookingFindTimes(text) {
  const times = [];
  for (const match of text.matchAll(cookingTimePattern)) {
    const phrase = match[2];
    const seconds = Math.round(cookingPhraseSeconds(phrase));
    if (seconds < cookingMinSeconds || seconds > cookingMaxSeconds) continue;
    const start = match.index + match[1].length;
    times.push({ start, end: start + phrase.length, text: phrase, seconds });
  }
  return times;
}

// "4 minuter", "1 timme 15 minuter", "1 minut 30 sekunder": for button names and announcements.
function cookingDurationWords(seconds) {
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = total % 60;
  return [
    hours && `${hours} ${hours === 1 ? "timme" : "timmar"}`,
    minutes && `${minutes} ${minutes === 1 ? "minut" : "minuter"}`,
    rest && `${rest} ${rest === 1 ? "sekund" : "sekunder"}`,
  ]
    .filter(Boolean)
    .join(" ");
}
