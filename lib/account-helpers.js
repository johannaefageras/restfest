// Small pure helpers for the account pages (src/js/account.js and the modules beside it). The build
// copies this file to js/account-helpers.js (eleventy.config.js), and `npm test` checks it.

// Where to go after signing in: `value` is the ?till= of logga-in.html. Only a path within the site
// is accepted, so a link can't use the sign-in page to send someone to another site. Returns the
// path with its query and hash, or null.
export function safeReturnPath(value, origin) {
  if (typeof value !== 'string' || !/^\/(?!\/)/.test(value)) return null;
  // Browsers read "\" as "/" and drop tabs and line breaks, which would turn "/\evil.example" into "//evil.example".
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return null;
  let url;
  try {
    url = new URL(value, origin);
  } catch {
    return null;
  }
  if (url.origin !== new URL(origin).origin) return null;
  // "/.//evil.example" resolves to the path "//evil.example", which a browser reads as another site.
  if (url.pathname.startsWith('//')) return null;
  // Not back to the sign-in pages themselves.
  if (/\/(logga-in|nytt-losenord)\.html$/.test(url.pathname)) return null;
  return url.pathname + url.search + url.hash;
}

// The heart changes that haven't reached the account yet: [{kind: 'archive' | 'generated', id, saved}].
// A new change replaces an earlier one for the same recipe and goes last. Returns a new list.
export function queueChange(queue, change) {
  const rest = queue.filter(item => item.kind !== change.kind || item.id !== change.id);
  return [...rest, {kind: change.kind, id: change.id, saved: Boolean(change.saved)}];
}

const sameChange = (a, b) => a.kind === b.kind && a.id === b.id && a.saved === b.saved;

// How many recipes go in one request. A removal names them all in the address, which can't be long.
const groupSize = 50;
const kinds = ['archive', 'generated'];

// The queue as requests: the changes of one kind together, as {kind, saved, ids}. The queue holds one
// change per recipe, so their order doesn't matter, except that removals go first to make room in a
// full book.
function queueGroups(queue) {
  const groups = [];
  for (const saved of [false, true]) {
    for (const kind of kinds) {
      const ids = queue.filter(change => change.kind === kind && change.saved === saved).map(change => change.id);
      for (let start = 0; start < ids.length; start += groupSize) groups.push({kind, saved, ids: ids.slice(start, start + groupSize)});
    }
  }
  return groups;
}

// Sends the queued changes with `send({kind, saved, ids})`, which answers true when they are stored
// and false when the account refuses them for good, and throws when they can't be sent now. A refused
// group is sent again one recipe at a time, so only the recipe that is the trouble is dropped.
// Stops at the first request that can't be sent, and returns the changes that are still waiting.
// A change of a kind there is no table for is left out of them: it could never be sent.
export async function sendQueue(queue, send) {
  const settled = [];
  try {
    for (const group of queueGroups(queue)) {
      if ((await send(group)) || group.ids.length === 1) {
        settled.push(group);
        continue;
      }
      for (const id of group.ids) {
        await send({...group, ids: [id]});
        settled.push({...group, ids: [id]});
      }
    }
  } catch {
    // Out of reach. What wasn't sent stays in the queue.
  }
  return queue.filter(change => kinds.includes(change.kind) && !settled.some(group => group.kind === change.kind && group.saved === change.saved && group.ids.includes(change.id)));
}

// The queue as it is now, without the changes that have been sent. A change made while the others
// were on their way stays, also when it is for the same recipe.
export function withoutSent(queue, sent) {
  return queue.filter(change => !sent.some(done => sameChange(done, change)));
}

// The account's list of ids for one kind, with the changes that haven't been sent laid over it, so
// the browser shows what the visitor last did.
export function applyQueue(ids, queue, kind) {
  const result = new Set(ids);
  for (const change of queue) {
    if (change.kind !== kind) continue;
    if (change.saved) result.add(change.id);
    else result.delete(change.id);
  }
  return [...result];
}

