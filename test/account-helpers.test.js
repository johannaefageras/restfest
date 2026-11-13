import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addFood, applyQueue, authErrorText, heartsToQueue, intendedSave, passwordProblem, queueChange, refusedForGood,
  resumeQueue, safeReturnPath, saveIntent, sendQueue, signInPage, stashQueue, withoutSent
} from '../lib/account-helpers.js';

const origin = 'https://example.se';

test('safeReturnPath keeps paths within the site', () => {
  assert.equal(safeReturnPath('/nytt-recept.html?id=abc&spara=1', origin), '/nytt-recept.html?id=abc&spara=1');
  assert.equal(safeReturnPath('/receptbok.html#top', origin), '/receptbok.html#top');
});

test('safeReturnPath refuses everything else', () => {
  for (const bad of [null, '', 'receptbok.html', '//evil.example', '/\\evil.example', '/\t/evil.example',
    'https://evil.example/', 'javascript:alert(1)', '/logga-in.html', '/logga-in.html?till=/x'])
    assert.equal(safeReturnPath(bad, origin), null, String(bad));
});

test('queueChange keeps only the latest change per recipe', () => {
  let q = queueChange([], {kind: 'archive', id: '01-rodbetspytt', saved: true});
  q = queueChange(q, {kind: 'generated', id: 'u1', saved: true});
  q = queueChange(q, {kind: 'archive', id: '01-rodbetspytt', saved: false});
  assert.deepEqual(q, [{kind: 'generated', id: 'u1', saved: true}, {kind: 'archive', id: '01-rodbetspytt', saved: false}]);
});

test('queueChange leaves the queue it was given unchanged', () => {
  const before = [{kind: 'archive', id: 'a', saved: true}];
  queueChange(before, {kind: 'archive', id: 'a', saved: false});
  assert.deepEqual(before, [{kind: 'archive', id: 'a', saved: true}]);
});

test('authErrorText gives Swedish texts for the common cases', () => {
  assert.equal(authErrorText({code: 'invalid_credentials'}), 'Fel e-postadress eller lösenord.');
  assert.equal(authErrorText({code: 'user_already_exists'}), 'Det finns redan ett konto med den e-postadressen. Logga in i stället.');
  assert.equal(authErrorText({code: 'email_not_confirmed'}), 'Du behöver bekräfta e-postadressen först. Kolla din mejl.');
  assert.equal(authErrorText({code: 'weak_password'}), 'Lösenordet behöver vara minst 8 tecken.');
  assert.equal(authErrorText({code: 'over_email_send_rate_limit'}), 'För många mejl på kort tid. Vänta en stund och prova igen.');
  assert.equal(authErrorText({code: 'same_password'}), 'Det nya lösenordet behöver skilja sig från det gamla.');
  assert.equal(authErrorText({code: 'email_address_invalid'}), 'E-postadressen ser inte rätt ut.');
  assert.equal(authErrorText({code: 'otp_expired'}), 'Länken har gått ut eller redan använts. Be om en ny.');
  assert.equal(authErrorText({message: 'Failed to fetch'}), 'Kunde inte nå Ofta bra efter. Kolla uppkopplingen och prova igen.');
  assert.equal(authErrorText({code: 'something_new'}), 'Något gick fel. Prova igen om en stund.');
  assert.equal(authErrorText(null), 'Något gick fel. Prova igen om en stund.');
});

test('passwordProblem wants 8 characters', () => {
  assert.equal(passwordProblem('1234567'), 'Lösenordet behöver vara minst 8 tecken.');
  assert.equal(passwordProblem('12345678'), null);
});

// Keeping the browser's hearts in step with the account (src/js/account.js).
const add = (id, kind = 'archive') => ({kind, id, saved: true});
const drop = (id, kind = 'archive') => ({kind, id, saved: false});

// sendQueue's `send` gets {kind, saved, ids}: true when stored, false when refused for good, and it
// throws when the account can't be reached. This one records what it was asked.
function sender({down = () => false, refuse = () => false} = {}) {
  const calls = [];
  const send = async group => {
    calls.push(`${group.saved ? '+' : '-'}${group.kind}:${group.ids.join(',')}`);
    if (down(group)) throw new Error('offline');
    return !refuse(group);
  };
  return {calls, send};
}

