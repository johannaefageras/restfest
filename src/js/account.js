// Accounts: who is signed in, the header's state, and the Supabase library (HANDOFF.md, "Konton och
// receptbok"). A module on every page, loaded after the plain scripts, so it can use their globals
// (assetUrl, savedKey, refreshSavedRecipes …). Without <meta name="restfest-account"> the site has no
// accounts, and this does nothing.
//
// A signed-out visitor gets this file and nothing more: the library (js/vendor/supabase.js) is only
// loaded when the browser holds a sign-in, or when a page asks for client(). Whether it does is
// remembered in localStorage under `restfest-account`, which the layout's head script reads before
// the first paint.
//
// Other scripts use window.restfestAccount:
//   signedIn()             true when this browser is signed in
//   client()               the Supabase client; loads the library the first time
//   token()                a fresh access token for the Edge Functions, or null
//   user()                 the signed-in user, or null
//   signedInNow()          call after a successful sign-in
//   signOut()              signs out here and goes to the home page
//   loginUrl(returnPath)   the sign-in page's address, coming back to returnPath (default: this page)
// and listen for `restfest:account` on document, sent when any of this changes.

import { safeReturnPath } from "./account-helpers.js";

const meta = document.querySelector('meta[name="restfest-account"]');
const markerKey = "restfest-account";
const generatedKey = "restfest-saved-generated";
const queueKey = "restfest-saved-queue";
const root = document.documentElement;

function readStored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function store(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing or a full disk: the page still works for this visit.
  }
}
function forgetStored(...keys) {
  try {
    keys.forEach((key) => localStorage.removeItem(key));
  } catch {}
}

function signedIn() {
  try {
    return localStorage.getItem(markerKey) != null;
  } catch {
    return false;
  }
}

function loginUrl(returnPath = location.pathname + location.search) {
  const path = safeReturnPath(returnPath, location.origin);
  return (
    assetUrl("logga-in.html") + (path ? `?till=${encodeURIComponent(path)}` : "")
  );
}

// The header is built signed out. The head script has already set the class; this sets where the
// two links lead and what they're called.
function showState() {
  const inside = signedIn();
  root.classList.toggle("signed-in", inside);
  const savedLink = document.querySelector("[data-saved-link]");
  if (savedLink) {
    savedLink.href = assetUrl(
      inside ? "receptbok.html" : "receptarkiv.html?vy=sparade",
    );
    savedLink.setAttribute(
      "aria-label",
      inside ? "Visa din receptbok" : "Visa sparade recept",
    );
  }
  document.querySelectorAll("[data-account-link]").forEach((link) => {
    link.href = inside ? assetUrl("profil.html") : loginUrl();
    if (link.hasAttribute("aria-label"))
      link.setAttribute("aria-label", inside ? "Ditt konto" : "Logga in");
  });
}

function announce() {
  document.dispatchEvent(new Event("restfest:account"));
}

let clientPromise;
function client() {
  clientPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = assetUrl("js/vendor/supabase.js");
    script.onload = () =>
      resolve(
        window.supabase.createClient(meta.content, meta.dataset.key, {
          auth: {
            // Implicit, not PKCE: a link in a mail must also work in a browser other than the one
            // that asked for it (sign up on a laptop, open the mail on a phone).
            flowType: "implicit",
            detectSessionInUrl: true,
            persistSession: true,
            autoRefreshToken: true,
          },
        }),
      );
    script.onerror = () => {
      clientPromise = undefined;
      script.remove();
      reject(new TypeError("Failed to fetch"));
    };
    document.head.append(script);
  });
  return clientPromise;
}

// The session, or null when there is none. `unknown` is true when Supabase couldn't be reached, which
// says nothing about whether the visitor is still signed in.
async function currentSession() {
  try {
    const { data, error } = await (await client()).auth.getSession();
    if (data?.session) return { session: data.session, unknown: false };
    const unreachable =
      error && (error.name === "AuthRetryableFetchError" || !error.status);
    return { session: null, unknown: Boolean(unreachable) };
  } catch {
    return { session: null, unknown: true };
  }
}

async function token() {
  if (!signedIn()) return null;
  return (await currentSession()).session?.access_token ?? null;
}

async function user() {
  if (!signedIn()) return null;
  return (await currentSession()).session?.user ?? null;
}

// This browser is no longer signed in: drop the marker and the copies of the account's recipe book.
// The fridge list, the shopping list and the week plan belong to the browser and stay.
function forget() {
  forgetStored(markerKey, generatedKey, queueKey, savedKey);
  refreshSavedRecipes();
  showState();
  announce();
}

async function signedInNow() {
  const { session } = await currentSession();
  if (!session) return;
  const data = session.user.user_metadata ?? {};
  store(markerKey, {
    name: data.display_name || data.full_name || data.name || "",
  });
  showState();
  announce();
}

async function signOut() {
  try {
    // Here only: other devices stay signed in.
    await (await client()).auth.signOut({ scope: "local" });
  } catch {
    // Unreachable or already signed out. The browser forgets the sign-in either way.
  }
  forget();
  location.href = assetUrl("");
}

if (meta) {
  window.restfestAccount = {
    signedIn,
    client,
    token,
    user,
    signedInNow,
    signOut,
    loginUrl,
  };
  showState();

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-sign-out]")) return;
    event.preventDefault();
    signOut();
  });

  // Signing in or out in another tab.
  window.addEventListener("storage", (event) => {
    if (event.key === markerKey || event.key === null) {
      showState();
      announce();
    }
  });

  if (signedIn()) {
    // Check that the sign-in still holds. One that has expired or been withdrawn just signs the
    // visitor out, without an error; an unreachable Supabase changes nothing.
    currentSession().then(({ session, unknown }) => {
      if (!session && !unknown && signedIn()) forget();
    });
  }
}