// At the first sign-in in a browser: the hearts it already holds, queued as additions to the
// account, so none is lost. Only ids shaped like a recipe file's name are taken (the database
// accepts no others). `queue` is what was already waiting.
export function heartsToQueue(ids, queue = []) {
  return ids
    .filter(id => typeof id === 'string' && /^[a-z0-9-]{1,80}$/.test(id))
    .reduce((result, id) => queueChange(result, {kind: 'archive', id, saved: true}), queue);
}

// Keeps the recipe book in the browser in step with the account (src/js/account.js, which explains
// the whole arrangement at its top). It is given:
//   queue    {read(), write(list)}: the unsent heart changes, kept where every tab can see them
//   remote   the account: change({kind, saved, ids}) as sendQueue's `send`, and book(), which resolves
//            to {archive: [ids], generated: [ids], …} or null when it can't be read
//   show     called with the account's book, unsent changes laid over it, to put it in the browser
//   lock     runs a task while no other tab runs one, and resolves to what it returns. Without it,
//            a tab that is slow to send an old change can undo a newer one sent from another tab.
// and returns the four things a tab does. Each resolves to true when the account was reached and
// nothing is left waiting, and they run one at a time.
export function bookSync({queue, remote, show, lock = task => task()}) {
  let work = Promise.resolve();
  function run(task) {
    // Out of reach for now: what's queued stays queued.
    const result = work.then(() => lock(task)).catch(() => false);
    work = result;
    return result;
  }

  async function send() {
    const waiting = queue.read();
    if (!waiting.length) return true;
    const left = await sendQueue(waiting, remote.change);
    // Read again: the visitor may have clicked a heart meanwhile.
    const now = withoutSent(queue.read(), waiting.filter(change => !left.includes(change)));
    queue.write(now);
    return now.length === 0;
  }

  // The account's book into the browser, once everything queued has been sent.
  async function fetch() {
    if (!(await send())) return false;
    const book = await remote.book();
    if (!book) return false;
    const waiting = queue.read();
    show({...book, archive: applyQueue(book.archive, waiting, 'archive'), generated: applyQueue(book.generated, waiting, 'generated')});
    return true;
  }

  return {
    // A heart click: queued, and sent at once if it can be.
    change(change) {
      queue.write(queueChange(queue.read(), change));
      return run(send);
    },
    send: () => run(send),
    refresh: () => run(fetch),
    // On a page load. `fresh()` says whether the book was fetched a moment ago; it is asked when this
    // task's turn comes, so a fetch the page itself asked for first counts.
    refreshIfStale: fresh => run(() => (fresh() && !queue.read().length ? true : fetch()))
  };
}

const passwordText = 'Lösenordet behöver vara minst 8 tecken.';
const generalText = 'Något gick fel. Prova igen om en stund.';

// Supabase's error codes (https://supabase.com/docs/guides/auth/debugging/error-codes) in Swedish.
const errorTexts = {
  invalid_credentials: 'Fel e-postadress eller lösenord.',
  user_already_exists: 'Det finns redan ett konto med den e-postadressen. Logga in i stället.',
  email_exists: 'Det finns redan ett konto med den e-postadressen. Logga in i stället.',
  email_not_confirmed: 'Du behöver bekräfta e-postadressen först. Kolla din mejl.',
  weak_password: passwordText,
  same_password: 'Det nya lösenordet behöver skilja sig från det gamla.',
  email_address_invalid: 'E-postadressen ser inte rätt ut.',
  validation_failed: 'E-postadressen ser inte rätt ut.',
  over_email_send_rate_limit: 'För många mejl på kort tid. Vänta en stund och prova igen.',
  over_request_rate_limit: 'För många försök på kort tid. Vänta en stund och prova igen.',
  otp_expired: 'Länken har gått ut eller redan använts. Be om en ny.',
  reauthentication_needed: 'Logga ut och in igen, så kan du byta lösenord.',
  session_not_found: 'Du har loggats ut. Logga in igen.',
  session_expired: 'Du har loggats ut. Logga in igen.'
};