test('sendQueue sends the changes of one kind together, removals first', async () => {
  const {calls, send} = sender();
  const left = await sendQueue([add('a'), drop('b'), add('g', 'generated'), add('c'), drop('h', 'generated')], send);
  assert.deepEqual(calls, ['-archive:b', '-generated:h', '+archive:a,c', '+generated:g']);
  assert.deepEqual(left, []);
});

test('sendQueue sends at most 50 recipes in one go', async () => {
  const {calls, send} = sender();
  await sendQueue(Array.from({length: 120}, (_, index) => add(`r-${index}`)), send);
  assert.deepEqual(calls.map(call => call.split(',').length), [50, 50, 20]);
});

test('sendQueue stops when the account cannot be reached and keeps what was not sent', async () => {
  const {calls, send} = sender({down: group => group.saved});
  const left = await sendQueue([add('a'), drop('b'), add('g', 'generated')], send);
  assert.deepEqual(calls, ['-archive:b', '+archive:a']);
  assert.deepEqual(left, [add('a'), add('g', 'generated')]);
});

test('sendQueue sends a refused group one recipe at a time, so only the refused one is dropped', async () => {
  const {calls, send} = sender({refuse: group => group.ids.includes('gone')});
  const left = await sendQueue([add('a'), add('gone'), add('c')], send);
  assert.deepEqual(calls, ['+archive:a,gone,c', '+archive:a', '+archive:gone', '+archive:c']);
  assert.deepEqual(left, []);
});

test('sendQueue keeps the rest of a refused group when the account goes out of reach', async () => {
  const {send} = sender({refuse: group => group.ids.length > 1, down: group => group.ids.join() === 'b'});
  assert.deepEqual(await sendQueue([add('a'), add('b'), add('c')], send), [add('b'), add('c')]);
});

test('sendQueue drops a change of a kind it does not know, so it cannot hold up the rest forever', async () => {
  const {calls, send} = sender();
  assert.deepEqual(await sendQueue([{kind: 'nonsense', id: 'a', saved: true}, add('b')], send), []);
  assert.deepEqual(calls, ['+archive:b']);
});

test('withoutSent removes what was sent and keeps changes made meanwhile', () => {
  // While "add a" was on its way, the visitor removed a again and hearted d.
  const now = [drop('a'), add('b'), add('d')];
  assert.deepEqual(withoutSent(now, [add('a'), add('b')]), [drop('a'), add('d')]);
  assert.deepEqual(withoutSent([add('x', 'generated')], [add('x', 'archive')]), [add('x', 'generated')]);
});

test('applyQueue lays unsent changes over the account\'s list', () => {
  const queue = [drop('b'), add('d'), add('g1', 'generated')];
  assert.deepEqual(applyQueue(['a', 'b', 'c'], queue, 'archive'), ['a', 'c', 'd']);
  assert.deepEqual(applyQueue(['g0'], queue, 'generated'), ['g0', 'g1']);
  assert.deepEqual(applyQueue(['a'], [add('a')], 'archive'), ['a']);
});

test('heartsToQueue queues the browser\'s own hearts as additions, skipping ids that are not recipe ids', () => {
  assert.deepEqual(heartsToQueue(['01-rodbetspytt', 'Not An Id', 7, '29-shakshuka'], [drop('29-shakshuka')]),
    [add('01-rodbetspytt'), add('29-shakshuka')]);
});

// The "Äter inte" list on profil.html.
test('addFood cleans the name and adds it last', () => {
  assert.deepEqual(addFood(['svamp'], '  färsk   koriander '), {list: ['svamp', 'färsk koriander'], problem: null});
  assert.equal(addFood([], 'a'.repeat(120)).list[0].length, 80);
});

test('addFood ignores empty names and ones already in the list', () => {
  assert.deepEqual(addFood(['Svamp'], '   '), {list: ['Svamp'], problem: null});
  assert.deepEqual(addFood(['Svamp'], 'svamp'), {list: ['Svamp'], problem: null});
});

