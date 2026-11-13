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
//   noteGenerated(id)      records that the server has added a generated recipe to the book
//   refreshBook()          fetches the book again now; resolves to true when it could
//   setName(name)          the visitor's name has changed (profil.html)
// and listen for `restfest:account` on document, sent when any of this changes.
//
// THE RECIPE BOOK. app.js draws hearts from `restfest-saved` in localStorage, signed in or not. For a
// signed-in visitor that list is a copy of the account's (the tables saved_recipes and
// saved_generated_recipes), kept in step here:
//   - at the first sign-in in a browser, the hearts it already holds are added to the account;
//   - every change is put in a queue (`restfest-saved-queue`) and sent; what can't be sent now
//     (offline, Supabase down) stays queued and goes with the next page load;
//   - on a page load, once the queue is empty, the account's lists replace the browser's.
// A heart click is never blocked or undone by any of this. The order of it all is bookSync in
// lib/account-helpers.js, which `npm test` checks; here it gets the browser's storage, the tables
// and a lock that keeps two open tabs from sending at the same time.

import {
  bookSync,
  heartsToQueue,
  refusedForGood,
  resumeQueue,
  safeReturnPath,
  signInPage,
  stashQueue,
} from "./account-helpers.js";

const meta = document.querySelector('meta[name="restfest-account"]');
const markerKey = "restfest-account";
const generatedKey = "restfest-saved-generated";
const queueKey = "restfest-saved-queue";
// Changes that hadn't reached the account when the visitor signed out, kept for their next sign-in.
const stashKey = "restfest-saved-stash";
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

// The account, as bookSync wants it.
const tables = { archive: "saved_recipes", generated: "saved_generated_recipes" };
const remote = {
  // Some hearts added or removed in one request. True when stored, and false when the database
  // refuses for good (a recipe that no longer exists, a full book). Throws when it should be tried
  // again later.
  async change({ kind, saved, ids }) {
    const table = (await client()).from(tables[kind]);
    const { error, status } = saved
      ? await table.upsert(
          ids.map((id) => ({ recipe_id: id })),
          { onConflict: "user_id,recipe_id", ignoreDuplicates: true },
        )
      : await table.delete().in("recipe_id", ids);
    if (!error) return true;
    if (!refusedForGood(status)) throw error;
    // A refused group is sent again one by one, so the warning names the recipe that is the trouble.
    if (ids.length === 1)
      console.warn(
        "The recipe book refused a change:",
        { kind, id: ids[0], saved },
        error.message,
      );
    return false;
  },
  // The book's ids and the name, or null when they can't be read.
  async book() {
    const db = await client();
    const [archive, generated, profile] = await Promise.all([
      db.from("saved_recipes").select("recipe_id"),
      // Not the table itself: the function leaves out recipes the owner has hidden, as
      // receptbok.html does, so the header's count and the page agree.
      db.rpc("my_generated_recipes").select("id"),
      db.from("profiles").select("display_name").maybeSingle(),
    ]);
    if (archive.error || generated.error) return null;
    return {
      archive: archive.data.map((row) => row.recipe_id),
      generated: generated.data.map((row) => row.id),
      name:
        profile.error || !profile.data
          ? null
          : (profile.data.display_name ?? ""),
    };
  },
};

const sameIds = (a, b) =>
  a.length === b.length && [...a].sort().join() === [...b].sort().join();

// The account's book into the browser.
function showBook({ archive, generated, name }) {
  // Signed out while the book was on its way, here or in another tab: it isn't this browser's to
  // show any more.
  if (!signedIn()) return;
  // The name as the profile has it now: it may have been changed on another device.
  const marker = readStored(markerKey, {});
  if (name != null && marker.name !== name) {
    store(markerKey, { ...marker, name });
    showState();
  }
  if (!sameIds(archive, readList(savedKey))) setSavedRecipes(archive);
  store(generatedKey, generated);
  try {
    sessionStorage.setItem(syncedKey, String(Date.now()));
  } catch {}
  showCount();
  announce();
}

// One tab at a time, with the Web Locks API. A tab that has waited 15 seconds for its turn gives up
// until the next page load; what it had queued stays queued. A browser without the API runs each
// tab for itself.
function oneTab(task) {
  if (!navigator.locks) return task();
  const patience = AbortSignal.timeout
    ? { signal: AbortSignal.timeout(15000) }
    : {};
  return navigator.locks.request("restfest-book", patience, () => task());
}

const book = bookSync({
  queue: {
    read: () => readList(queueKey),
    write: (list) => store(queueKey, list),
  },
  remote,
  show: showBook,
  lock: oneTab,
});
const refreshBook = () => book.refresh();

function fetchedRecently() {
  try {
    return Date.now() - Number(sessionStorage.getItem(syncedKey)) < 60000;
  } catch {
    return false;
  }
}

// The browser's copy of which generated recipes are in the book.
function keepGenerated(id, on) {
  const ids = generatedIds();
  if (on) ids.add(id);
  else ids.delete(id);
  store(generatedKey, [...ids]);
  showCount();
}

function setGenerated(id, on) {
  if (!signedIn()) return;
  keepGenerated(id, on);
  book.change({ kind: "generated", id, saved: Boolean(on) });
  announce();
}

// generate-recipe adds a signed-in visitor's new recipe to their book itself, so there is nothing
// to send: only the browser's copy needs to know.
function noteGenerated(id) {
  if (!signedIn()) return;
  keepGenerated(id, true);
  announce();
}

// This browser is no longer signed in: drop the marker and the copies of the account's recipe book.
// The fridge list, the shopping list and the week plan belong to the browser and stay.
// Heart changes that never reached the account aren't thrown away: they are put aside under the
// visitor's id, out of sight, and sent when the same visitor signs in here again.
function forget() {
  const stash = stashQueue(readStored(markerKey, {})?.id, readList(queueKey));
  if (stash) store(stashKey, stash);
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
  // The name from the sign-up, until the profile's own arrives with the book below.
  store(markerKey, {
    id: session.user.id,
    name: data.display_name || data.full_name || data.name || "",
  });
  showState();
  // The hearts this browser held before signing in go into the account, so none is lost. Only at
  // the first sign-in: later the list is the account's own, and a recipe taken out of the book on
  // another device must not come back from here.
  let waiting = readList(queueKey);
  if (first) waiting = heartsToQueue(readList(savedKey), waiting);
  // And what this visitor left unsent the last time they signed out here.
  waiting = resumeQueue(readStored(stashKey, null), session.user.id, waiting);
  forgetStored(stashKey);
  store(queueKey, waiting);
  await refreshBook();
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
  if (signedIn() && readList(queueKey).length) {
    await Promise.race([
      book.send(),
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
  };
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
      if (marker.id !== session.user.id)
        store(markerKey, { ...marker, id: session.user.id });
      // Not again if a page that needs the book now (receptbok.html) has just fetched it.
      book.refreshIfStale(fetchedRecently);
    });
  }
}
