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
//   signOut(notice)        signs out here and goes to the home page, where `notice` (if any) is
//                          shown as a toast
//   loginUrl(returnPath)   the sign-in page's address, coming back to returnPath (default: this page)
//   generatedIds()         the generated recipes in the visitor's recipe book, as a Set of ids
//   setGenerated(id, on)   adds a generated recipe to the book, or takes it out
//   noteGenerated(data)    caches a generation result and queues a safe initial-save retry
//   refreshBook()          fetches the book again now; resolves to true when it could
//   setName(name)          the visitor's name has changed (profil.html)
//   bookSnapshot()         cached book with pending heart changes applied
//   bookStatus()           sync status for the recipe-book page
//   rememberRecipe(data)   cache a viewed generated recipe for offline reading
//   cachedRecipe(id)       that user's cached recipe, or null
// and listen for `restfest:account` on document, sent when any of this changes.
//
// THE RECIPE BOOK. Both archive favorites and generated recipes use recipe-book-account.js and
// the same durable outbox engine as the shopping list. Every change has its own operation id and
// user-scoped storage entry. Failed sends retry on reconnection, focus and visible-page polling.
// The cached snapshot renders offline; signing out restores the separate guest favorites.

import { safeReturnPath, signInPage } from "./account-helpers.js";
import { createShoppingAccount } from "./shopping-account.js";
import { createRecipeBookAccount } from "./recipe-book-account.js";

const meta = document.querySelector('meta[name="restfest-account"]');
const markerKey = "restfest-account";
const generatedKey = "restfest-saved-generated";
const root = document.documentElement;
let shopping;
let book;

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
  const owner = inside ? readStored(markerKey, {})?.id : null;
  shopping?.activate(owner);
  book?.activate(owner);
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
  // The visitor's name in the account pages' menu (_includes/account-nav.njk).
  const name = inside ? (readStored(markerKey, {})?.name ?? "") : "";
  document.querySelectorAll("[data-account-name]").forEach((element) => {
    element.textContent = name;
    element.hidden = !name;
  });
}

function setName(name) {
  if (!signedIn()) return;
  store(markerKey, { ...readStored(markerKey, {}), name: name ?? "" });
  showState();
}

// A line to show as a toast on the next page, e.g. after deleting the account.
const noticeKey = "restfest-notice";

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

function readList(key) {
  const list = readStored(key, []);
  return Array.isArray(list) ? list : [];
}
const generatedIds = () => new Set(readList(generatedKey));

// The header's count: hearted archive recipes plus generated ones. app.js writes the first number
// (refreshSavedViews), so this runs after it.
function showCount() {
  const count = document.querySelector("#saved-count");
  if (count && signedIn()) count.textContent = saved.size + generatedIds().size;
}

const sameIds = (a, b) =>
  a.length === b.length && [...a].sort().join() === [...b].sort().join();

// The account's book into the browser.
function showBook({ archive, generated, name }) {
  // The controller supplies the separate guest list on sign-out. Late network responses are
  // discarded before they reach this function.
  if (!signedIn()) {
    setSavedRecipes(archive.map(row => row.recipe_id));
    forgetStored(generatedKey);
    announce();
    return;
  }
  // The name as the profile has it now: it may have been changed on another device.
  const marker = readStored(markerKey, {});
  if (name != null && marker.name !== name) {
    store(markerKey, { ...marker, name });
    showState();
  }
  const archiveIds = archive.map(row => row.recipe_id);
  const generatedIds = generated.map(row => row.id);
  if (!sameIds(archiveIds, readList(savedKey))) setSavedRecipes(archiveIds);
  store(generatedKey, generatedIds);
  showCount();
  announce();
}

const refreshBook = () => book.refresh();
function setGenerated(id, on) {
  if (signedIn()) book.change({ kind: "generated", id, saved: Boolean(on) });
}
function noteGenerated(data) { book?.noteGenerated(data); }

