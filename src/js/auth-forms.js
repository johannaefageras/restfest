// logga-in.html and nytt-losenord.html: signing in, creating an account, asking for and choosing a
// new password (HANDOFF.md, "Konton och receptbok"). A module, after account.js, which gives it the
// Supabase client (window.restfestAccount) and the plain scripts' globals ($, assetUrl).
//
// A link in a mail, and the way back from Google, lead here with the sign-in in the address; the
// client reads it when it starts. After signing in the visitor goes to ?till=<path> when that is a
// path within the site, otherwise to the recipe book.

import { busy, checked, emailValue, problem, show } from "./account-forms.js";
import {
  authErrorText,
  passwordProblem,
  safeReturnPath,
} from "./account-helpers.js";

const account = window.restfestAccount;
const main = $("#main");
const params = new URLSearchParams(location.search);
const returnPath = safeReturnPath(params.get("till"), location.origin);

let finishing = false;
async function finish(destination) {
  if (finishing) return;
  finishing = true;
  await account.signedInNow();
  location.replace(destination);
}

// An error Supabase sent along instead of a sign-in, e.g. a link that has already been used. It comes
// after the # or the ?, depending on the kind of link.
function addressError() {
  for (const source of [location.hash.slice(1), location.search.slice(1)]) {
    const values = new URLSearchParams(source);
    if (values.get("error") || values.get("error_code"))
      return { code: values.get("error_code") ?? values.get("error") };
  }
  return null;
}

