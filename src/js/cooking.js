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

// --- The page part. Everything below touches the document; it runs from cookingInitPage() and from
// enhanceCooking(), which app.js calls for each recipe it shows (its own page, the pop-up, nytt-recept).

// Per recipe view on screen: its step items, ingredient checkboxes and saved screen choice.
const cookingViews = new WeakMap();

const cookingReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function cookingIngredientBoxes(article) {
  return [...article.querySelectorAll('.cook-ingredient input[type="checkbox"]')];
}

function cookingCheckedIndexes(boxes) {
  return boxes.flatMap((box, index) => (box.checked ? [index] : []));
}

function cookingSave(article) {
  const view = cookingViews.get(article);
  cookingSaveEntry(
    localStorage,
    article.dataset.recipe,
    {
      steps: cookingCheckedIndexes(view.boxes),
      ingredients: cookingCheckedIndexes(cookingIngredientBoxes(article)),
      screenOff: view.screenOff,
    },
    Date.now(),
  );
}

function cookingDrawSteps(article) {
  const view = cookingViews.get(article);
  const checked = view.boxes.map((box) => box.checked);
  const count = checked.filter(Boolean).length;
  // The marker shows only once cooking has begun, so an untouched recipe looks as it always has.
  const current = count ? cookingCurrentStep(checked) : -1;
  view.steps.forEach((step, index) => {
    step.classList.toggle("is-done", checked[index]);
    step.classList.toggle("is-current", index === current);
  });
  view.bar.max = view.steps.length;
  view.bar.value = count;
  view.text.textContent = `${count} av ${view.steps.length} klara`;
  view.reset.hidden =
    !count && !cookingIngredientBoxes(article).some((box) => box.checked);
}

// After a step is checked, brings the next one into view if it is entirely below the screen, and
// never moves the page otherwise.
function cookingRevealCurrent(article) {
  const step = article.querySelector(".cook-step.is-current");
  if (!step || step.getBoundingClientRect().top < innerHeight) return;
  step.scrollIntoView({
    block: "nearest",
    behavior: cookingReducedMotion() ? "instant" : "smooth",
  });
}

// Called after every step toggle and timer start, inside the tap (cooking.js keeps the screen on).
function cookingActivity(article) {}

function enhanceCooking(article) {
  const section = article.querySelector(".recipe-directions");
  if (!section || cookingViews.has(article)) return;
  const heading = section.querySelector("h2");
  const row = document.createElement("div");
  row.className = "recipe-section-heading";
  heading.replaceWith(row);
  row.append(heading);
  row.insertAdjacentHTML(
    "beforeend",
    '<div class="recipe-actions cook-screen" hidden></div>',
  );
  row.insertAdjacentHTML(
    "afterend",
    `<p class="cook-steps-hint">Tryck på ett steg när det är klart.</p>
    <div class="cook-checklist cook-steps-progress">
      <progress class="cook-steps-bar" aria-label="Klara steg" value="0" max="1"></progress>
      <p class="meta cook-steps-text" aria-live="polite"></p>
      <button class="text-button cook-steps-reset" type="button" hidden>Börja om</button>
    </div>`,
  );

  // Each section (an h3 and its list) is numbered from 1; the saved indexes run across all of them.
  const lists = [...section.querySelectorAll("ol.directions")];
  const steps = [];
  const labels = [];
  for (const list of lists) {
    const before = list.previousElementSibling;
    const title = before?.matches("h3") ? before.textContent.trim() : null;
    [...list.children].forEach((step, index) => {
      const label = cookingStepLabel(title, index + 1, lists.length);
      const box = document.createElement("input");
      box.type = "checkbox";
      box.className = "cook-step-check";
      box.setAttribute("aria-label", `${label} klart`);
      step.classList.add("cook-step");
      step.prepend(box);
      steps.push(step);
      labels.push(label);
    });
  }

  const saved =
    cookingReadState(localStorage, Date.now())[article.dataset.recipe] ?? {};
  const view = {
    steps,
    labels,
    boxes: steps.map((step) => step.querySelector(".cook-step-check")),
    bar: section.querySelector(".cook-steps-bar"),
    text: section.querySelector(".cook-steps-text"),
    reset: section.querySelector(".cook-steps-reset"),
    screenOff: Boolean(saved.screenOff),
  };
  cookingViews.set(article, view);
  for (const index of saved.steps ?? []) if (view.boxes[index]) view.boxes[index].checked = true;
  const ingredients = cookingIngredientBoxes(article);
  for (const index of saved.ingredients ?? [])
    if (ingredients[index]) ingredients[index].checked = true;
  cookingDrawSteps(article);

  // A tap anywhere on a step's text checks it, except on its buttons and links, or when it ends a
  // text selection.
  section.addEventListener("click", (event) => {
    const step = event.target.closest(".cook-step");
    if (!step || event.target.closest("button, a, input, label")) return;
    if (getSelection()?.toString()) return;
    const box = step.querySelector(".cook-step-check");
    box.checked = !box.checked;
    box.dispatchEvent(new Event("change", { bubbles: true }));
  });
  section.addEventListener("change", (event) => {
    if (!event.target.matches(".cook-step-check")) return;
    article.dataset.cookingStarted = "1";
    cookingSave(article);
    cookingDrawSteps(article);
    if (event.target.checked) cookingRevealCurrent(article);
    cookingActivity(article);
  });
  article
    .querySelector(".cook-ingredient-columns")
    ?.addEventListener("change", () => {
      cookingSave(article);
      cookingDrawSteps(article);
    });
  // "Börja om" clears the steps and the ingredients; running timers have their own ✕.
  view.reset.addEventListener("click", () => {
    for (const box of [...view.boxes, ...ingredients]) box.checked = false;
    // app.js redraws the ingredient progress on a change in the list.
    ingredients[0]?.dispatchEvent(new Event("change", { bubbles: true }));
    cookingSave(article);
    cookingDrawSteps(article);
    view.boxes[0]?.focus({ preventScroll: true });
  });
}

function cookingInitPage() {}

if (typeof document !== "undefined") cookingInitPage();