// This browser is no longer signed in: drop the marker and the copies of the account's recipe book.
// The shopping outbox stays scoped to its owner; signing out restores the separate guest list.
// The fridge list and week plan belong to the browser and stay.
// Heart changes that never reached the account stay in its private outbox for the next sign-in.
function forget() {
  forgetStored(markerKey, generatedKey);
  showState();
  announce();
}

async function signedInNow() {
  const { session } = await currentSession();
  if (!session) return;
  const data = session.user.user_metadata ?? {};
  // The name from the sign-up, until the profile's own arrives with the book below.
  store(markerKey, {
    id: session.user.id,
    name: data.display_name || data.full_name || data.name || "",
  });
  showState();
  await Promise.all([refreshBook(), shopping?.refresh()]);
  announce();
}

async function signOut(notice) {
  if (typeof notice === "string" && notice) {
    try {
      sessionStorage.setItem(noticeKey, notice);
    } catch {}
  }
  // First one more try at sending what is queued, for a few seconds at most. What still can't be
  // sent is put aside by forget().
  if (signedIn()) {
    await Promise.race([
      Promise.all([book?.refresh(), shopping?.refresh()]),
      new Promise((resolve) => setTimeout(resolve, 4000)),
    ]);
  }
  try {
    // Here only: other devices stay signed in. This also removes the sign-in the library keeps in
    // the browser, which matters after deleting the account: the old one would otherwise linger.
    await (await client()).auth.signOut({ scope: "local" });
  } catch {
    // Unreachable or already signed out. The browser forgets the sign-in either way.
  }
  forget();
  location.href = assetUrl("");
}

// A sign-in in the address on a page that can't take it: the mail link or Google came back to the
// site's front page because the page that asked isn't in Supabase's list of allowed addresses
// (HANDOFF.md, setup step 2). Pass it on to the page that can, instead of leaving it unused.
const arrival = meta && !signedIn() ? signInPage(location.hash) : null;
if (arrival && !/\/(logga-in|nytt-losenord)\.html$/.test(location.pathname)) {
  location.replace(assetUrl(arrival) + location.hash);
} else if (meta) {
  window.restfestAccount = {
    signedIn,
    client,
    token,
    user,
    signedInNow,
    signOut,
    loginUrl,
    generatedIds,
    setGenerated,
    noteGenerated,
    refreshBook,
    setName,
    bookSnapshot: () => book.snapshot(),
    bookStatus: () => book.status(),
    rememberRecipe: data => book.rememberRecipe(data),
    cachedRecipe: id => book.cachedRecipe(id),
    discardBook: () => book.discard(),
  };
  shopping = createShoppingAccount({
    client,
    currentUser: () => signedIn() ? readStored(markerKey, {})?.id ?? null : null,
  });
  window.restfestShopping = shopping;
  book = createRecipeBookAccount({
    client,
    currentUser: () => signedIn() ? readStored(markerKey, {})?.id ?? null : null,
    show: showBook,
  });
  showState();
  showCount();
  try {
    const notice = sessionStorage.getItem(noticeKey);
    sessionStorage.removeItem(noticeKey);
    if (notice) showToast(notice);
  } catch {}

  // A heart on an archive recipe (toggleSave in app.js).
  document.addEventListener("restfest:save-change", (event) => {
    if (!signedIn()) return;
    book.change({
      kind: "archive",
      id: event.detail.id,
      saved: event.detail.saved,
    });
  });
  document.addEventListener("restfest:saved", showCount);

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
    if (event.key === generatedKey) {
      showCount();
      announce();
    }
  });

  if (signedIn()) {
    // Check that the sign-in still holds. One that has expired or been withdrawn just signs the
    // visitor out, without an error; an unreachable Supabase changes nothing.
    currentSession().then(({ session, unknown }) => {
      if (!session && !unknown && signedIn()) {
        forget();
        return;
      }
      if (!session) return;
      const marker = readStored(markerKey, {});
      if (marker.id !== session.user.id) {
        store(markerKey, { ...marker, id: session.user.id });
        showState();
      }
      // The book also refreshes on focus, reconnection and visible-page polling.
      book.refresh();
    });
  }
}
