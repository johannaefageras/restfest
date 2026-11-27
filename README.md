# Ofta bra efter

**Rädda resterna.** A Swedish recipe site for making dinner from what is already in the fridge.

[oftabraefter.se](https://oftabraefter.se)

Enter ingredients, find matching recipes, save favourites and plan the week. The archive also includes drinks, baking, pantry recipes and **Mer än mat**: home spa, cleaning, pet treats and gardening ideas for things left over.

Three collections gather parts of it: **Pasta** (pasta sorts), **Tårtor** (the world's best-known cakes) and **Scrollstopp**, baking, desserts and drinks for teenagers. Every Scrollstopp recipe has a portrait image with the site's address that visitors can save and post on TikTok.

Recipes help while you cook. Steps can be checked off, and times in the instructions (from 30 seconds to 2 hours) start timers that stay at the bottom of every page until dismissed. The screen stays on from the first step or timer until the recipe is done, unless you turn that off. Checked steps and ingredients are kept on the device for 12 hours. Timers are kept until they are dismissed or an hour after they finish.

The site is built with Eleventy, Nunjucks, Markdown and plain browser JavaScript. Supabase provides optional accounts, a synced recipe book and shopping list, fridge-photo recognition and generated recipes. Claude handles recognition and recipe writing; OpenAI generates recipe photos.

## Run locally

Use **Node.js 24** and npm. The test suite imports TypeScript files directly using Node's built-in support.

```sh
npm ci
npm start
```

Open [localhost:8080](http://localhost:8080). Eleventy rebuilds the site as source files change.

The checked-in configuration points to the project's Supabase backend. To work on the static site with accounts and AI features disabled:

```sh
RESTFEST_SUPABASE_URL='' RESTFEST_PUBLISHABLE_KEY='' npm start
```

The recipe archive, ingredient matching, browser-saved favourites, week plan and guest shopping list work without Supabase.

The shopping list at **inkopslista.html** is available without signing in, including when accounts are disabled. Guests keep their list on the current device; signed-in visitors also sync with their account. **Dela en kopia** creates a named, independent checklist that opens without an account. New links use **lista/#<22-character-code>**, with a display-only snapshot stored in Supabase. Only outstanding combined quantities, the list name and notes are shared; recipe names stay in the original list, and the recipient's checks are saved separately on their device. Sharing works from both the page and the guest modal. Both the original list and shared copies group items by store department, using the grocery catalogue and product-form rules (for example frozen and canned goods). Unrecognised items appear under Övrigt.

The `20261118120000_shopping_copies.sql` migration and `shopping-copy` Edge Function were deployed on 2026-11-18. Rebuild and publish the static site, including **lista/index.html**, to enable the short links for visitors. Existing long links still work, and builds with an empty `RESTFEST_SUPABASE_URL` keep creating self-contained links. Creating a short link and opening it for the first time require an internet connection. Copies have no account association, do not expire and cannot be revoked.

## Commands

| Command | What it does |
| --- | --- |
| `npm start` | Starts the local Eleventy server. |
| `npm run build` | Deletes `_site/` and builds a fresh copy of the website there. |
| `npm test` | Runs the Node test suite, including builds with and without accounts. |
| `npm run photos` | Makes WebP copies of the recipe photos in `.cache/recipe-photos/`, skipping photos that already have up-to-date copies. Every build does this first, also while `npm start` is running, so it is rarely needed by itself. |
| `npm run supabase-data` | Regenerates the ingredient, taxonomy, example-recipe and style-reference data used by the Edge Functions. |
| `npm run promote -- "<recipe-uuid-or-url>"` | Adds a generated recipe and its photo to the Markdown archive. |

## Site settings

Edit [src/_data/site.js](src/_data/site.js), then rebuild and publish the site.

| Setting | Used for |
| --- | --- |
| `url` | Public base URL, canonical links, sitemap URLs and absolute sharing-image URLs. |
| `name` | Header, footer, page-title suffix and sharing previews. |
| `title` | Home-page title and the default title for pages without one. |
| `description` | Home-page description and the fallback for other pages. |
| `language` | HTML language and recipe structured-data language; currently `sv`. |
| `locale` | Sharing-preview locale; currently `sv_SE`. |
| `socialImage` | Default sharing image, with `path`, `alt`, `width`, `height` and MIME `type`. |
| `contact` | Email link under **Frågor** on the privacy page. An empty string hides it. |
| `socialLinks` | Optional `{ label, url }` entries shown in the footer. An empty list hides them. |

Page front matter can override `title`, `description` and `socialImage`. Page titles get ` · <site name>` automatically; set `titleSuffix: ''` to omit it. Recipe pages use their own titles and descriptions, with a dedicated sharing card when one exists and their recipe photo otherwise.

### Social preview images

Social artwork lives in [src/assets/social/](src/assets/social/):

| Folder | Use |
| --- | --- |
| `1200x630/` | Landscape cards selected by the website's Open Graph and Twitter metadata. |
| `1080x1080/` | Square artwork for uploading directly as social posts. |
| `1080x1920/` | Portrait artwork for uploading directly as stories. |

The default is [1200x630/startsida.png](src/assets/social/1200x630/startsida.png), configured in `site.js`. Update its alt text and dimensions if you replace it. The square and portrait versions are also copied into `_site/assets/social/`; they are not automatically substituted in link previews.

[src/_data/socialImages.js](src/_data/socialImages.js) maps landscape cards to pages by filename: `receptarkiv.png` → `/receptarkiv.html`, `kategori-soppor.png` → `/kategori/soppor.html`, and `typ-odling.png` → `/typ/odling.html`. Its aliases handle the home page, the shorter household filename and the two recipe cards for Rödbetspytt and Bolognese. Add an alias there when a card's filename differs from its page address. New recipe cards can use `recept-<full-recipe-id>.png` to match automatically.

The branded recipe cards are selected; alternative `*-foto.png` exports stay available without being selected. A page's explicit `socialImage` overrides the automatic selection. Recipe structured data continues to use the original dish photo.

Every page receives Open Graph and Twitter metadata. Indexable pages also receive canonical links. When `url` is set, each build generates `sitemap.xml` and a `robots.txt` reference to it. The sitemap includes public recipe, category, type and tag pages and excludes pages marked `noindex`.

The home page includes `WebSite` structured data for the site's name, address, description and language. Other indexable pages include `BreadcrumbList` structured data following their existing navigation and back links. Public pages allow large search-image previews with `max-image-preview:large`; pages marked `noindex` keep that restriction and receive no site or breadcrumb structured data. These additions are generated by [lib/metadata.js](lib/metadata.js), using the settings in `site.js`.

### Home-screen icons

[src/assets/apple-touch-icon.png](src/assets/apple-touch-icon.png) is the iPhone home-screen icon. [src/pages/manifest.njk](src/pages/manifest.njk) builds `manifest.webmanifest`, which gives other phones the site's name and `icon-192.png`, `icon-512.png` and `icon-maskable-512.png`. The drawings are [design/app-icon.svg](design/app-icon.svg), [app-icon-touch.svg](design/app-icon-touch.svg) and [app-icon-maskable.svg](design/app-icon-maskable.svg); export them again at the same sizes after changing them. The manifest keeps `"display": "browser"`, so the site opens from the home screen in the browser as usual.

## Project structure

| Path | Contents |
| --- | --- |
| [src/pages/](src/pages/) | Page templates, listing pages, sitemap and generated browser-data templates. |
| [src/recept/](src/recept/) | One Markdown file per archive recipe. |
| [src/pasta/](src/pasta/) | One Markdown file per pasta sort, listed on `pastasorter.html`. |
| [src/_includes/](src/_includes/) | Shared layouts, recipe cards, account navigation and shopping-list markup. |
| [src/_data/](src/_data/) | Site settings, Supabase settings and the food catalogue. |
| [src/js/](src/js/) | Browser behaviour and the shared taxonomy in `recipes.js`. |
| [src/css/](src/css/) | Fonts, design tokens, page styles, dark theme and UI icons. |
| [src/assets/](src/assets/) | Recipe photos, Scrollstopp's TikTok images, illustrations, icons, fonts and the sharing image. |
| [lib/](lib/) | Build-time recipe validation and parsing, plus helpers shared with browser code. |
| [supabase/](supabase/) | Database migrations, Edge Functions, photo references and auth-email templates. |
| [tools/](tools/) | Data generation, recipe promotion and backend test helpers. |
| [test/](test/) | Automated tests. |
| [design/](design/) | Design source files, outside the published site. |
| `_site/` | Generated website. Ignored by Git; do not edit it directly. |
| `.cache/recipe-photos/` | WebP copies of the recipe photos, made before every build and copied into `_site/assets/recipes/`. Ignored by Git. |
| `.cache/scrollstopp/` | The stamped TikTok images and their WebP copies, made before every build and copied into `_site/assets/scrollstopp/`. Ignored by Git. |

[eleventy.config.js](eleventy.config.js) defines collections, copied assets and the `src/` → `_site/` build. Templates set explicit permalinks, so the `pages/` folder does not appear in public URLs.

## Add or edit recipes

1. Copy a similar recipe in `src/recept/` and give a new recipe the next unused numeric filename prefix, followed by a short slug.
2. Edit its YAML front matter: title, publication date (`YYYY-MM-DD`), description, image paths, alt text, categories, tags, time label and ingredients. Set `time` to a number of minutes when applicable.
3. Put its photos in `src/assets/recipes/`. Both `image` and `cardImage` are paths relative to `src/` and must point to existing files; they can use the same photo. PNG photos get the WebP copies the pages show, 600, 1200 and 1600 px wide ([tools/photos.mjs](tools/photos.mjs)); other formats are used as they are. The copies are made when the site is built, also while `npm start` is running and when a photo is replaced.
4. Write the instructions as numbered Markdown steps. Optional `###` headings group steps; `##` headings introduce extra sections with bullet lists. A paragraph starting with bold text becomes a tip.
5. Preview the page, regenerate Supabase data if needed, then run the build and tests.

A recipe's front matter, with what each field does:

```yaml
---
title: Rödbetspytt i torn med gyllene äggula
date: 2026-11-09 # the day it was published; not shown, but "Nyast först" sorts by it
description: Gårdagens kokta potatis, en burk inlagda rödbetor …
image: assets/recipes/01-rodbetspytt.png # the large photo, path from src/
cardImage: assets/recipes/01-rodbetspytt.png # the photo on cards; can be the same file
alt: Rödbetspytt i torn med gyllene äggula
categories: [main, breakfast] # keys from mealTypes in src/js/recipes.js; the first is shown on cards
tags: [Vegetarian, Gluten free, Swedish] # keys from recipeTagLabels in src/js/recipes.js
time: 35 # total minutes, for "Under 20 min"; leave out when it isn't one number
timeLabel: 35 min # shown on cards
facts: # the boxes under the description, in this order
  Förberedelse: 15 min
  Portioner: "4"
  Nivå: Nybörjare
beforeYouStart: … # optional: the "Bra att veta." box
pantryKeys: [potatis, lok, rodbetor, agg] # the main ingredients for fridge matching
ingredients:
  - title: Pytt # groups are optional; without titles, list the items directly
    items:
      - name: 800 g kokt, kall potatis
        key: potatis # a key from foods.json, for matching
      - name: 1 tsk salt
        basic: true # assumed to be at home
      - name: 1 handduk
        tool: true # equipment: its amount doesn't scale with the yield
      - name: Byt honungen mot ljus sirap.
        note: true # a note line, not an ingredient
---
```

**Keep existing recipe filenames unchanged.** Their IDs are used in public URLs, saved recipes and shopping lists.

Ingredient keys come from [src/_data/foods.json](src/_data/foods.json), with browser aliases and additions in [src/js/recipes.js](src/js/recipes.js). That script also defines `mealTypes`, `recipeTagLabels` and diet rules. [lib/taxonomy.js](lib/taxonomy.js) loads the same definitions for the build and supplies type-page details.

`pantryKeys` identifies the main ingredients used for fridge matching. Ingredient entries can have a `key`, `basic: true` for assumed pantry staples, `tool: true` for equipment whose amount should not scale, or `note: true` for a note line. Ingredients can be a plain list or titled groups. Yield information belongs in `facts`, which also supplies the recipe page's information boxes.

Non-food recipes use exactly one category: `spa`, `household`, `pets` or `garden`. They appear under **Mer än mat** and stay out of dinner matching and food-recipe structured data.

The build reports missing fields, unknown categories, tags or ingredient keys, missing images and unsupported Markdown. It checks the data format; recipes still need editorial review.

### Add a generated recipe to the archive

Once a generated recipe has a finished photo:

```sh
npm run promote -- "<recipe-uuid-or-url>"
```

Replace the argument with its UUID or full `nytt-recept.html?id=…` URL. The script fetches the recipe, assigns the next number and today's Stockholm date, and saves the Markdown and photo locally. Review both before publishing.

The script optionally reads `SUPABASE_SECRET_KEY` from the local, ignored `.env` file. With that key, it also marks the stored recipe as promoted so its generated page links to the archive version. Without it, the script explains how to set `promoted_as` manually.

## Add or edit pasta sorts

`pastasorter.html` lists the pasta sorts as cards with a filter, and a card opens the sort in a dialog. Each sort also has its own page, `pasta/<slug>.html`, which the dialog shows.

1. Copy [src/pasta/_mall.md](src/pasta/_mall.md) to `src/pasta/<slug>.md`. The template explains every field; the build skips the template itself.
2. Put the square drawing for its card in `src/assets/icons/pasta/<slug>.svg`, 512 × 512, and the wide cover for its page in `src/assets/covers/pasta/<slug>.svg`, about 1672 × 941.
3. `bytMot` names other sorts by slug, and the optional `recept` names archive recipes by file name. Run `npm test`: it reports unknown values, missing drawings or covers and links to sorts or recipes that don't exist.

The allowed forms, sauces and doughs are in [lib/pasta.js](lib/pasta.js). Fresh sorts link to the recipe named `grundrecept` in [src/pasta/pasta.11tydata.js](src/pasta/pasta.11tydata.js).

## Add or edit cakes

`tartor.html` lists the cakes as cards with a filter for level, parts and origin. The cakes are ordinary archive recipes, so a card opens the recipe in the recipe dialog, and they also appear in the archive under **Fika & bakning**. What makes a recipe a cake is a `tarta` block in its front matter:

```yaml
tarta:
  nr: 15 # its number on tartor.html; the cakes have their own numbering, 1, 2, 3 … without gaps
  namn: "Prinsesstårta" # a short name, for the list on a base recipe's page
  ursprung: "Sverige" # shown on its card; the origin menu filters on its region (`regions` in lib/cakes.js)
  delar: [sockerbotten, vaniljkram, sylt, gradde, marsipan] # keys from `parts` in lib/cakes.js
```

1. Add the recipe as usual (above), with the `tarta` block. The level filter uses `facts: Nivå`.
2. Use the whole cake as `image` and a piece as `cardImage`, e.g. `assets/recipes/317-prinsesstarta.png` and `317-prinsesstarta-bit.png`. The piece is the cake's card in the archive (on `tartor.html` the card has the drawing). The archive cards show a centered 16:9 crop of the photo.
3. Add its two drawings, named the same way: `assets/icons/tartor/317-prinsesstarta.svg` (the whole cake, on its card on `tartor.html`) and `317-prinsesstarta-bit.svg` (a piece, in the box at the bottom of its recipe's page and in the list on the base recipe's page). Give them a square `viewBox`, like the pasta drawings, so they all show at the same size.
4. Run `npm test`: it reports gaps or repeats in the numbering, unknown parts or levels, an origin that belongs to no region and missing drawings, icons or recipes.

The parts, levels, regions and leftover recipes are in [lib/cakes.js](lib/cakes.js). A part with `grundrecept` links to its base recipe from `tartor.html`, and that recipe's page lists the cakes built with it. A cake's own page ends with its number, the parts it is built with (each a link to `tartor.html` filtered by it) and the cakes before and after it.

## Add or edit Scrollstopp recipes

`scrollstopp.html` lists baking, desserts and drinks for teenagers as tall cards, 12 at a time, with no filter. Like the cakes, they are ordinary archive recipes (340–358), so a card opens the recipe in the recipe dialog, and they also appear in the archive under their categories. What makes a recipe part of Scrollstopp is a `scrollstopp` block in its front matter:

```yaml
scrollstopp:
  nr: 3 # its number on scrollstopp.html: 1, 2, 3 … without gaps
  namn: "Kanelbullar på pinne" # a short name, for the previous and next links on a recipe's page
```

1. Add the recipe as usual (above), with the `scrollstopp` block. The card shows `facts: Nivå` with the cakes' level icons.
2. Put its cover photo in `src/assets/recipes/<id>.png`, as for any recipe, and use it as both `image` and `cardImage`.
3. Put its TikTok image, in portrait and close to 9:16, in `src/assets/scrollstopp/<id>.png`. Don't put it in `src/assets/recipes/`: every PNG there gets 600, 1200 and 1600 px wide copies, and a portrait about 940 px wide would be missing the wider ones.
4. Run `npm test`: it reports gaps or repeats in the numbering, a missing short name or level, and a missing, landscape or stray TikTok image.

Every build makes three files from each TikTok image ([tools/scrollstopp-images.mjs](tools/scrollstopp-images.mjs)): `<id>.jpg`, 1080 × 1920 with "oftabraefter.se" centred near the top, which visitors save; a 540 px wide copy of it, shown on the recipe's page; and a 600 px wide copy without the address, for the card. An image that isn't exactly 9:16 is cropped in the middle first. Only new or changed images are made again, and all of them when the stamp or the script changes.

The address is [design/scrollstopp-stamp.png](design/scrollstopp-stamp.png), drawn by [tools/scrollstopp-stamp.mjs](tools/scrollstopp-stamp.mjs) in Trio Grotesk on the site's lavender. To change its text, size or colours, edit that script, run `node tools/scrollstopp-stamp.mjs 2>/dev/null`, look at the PNG and rebuild: a newer stamp makes all the images again. Its place on the image is set in `tools/scrollstopp-images.mjs`, below TikTok's tabs and away from its buttons and caption.

On a Scrollstopp recipe's page, the image and **Spara bilden** come after the extra sections ([src/js/tiktok-save.js](src/js/tiktok-save.js)). The button downloads the JPEG; on a phone that can share files it opens the share sheet instead, where the image can go to Photos or straight to TikTok. The page ends with the recipe's number and the recipes before and after it. The helpers are in [lib/scrollstopp.js](lib/scrollstopp.js).

## Supabase and AI features

The browser's connection is configured in [src/_data/ai.js](src/_data/ai.js):

| Setting or environment variable | Purpose |
| --- | --- |
| `supabaseUrl` / `RESTFEST_SUPABASE_URL` | Supabase project URL. An empty value disables photo recognition and generated recipes. |
| `publishableKey` / `RESTFEST_PUBLISHABLE_KEY` | Public browser key. Accounts are enabled when both the URL and key are present. |

Environment variables override the values in the file. `npm start` and `npm run build` do not automatically load `.env`; export these variables in the shell or set them in the hosting environment. The promotion script loads `.env` separately.

Supabase Edge Functions provide:

| Function | Purpose |
| --- | --- |
| `detect-ingredients` | Recognises groceries in fridge photos. |
| `generate-recipe` | Writes and stores a recipe from the visitor's ingredients and preferences. |
| `get-recipe` | Returns a stored generated recipe. |
| `recipe-image` | Generates its recipe photo. |
| `delete-account` | Deletes the signed-in visitor's account and associated data. |
| `shopping-copy` | Stores and returns the snapshots behind shared shopping-list links. |

Provider credentials belong in Supabase secrets, not browser files. The publishable browser key is public; access is controlled by database policies and function checks. Database migrations, authentication redirects, Google sign-in, sign-in by text message and email delivery need separate backend setup, described below.

### Set up the backend

The project is already set up; these steps are for a new Supabase project. Run the commands in the project folder; `npx supabase` needs no install.

1. Create a Supabase project (region Stockholm, `eu-north-1`) and note its reference, the `abcd…` in `https://abcd….supabase.co`.
2. Run `npx supabase login`, then `npx supabase link --project-ref <reference>`.
3. Run `npx supabase db push` to apply [supabase/migrations/](supabase/migrations/): the tables, database functions and photo bucket.
4. Set the secrets: `npx supabase secrets set ANTHROPIC_API_KEY=… OPENAI_API_KEY=… RATE_LIMIT_SALT=$(openssl rand -hex 24) ALLOWED_ORIGINS=https://oftabraefter.se,http://localhost:8080`.
5. Run `npx supabase functions deploy` to deploy all the functions. Add `--use-api` if it asks for Docker.
6. Put the project URL and the publishable key (`sb_publishable_…`, under Project Settings → API keys) in [src/_data/ai.js](src/_data/ai.js). Never put a secret key there.
7. Under Authentication → URL Configuration, set the Site URL to the site's address, and add `http://localhost:8080/**` and the public address followed by `/**` to the redirect list.
8. Under Authentication → Sign In / Providers → Email, set the minimum password length to 8 and keep "Confirm email" on. The site checks for 8 characters; Supabase's default is 6.
9. Paste the three mail templates from [supabase/templates/](supabase/templates/); [its README](supabase/templates/README.md) says which goes where.
10. For Google sign-in, create a Web application OAuth client in Google Cloud Console, using the redirect address shown on Supabase's Google provider page, and enter its ID and secret on that page.
11. For sign-in by text message, put an SMS-capable Swedish mobile number in a Twilio Messaging Service, and under Messaging → Settings → Geo permissions in Twilio allow Sweden only. In Supabase, under Authentication → Sign In / Providers → Phone, choose Twilio and enter the Account SID, the Auth Token and the Messaging Service SID (`MG…`); the SMS text can say `Din kod till Ofta bra efter: {{ .Code }}`. The site only accepts Swedish mobile numbers. Every code is a paid text that anyone can ask for, so set the SMS limit under Authentication → Rate Limits, turn off auto-recharge in Twilio and add a usage alert there.
12. Before real visitors arrive, connect a mail service under Authentication → Emails → SMTP Settings. Supabase's built-in sender only delivers to the project's own team, a few mails an hour.
13. Set monthly spending limits in the Anthropic Console and on OpenAI's platform. The daily caps limit the volume; the spending limits are the hard stop.

Optional secrets change how the functions behave without a new deploy. They are explained where they are read, in `supabase/functions/_shared/`:

| Secrets | Read in | Used for |
| --- | --- | --- |
| `CLAUDE_MODEL`, `CLAUDE_DETECT_MODEL`, `CLAUDE_RECIPE_MODEL`, `CLAUDE_EFFORT`, `CLAUDE_DETECT_EFFORT`, `CLAUDE_RECIPE_EFFORT` | `claude.ts` | The Claude model and effort for photo recognition and recipes. |
| `DETECT_PER_VISITOR`, `DETECT_PER_DAY`, `RECIPE_PER_VISITOR`, `RECIPE_PER_DAY`, `SHARE_PER_VISITOR`, `SHARE_PER_DAY` | `limits.ts` | Daily caps per visitor and for everyone together. |
| `IMAGE_MODEL`, `IMAGE_SIZE`, `IMAGE_QUALITY`, `IMAGE_STYLE_REFERENCES` | `image.ts` | The recipe photos; `IMAGE_STYLE_REFERENCES=off` stops sending the style photos. |

### Keep generated backend data in sync

After changing the food catalogue, categories, tags, recipe ingredient keys or style-reference photos, run:

```sh
npm run supabase-data
npm test
```

The generator updates `supabase/functions/_shared/data.ts` and `style-references.ts`. Review those changes and deploy the affected Edge Functions separately. Tests check that the ingredient vocabulary and recipe-derived keys match the current source data.

The `RESTFEST_*` variable names and older `restfest-*` storage keys remain from the site's former name. Keep them stable so existing settings and saved recipes continue to work.

## Verify changes

```sh
npm run build
npm test
```

Tests cover ingredient matching, recipe parsing, preferences, shopping-list grouping and sync, offline behaviour and account-dependent builds. The stand-ins in [tools/standin/](tools/standin/) check the Edge Functions, database policies, shared shopping lists and account pages without the real backend; each file's opening comment says how to run it. Automated checks do not replace testing real sign-ins, fridge photos and generated recipes against the configured backend.

If a preview stays stale after changing `lib/` or `eleventy.config.js`, restart `npm start`. For stale CSS or browser scripts, reload without the browser cache.

## Publish

Build the site and upload **the contents of `_site/`** to the web root. For a host that builds from Git:

| Setting | Value |
| --- | --- |
| Node.js | `24` |
| Build command | `npm run build` |
| Publish directory | `_site` |

Preserve the generated directories and `.html` URLs. The frontend is static; it does not need an application server or a catch-all SPA rewrite. Backend changes require their own Supabase migration or function deployment and are not published by the Eleventy build.

## Licence

Project code is licensed under the [MIT licence](LICENSE). Bundled commercial typefaces have separate licensing terms.
