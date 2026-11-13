// profil.html and konto.html, for a signed-in visitor (HANDOFF.md, "Konton och receptbok"). A module,
// after account.js, using its window.restfestAccount and the plain scripts' globals ($, assetUrl,
// dietTags, impliedTags, recipeTagLabels, faIcon, escapeHtml, showToast).
//
// profil.html: the name and the preferences in the visitor's row of the profiles table. The database
// decides what can be stored (supabase/migrations/…_accounts.sql); the form keeps to the same limits.
// konto.html: the sign-in itself, which is Supabase Auth, and deleting the account (the
// delete-account function).

import { busy, checked, emailValue, problem, show } from "./account-forms.js";
import { addFood, authErrorText, passwordProblem } from "./account-helpers.js";

const account = window.restfestAccount;
const main = $("#main");
// Where the Edge Functions answer (src/_data/ai.js).
const functionsUrl = document.querySelector('meta[name="restfest-ai"]')?.content;

async function profilePage(db, user) {
  const wait = $("[data-profile-wait]");
  const form = $("[data-profile-form]");
  const dietBox = $("[data-diets]");
  const avoidInput = $("#profile-avoid");
  const avoidList = $("[data-avoid-list]");
  const avoidError = $("[data-avoid-error]");
  const savedText = $("[data-profile-saved]");
  let avoid = [];

  dietBox.innerHTML = dietTags
    .map(
      (key) =>
        `<label class="account-check"><input type="checkbox" name="diets" value="${key}"> ${escapeHtml(recipeTagLabels[key] ?? key)}</label>`,
    )
    .join("");
  const dietInputs = [...dietBox.querySelectorAll("input")];
  const implied = impliedTags.Vegan ?? [];

  // Veganskt covers the three diets it implies, so they follow it and can't be changed on their own.
  function followVegan(changed) {
    const vegan = dietInputs.find((input) => input.value === "Vegan").checked;
    for (const input of dietInputs) {
      if (!implied.includes(input.value)) continue;
      if (vegan) input.checked = true;
      else if (changed) input.checked = false;
      input.disabled = vegan;
    }
  }

  function drawAvoid() {
    avoidList.innerHTML = avoid
      .map(
        (name, index) =>
          `<li><span>${escapeHtml(name)}</span><button type="button" data-avoid-remove="${index}" aria-label="Ta bort ${escapeHtml(name)}">${faIcon("xmark")}</button></li>`,
      )
      .join("");
  }

  function addFromField() {
    const result = addFood(avoid, avoidInput.value);
    show(avoidError, result.problem, avoidInput);
    if (result.problem) return;
    avoid = result.list;
    avoidInput.value = "";
    drawAvoid();
    show(savedText, "");
  }

  let row;
  try {
    row = checked(
      await db
        .from("profiles")
        .select("display_name, diets, avoid, servings")
        .eq("id", user.id)
        .maybeSingle(),
    );
  } catch (error) {
    wait.textContent = `${authErrorText(error)} Ladda om sidan för att försöka igen.`;
    return;
  }
  form.elements.namedItem("display_name").value = row?.display_name ?? "";
  for (const input of dietInputs)
    input.checked = (row?.diets ?? []).includes(input.value);
  followVegan(false);
  avoid = Array.isArray(row?.avoid) ? row.avoid.slice(0, 30) : [];
  drawAvoid();
  form.elements.namedItem("servings").value = row?.servings ?? "";
  wait.hidden = true;
  form.hidden = false;

  dietBox.addEventListener("change", (event) => {
    if (event.target.value === "Vegan") followVegan(true);
  });
  form.addEventListener("input", () => show(savedText, ""));
  $("[data-avoid-add]").addEventListener("click", () => {
    addFromField();
    avoidInput.focus();
  });
  // Enter in the food field adds the food; it doesn't save the form.
  avoidInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addFromField();
  });
  avoidList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-avoid-remove]");
    if (!button) return;
    const index = Number(button.dataset.avoidRemove);
    avoid = avoid.filter((_, position) => position !== index);
    drawAvoid();
    show(avoidError, "");
    show(savedText, "");
    // The keyboard's place moves to the next food's button, or back to the field.
    (
      avoidList.querySelectorAll("button")[Math.min(index, avoid.length - 1)] ??
      avoidInput
    ).focus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    show(savedText, "");
    busy(form, $("[data-profile-error]"), async () => {
      // Something typed but not added yet is meant to be in the list.
      if (avoidInput.value.trim()) {
        addFromField();
        if (!avoidError.hidden)
          throw problem("Det gick inte att lägga till råvaran. Se ovan.");
      }
      const name = form.elements
        .namedItem("display_name")
        .value.trim()
        .slice(0, 80);
      const servings = form.elements.namedItem("servings").value;
      checked(
        await db
          .from("profiles")
          .update({
            display_name: name || null,
            diets: dietInputs
              .filter((input) => input.checked)
              .map((input) => input.value),
            avoid,
            servings: servings ? Number(servings) : null,
          })
          .eq("id", user.id),
      );
      account.setName(name);
      show(savedText, "Sparat.");
    });
  });
}

