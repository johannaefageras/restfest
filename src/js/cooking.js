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

// Called whenever the timers change outside a tap: may let the screen go dark, never asks to keep it on.
function cookingUpdateScreen() {}

// Turns each cooking time in the steps, and in the notes after them, into a timer button. The text
// stays as written; the button's name says what it does. Notes are labelled "Tips".
function cookingAddTimeButtons(article, view) {
  const places = [
    ...view.steps.map((step, index) => ({ root: step, place: index, label: view.labels[index] })),
    ...[...article.querySelectorAll(".recipe-directions > .recipe-tip")].map((note, index) => ({
      root: note,
      place: `n${index}`,
      label: "Tips",
    })),
  ];
  for (const { root, place, label } of places) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode())
      if (!walker.currentNode.parentElement.closest("button, input")) nodes.push(walker.currentNode);
    let phraseIndex = 0;
    for (const node of nodes) {
      const times = cookingFindTimes(node.data).map((time) => ({ ...time, index: phraseIndex++ }));
      // From the end, so the earlier offsets in the node stay right.
      for (const time of times.reverse()) {
        node.splitText(time.end);
        node.splitText(time.start).replaceWith(
          cookingTimeButton({
            id: cookingTimerId(article.dataset.recipe, place, time.index),
            seconds: time.seconds,
            phrase: time.text,
            label,
          }),
        );
      }
    }
  }
}

function cookingTimeButton({ id, seconds, phrase, label }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "cook-time";
  Object.assign(button.dataset, { timerId: id, seconds, phrase, stepLabel: label });
  button.setAttribute("aria-label", `Starta timer, ${cookingDurationWords(seconds)}`);
  button.innerHTML = '<i class="fas fa-stopwatch" aria-hidden="true"></i>';
  button.append(phrase);
  return button;
}

// --- The timer tray, at the bottom of every page while there are timers. They are saved with their end
// times, so a reload, another page or a second tab shows the same ones.

let cookingTray = null;
let cookingTrayList = null;
let cookingLive = null;
let cookingInterval = 0;
let cookingTrayKey = "";
const cookingDonePrefix = "Klart! · ";

function cookingElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function cookingTrayButton(id, selector) {
  return [...(cookingTrayList?.children ?? [])]
    .find((row) => row.dataset.timerId === id)
    ?.querySelector(selector);
}

function cookingRecipeOnPage(recipeId) {
  return Boolean(document.querySelector(`.recipe-view[data-recipe="${CSS.escape(recipeId)}"]`));
}

function cookingTrayRow(timer) {
  const row = cookingElement("li", `cook-tray-row${timer.done ? " is-done" : ""}`);
  row.dataset.timerId = timer.id;
  const info = cookingElement("span", "cook-tray-info");
  info.append(cookingElement("span", "cook-tray-what", `${timer.phrase} · ${timer.stepLabel}`));
  if (cookingRecipeOnPage(timer.recipeId))
    info.append(cookingElement("span", "cook-tray-recipe", timer.recipeTitle));
  else {
    const link = cookingElement("a", "cook-tray-recipe", timer.recipeTitle);
    link.href = timer.recipeUrl;
    info.append(link);
  }
  const close = cookingElement("button", "cook-tray-close");
  close.type = "button";
  close.setAttribute("aria-label", timer.done ? "Stäng timer" : "Avbryt timer");
  close.innerHTML = '<i class="fas fa-xmark" aria-hidden="true"></i>';
  const more = cookingElement("button", "text-button cook-tray-more", "+1 min");
  more.type = "button";
  row.append(cookingElement("span", "cook-tray-time"), info, more, close);
  return row;
}

