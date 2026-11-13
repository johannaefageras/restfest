// Builds the site twice, with and without a publishable key, and checks that accounts are either
// fully there or leave no trace (src/_data/ai.js, `accounts`).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('..', import.meta.url).pathname;

function build(publishableKey) {
  const out = mkdtempSync(join(tmpdir(), 'restfest-build-'));
  execFileSync(join(root, 'node_modules/.bin/eleventy'), [`--output=${out}`, '--quiet'], {
    cwd: root,
    env: { ...process.env, SUPABASE_PUBLISHABLE_KEY: publishableKey },
    stdio: 'pipe'
  });
  return { out, read: path => readFileSync(join(out, path), 'utf8'), has: path => existsSync(join(out, path)) };
}

const accountPages = ['logga-in.html', 'nytt-losenord.html', 'receptbok.html', 'profil.html', 'konto.html', 'integritet.html'];

test('without a publishable key the pages have no trace of accounts', t => {
  const site = build('');
  t.after(() => rmSync(site.out, { recursive: true, force: true }));
  for (const page of ['index.html', 'receptarkiv.html', 'recept/01-rodbetspytt.html', 'nytt-recept.html']) {
    const html = site.read(page);
    for (const trace of ['restfest-account', 'js/account.js', 'logga-in', 'signed-in', 'Receptbok', 'integritet', 'data-saved-link', 'data-account-link'])
      assert.equal(html.includes(trace), false, `${page} mentions ${trace}`);
  }
  for (const page of accountPages) assert.equal(site.has(page), false, `${page} was built`);
});

test('with a publishable key every page gets the account button and the account script', t => {
  const site = build('sb_publishable_test');
  t.after(() => rmSync(site.out, { recursive: true, force: true }));
  for (const [page, base] of [['index.html', ''], ['recept/01-rodbetspytt.html', '../']]) {
    const html = site.read(page);
    assert.match(html, /<meta name="restfest-account" content="https:\/\/[a-z0-9]+\.supabase\.co" data-key="sb_publishable_test">/);
    assert.ok(html.includes(`<script type="module" src="${base}js/account.js"></script>`), `${page} loads account.js`);
    assert.ok(html.includes(`href="${base}logga-in.html"`), `${page} links to the sign-in page`);
    assert.ok(html.indexOf("localStorage.getItem('restfest-account')") < html.indexOf('rel="stylesheet"'), `${page} sets the state before the styles`);
    assert.equal(html.includes('vendor/supabase.js'), false, `${page} must not load the library itself`);
  }
  for (const page of ['logga-in.html', 'nytt-losenord.html']) {
    const html = site.read(page);
    assert.match(html, /<meta name="robots" content="noindex">/, `${page} is kept out of search engines`);
    assert.ok(html.includes('<script type="module" src="js/auth-forms.js"></script>'), `${page} loads auth-forms.js`);
    assert.ok(html.indexOf('js/account.js') < html.indexOf('js/auth-forms.js'), `${page} loads account.js first`);
  }
  assert.ok(site.has('js/account.js'));
  assert.ok(site.has('js/account-helpers.js'));
  assert.match(site.read('js/vendor/supabase.js'), /createClient/);
});
