import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applyQueue, authErrorText, heartsToQueue, passwordProblem, queueChange, safeReturnPath, sendQueue, withoutSent
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

test('sendQueue sends the changes in order and returns what is left', async () => {
  const sent = [];
  const left = await sendQueue([add('a'), drop('b'), add('c')], async change => { sent.push(change.id); });
  assert.deepEqual(sent, ['a', 'b', 'c']);
  assert.deepEqual(left, []);
});

test('sendQueue stops at the first change that cannot be sent and keeps it and the rest', async () => {
  const sent = [];
  const left = await sendQueue([add('a'), drop('b'), add('c')], async change => {
    if (change.id === 'b') throw new Error('offline');
    sent.push(change.id);
  });
  assert.deepEqual(sent, ['a']);
  assert.deepEqual(left, [drop('b'), add('c')]);
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
