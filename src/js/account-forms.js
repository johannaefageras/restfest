// What the forms on the account pages share (auth-forms.js, profile.js): showing a text, running a
// request with the buttons off, and turning what went wrong into Swedish.

import { authErrorText } from "./account-helpers.js";

// Shows `text` in `element`, or hides the element when there is none.
export function show(element, text) {
  element.textContent = text ?? "";
  element.hidden = !text;
}

// A problem the visitor can fix, in Swedish.
export function problem(text) {
  return Object.assign(new Error(text), { visitorText: text });
}

// Runs `work` with the container's buttons off, and shows what went wrong in `errorBox`.
export async function busy(container, errorBox, work) {
  const buttons = [...container.querySelectorAll("button")];
  show(errorBox, "");
  buttons.forEach((button) => (button.disabled = true));
  container.setAttribute("aria-busy", "true");
  try {
    await work();
  } catch (error) {
    show(errorBox, error.visitorText ?? authErrorText(error));
  } finally {
    buttons.forEach((button) => (button.disabled = false));
    container.removeAttribute("aria-busy");
  }
}

// supabase-js returns its errors; throw them so busy() shows them.
export function checked({ data, error }) {
  if (error) throw error;
  return data;
}

// The address in an email field, or a problem to show.
export function emailValue(input) {
  const value = input.value.trim();
  if (!value) throw problem("Skriv din e-postadress.");
  if (!input.checkValidity()) throw problem("E-postadressen ser inte rätt ut.");
  return value;
}
