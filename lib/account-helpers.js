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

// Sends the queued changes in order with `send(change)`, which throws when a change can't be sent
// now. Stops at the first one that can't, and returns it and the ones after it.
export async function sendQueue(queue, send) {
  for (let index = 0; index < queue.length; index++) {
    try {
      await send(queue[index]);
    } catch {
      return queue.slice(index);
    }
  }
  return [];
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
