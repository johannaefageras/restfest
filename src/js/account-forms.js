// What the forms on the account pages share (auth-forms.js, profile.js): showing a text, running a
// request with the buttons off, and turning what went wrong into Swedish.

import { authErrorText } from "./account-helpers.js";

// The field each error box is about at the moment, so the mark can be taken off again.
const marked = new WeakMap();
let boxes = 0;

const describedBy = (field) =>
  (field.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean);

function unmark(box) {
  const field = marked.get(box);
  if (!field) return;
  marked.delete(box);
  field.removeAttribute("aria-invalid");
  const rest = describedBy(field).filter((id) => id !== box.id);
  if (rest.length) field.setAttribute("aria-describedby", rest.join(" "));
  else field.removeAttribute("aria-describedby");
}

// Shows `text` in `element`, or hides the element when there is none. When the text is a problem with
// one `field`, the field is marked as wrong and described by the text, so a screen reader says the
// problem with the field and not only when it appears. The mark comes off when the text changes.
export function show(element, text, field) {
  unmark(element);
  element.textContent = text ?? "";
  element.hidden = !text;
  if (!text || !field) return;
  element.id ||= `account-problem-${++boxes}`;
  field.setAttribute("aria-invalid", "true");
  field.setAttribute(
    "aria-describedby",
    [...describedBy(field), element.id].join(" "),
  );
  marked.set(element, field);
}

// A problem the visitor can fix, in Swedish, and the field it is about when it is about one.
export function problem(text, field) {
  return Object.assign(new Error(text), { visitorText: text, field });
}

// Supabase's errors that are about one field: its name in `fields` below.
const errorFields = {
  weak_password: "password",
  same_password: "password",
  email_address_invalid: "email",
  validation_failed: "email",
  user_already_exists: "email",
  email_exists: "email",
};

// Runs `work` with the container's buttons off, and shows what went wrong in `errorBox`. A problem
// with one field marks that field and puts the keyboard there. `fields` is the form's
// {email, password} inputs, for the problems Supabase finds.
export async function busy(container, errorBox, work, fields = {}) {
  const buttons = [...container.querySelectorAll("button")];
  show(errorBox, "");
  buttons.forEach((button) => (button.disabled = true));
  container.setAttribute("aria-busy", "true");
  try {
    await work();
  } catch (error) {
    const field = error.field ?? fields[errorFields[error.code]];
    show(errorBox, error.visitorText ?? authErrorText(error), field);
    field?.focus();
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
  if (!value) throw problem("Skriv din e-postadress.", input);
  if (!input.checkValidity())
    throw problem("E-postadressen ser inte rätt ut.", input);
  return value;
}