async function accountPage(db, sessionUser) {
  const wait = $("[data-account-wait]");
  const sections = $("[data-account-sections]");
  const emailForm = $("[data-email-form]");
  const passwordForm = $("[data-password-change]");
  const dialog = $("#delete-dialog");

  // Asked from Supabase, so the address and the sign-in methods are the current ones.
  let user = sessionUser;
  try {
    user = checked(await db.auth.getUser()).user ?? sessionUser;
  } catch {
    // The copy from the sign-in will do.
  }

  function drawLogin() {
    const methods = new Set([
      ...(user.identities ?? []).map((identity) => identity.provider),
      ...(user.app_metadata?.providers ?? []),
    ]);
    const password = methods.has("email");
    const google = methods.has("google");
    $("[data-account-email]").textContent = user.email ?? "";
    $("[data-account-methods]").textContent =
      password && google
        ? "Du loggar in med lösenord eller med Google."
        : google
          ? "Du loggar in med Google."
          : "Du loggar in med e-postadress och lösenord.";
    $("[data-password-title]").textContent = password
      ? "Byt lösenord"
      : "Välj ett lösenord";
    $("[data-password-intro]").hidden = password;
  }
  drawLogin();
  wait.hidden = true;
  sections.hidden = false;

  emailForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = $("[data-email-status]");
    show(status, "");
    const input = emailForm.elements.namedItem("email");
    busy(emailForm, $("[data-email-error]"), async () => {
      const address = emailValue(input);
      if (address.toLowerCase() === (user.email ?? "").toLowerCase())
        throw problem("Det är redan din e-postadress.", input);
      checked(
        await db.auth.updateUser(
          { email: address },
          { emailRedirectTo: assetUrl("konto.html") },
        ),
      );
      emailForm.reset();
      show(
        status,
        `Vi har skickat en länk till ${address}. Bytet gäller när du har klickat på den.`,
      );
    }, { email: input });
  });

  passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = $("[data-password-status]");
    show(status, "");
    const input = passwordForm.elements.namedItem("password");
    busy(passwordForm, $("[data-password-error]"), async () => {
      const short = passwordProblem(input.value);
      if (short) throw problem(short, input);
      const data = checked(await db.auth.updateUser({ password: input.value }));
      if (data.user) user = data.user;
      passwordForm.reset();
      drawLogin();
      show(status, "Lösenordet är sparat.");
    }, { password: input });
  });

  const opener = $("[data-delete-open]");
  opener.addEventListener("click", () => {
    show($("[data-delete-error]"), "");
    dialog.showModal();
  });
  $("[data-delete-cancel]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => opener.focus());
  $("[data-delete-confirm]").addEventListener("click", () => {
    busy(dialog, $("[data-delete-error]"), async () => {
      const token = await account.token();
      if (!token) throw problem("Du har loggats ut. Logga in igen.");
      let response;
      try {
        response = await fetch(`${functionsUrl}/delete-account`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: "{}",
        });
      } catch {
        throw new TypeError("Failed to fetch");
      }
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw problem(result.error || "Något gick fel. Prova igen om en stund.");
      }
      // The account is gone; this removes what the browser still holds of it and goes home.
      await account.signOut("Kontot är borttaget.");
    });
  });
}

async function start() {
  // These pages are for a signed-in visitor: anyone else goes to sign in, and comes back.
  if (!account.signedIn()) {
    location.replace(account.loginUrl());
    return;
  }
  const wait = $("[data-profile-wait], [data-account-wait]");
  let db;
  let user;
  try {
    db = await account.client();
    user = await account.user();
  } catch (error) {
    wait.textContent = authErrorText(error);
    return;
  }
  if (!user) {
    // The sign-in has run out. account.js has noticed too, or will.
    if (!account.signedIn()) location.replace(account.loginUrl());
    else wait.textContent = "Kunde inte nå Ofta bra efter. Kolla uppkopplingen och prova igen.";
    return;
  }
  if (main.dataset.profilePage === "profil") profilePage(db, user);
  else accountPage(db, user);
}

if (account) {
  start();
  // Signed out in another tab, or the sign-in has run out.
  document.addEventListener("restfest:account", () => {
    if (!account.signedIn()) location.replace(account.loginUrl());
  });
}