test('addFood refuses the 31st food', () => {
  const full = Array.from({length: 30}, (_, i) => `mat ${i}`);
  assert.deepEqual(addFood(full, 'en till'), {list: full, problem: 'Listan rymmer 30 råvaror. Ta bort någon för att lägga till en ny.'});
});

test('authErrorText explains when a fresh sign-in is needed', () => {
  assert.equal(authErrorText({code: 'reauthentication_needed'}), 'Logga ut och in igen, så kan du byta lösenord.');
});

// Found by the review of the accounts branch.
test('safeReturnPath refuses paths that resolve to another site', () => {
  for (const bad of ['/.//evil.example', '/..//evil.example', '/%2e//evil.example', '/a/..//evil.example'])
    assert.equal(safeReturnPath(bad, origin), null, bad);
  assert.equal(safeReturnPath('/a/../receptbok.html', origin), '/receptbok.html');
});

test('refusedForGood is true only for answers that will never change', () => {
  for (const status of [400, 409, 422]) assert.equal(refusedForGood(status), true, String(status));
  // Signed out, forbidden, not found (the table may not be there yet), too many requests, server trouble, no answer.
  for (const status of [0, undefined, 401, 403, 404, 408, 429, 500, 503]) assert.equal(refusedForGood(status), false, String(status));
});

test('stashQueue keeps unsent changes for the visitor who made them', () => {
  assert.deepEqual(stashQueue('user-1', [add('a')]), {user: 'user-1', queue: [add('a')]});
  assert.equal(stashQueue('user-1', []), null);
  assert.equal(stashQueue(undefined, [add('a')]), null);
});

test('resumeQueue gives the stashed changes back to the same visitor only', () => {
  const stash = {user: 'user-1', queue: [add('a'), drop('b')]};
  assert.deepEqual(resumeQueue(stash, 'user-1', [add('b'), add('c')]), [add('a'), add('b'), add('c')]);
  assert.deepEqual(resumeQueue(stash, 'user-2', [add('c')]), [add('c')]);
  assert.deepEqual(resumeQueue(null, 'user-1', [add('c')]), [add('c')]);
  assert.deepEqual(resumeQueue({user: 'user-1', queue: 'nonsense'}, 'user-1', []), []);
});

test('signInPage says where a sign-in in the address belongs', () => {
  assert.equal(signInPage('#access_token=abc&refresh_token=def&type=signup'), 'logga-in.html');
  assert.equal(signInPage('#access_token=abc&type=recovery'), 'nytt-losenord.html');
  assert.equal(signInPage('#error=access_denied&error_code=otp_expired&error_description=x'), 'logga-in.html');
  for (const other of ['', '#borja', '#sa-funkar-det', '#recept', '#token=1'])
    assert.equal(signInPage(other), null, other);
});

// "Spara i receptboken" on a generated recipe, signed out (src/js/new-recipe.js).
const hour = 60 * 60 * 1000;

test('intendedSave is true for the recipe the visitor asked to save, for an hour', () => {
  const intent = saveIntent('recipe-1', 1000);
  assert.equal(intendedSave(intent, 'recipe-1', 1000), true);
  assert.equal(intendedSave(intent, 'recipe-1', 1000 + hour - 1), true);
  assert.equal(intendedSave(JSON.parse(JSON.stringify(intent)), 'recipe-1', 2000), true);
});

test('intendedSave is false for another recipe, a later hour, or no request at all', () => {
  const intent = saveIntent('recipe-1', 1000);
  assert.equal(intendedSave(intent, 'recipe-2', 2000), false);
  assert.equal(intendedSave(intent, 'recipe-1', 1000 + hour), false);
  assert.equal(intendedSave(intent, 'recipe-1', 500), false);
  for (const nothing of [null, undefined, 'recipe-1', {}, {id: 'recipe-1'}, {id: 'recipe-1', at: 'now'}])
    assert.equal(intendedSave(nothing, 'recipe-1', 2000), false, JSON.stringify(nothing));
});