// Draws the tray from the saved timers. The rows are rebuilt only when the timers, their order or
// their state change, keeping focus on the same button; otherwise only the countdowns change.
function cookingRenderTray() {
  if (!cookingTray) return;
  const now = Date.now();
  const timers = cookingSortTimers(cookingReadTimers(localStorage, now));
  const key = timers
    .map((timer) => `${timer.id}:${timer.done}:${cookingRecipeOnPage(timer.recipeId)}`)
    .join("|");
  if (key !== cookingTrayKey) {
    cookingTrayKey = key;
    const focused = cookingTray.contains(document.activeElement) ? document.activeElement : null;
    const focusId = focused?.closest(".cook-tray-row")?.dataset.timerId;
    const focusClass = focused?.matches(".cook-tray-more") ? ".cook-tray-more" : ".cook-tray-close";
    cookingTrayList.replaceChildren(...timers.map(cookingTrayRow));
    if (focusId) cookingTrayButton(focusId, focusClass)?.focus({ preventScroll: true });
  }
  timers.forEach((timer, index) => {
    cookingTrayList.children[index].querySelector(".cook-tray-time").textContent = timer.done
      ? "Klart!"
      : cookingFormatRemaining(timer.endsAt - now);
  });
  cookingTray.hidden = !timers.length;
  document.documentElement.style.setProperty("--cook-tray-height", `${cookingTray.offsetHeight}px`);
  // "Klart! · " in the tab's title while a timer is done. app.js changes the title when the recipe
  // pop-up opens and closes, so this is set again on every tick rather than once.
  const title = document.title.startsWith(cookingDonePrefix)
    ? document.title.slice(cookingDonePrefix.length)
    : document.title;
  const wanted = timers.some((timer) => timer.done) ? cookingDonePrefix + title : title;
  if (document.title !== wanted) document.title = wanted;
  if (timers.length && !cookingInterval) cookingInterval = setInterval(cookingTick, 1000);
  if (!timers.length && cookingInterval) {
    clearInterval(cookingInterval);
    cookingInterval = 0;
  }
}

// Once a second, and when the page becomes visible again. Only a visible page marks timers done,
// so the tab you're looking at is the one that rings, also when another tab has the same timers.
function cookingTick() {
  const now = Date.now();
  if (document.visibilityState === "visible") {
    const { timers, finished } = cookingDueTimers(cookingReadTimers(localStorage, now), now);
    if (finished.length) {
      cookingWriteTimers(localStorage, timers);
      // Browsers allow sound and vibration only once the page has had a tap; before that, the tray
      // shows "Klart!" by itself.
      const tapped = navigator.userActivation?.hasBeenActive ?? true;
      if (tapped && finished.some((timer) => cookingShouldRing(timer, now))) {
        cookingAlarm.ring();
        navigator.vibrate?.([200, 100, 200]);
      }
      for (const timer of finished)
        cookingAnnounce(`Klart: ${cookingDurationWords(timer.seconds)}, ${timer.stepLabel}`);
    }
  }
  cookingRenderTray();
  cookingUpdateScreen();
}

function cookingAnnounce(message) {
  if (!cookingLive) return;
  // Emptied first, so the same message twice is announced twice.
  cookingLive.textContent = "";
  setTimeout(() => {
    cookingLive.textContent = message;
  }, 50);
}

function cookingTrayClick(event) {
  const button = event.target.closest("button");
  if (!button) return;
  const id = button.closest(".cook-tray-row").dataset.timerId;
  const now = Date.now();
  let timers = cookingReadTimers(localStorage, now);
  let next = null;
  if (button.matches(".cook-tray-more")) timers = cookingAddMinute(timers, id, now);
  else {
    // Focus goes to the next row's ✕, or the one before, or back to the time button in the recipe.
    const rows = [...cookingTrayList.children];
    const index = rows.findIndex((row) => row.dataset.timerId === id);
    next = (rows[index + 1] ?? rows[index - 1])?.dataset.timerId;
    timers = cookingRemoveTimer(timers, id);
  }
  cookingWriteTimers(localStorage, timers);
  if (!timers.some((timer) => timer.done)) cookingAlarm.stop();
  cookingRenderTray();
  if (button.matches(".cook-tray-close")) {
    const target = next
      ? cookingTrayButton(next, ".cook-tray-close")
      : document.querySelector(`.cook-time[data-timer-id="${CSS.escape(id)}"]`);
    target?.focus({ preventScroll: Boolean(next) });
  }
  cookingUpdateScreen();
}

