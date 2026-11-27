// profil.html and konto.html, for a signed-in visitor (HANDOFF.md, "Konton och receptbok"). A module,
// after account.js, using its window.restfestAccount and the plain scripts' globals ($, assetUrl,
// dietTags, impliedTags, recipeTagLabels, faIcon, escapeHtml, showToast).
//
// profil.html: the name and the preferences in the visitor's row of the profiles table. The database
// decides what can be stored (supabase/migrations/…_accounts.sql); the form keeps to the same limits.
// konto.html: the sign-in itself, which is Supabase Auth: the email address, the mobile number and the
// password, and deleting the account (the delete-account function).

import { busy, checked, emailValue, problem, show } from "./account-forms.js";
import {
  addFood,
  authErrorText,
  loginMethods,
  loginMethodsText,
  passwordProblem,
  phoneDisplay,
  phoneNumber,
  signedInAs,
} from "./account-helpers.js";

const account = window.restfestAccount;
const main = $("#main");
// Where the Edge Functions answer (src/_data/ai.js).
const functionsUrl = document.querySelector(
  'meta[name="restfest-ai"]',
)?.content;

async function profilePage(db, user) {
  const wait = $("[data-profile-wait]");
  const form = $("[data-profile-form]");
  const dietBox = $("[data-diets]");
  const avoidInput = $("#profile-avoid");
  const avoidList = $("[data-avoid-list]");
  const avoidError = $("[data-avoid-error]");
  const savedText = $("[data-profile-saved]");
  const servingsInput = form.elements.namedItem("servings");
  const servingsDown = $('[data-servings-step="down"]', form);
  const servingsUp = $('[data-servings-step="up"]', form);
  let avoid = [];

  dietBox.innerHTML = dietTags
    .map(
      (key) =>
        `<label class="account-check"><input type="checkbox" name="diets" value="${key}"> ${escapeHtml(recipeTagLabels[key] ?? key)}</label>`,
    )
    .join("");
  const dietInputs = [...dietBox.querySelectorAll("input")];
  // Included diets follow their parent: Vegan covers Dairy free, which covers Lactose free.
  // Parents come before their dependent diets in dietTags, so clearing them updates the chain.
  function followDiets() {
    for (const input of dietInputs) {
      const included = dietInputs.some(
        (parent) =>
          parent.checked &&
          (impliedTags[parent.value] ?? []).includes(input.value),
      );
      if (included) input.checked = true;
      else if (input.disabled) input.checked = false;
      input.disabled = included;
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
        .select("display_name, diets, avoid, servings, max_cooking_minutes")
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
  followDiets();
  avoid = Array.isArray(row?.avoid) ? row.avoid.slice(0, 30) : [];
  drawAvoid();
  servingsInput.value = row?.servings ?? "";
  form.elements.namedItem("max_cooking_minutes").value =
    row?.max_cooking_minutes ?? "";
  const minServings = Number(servingsInput.min);
  const maxServings = Number(servingsInput.max);
  function updateServingsSteps() {
    const value = servingsInput.valueAsNumber;
    servingsDown.setAttribute("aria-disabled", String(value <= minServings));
    servingsUp.setAttribute("aria-disabled", String(value >= maxServings));
  }
  function stepServings(direction) {
    const value = servingsInput.valueAsNumber;
    const next = !Number.isFinite(value)
      ? minServings
      : direction < 0
        ? Math.ceil(value) - 1
        : Math.floor(value) + 1;
    servingsInput.value = String(
      Math.max(minServings, Math.min(maxServings, next)),
    );
    servingsInput.dispatchEvent(new Event("input", { bubbles: true }));
  }
  servingsDown.addEventListener("click", () => stepServings(-1));
  servingsUp.addEventListener("click", () => stepServings(1));
  servingsInput.addEventListener("input", updateServingsSteps);
  updateServingsSteps();
  wait.hidden = true;
  form.hidden = false;

  dietBox.addEventListener("change", followDiets);
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
      if (!servingsInput.validity.valid)
        throw problem(
          "Välj ett helt antal portioner mellan 1 och 12, eller lämna fältet tomt.",
          servingsInput,
        );
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
      const servings = servingsInput.value;
      const cookingMinutes = form.elements.namedItem(
        "max_cooking_minutes",
      ).value;
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
            max_cooking_minutes: cookingMinutes ? Number(cookingMinutes) : null,
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

  // An account made with a mobile number has no email address until one is added, and so no use for
  // a password: the login form asks for the address.
  function drawLogin() {
    const methods = loginMethods(user);
    const hasEmail = Boolean(user.email);
    $("[data-account-email]").textContent = signedInAs(user);
    $("[data-account-methods]").textContent = loginMethodsText(methods);
    $("[data-email-title]").textContent = hasEmail
      ? "Byt e-postadress"
      : "Lägg till e-postadress";
    $("[data-email-intro]").textContent = hasEmail
      ? "En ny adress? Vi skickar en länk så att du kan bekräfta bytet."
      : "Med en e-postadress kan du också logga in med lösenord. Vi skickar en länk så att du kan bekräfta den.";
    $("[data-email-submit]").textContent = hasEmail
      ? "Byt e-postadress"
      : "Lägg till e-postadress";
    $("[data-password-section]").hidden = !hasEmail;
    $("[data-password-title]").textContent = methods.password
      ? "Byt lösenord"
      : "Välj ett lösenord";
    $("[data-password-intro]").hidden = methods.password;
    $("[data-phone-title]").textContent = methods.phone
      ? "Byt mobilnummer"
      : "Lägg till mobilnummer";
    $("[data-phone-intro]").textContent = methods.phone
      ? `Du loggar in med en kod som vi sms:ar till ${phoneDisplay(user.phone)}.`
      : "Med ett mobilnummer kan du också logga in med en kod per sms.";
  }
  drawLogin();
  wait.hidden = true;
  sections.hidden = false;

  emailForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = $("[data-email-status]");
    show(status, "");
    const input = emailForm.elements.namedItem("email");
    busy(
      emailForm,
      $("[data-email-error]"),
      async () => {
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
          user.email
            ? `Vi har skickat en länk till ${address}. Bytet gäller när du har klickat på den.`
            : `Vi har skickat en länk till ${address}. Adressen läggs till när du har klickat på den.`,
        );
      },
      { email: input },
    );
  });

  passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = $("[data-password-status]");
    show(status, "");
    const input = passwordForm.elements.namedItem("password");
    busy(
      passwordForm,
      $("[data-password-error]"),
      async () => {
        const short = passwordProblem(input.value);
        if (short) throw problem(short, input);
        const data = checked(
          await db.auth.updateUser({ password: input.value }),
        );
        if (data.user) user = data.user;
        passwordForm.reset();
        drawLogin();
        show(status, "Lösenordet är sparat.");
      },
      { password: input },
    );
  });

  // A new number: a code goes to it first, and the number is the account's once the code is typed.
  // Until then Supabase keeps it apart (new_phone), and the old number, if any, still signs in.
  const phoneForm = $("[data-phone-change]");
  const phoneInput = phoneForm.elements.namedItem("phone");
  const codeInput = phoneForm.elements.namedItem("code");
  const codeField = $("[data-phone-code-field]");
  const phoneStatus = $("[data-phone-status]");
  let pendingPhone = null;

  function waitForCode(phone) {
    pendingPhone = phone;
    codeField.hidden = !phone;
    codeInput.value = "";
    $("[data-phone-submit]").textContent = phone
      ? "Spara numret"
      : "Skicka kod";
  }

  // Another number needs a code of its own.
  phoneInput.addEventListener("input", () => {
    if (pendingPhone && phoneNumber(phoneInput.value) !== pendingPhone) {
      waitForCode(null);
      show(phoneStatus, "");
    }
  });

  async function sendPhoneCode(phone) {
    checked(await db.auth.updateUser({ phone }));
    waitForCode(phone);
    show(
      phoneStatus,
      `Vi har skickat en kod till ${phoneDisplay(phone)}. Skriv den här.`,
    );
    codeInput.focus();
  }

  phoneForm.addEventListener("submit", (event) => {
    event.preventDefault();
    show(phoneStatus, "");
    busy(
      phoneForm,
      $("[data-phone-error]"),
      async () => {
        const phone = phoneNumber(phoneInput.value);
        if (!phone)
          throw problem(
            phoneInput.value.trim()
              ? "Skriv Ett svenskt mobilnummer, t.ex. 070-123 45 67."
              : "Skriv ditt mobilnummer.",
            phoneInput,
          );
        if (phone !== pendingPhone) {
          if (
            loginMethods(user).phone &&
            phone === phoneNumber(`+${user.phone}`)
          )
            throw problem("Det är redan ditt nummer.", phoneInput);
          await sendPhoneCode(phone);
          return;
        }
        const token = codeInput.value.replace(/\s/g, "");
        if (!/^\d{4,10}$/.test(token))
          throw problem("Skriv koden från sms:et.", codeInput);
        const { data, error } = await db.auth.verifyOtp({
          phone,
          token,
          type: "phone_change",
        });
        // Supabase gives the same answer for a wrong code and an old one.
        if (error?.code === "otp_expired")
          throw problem(
            "Koden stämmer inte, eller har slutat gälla. Prova igen, eller skicka en ny kod.",
            codeInput,
          );
        if (error) throw error;
        if (data.user) user = data.user;
        phoneForm.reset();
        waitForCode(null);
        drawLogin();
        show(phoneStatus, "Numret är sparat.");
      },
      { phone: phoneInput },
    );
  });

  $("[data-phone-resend]").addEventListener("click", () => {
    show(phoneStatus, "");
    busy(phoneForm, $("[data-phone-error]"), () => sendPhoneCode(pendingPhone));
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
        throw problem(
          result.error || "Något gick fel. Prova igen om en stund.",
        );
      }
      // The account is gone; this removes what the browser still holds of it and goes home.
      window.restfestShopping?.discard();
      account.discardBook();
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
    else
      wait.textContent =
        "Kunde inte nå Ofta bra efter. Kolla uppkopplingen och prova igen.";
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
