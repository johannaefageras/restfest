// Builds the site twice, with and without a publishable key, and checks that accounts are either
// fully there or leave no trace (src/_data/ai.js, `accounts`).
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const root = new URL("..", import.meta.url).pathname;

function build(publishableKey) {
  const out = mkdtempSync(join(tmpdir(), "restfest-build-"));
  execFileSync(
    join(root, "node_modules/.bin/eleventy"),
    [`--output=${out}`, "--quiet"],
    {
      cwd: root,
      env: { ...process.env, RESTFEST_PUBLISHABLE_KEY: publishableKey },
      stdio: "pipe",
    },
  );
  return {
    out,
    read: (path) => readFileSync(join(out, path), "utf8"),
    has: (path) => existsSync(join(out, path)),
  };
}

const accountPages = [
  "logga-in.html",
  "nytt-losenord.html",
  "receptbok.html",
  "profil.html",
  "konto.html",
  "integritet.html",
];

test("without a publishable key the pages have no trace of accounts", (t) => {
  const site = build("");
  t.after(() => rmSync(site.out, { recursive: true, force: true }));
  for (const page of [
    "index.html",
    "receptarkiv.html",
    "recept/01-rodbetspytt.html",
    "nytt-recept.html",
    "inkopslista.html",
  ]) {
    const html = site.read(page);
    for (const trace of [
      "restfest-account",
      "js/account.js",
      "logga-in",
      "signed-in",
      "Receptsamling",
      "integritet",
      "data-saved-link",
      "data-account-link",
    ])
      assert.equal(html.includes(trace), false, `${page} mentions ${trace}`);
  }
  for (const page of accountPages)
    assert.equal(site.has(page), false, `${page} was built`);
  assert.match(
    site.read("index.html"),
    /<button id="shopping-nav"[^>]*aria-haspopup="dialog"/,
    "shopping still opens a modal without accounts",
  );
  assert.match(
    site.read("index.html"),
    /data-shopping-add/,
    "guests can add their own items",
  );
  assert.match(
    site.read("index.html"),
    /data-shopping-recipe-tools/,
    "guests can manage recipe contributions",
  );
  for (const section of ["pending", "bought"])
    assert.match(
      site.read("index.html"),
      new RegExp(`data-shopping-items="${section}"`),
      `guests have the ${section} section`,
    );
  assert.equal(
    site.has("js/vendor/supabase.js"),
    false,
    "the Supabase library was copied, though no page loads it",
  );
  assert.equal(
    site.has("shopping-worker.js"),
    false,
    "a site without accounts has no shopping worker",
  );
  const copy = site.read("delad-inkopslista.html");
  assert.match(copy, /<meta name="robots" content="noindex">/);
  assert.match(copy, /data-shopping-copy/);
  assert.match(copy, /js\/shopping-copy-view.js/);
  assert.doesNotMatch(
    copy,
    /js\/shopping-list.js|class="when-signed-in"[^>]*data-shopping-copy/,
  );
  assert.ok(site.has("js/shopping-copy.js"));
  assert.ok(site.has("js/shopping-copy-links.js"));
  const shortCopy = site.read("lista/index.html");
  assert.match(shortCopy, /<html[^>]*data-base="\.\.\/"/);
  assert.match(shortCopy, /<meta name="robots" content="noindex">/);
  assert.match(shortCopy, /src="\.\.\/js\/shopping-copy-view.js"/);
  assert.match(shortCopy, /src="\.\.\/assets\/icons\/shopping-basket.svg"/);
  assert.match(site.read("index.html"), /data-shopping-share/);
  const shopping = site.read("inkopslista.html");
  assert.match(shopping, /class="shopping-panel" data-shopping-list/);
  assert.equal(
    (shopping.match(/data-shopping-share/g) ?? []).length,
    2,
    "guests can share from both the page and modal",
  );
  assert.match(shopping, /Du kan dela en kopia utan att logga in/);
  assert.match(shopping, /js\/shopping-list.js/);
  assert.doesNotMatch(shopping, /class="when-signed-in"/);
  assert.doesNotMatch(site.read("sitemap.xml"), /delad-inkopslista/);
  assert.doesNotMatch(site.read("sitemap.xml"), /inkopslista/);
  assert.doesNotMatch(site.read("sitemap.xml"), /<loc>[^<]*\/lista\//);
});

test("with a publishable key every page gets the account button and the account script", (t) => {
  const site = build("sb_publishable_test");
  t.after(() => rmSync(site.out, { recursive: true, force: true }));
  for (const [page, base] of [
    ["index.html", ""],
    ["recept/01-rodbetspytt.html", "../"],
  ]) {
    const html = site.read(page);
    assert.match(
      html,
      /<meta name="restfest-account" content="https:\/\/[a-z0-9]+\.supabase\.co" data-key="sb_publishable_test">/,
    );
    assert.ok(
      html.includes(
        `<script type="module" src="${base}js/account.js"></script>`,
      ),
      `${page} loads account.js`,
    );
    assert.ok(
      html.includes(`href="${base}logga-in.html"`),
      `${page} links to the sign-in page`,
    );
    assert.match(
      html,
      new RegExp(`<a id="shopping-nav"[^>]*href="${base}inkopslista.html"`),
      `${page} links to the shopping page`,
    );
    assert.ok(
      html.indexOf("localStorage.getItem('restfest-account')") <
        html.indexOf('rel="stylesheet"'),
      `${page} sets the state before the styles`,
    );
    assert.equal(
      html.includes("vendor/supabase.js"),
      false,
      `${page} must not load the library itself`,
    );
  }
  for (const page of ["logga-in.html", "nytt-losenord.html"]) {
    const html = site.read(page);
    assert.match(
      html,
      /<meta name="robots" content="noindex">/,
      `${page} is kept out of search engines`,
    );
    assert.ok(
      html.includes('<script type="module" src="js/auth-forms.js"></script>'),
      `${page} loads auth-forms.js`,
    );
    assert.ok(
      html.indexOf("js/account.js") < html.indexOf("js/auth-forms.js"),
      `${page} loads account.js first`,
    );
  }
  const book = site.read("receptbok.html");
  assert.match(book, /<meta name="robots" content="noindex">/);
  assert.ok(
    book.includes('<script type="module" src="js/recipe-book.js"></script>'),
    "receptbok.html loads recipe-book.js",
  );
  assert.match(
    book,
    /<a href="receptbok\.html" aria-current="page">/,
    "the account menu marks the recipe book as the current page",
  );
  for (const link of [
    'href="inkopslista.html"',
    'href="profil.html"',
    'href="konto.html"',
    "data-sign-out",
  ])
    assert.ok(book.includes(link), `the account menu has ${link}`);
  for (const [page, name] of [
    ["profil.html", "Profil"],
    ["konto.html", "Konto"],
  ]) {
    const html = site.read(page);
    assert.match(
      html,
      /<meta name="robots" content="noindex">/,
      `${page} is kept out of search engines`,
    );
    assert.ok(
      html.includes('<script type="module" src="js/profile.js"></script>'),
      `${page} loads profile.js`,
    );
    assert.ok(
      html.includes(`<a href="${page}" aria-current="page">${name}</a>`),
      `${page} is marked in the account menu`,
    );
  }
  const shopping = site.read("inkopslista.html");
  assert.match(shopping, /<meta name="robots" content="noindex">/);
  assert.ok(
    shopping.includes(
      '<script type="module" src="js/shopping-list.js"></script>',
    ),
  );
  assert.match(
    shopping,
    /<a href="inkopslista\.html" aria-current="page">Inköpslista<\/a>/,
  );
  assert.match(shopping, /class="shopping-panel" data-shopping-list/);
  assert.equal(
    (shopping.match(/id="shopping-items"/g) ?? []).length,
    1,
    "the modal and page have no duplicate shopping ids",
  );
  for (const section of ["pending", "bought"]) {
    assert.equal(
      (
        shopping.match(new RegExp(`data-shopping-items="${section}"`, "g")) ??
        []
      ).length,
      2,
      `both views have the ${section} section`,
    );
    assert.equal(
      (
        shopping.match(
          new RegExp(`data-shopping-section-count="${section}"`, "g"),
        ) ?? []
      ).length,
      2,
      "both sections have their own counts",
    );
  }
  const shoppingIds = [...shopping.matchAll(/\bid="(shopping[^"]*)"/g)].map(
    (match) => match[1],
  );
  assert.equal(
    new Set(shoppingIds).size,
    shoppingIds.length,
    "section labels and lists have unique ids across both views",
  );
  assert.equal(
    (shopping.match(/data-shopping-add/g) ?? []).length,
    2,
    "account and modal both support direct additions",
  );
  assert.equal(
    (shopping.match(/data-shopping-recipe-tools/g) ?? []).length,
    2,
    "recipe controls are shared by the page and modal",
  );
  assert.ok(site.has("shopping-worker.js"));
  assert.ok(site.has("js/shopping-sync.js"));
  assert.ok(site.has("js/shopping-account.js"));
  assert.equal(
    (shopping.match(/data-shopping-share/g) ?? []).length,
    2,
    "account and modal can both share a copy",
  );
  assert.ok(site.has("delad-inkopslista.html"));
  assert.ok(site.has("lista/index.html"));
  const worker = site.read("shopping-worker.js");
  for (const path of [
    ...worker.matchAll(/'([^']+\.(?:js|html|css|woff2|svg))'/g),
  ].map((match) => match[1]))
    assert.ok(
      site.has(path),
      `the shopping worker's offline asset ${path} exists`,
    );
  const privacy = site.read("integritet.html");
  assert.equal(
    privacy.includes('name="robots"'),
    false,
    "the privacy page may be indexed",
  );
  assert.match(privacy, /<h1[^>]*>.*Integritet/s);
  for (const [page, base] of [
    ["index.html", ""],
    ["recept/01-rodbetspytt.html", "../"],
    ["logga-in.html", ""],
  ])
    assert.ok(
      site
        .read(page)
        .includes(`<a class="nav-link" href="${base}integritet.html"`),
      `${page} links to the privacy page in the footer`,
    );
  assert.ok(site.has("js/account.js"));
  assert.ok(site.has("js/account-helpers.js"));
  assert.match(site.read("js/vendor/supabase.js"), /createClient/);
});
