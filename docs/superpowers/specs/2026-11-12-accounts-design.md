# Accounts, recipe book and preferences: design

Status: draft for the owner's approval. Nothing here is built yet.

Read HANDOFF.md first. It explains how the site is built, how the owner likes to work, and how the
existing Supabase features ("Kylfoto och nya recept") fit together. This document only covers what
is new.

## Why

Ofta bra efter (called Restfest until 2026-11-13; see "The name" in HANDOFF.md) can already write a new recipe from a fridge list, but the recipe belongs to nobody. It
lives at `nytt-recept.html?id=<uuid>`, and a visitor who loses the link loses the recipe. The owner
wants an account to give a visitor two things:

1. **A personal recipe book**, where the recipes they generate are kept.
2. **Saved preferences** about what kind of recipes they want, so new recipes fit them.

Sign-in is by email and password, or with Google. The owner asked for account and profile pages.

## What the owner decided, and what is the designer's call

The owner said: accounts with email + password and Google; account and profile pages; the purpose
is a personal recipe book for generated recipes and saved preferences.

Everything else below was proposed by the designer (Claude) and accepted by the owner as a whole
with "sounds good", without discussing the details. Where a detail goes beyond what was shown to
the owner, it is marked **(designer's call)**. The builder may raise any of these again if they turn
out badly.

## Goals

- A visitor can create an account, sign in, sign out, reset a forgotten password, and delete the
  account, with email + password or Google.
- A signed-in visitor has a recipe book that is the same on every device. It holds the recipes
  they generated while signed in and the archive recipes they have hearted.
- A signed-in visitor can save preferences, and Claude follows them when writing a new recipe.
- All new pages and texts are in Swedish and look like the rest of the site.

## Non-goals

- Requiring an account for anything that works today. Generating a recipe stays open to everyone,
  under the same daily caps, counted the same way (by IP hash). Signed-in visitors get no higher cap.
- Syncing the fridge list, the shopping list or the week plan to the account. They stay in the
  browser.
- Preferences changing the archive matching on the home page or the archive filters.
- Other sign-in methods (Apple, Facebook, magic links), two-factor sign-in, CAPTCHA.
- Profile pictures, public profiles, sharing a recipe book, editing a generated recipe.
- An admin interface. The owner keeps using Supabase's dashboard.

## Anti-goals (these make it a failure even if it works)

- **The signed-out site gets worse.** A visitor without an account must see the same pages, with
  the same behaviour and close to the same page weight as today. Page weight was a review item
  (HANDOFF item 4); don't make every visitor download the Supabase library.
- **Someone loses their hearts.** Signing in or creating an account must never drop the recipes a
  visitor had already hearted in that browser.
- **A secret reaches the browser.** Only the project's publishable key may be in the site.
- **The site depends on Supabase to render.** If Supabase is down, slow or not configured, every
  existing page still works; only the account features are missing. While `supabaseUrl` in
  `src/_data/ai.js` is empty (or the publishable key is), the site has no trace of accounts.

## How it behaves

### Signed out

Nothing changes, with two additions:

- The header has a "Logga in" button after Sparat and Inköpslista.
- A generated recipe's page has a "Spara i receptboken" button. Pressing it sends the visitor to
  the sign-in page and brings them back afterwards, with the recipe saved.

### Signing in and creating an account

One page, `logga-in.html`, with two modes: "Logga in" and "Skapa konto".

- **Google:** a "Fortsätt med Google" button in both modes.
- **Email + password:** creating an account asks for email and a password of at least 8 characters,
  and optionally a name. The visitor then gets a confirmation mail and has to click its link before
  the account works. The page says so ("Kolla din mejl").
- **Forgotten password:** "Glömt lösenordet?" sends a reset mail. Its link opens `nytt-losenord.html`,
  where the visitor sets a new password and is then signed in.
- **Coming back:** the page takes a return address (`?till=…`). After signing in the visitor goes
  back there, or to the recipe book if there is none. The return address must be a path within the
  site; anything else is ignored (no open redirect).
- **Errors** are shown in Swedish beside the form: wrong email or password, email already
  registered, password too short, mail not confirmed yet (with a "skicka igen" link), no connection.
- A visitor who is already signed in and opens this page goes straight to the recipe book.

### Signed in

- **Header:** "Sparat" becomes "Receptbok" and links to `receptbok.html`; its count is the number
  of recipes in the book. "Logga in" becomes an account button that links to `profil.html`. The
  header is tight (HANDOFF item 13), so the new button follows the others: icon only below 1200px.
  **(designer's call)**
- **No flicker:** pages are built signed out, so a signed-in visitor must not see "Logga in" flash
  on every page load. Decide the header's state before first paint from a small marker kept in
  `localStorage`, set at sign-in and removed at sign-out.
- **Hearts** work as before on every page, and each change is also stored in the account.
- **First sign-in in a browser:** the archive recipes hearted in that browser are added to the
  account. From then on the account is the truth, and the browser's list is a copy of it, so hearts
  can still be drawn at once without waiting for the network.
- **Signing out** empties the browser's copy of the hearts, so the next person at a shared computer
  doesn't see them. They are safe in the account. **(designer's call)** The fridge list, shopping
  list and week plan are left alone.
- **Generating a recipe** while signed in puts it in the recipe book automatically, and Claude
  follows the visitor's preferences.
- **A generated recipe's page** has a heart, like an archive recipe: pressed when it is in the
  visitor's book, and pressing it adds or removes it. Any signed-in visitor can add any generated
  recipe they have the link to, not only ones they generated themselves. **(designer's call:** the
  pages are public anyway, and it makes a shared link useful.)

### Min receptbok (`receptbok.html`)

- Signed out: a short explanation and a button to sign in.
- Signed in: one list of everything in the book, most recently added first, drawn with the same
  card as the archive (`archiveCard()` in `app.js`). Archive recipes link to `recept/<id>.html`,
  generated ones to `nytt-recept.html?id=<uuid>`. Generated recipes carry a small label that sets
  them apart, and show their photo, or the same placeholder as their page while there is none.
- A simple filter: all, generated, from the archive. **(designer's call)**
- Each card has its heart; removing a recipe takes it out of the list with the usual toast.
- Empty book: a friendly empty state that points to the fridge on the home page and to the archive.
- The archive's own "Sparade" view (`receptarkiv.html?vy=sparade`) keeps working and keeps showing
  hearted archive recipes only.

### Profil (`profil.html`)

- **Name** (optional, shown in the greeting on the account pages).
- **Kost:** any of the site's five diet tags (`dietTags` in `src/js/recipes.js`: vegetarian, vegan,
  dairy free, egg free, gluten free), with their Swedish labels. Choosing vegan implies the three it
  covers, as `impliedTags` already says.
- **Äter inte:** a short list of foods the visitor doesn't eat, typed as free text, one at a time
  (at most 30, each at most 80 characters, cleaned the way `cleanName()` cleans fridge items).
- **Portioner:** how many the visitor usually cooks for, 1–12. Empty means "let the recipe decide",
  which is what happens today.
- Saved with an explicit "Spara" button and a confirmation.

### Konto (`konto.html`)

- Shows the email address and how the visitor signs in (password, Google or both).
- Change email (Supabase sends a confirmation to the new address).
- Change password. An account created with Google has no password; it can set one here.
- Sign out.
- Delete the account, behind a confirmation dialog that says what is deleted. Deleting removes the
  sign-in, the profile, the preferences and the recipe book. Generated recipes themselves stay
  where they are: they were never tied to the person, only listed in their book.

The three signed-in pages (Receptbok, Profil, Konto) share a small sub-menu so each is one click
from the others, with "Logga ut" in it. Opening Profil or Konto signed out leads to the sign-in page
with a return address.

### Preferences and new recipes

`generate-recipe` reads the caller's preferences when the request comes with a valid sign-in, and
adds them to the prompt (`recipePrompt()` in `_shared/recipe.ts`):

- the diets the recipe must keep to;
- the foods to leave out;
- the number of portions to write for.

If the fridge list contains something the preferences rule out (chicken for a vegetarian), Claude
leaves it out rather than refusing. **Claude decides whether enough is left to cook from, not
code:** the site has no table of which foods fit which diet, and "äter inte" is free text. The
recipe draft (`draftSchema`) gets a way for Claude to say "nothing here fits these preferences", and
the function then answers with a Swedish message that names the preferences and points to the
profile page. That request still counts against the visitor's daily cap, since it cost a Claude
call. The recipe isn't checked against the preferences afterwards; the prompt is trusted.
**(designer's call, all of this paragraph)**

A request with no sign-in, or with an expired or invalid one, is handled exactly as today: the
recipe is written without preferences and isn't added to any book.

### Privacy page

Accounts mean the site stores personal data (email, name, preferences) for the first time. Add a
short page, `integritet.html`, linked from the sign-up form and the footer: what is stored, where
(Supabase, in the EU), that fridge photos and fridge lists are sent to Anthropic and recipe texts to
OpenAI for the photo, and how to delete the account. **(designer's call:** not requested, but a
Swedish site that takes sign-ups needs it. The builder drafts the text; the owner approves it, as
HANDOFF says for all content.)

## How it is made

### Chosen

- **Supabase Auth**, in the Supabase project the site already uses (`yatffwoobcsrxcxplecd`). The
  owner chose Supabase for the backend earlier; using its sign-in is the designer's call and the
  obvious one.
- **`@supabase/supabase-js` v2 in the browser**, served from the site itself rather than a CDN. The
  site has no bundler; the build already copies single files into `js/` (see `recipe-amounts.js` in
  `eleventy.config.js`), and the library can be copied from `node_modules` the same way.
- **The library loads only when needed:** on the sign-in and account pages, and on other pages only
  when the browser has a stored sign-in. A signed-out visitor never downloads it.
- **The publishable key** (`sb_publishable_…`) goes in `src/_data/ai.js` beside the project address
  and reaches the pages the way the functions' address does. It is public by design. The owner has
  to copy it from the dashboard.
- **Database access from the browser goes through row level security.** The existing tables keep
  RLS on with no policies.

### Data (one new migration)

- **`profiles`**: one row per user. `id` (the auth user's id, deleted with it), `display_name`,
  `diets text[]`, `avoid text[]`, `servings int` (null = no preference), `created_at`, `updated_at`.
  Created automatically when a user is created; for Google sign-ups the name comes from Google.
  The owner of a row may read and update it. Check constraints keep the values within the limits
  above, so the browser can't store anything else.
- **`saved_recipes`**: archive recipes in a book. `user_id`, `recipe_id text` (the archive id, e.g.
  `01-rodbetspytt`), `created_at`; one row per pair. The owner may read, add and remove their rows.
  Archive ids aren't in the database, so they can't be checked against it; limit their shape and
  length, and let the page ignore ids that aren't in the recipe index (as `readSavedRecipes()` does).
- **`saved_generated_recipes`**: generated recipes in a book. `user_id`, `recipe_id uuid`
  referencing `generated_recipes` (deleted with it), `created_at`; one row per pair. The owner may
  read, add and remove their rows.
- **Reading a book's generated recipes:** the browser can't read `generated_recipes`. Give it one
  way to fetch what the cards need (id, title, description, time label, category, tags, photo status
  and path, `promoted_as`, when it was added) for the caller's own saved, non-hidden recipes. A
  database function that uses the caller's identity is enough; a new Edge Function also works.
- `generated_recipes` gets no owner column. A recipe's link to a person is only the row in
  `saved_generated_recipes`, which keeps deletion simple and the recipe table anonymous.

### Edge Functions

- **`generate-recipe`**: accept an optional sign-in (the `Authorization` header). When it is valid,
  load the profile, add the preferences to the prompt, and add the new recipe to the caller's book
  in the same request, since the page navigates away as soon as the answer arrives. The answer says
  whether it was saved.
- **`delete-account`** (new): requires a valid sign-in and deletes that user with the secret key.
  The database's cascades remove the rest.
- **Shared code:** `http.ts` has to allow the `authorization` header in CORS, and needs a helper
  that turns a request into a user or null. `verify_jwt` stays off in `config.toml`, as HANDOFF
  explains; the functions check the sign-in themselves.
- `get-recipe`, `recipe-image` and `detect-ingredients` don't change.

### Browser code

`app.js` is a set of plain scripts in one global scope, and hearts are drawn from its `saved` set.
Keep that. The account code is a separate file that:

- decides the header state early, and loads the library only when needed;
- after sign-in, merges the browser's hearts into the account, then replaces the browser's list
  with the account's and refreshes the views (`refreshSavedViews()`);
- stores each later heart change in the account as well. `toggleSave()` needs a small hook for that,
  such as an event, in the style of `restfest:pantry`;
- sends the sign-in along with the `generate-recipe` request in `fridge-ai.js`.

If a heart can't be stored in the account (offline, Supabase down), the heart still changes in the
browser, and the difference is sent the next time the account is reachable. Don't block or undo the
click.

### Mails

Supabase sends three mails: confirm the address, reset the password, confirm a changed address. The
defaults are in English. Write Swedish versions in the site's voice and keep them in the repo
(`supabase/`), so they can be applied to the project and aren't only in the dashboard.

### What the owner has to do (the builder can't)

Write these as steps in HANDOFF.md, like the existing "Setup (once)" list:

1. **Publishable key:** copy it from the Supabase dashboard into `src/_data/ai.js`.
2. **Google sign-in:** create an OAuth client in Google Cloud Console (consent screen, client id and
   secret). Its redirect address is the project's callback URL, shown on the Google provider page in
   the Supabase dashboard (expected: `https://yatffwoobcsrxcxplecd.supabase.co/auth/v1/callback`).
   Enter the id and secret on that same page.
3. **Addresses:** set the Site URL and the allowed redirect addresses in Supabase (the local server,
   and the public address once there is one).
4. **Mail delivery:** Supabase's built-in mail sender is for testing only. Its documentation
   (supabase.com/docs/guides/auth/auth-smtp, read 2026-11-13) says it refuses to deliver to addresses
   outside the project's team and sends 2 mails an hour. Real visitors need the project connected to
   a mail service (the page lists Resend, AWS SES, Postmark, SendGrid, ZeptoMail and Brevo), which
   needs a domain the owner controls. Until then, sign-up by email works for the owner's own address
   only; Google sign-in works for everyone.

The builder runs the migration and deploys the functions, after asking (see "Constraints").

**Testing sign-up by mail before a mail service exists:** the built-in sender only reaches the
owner's own address, and the builder can't read that inbox. Either the owner clicks the links in
the test mails, or the owner adds `SUPABASE_SECRET_KEY` to `.env` (HANDOFF already describes it for
`npm run promote`) so the builder can confirm a throwaway account through the admin API. Ask the
owner which when the deploy question is asked.

Known caveat to pass on: Google's consent screen will say the visitor is continuing to
`yatffwoobcsrxcxplecd.supabase.co`, not to Ofta bra efter, unless the project gets a custom domain
(Supabase's Google sign-in guide says so itself), which is a paid Supabase add-on.

## Constraints

- Site copy is Swedish; replies to the owner are in English. Ask the owner before content decisions,
  with a recommendation (HANDOFF). Page names, button labels and mail texts are content.
- No framework and no bundler. Eleventy 3.1.7, Nunjucks, plain scripts.
- Every template in `src/pages/` sets its own `permalink:`. The new pages are `noindex`, except the
  privacy page.
- The new pages need a server (they load the library and talk to Supabase); they don't have to work
  from `file://`.
- Supabase free plan. Don't add anything that needs a paid plan.
- Commit only when the owner asks. The owner's earlier uncommitted work was committed to `main` on
  2026-11-13 (`4781d9c`), at their choice, so this work starts from a clean tree. Do it on a new
  branch off `main`.
- **Deploying to the live Supabase project** (the owner's choice, 2026-11-13): there is no local
  Supabase (no Docker), so the live project is the only real backend. Build and test against
  stand-ins first. Then ask the owner once before pushing the migration and deploying the functions
  with the Supabase CLI, which is linked on this machine. After that, test with a throwaway account
  and delete it. Don't touch the live project before that question is answered.

## Verifying it

- `npm test` for the pure parts: the return-address check, the preference text added to the prompt,
  the merge of browser hearts and account hearts.
- The Edge Functions type-check with Deno and run against stand-ins, as the existing ones were.
- In a browser, against the live project once the owner has agreed to the deploy, with a throwaway
  account (serve the site as in HANDOFF, "Testing setup that worked"):
  sign up, confirm, sign in, sign out, reset the password, heart on one device and see it on
  another, generate a recipe signed in and find it in the book, save preferences and see a new
  recipe follow them, delete the account. Google sign-in can only be tested after the owner's setup
  step.
- Signed out, with the account features configured: the home page loads no new script beyond the
  small account file, and behaves as before.
- With the publishable key empty: the build has no trace of accounts.
- No horizontal overflow at 320–1440px on the new pages and in the header, signed in and signed out.

## Left to the builder

- File and function names, the exact table and policy definitions, and how the library file gets
  into the build.
- The sign-in flow type and where Google and the mail links land before forwarding.
- The look of the new pages and the account sub-menu, within the site's existing styles
  (`kitchen.css`), and which illustration or icon each gets (`src/assets/illustrations/`,
  `src/assets/icons/`).
- The Swedish wording, as a draft for the owner.
- Whether the book's generated recipes come from a database function or an Edge Function.
- How unsent heart changes are remembered until the account is reachable again.
