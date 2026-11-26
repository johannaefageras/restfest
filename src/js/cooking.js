"use strict";

// Cooking along with a recipe's "Gör så här": steps you check off, timers started from the times in
// the text (cooking-times.js finds them), and the screen kept on while you cook. The design is in
// docs/superpowers/specs/2026-11-26-cooking-steps-design.md.
// A classic script loaded on every page before app.js, so they share one global scope: every
// top-level name here starts with "cooking" (or is enhanceCooking). The functions up to the page
// part are pure and tested in test/cooking.test.js.

const cookingStateKey = "restfest-cooking";
const cookingTimersKey = "restfest-timers";
// A recipe's checked steps and ingredients are kept for 12 hours; a finished timer for one.
const cookingKeepMs = 12 * 60 * 60 * 1000;
const cookingDoneKeepMs = 60 * 60 * 1000;
// A timer that finished while the page was away rings on return only if it ended this recently.
const cookingRingWithinMs = 60 * 1000;

function cookingReadJson(storage, key) {
  try {
    return JSON.parse(storage.getItem(key));
  } catch {
    return null;
  }
}

function cookingWriteJson(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {}
}

const cookingIsObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

// { [recipeId]: { steps, ingredients, screenOff, updated } }, without the entries older than 12 hours.
function cookingReadState(storage, now) {
  const stored = cookingReadJson(storage, cookingStateKey);
  if (!cookingIsObject(stored)) return {};
  return Object.fromEntries(
    Object.entries(stored).filter(
      ([, entry]) =>
        cookingIsObject(entry) &&
        typeof entry.updated === "number" &&
        entry.updated >= now - cookingKeepMs,
    ),
  );
}

function cookingSaveEntry(storage, recipeId, { steps, ingredients, screenOff }, now) {
  const state = cookingReadState(storage, now);
  state[recipeId] = { steps, ingredients, screenOff, updated: now };
  cookingWriteJson(storage, cookingStateKey, state);
}

// The saved timers, without the ones that ended more than an hour ago.
function cookingReadTimers(storage, now) {
  const stored = cookingReadJson(storage, cookingTimersKey);
  if (!Array.isArray(stored)) return [];
  return stored.filter(
    (timer) =>
      cookingIsObject(timer) &&
      typeof timer.endsAt === "number" &&
      timer.endsAt >= now - cookingDoneKeepMs,
  );
}

function cookingWriteTimers(storage, timers) {
  cookingWriteJson(storage, cookingTimersKey, timers);
}

// A time button's timer: its recipe, its place (the step's index across all sections, or n<index>
// for a note after the steps) and which time in that place it is.
function cookingTimerId(recipeId, place, phraseIndex) {
  return `${recipeId}:${place}:${phraseIndex}`;
}

function cookingStartTimer(timers, fields, now) {
  return [
    ...timers.filter((timer) => timer.id !== fields.id),
    { ...fields, endsAt: now + fields.seconds * 1000, done: false },
  ];
}

// "+1 min": a running timer gets a minute more; a finished one starts again with a minute.
function cookingAddMinute(timers, id, now) {
  return timers.map((timer) => {
    if (timer.id !== id) return timer;
    return timer.done
      ? { ...timer, endsAt: now + 60000, done: false }
      : { ...timer, endsAt: timer.endsAt + 60000 };
  });
}

function cookingRemoveTimer(timers, id) {
  return timers.filter((timer) => timer.id !== id);
}

// Marks the timers whose time is up as done. `finished` has only those that weren't done before.
function cookingDueTimers(timers, now) {
  const finished = [];
  const updated = timers.map((timer) => {
    if (timer.done || timer.endsAt > now) return timer;
    const done = { ...timer, done: true };
    finished.push(done);
    return done;
  });
  return { timers: updated, finished };
}

function cookingSortTimers(timers) {
  return [...timers].sort((a, b) => a.endsAt - b.endsAt);
}

function cookingShouldRing(timer, now) {
  return now - timer.endsAt < cookingRingWithinMs;
}

// "4:00", "0:59", "1:05:00": rounded up, so a timer shows 0:00 only when it is done.
function cookingFormatRemaining(ms) {
  const total = ms > 0 ? Math.ceil(ms / 1000) : 0;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
}

// The first step that isn't checked, or -1 when all are.
function cookingCurrentStep(checked) {
  return checked.indexOf(false);
}

// "Steg 3", or with several sections "Vattenkokare, steg 2" (each section is numbered from 1).
function cookingStepLabel(sectionTitle, stepNumber, sectionCount) {
  return sectionTitle && sectionCount > 1
    ? `${sectionTitle}, steg ${stepNumber}`
    : `Steg ${stepNumber}`;
}

// Whether the screen should stay on: while cooking a recipe that isn't finished, or while a timer
// runs, unless the visitor turned it off.
function cookingWantsScreen({ started, screenOff, allDone, running }) {
  return !screenOff && ((started && !allDone) || running > 0);
}