// A modal dialog (the recipe pop-up, the shopping list) makes the rest of the page inert, so the tray
// moves into the open one and back to the page when it closes.
function cookingPlaceTray() {
  const isModal = (dialog) => {
    try {
      return dialog.matches(":modal");
    } catch {
      return true;
    }
  };
  const home = [...document.querySelectorAll("dialog[open]")].find(isModal) ?? document.body;
  if (cookingTray.parentElement !== home) home.append(cookingTray, cookingLive);
  cookingRenderTray();
}

// A short kitchen-timer beep made in the browser, repeated for half a minute or until stopped. Browsers
// only allow sound after a tap, so prime() runs in the tap that starts a timer.
const cookingAlarm = {
  context: null,
  timeout: 0,
  until: 0,
  prime() {
    try {
      this.context ??= new (window.AudioContext || window.webkitAudioContext)();
      if (this.context.state === "suspended") this.context.resume();
    } catch {}
  },
  ring() {
    this.prime();
    if (!this.context) return;
    this.stop();
    this.until = Date.now() + 30000;
    const beep = () => {
      try {
        if (this.context.state === "suspended") this.context.resume();
        const start = this.context.currentTime;
        for (let index = 0; index < 3; index++) {
          const at = start + index * 0.25;
          const tone = this.context.createOscillator();
          const gain = this.context.createGain();
          tone.frequency.value = 880;
          gain.gain.setValueAtTime(0.0001, at);
          gain.gain.exponentialRampToValueAtTime(0.3, at + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.15);
          tone.connect(gain).connect(this.context.destination);
          tone.start(at);
          tone.stop(at + 0.16);
        }
      } catch {}
      if (Date.now() + 1500 < this.until) this.timeout = setTimeout(beep, 1500);
    };
    beep();
  },
  stop() {
    clearTimeout(this.timeout);
    this.timeout = 0;
  },
};

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
  cookingAddTimeButtons(article, view);

  // A time button starts its timer, or, if it is already running, goes to it in the tray.
  section.addEventListener("click", (event) => {
    const button = event.target.closest(".cook-time");
    if (!button) return;
    cookingAlarm.prime();
    const id = button.dataset.timerId;
    const seconds = Number(button.dataset.seconds);
    const now = Date.now();
    const timers = cookingReadTimers(localStorage, now);
    if (timers.some((timer) => timer.id === id && !timer.done)) {
      cookingTrayButton(id, ".cook-tray-more")?.focus();
      return;
    }
    cookingWriteTimers(
      localStorage,
      cookingStartTimer(
        timers,
        {
          id,
          recipeId: article.dataset.recipe,
          recipeTitle: article.querySelector(".recipe-heading")?.textContent.trim() ?? "",
          recipeUrl: location.href.split("#")[0],
          stepLabel: button.dataset.stepLabel,
          phrase: button.dataset.phrase,
          seconds,
        },
        now,
      ),
    );
    cookingRenderTray();
    cookingAnnounce(`Timer startad, ${cookingDurationWords(seconds)}`);
    cookingActivity(article);
  });

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

function cookingInitPage() {
  document.body.insertAdjacentHTML(
    "beforeend",
    `<section class="cook-tray" aria-label="Timers" hidden><ol class="cook-tray-list"></ol></section>
    <p class="sr-only cook-live" role="status"></p>`,
  );
  cookingTray = document.querySelector(".cook-tray");
  cookingTrayList = cookingTray.querySelector(".cook-tray-list");
  cookingLive = document.querySelector(".cook-live");
  cookingTrayList.addEventListener("click", cookingTrayClick);
  // After a reload or on another page, the timers' sound is allowed again by the next tap anywhere.
  document.addEventListener(
    "pointerdown",
    () => {
      if (!cookingTray.hidden) cookingAlarm.prime();
    },
    { capture: true },
  );
  document.addEventListener("visibilitychange", cookingTick);
  addEventListener("storage", (event) => {
    if (event.key === cookingTimersKey) cookingRenderTray();
  });
  new MutationObserver(cookingPlaceTray).observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["open"],
  });
  cookingTick();
}

if (typeof document !== "undefined") cookingInitPage();