// A Swedish text for an error from supabase-js, or for a lost connection.
export function authErrorText(error) {
  const text = errorTexts[error?.code];
  if (text) return text;
  if (!error?.code && /fetch|network/i.test(error?.message ?? '')) {
    return 'Kunde inte nå Ofta bra efter. Kolla uppkopplingen och prova igen.';
  }
  return generalText;
}

// What's wrong with a new password, or null. Supabase checks the same length (HANDOFF.md, "Konton och receptbok").
export function passwordProblem(password) {
  return typeof password === 'string' && password.length >= 8 ? null : passwordText;
}

// Adds a food to the "Äter inte" list on profil.html: one line of at most 80 characters, not already
// there (whatever the capitals), and at most 30 in all, as the database allows. Returns the new list
// and, when the food couldn't be added, why.
export function addFood(list, value) {
  const name = String(value ?? '').replace(/[\p{Cc}\p{Cf}"]/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, 80).trim();
  if (!name || list.some(food => food.toLowerCase() === name.toLowerCase())) return {list, problem: null};
  if (list.length >= 30) return {list, problem: 'Listan rymmer 30 råvaror. Ta bort någon för att lägga till en ny.'};
  return {list: [...list, name], problem: null};
}

// Whether the database's answer to a heart change means "never": a check that fails, a recipe that
// no longer exists, a full book (400, 409, 422). Anything else may work later: signed out (401, 403),
// too many requests, server trouble, no answer at all, and 404, which is what a table that hasn't
// been created yet answers.
export function refusedForGood(status) {
  return status === 400 || status === 409 || status === 422;
}

// When a visitor signs out, or their sign-in runs out, with heart changes that haven't reached the
// account: the changes are put aside under the visitor's id instead of being thrown away, and
// nothing of them shows in the browser meanwhile. Returns what to store, or null when there is
// nothing to keep.
export function stashQueue(userId, queue) {
  return userId && queue.length ? {user: userId, queue} : null;
}

// At sign-in: the queue with what was put aside for this visitor laid under it, so the changes are
// sent after all. Changes put aside for someone else are left out.
export function resumeQueue(stash, userId, queue) {
  if (!stash || stash.user !== userId || !Array.isArray(stash.queue)) return queue;
  return queue.reduce(queueChange, stash.queue.reduce(queueChange, []));
}

// A sign-in, or the reason there is none, arrives in the address after the # (a link in a mail, the
// way back from Google). If Supabase's list of allowed addresses doesn't have the page that asked,
// it sends the visitor to the site's front page instead. Returns the page that should take care of
// such a hash, or null for an ordinary one like #borja.
export function signInPage(hash) {
  const values = new URLSearchParams(String(hash ?? '').replace(/^#/, ''));
  if (values.get('access_token')) return values.get('type') === 'recovery' ? 'nytt-losenord.html' : 'logga-in.html';
  if (values.get('error_code') || values.get('error_description')) return 'logga-in.html';
  return null;
}

// "Spara i receptboken" on a generated recipe, for a visitor who isn't signed in: the recipe is saved
// when they come back from signing in (src/js/new-recipe.js). That they asked is kept in the browser
// as {id, at}, for an hour. The way back also has ?spara=1 in its address, but an address can be put
// in a link by anyone, so it saves nothing without this.
export function saveIntent(id, now) {
  return {id, at: now};
}

// Whether the visitor asked, in this browser and within the hour, to save the recipe `id`.
export function intendedSave(intent, id, now) {
  return intent?.id === id && typeof intent.at === 'number' && now >= intent.at && now - intent.at < 60 * 60 * 1000;
}
