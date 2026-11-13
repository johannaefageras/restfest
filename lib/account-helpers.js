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