async function loginPage() {
  const title = $("[data-auth-title]");
  const mainBox = $("[data-auth-main]");
  const form = $("[data-auth-form]");
  const errorBox = $("[data-auth-error]");
  const submit = $("[data-auth-submit]");
  // Not form.name: that is the form's own name.
  const nameInput = form.elements.namedItem("name");
  const resetForm = $("[data-reset-form]");
  const sentBox = $("[data-auth-sent]");
  const destination = returnPath
    ? location.origin + returnPath
    : assetUrl("receptbok.html");
  // Where mail links and Google send the visitor back: this page, keeping the way onward.
  const backHere =
    assetUrl("logga-in.html") +
    (returnPath ? `?till=${encodeURIComponent(returnPath)}` : "");
  let mode = "logga";

  function setMode(next, { address = true } = {}) {
    mode = next;
    const creating = mode === "skapa";
    main.querySelectorAll("[data-only]").forEach((element) => {
      element.hidden = element.dataset.only !== mode;
    });
    title.textContent = creating ? "Skapa konto." : "Logga in.";
    submit.textContent = creating ? "Skapa konto" : "Logga in";
    document.title = `${creating ? "Skapa konto" : "Logga in"} · Ofta bra efter`;
    form.password.autocomplete = creating ? "new-password" : "current-password";
    show(errorBox, "");
    if (address) {
      const url = new URL(location.href);
      if (creating) url.searchParams.set("lage", "skapa");
      else url.searchParams.delete("lage");
      history.replaceState(null, "", url);
    }
  }

  function showPart(part) {
    mainBox.hidden = part !== mainBox;
    resetForm.hidden = part !== resetForm;
    sentBox.hidden = part !== sentBox;
    (part.querySelector("input") ?? part.querySelector("button"))?.focus();
  }

  // The box with "Skicka igen": after signing up, and when signing in before confirming.
  function showSent(address, text) {
    $("[data-sent-text]").textContent = text;
    show($("[data-sent-error]"), "");
    sentBox.dataset.email = address;
    showPart(sentBox);
  }

  setMode(params.get("lage") === "skapa" ? "skapa" : "logga", {
    address: false,
  });

  main.addEventListener("click", (event) => {
    const link = event.target.closest("[data-mode]");
    if (!link) return;
    event.preventDefault();
    setMode(link.dataset.mode);
    (mode === "skapa" ? nameInput : form.email).focus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    busy(mainBox, errorBox, async () => {
      const address = emailValue(form.email);
      const password = form.password.value;
      const client = await account.client();
      if (mode === "logga") {
        if (!password) throw problem("Skriv ditt lösenord.");
        const { error } = await client.auth.signInWithPassword({
          email: address,
          password,
        });
        // The link in the first mail may be lost or too old by now: offer a new one.
        if (error?.code === "email_not_confirmed") {
          showSent(
            address,
            `Du behöver bekräfta e-postadressen innan du kan logga in. Vi skickade en länk till ${address} när kontot skapades.`,
          );
          return;
        }
        if (error) throw error;
        await finish(destination);
        return;
      }
      const short = passwordProblem(password);
      if (short) throw problem(short);
      const data = checked(
        await client.auth.signUp({
          email: address,
          password,
          options: {
            data: { display_name: nameInput.value.trim().slice(0, 80) },
            emailRedirectTo: backHere,
          },
        }),
      );
      // Without mail confirmation the account works at once.
      if (data.session) {
        await finish(destination);
        return;
      }
      // For an address that already has an account, Supabase answers as if a new one was made, but
      // with no sign-in methods, and sends no mail. Say so instead of leaving the visitor waiting.
      if (data.user && (data.user.identities ?? []).length === 0)
        throw { code: "user_already_exists" };
      showSent(
        address,
        `Kolla din mejl. Vi har skickat en länk till ${address}. Klicka på den för att börja använda kontot.`,
      );
    });
  });

  $("[data-google]").addEventListener("click", () => {
    busy(mainBox, errorBox, async () => {
      const client = await account.client();
      checked(
        await client.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: backHere },
        }),
      );
    });
  });

  $("[data-resend]").addEventListener("click", () => {
    const errors = $("[data-sent-error]");
    busy(sentBox, errors, async () => {
      const client = await account.client();
      checked(
        await client.auth.resend({
          type: "signup",
          email: sentBox.dataset.email,
          options: { emailRedirectTo: backHere },
        }),
      );
      showToast("Vi har skickat länken igen.");
    });
  });

  $("[data-forgot]").addEventListener("click", () => {
    resetForm.email.value = form.email.value;
    show($("[data-reset-status]"), "");
    showPart(resetForm);
  });
  $("[data-reset-back]").addEventListener("click", () => showPart(mainBox));
  // Back from "Kolla din mejl", e.g. after confirming on another device: sign in with the same address.
  $("[data-sent-back]").addEventListener("click", () => {
    setMode("logga");
    form.email.value = sentBox.dataset.email ?? "";
    form.password.value = "";
    showPart(mainBox);
    (form.email.value ? form.password : form.email).focus();
  });

  resetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = $("[data-reset-status]");
    show(status, "");
    busy(resetForm, $("[data-reset-error]"), async () => {
      const address = emailValue(resetForm.email);
      const client = await account.client();
      checked(
        await client.auth.resetPasswordForEmail(address, {
          redirectTo: assetUrl("nytt-losenord.html"),
        }),
      );
      // The same answer whether or not the address has an account.
      show(
        status,
        "Om det finns ett konto med den adressen har vi skickat en länk. Kolla din mejl.",
      );
    });
  });

  // Arriving from a mail link or from Google, or already signed in.
  const arrivalError = addressError();
  try {
    const client = await account.client();
    client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) finish(destination);
    });
    const { data } = await client.auth.getSession();
    if (data.session) {
      await finish(destination);
      return;
    }
  } catch (error) {
    if (!arrivalError) show(errorBox, authErrorText(error));
  }
  if (arrivalError) show(errorBox, authErrorText(arrivalError));
}

async function passwordPage() {
  const wait = $("[data-password-wait]");
  const form = $("[data-password-form]");
  const expired = $("[data-password-expired]");
  const errorBox = $("[data-password-error]");

  let session = null;
  try {
    const client = await account.client();
    session = (await client.auth.getSession()).data.session;
  } catch (error) {
    wait.textContent = authErrorText(error);
    return;
  }
  wait.hidden = true;
  if (!session) {
    expired.hidden = false;
    return;
  }
  form.hidden = false;
  form.password.focus();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    busy(form, errorBox, async () => {
      const short = passwordProblem(form.password.value);
      if (short) throw problem(short);
      const client = await account.client();
      checked(await client.auth.updateUser({ password: form.password.value }));
      await finish(assetUrl("receptbok.html"));
    });
  });
}

if (account) {
  if (main.dataset.authPage === "login") loginPage();
  else if (main.dataset.authPage === "password") passwordPage();
}
