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
//   generatedIds()         the generated recipes in the visitor's recipe book, as a Set of ids
//   setGenerated(id, on)   adds a generated recipe to the book, or takes it out
//   refreshBook()          fetches the book again now; resolves to true when it could
// and listen for `restfest:account` on document, sent when any of this changes.
//
// THE RECIPE BOOK. app.js draws hearts from `restfest-saved` in localStorage, signed in or not. For a
// signed-in visitor that list is a copy of the account's (the tables saved_recipes and
// saved_generated_recipes), kept in step here:
//   - at the first sign-in in a browser, the hearts it already holds are added to the account;
//   - every change is put in a queue (`restfest-saved-queue`) and sent; what can't be sent now
//     (offline, Supabase down) stays queued and goes with the next page load;
//   - on a page load, once the queue is empty, the account's lists replace the browser's.
// A heart click is never blocked or undone by any of this.

import {
  applyQueue,
  heartsToQueue,
  queueChange,
  safeReturnPath,
  sendQueue,
  withoutSent,
} from "./account-helpers.js";

const meta = document.querySelector('meta[name="restfest-account"]');
const markerKey = "restfest-account";
const generatedKey = "restfest-saved-generated";
const queueKey = "restfest-saved-queue";
// When the book was last fetched, so a visitor clicking around doesn't fetch it on every page.
const syncedKey = "restfest-book-synced";
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

// One change to the account. Throws when it should be tried again later; a change the database
// refuses for good (a recipe that no longer exists, a full book) is dropped instead.
async function sendChange(db, change) {
  const table =
    change.kind === "generated" ? "saved_generated_recipes" : "saved_recipes";
  const { error, status } = change.saved
    ? await db
        .from(table)
        .upsert(
          { recipe_id: change.id },
          { onConflict: "user_id,recipe_id", ignoreDuplicates: true },
        )
    : await db.from(table).delete().eq("recipe_id", change.id);
  if (!error) return;
  const refused =
    status >= 400 && status < 500 && ![401, 403, 408, 429].includes(status);
  if (!refused) throw error;
  console.warn("The recipe book refused a change:", change, error.message);
}

// Sends what is queued. True when the queue is empty afterwards.
async function sendWaiting(db) {
  const waiting = readList(queueKey);
  if (!waiting.length) return true;
  const left = await sendQueue(waiting, (change) => sendChange(db, change));
  const sent = waiting.slice(0, waiting.length - left.length);
  // Read again: the visitor may have clicked a heart meanwhile.
  const now = withoutSent(readList(queueKey), sent);
  store(queueKey, now);
  return now.length === 0;
}

const sameIds = (a, b) =>
  a.length === b.length && [...a].sort().join() === [...b].sort().join();

// The account's book into the browser, once everything queued has been sent.
async function fetchBook(db) {
  if (!(await sendWaiting(db))) return false;
  const [archive, generated] = await Promise.all([
    db.from("saved_recipes").select("recipe_id"),
    db.from("saved_generated_recipes").select("recipe_id"),
  ]);
  if (archive.error || generated.error) return false;
  const waiting = readList(queueKey);
  const ids = (result, kind) =>
    applyQueue(
      result.data.map((row) => row.recipe_id),
      waiting,
      kind,
    );
  const archiveIds = ids(archive, "archive");
  if (!sameIds(archiveIds, readList(savedKey))) setSavedRecipes(archiveIds);
  store(generatedKey, ids(generated, "generated"));
  try {
    sessionStorage.setItem(syncedKey, String(Date.now()));
  } catch {}
  showCount();
  announce();
  return true;
}

// One at a time, so two runs can't send the same change or overwrite each other's lists.
let bookWork = Promise.resolve();
function bookTask(task) {
  const run = bookWork.then(async () => {
    try {
      return await task(await client());
    } catch {
      // Unreachable for now. What's queued stays queued.
      return false;
    }
  });
  bookWork = run;
  return run;
}
const refreshBook = () => bookTask(fetchBook);

function fetchedRecently() {
  try {
    return Date.now() - Number(sessionStorage.getItem(syncedKey)) < 60000;
  } catch {
    return false;
  }
}

function queue(change) {
  store(queueKey, queueChange(readList(queueKey), change));
  bookTask(sendWaiting);
}

function setGenerated(id, on) {
  if (!signedIn()) return;
  const ids = generatedIds();
  if (on) ids.add(id);
  else ids.delete(id);
  store(generatedKey, [...ids]);
  showCount();
  queue({ kind: "generated", id, saved: Boolean(on) });
  announce();
}

// This browser is no longer signed in: drop the marker and the copies of the account's recipe book.
// The fridge list, the shopping list and the week plan belong to the browser and stay.
function forget() {
  forgetStored(markerKey, generatedKey, queueKey);
  try {
    sessionStorage.removeItem(syncedKey);
  } catch {}
  setSavedRecipes([]);
  showState();
  announce();
}

async function signedInNow() {
  const { session } = await currentSession();
  if (!session) return;
  const first = !signedIn();
  const data = session.user.user_metadata ?? {};
  store(markerKey, {
    name: data.display_name || data.full_name || data.name || "",
  });
  showState();
  // The hearts this browser held before signing in go into the account, so none is lost. Only at
  // the first sign-in: later the list is the account's own, and a recipe taken out of the book on
  // another device must not come back from here.
  if (first)
    store(queueKey, heartsToQueue(readList(savedKey), readList(queueKey)));
  await refreshBook();
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
    generatedIds,
    setGenerated,
    refreshBook,
  };
  showState();
  showCount();

  // A heart on an archive recipe (toggleSave in app.js).
  document.addEventListener("restfest:save-change", (event) => {
    if (!signedIn()) return;
    queue({ kind: "archive", id: event.detail.id, saved: event.detail.saved });
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
      if (!session && !unknown && signedIn()) forget();
      else if (session && (!fetchedRecently() || readList(queueKey).length))
        refreshBook();
    });
  }
}
