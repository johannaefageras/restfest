# Ofta bra efter – handoff

Ofta bra efter is a Swedish recipe site built around "Vad blir det till middag?" (what's for dinner?). You type what's in your fridge and it suggests dinners from a recipe archive. It's a static site built with Eleventy; the browser code has no framework. ChatGPT Sites originally generated it. A previous chat reviewed it and listed 20 issues, P0 to P3. Items 1–8 and 16 are done, the site has moved to Eleventy, and each recipe is now a Markdown file with pages per category, type and tag. The other items remain.

**How the owner likes to work:** they pick items by number ("Do 7", "Continue with 6 and 8"). Don't start the next item until asked. Ask before content or product decisions, and give a recommended option. Reply in English; all site copy is Swedish. When a batch is done, summarise it in plain language: what changed, what was verified, what to deploy and any caveats.

**Git:** the project is on GitHub (`johannaefageras/restfest`, branch `main`). Commit only when the owner asks, on a branch.

**The name:** the site was called Restfest until 2026-11-13, when the owner renamed it Ofta bra efter. Everything a visitor sees uses the new name, as do the instructions Claude gets in the Edge Functions (those take effect at the next function deploy). Names nobody sees were left as they were, on purpose: the browser storage keys (`restfest-saved` and the others, so nobody's saved recipes are lost), the script events (`restfest:pantry`), `<meta name="restfest-ai">`, `project_id` in `supabase/config.toml`, the first migration's comment, the GitHub repository, the project folder and the Supabase project's display name. The footer tagline "Rädda resterna." is unchanged. Two things were sized for the longer name in `kitchen.css`: the large name in the footer (`.footer-mark`, one line at 11.2vw), and the header logo below 420px, which shrinks so it doesn't run into the buttons.

## How the site works

Eleventy builds the site from `src/` into `_site/`. `_site/` is generated and not in git.

`src/` has one folder per kind of file: `pages/` (page templates), `recept/` (recipes), `_includes/layouts/` (layouts), `_includes/` (snippets the layouts include), `_data/` (data), `css/`, `js/` and `assets/`.

| File                                            | Role                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/index.njk`                           | Home page: a yellow hero with the page title, then three steps with the same heading (`.step-heading`): 01 Inventera (fridge list, and the fridge photo when it's on), 02 Matcha (tonight's dinner), 03 Planera (the week plan). "Så funkar det" at the bottom names the same three steps                  |
| `src/pages/receptarkiv.njk`                     | Recipe archive with search and filters, food only                                                                                                                                                                                                                                                          |
| `src/pages/mer-an-mat.njk`                      | "Mer än mat": spa, cleaning and pet recipes, in three sections                                                                                                                                                                                                                                             |
| `src/pages/kategori.njk`, `typ.njk`, `tagg.njk` | Build one page per category, recipe type and tag from the collections, with the layout `src/_includes/layouts/listing.njk` and the cards in `src/_includes/recipe-card.njk`                                                                                                                                |
| `src/pages/recipe-index.njk`                    | Builds `data/recipe-index.js`: the slim index for the home page and archive, with no amounts and no instructions                                                                                                                                                                                           |
| `src/pages/sitemap.njk`                         | Builds `sitemap.xml`, only when the site address is set                                                                                                                                                                                                                                                    |
| `src/recept/<id>.md`                            | **The recipes**, one Markdown file each (205). Builds `recept/<id>.html`. Format under "Recipes" below                                                                                                                                                                                                     |
| `src/recept/recept.11tydata.js`                 | Settings for every recipe file: layout, address, and the computed `recipe` the templates use                                                                                                                                                                                                               |
| `src/_includes/layouts/base.njk`                | **The layout every page shares:** head, header, footer, recipe pop-up, shopping dialog, icon sprite and scripts. The header and footer exist only here                                                                                                                                                     |
| `src/_includes/layouts/recipe.njk`              | The recipe page layout                                                                                                                                                                                                                                                                                     |
| `src/_includes/layouts/listing.njk`             | The layout for the category, type and tag pages                                                                                                                                                                                                                                                            |
| `src/_includes/recipe-card.njk`                 | The recipe card on the category, type and tag pages                                                                                                                                                                                                                                                        |
| `src/_data/foods.json`                          | **The ingredient list:** each key with its name, food group and the words people type for it. Recipes refer to these keys                                                                                                                                                                                  |
| `src/_data/site.js`                             | The site's public address (empty for now). Setting it adds canonical links, `og:image` and `sitemap.xml`                                                                                                                                                                                                   |
| `src/js/recipes.js`                             | Taxonomy and helpers: `foodGroups`, `mealTypes` (the categories), `mealName()`, `nonFoodMeals`, `isFood()`, `dietTags`, `impliedTags`, `allTags()`, `hasTag()`, `recipeTagLabels`, `foods` with extra aliases. Used by the browser, and loaded by the build (`lib/taxonomy.js`) so both use the same lists |
| `src/js/app.js`                                 | Shared code: saving, shopping list, archive rendering and filters, Mer än mat grids, ingredient matching, the recipe pop-up                                                                                                                                                                                |
| `src/js/kitchen.js`                             | Home page only: the fridge list, unknown-ingredient suggestions, the best match and three more                                                                                                                                                                                                             |
| `src/css/styles.css`                            | Original styles, much of it dead (item 17)                                                                                                                                                                                                                                                                 |
| `src/css/kitchen.css`                           | Everything newer. It overrides `styles.css`                                                                                                                                                                                                                                                                |
| `src/css/icons.css`                             | The Font Awesome UI icons, generated by `tools/icons.mjs` (see "Icons" below)                                                                                                                                                                                                                              |
| `lib/recipe-body.js`                            | Build only: reads the Markdown below a recipe's front matter (steps, tips, extra sections)                                                                                                                                                                                                                 |
| `lib/recipes.js`                                | Build only: checks a recipe's front matter and works out its page, card and index entry; groups the recipes for the category, type and tag pages                                                                                                                                                           |
| `lib/taxonomy.js`                               | Build only: loads `src/js/recipes.js` and `foods.json`; makes the page addresses for categories, types and tags                                                                                                                                                                                            |
| `eleventy.config.js`                            | Which files are copied as they are, which files the local server watches, and the recipe collections                                                                                                                                                                                                       |

- **Scripts:** they are plain scripts sharing one global scope, loaded in this order: `data/recipe-index.js` → `js/recipes.js` → `js/app.js` → `js/kitchen.js` (home page only). A page lists extra scripts from `src/js/` in its front matter (`scripts: [kitchen.js]`).
- **CSS paths:** the stylesheets are served from `css/`, so their `url()`s start with `../` (`url("../assets/fonts/…")`).
- **Paths:** pages use relative paths. Pages one folder down (recipes, categories, types, tags) set `base: '../'`, and the layout puts `{{ base }}` in front of every path and adds `data-base` to `<html>` for `app.js`. Opening the built files from disk still works.
- **URLs are unchanged from before Eleventy:** `receptarkiv.html`, `mer-an-mat.html`, `recept/<id>.html`. Every template in `src/pages/` sets its own `permalink:`, because the folder isn't part of the address (`index.njk` has `index.html`). Without one, Eleventy writes `pages/name/index.html`.
- **New URLs:** `kategori/<slug>.html` (18 food categories), `typ/<slug>.html` (`mat`, `hemmaspa`, `hushall-och-rengoring`, `husdjur`) and `tagg/<slug>.html` (85 tags). The slug comes from the Swedish label: "Fika & bakning" → `fika-och-bakning`. Renaming a label changes the address; the build stops if two labels give the same one.
- **localStorage keys:** `restfest-pantry`, `restfest-saved`, `restfest-shopping-list`, `restfest-week`. With accounts also `restfest-account`, `restfest-saved-generated`, `restfest-saved-queue` and `restfest-saved-stash` (see "Konton och receptbok").

**Build:** `npm install` once, then:

- `npm start`: local server at http://localhost:8080 that rebuilds and reloads on every change, including recipe files, `foods.json` and `recipes.js`. Restart it after changing `eleventy.config.js`, since new watch targets only register on start.
- `npm run build`: clears `_site/` and builds it from scratch. That folder is what gets uploaded.

**Eleventy notes:**

- Pinned to 3.1.7.
- Templates are Nunjucks. Output is HTML-escaped by default, so use `| safe` only for markup the build made itself (`content`, the JSON-LD).
- In front matter that needs computed values, use `---js` (see `kategori.njk`). A computed value written as a Nunjucks string in YAML gets escaped twice.
- Eleventy first calls each computed value with stand-in data to find out what it reads. `recept.11tydata.js` skips that call for `recipe`, which would otherwise fail on the stand-ins.
- Markdown is not run through Nunjucks or Liquid first (`markdownTemplateEngine: false`), so `{{` in a recipe is just text.

## Recipes

Each recipe is `src/recept/<id>.md`. The id is the file name, a number and a name (`01-rodbetspytt`). **Don't rename existing files:** saved recipes and shopping lists in visitors' browsers use the id. A new recipe takes the next number (206 now) and the day it's published as its `date`, and its photos go in `src/assets/recipes/<id>.png` (1200 px wide) and `<id>.png` (600 px). A recipe added from a generated one (`npm run promote`, see "Kylfoto och nya recept") gets a `.jpg` photo, 1536 px wide.

**Front matter** (YAML) holds what the site works with:

```yaml
---
title: Rödbetspytt i torn med gyllene äggula
date: 2026-11-09 # the day it was published; never shown, but "Nyast först" sorts by it
description: Gårdagens kokta potatis, en burk inlagda rödbetor …
image: assets/recipes/01-rodbetspytt.png # the large photo, path from src/
cardImage: assets/recipes/01-rodbetspytt.png # the photo on cards
alt: Rödbetspytt i torn med gyllene äggula # the photo's alt text
categories: [main, breakfast] # keys from mealTypes in src/js/recipes.js; the first is shown on the card
tags: [Vegetarian, Gluten free, Swedish] # keys from recipeTagLabels in src/js/recipes.js
time: 35 # total minutes, for "Under 20 min"; leave out when it isn't one number
timeLabel: 35 min # shown on the card
facts: # the boxes under the description, in this order
  Förberedelse: 15 min
  Portioner: "4"
  Nivå: Nybörjare
beforeYouStart: … # optional, the "Bra att veta." box
pantryKeys: [potatis, lok, rodbetor, agg] # the main ingredients for fridge matching (keys from foods.json)
ingredients:
  - title: Pytt # groups are optional: without titles, list the items directly
    items:
      - name: 800 g kokt, kall potatis
        key: potatis # links the ingredient to foods.json for matching
      - name: 1 tsk salt
        basic: true # always assumed at home
      - name: 1 handduk
        tool: true # a tool you use and keep: its amount doesn't scale with the yield
      - name: Byt honungen mot ljus sirap.
        note: true # a note line, not an ingredient
---
```

A spa, cleaning or pet recipe has exactly one category: `spa`, `household` or `pets`.

**The text below** is Markdown in a fixed shape (`lib/recipe-body.js`):

```markdown
1. A numbered list is the steps, under "Gör så här".
2. Bold, italics and links work inside a step.

### A step group title (optional, e.g. "Kaffebryggare" in 108-avkalkare)

1. …

**Har du ingen gröt över?** A paragraph that starts in bold is a tip, shown after the steps.

## Dekoration och servering

- Each ## heading is an extra section with a bulleted list.
```

**Dates:** every recipe needs `date:`, written `YYYY-MM-DD`. The 135 recipes from before dates existed all have `2026-11-09`, the day they went into git; 136–205 have `2026-11-10`. Visitors never see the date: it goes into the recipe index for the archive's sort, and into food recipes' structured data as `datePublished`. Eleventy also reads `date` as the page date, but nothing here uses that: the collections are sorted by file number in `eleventy.config.js`.

**Checks:** the build stops with a message naming the file when a category, tag label or ingredient key is unknown, when required fields (including `date`) are missing, when `image` or `cardImage` points to a file that doesn't exist, or when the text has something the page can't show (with the line number). A new tag needs its Swedish label in `recipeTagLabels` first; a new ingredient key needs an entry in `foods.json`.

**Collections** (`eleventy.config.js`):

- `recipes`: all recipes in id order.
- `recipeCategories`: food categories with recipes.
- `recipeTypes`: Mat, Hemmaspa & behandlingar, Hushåll & rengöring, Husdjur. The type follows from the categories: `spa`, `household` or `pets`, otherwise food.
- `recipeTags`: every tag, sorted by Swedish label. Tag pages count implied tags as the archive does, so Vegetariskt includes the vegan recipes.
- Eleventy also makes a collection per raw tag from `tags`, e.g. `collections.Vegan`.

**Pages:** how visitors and search engines reach the new pages:

- The archive intro links to the Mat page ("gå direkt till en kategori"). The Mat page and every category page have a row of links to all categories.
- The three section headings on Mer än mat link to their type pages. `mer-an-mat.njk` renders those sections from `collections.recipeTypes`, so the label, icon and intro come from `lib/taxonomy.js`.
- Each recipe page links its categories (in the line above the title) and its tags to their pages.
- **The "Recept" menu** in the header and footer links to the archive (as "Mat & dryck") and to the three type pages Hemmaspa, Hushåll and Husdjur. It replaced the Receptarkiv and Mer än mat links (2026-11-12, the owner's choice). `mer-an-mat.html` is still built but is no longer in the menu: the archive intro, the archive's search note and the back links on the three type pages lead to it.
- A spa, cleaning or pet recipe's back link goes to its own type page ("Till Hemmaspa"); before, it went to Mer än mat.
- The header and footer don't link to the category and tag pages.

**The "Recept" menu** (`recipeMenu` in `base.njk`, styles at the end of `kitchen.css`, script near the end of `app.js`):

- **Entries:** one per recipe type, from `menu` in `typeDetails` (`lib/taxonomy.js`): a short label, a line about what's there and, for Mat & dryck, the archive's address instead of the type page's. The owner chose the four names and that Mat & dryck leads to the archive; the lines under the names are mine.
- **Markup:** a `<details>`, so it opens without JavaScript. `app.js` closes it on Escape (focus goes back to "Recept"), on a click outside, when focus leaves it and when the visitor comes back with Back.
- **Look:** in the header the panel hangs from the header's rule; in the footer it opens upwards and stands on the footer's rule. Its 3px edge lies on the rule, so `nav` has to stay as tall as its bar (`align-self: stretch`). In the header the panel starts at the left edge of the word "Recept"; in the footer it ends at the page's right edge. Centring it under the word was tried on 2026-11-12 and the owner preferred it this way. Below 960px the footer's panel floats above the menu row instead, and below 520px both panels are as wide as the row. Each row has its own colour on hover and on its own page.
- **Header layout:** from 960px the two menu links sit in the middle of the header, with the logo and the buttons at the edges (`.header-inner` is a three-column grid with equal side columns). The owner chose this on 2026-11-12: with only two links beside the buttons, the header and the open panel looked pushed to the right. The footer's menu stays at the right edge.
- **Current page:** "Recept" has the yellow underline on the archive, Mer än mat and every category, type and tag page (`inRecipes` in `base.njk`); the entry for the page itself has `aria-current="page"`.
- **Top-level menu links have the class `nav-link`** (the "Recept" summary and "Så funkar det"), so the menu styles don't reach the links inside the panel.
- **Hushåll & rengöring** was "Hushåll & städ" until 2026-11-12 (label and badge in `src/js/recipes.js`, address `typ/hushall-och-rengoring.html`). The old address isn't redirected; the site had no public address then.

The home page, archive and Mer än mat draw their recipe cards with JavaScript, so without it the category and type pages are the only links to the recipe pages. Following plain links from `index.html` reaches all 315 pages. On phones the row of 18 category links fills most of the first screen (compare item 11). The cards on these pages are rendered at build time with the same markup as `archiveCard()` in `app.js`, so change both together; `app.js` then shows which hearts are saved.

**Recipe pop-up:** recipe links are real links, `<a href="recept/<id>.html" data-open="<id>">`. On a plain click, `openRecipe()` in `app.js`:

1. fetches the recipe's page and takes its `.recipe-view`;
2. shows it in `#recipe-dialog` and changes the address with `history.pushState`.

Related behaviour:

- **Back** closes the pop-up and **Forward** reopens it.
- **Ctrl/Cmd-click** opens the real page.
- **Opened from disk** (file://) or if the fetch fails, it navigates to the page instead.
- **Asset paths:** `siteBase` is absolute, so paths keep working while the address shows `recept/…`. Use `assetUrl()` and `recipeUrl()` for new asset paths.

**Matching (home page):**

- **Which recipes:** only dinner recipes are suggested: meals `main`, `soup`, `salad` and `sandwich`, and only if at least one of their ingredients is on the fridge list.
- **Score:** 0.75 × coverage of the main ingredients (`pantryKeys`) + 0.25 × coverage of the other ingredients (`foodKeys`).
- **Always assumed at home:** salt, pepper, water, oil and spices.
- **Recognising ingredients:** exact alias, then a match ignoring accents, then Swedish word endings stripped, then suggestions from compound words and spelling distance.

**Home page layout** (reworked on 2026-11-11 after the owner felt something was off):

- **One hero.** The purple block (`#b7a1e6`) holds the page title "Vad blir det till middag i kväll?", a lead that opens with a half-empty fridge ("Ett halvt paket crème fraiche, två morötter och en ensam paprika?"), "Prova ett exempel" and the noodle bowl (`illustrations/noodles.svg`). It is purple rather than the site's yellow because the noodles are exactly that yellow and would disappear. The title has no highlighter (Johanna doesn't want one here); a no-break space keeps "i kväll?" together on one line. On desktop the bowl sits against the right padding, as far in as the text on the left. Under 700px everything stacks in one centered column with the bowl on top.
- **Three steps with the same heading:** eyebrow and h2 above the content, the same size everywhere (`.step-heading`, also used by "Så funkar det"). The step names match "Så funkar det": 01 Inventera, 02 Matcha, 03 Planera.
- **Step 01** is two cards with the same shape, "Lägg till vad som finns hemma" (`.add-card`, green `#b4e48c`) and "Ta en bild av ditt kylskåp" (`.photo-card`, yellow): title, a line of text, the action at the bottom, so titles and buttons line up and both cards stay the same height. Side by side from 800px, the photo first on narrower screens. The list they both fill, "Det här finns hemma redan" (`.pantry-panel`), is its own panel below them, dashed while empty (`is-empty`, set in `renderPantry()`). The photo card has the artwork in a column of its own; under 420px card width (a container query) its button moves below the artwork. Without the photo feature, "Skriv in" takes the full width with the field and button on one row. Photo progress and results show under the list (`#pantry-status`).
- **Step 02 before a match:** a small dashed placeholder (`emptyTonight()` in `kitchen.js`) instead of a full recipe card. Before, it showed recipe 01 under "Ur receptarkivet", which read as a result.
- **Step 03 leaves out step 02's recipes** (the best match and "Fler förslag", `tonightIds` in `kitchen.js`), and is hidden when fewer than two other dinners match. Before, the same recipes showed in both.
- **On phones (under 700px)** the best match's description is cut to four lines (`line-clamp`), so "Visa recept" stays near the top, and step 03's "Lägg saknade i inköpslistan" is a full-width button with "Ny vecka" under it.

**Archive order:** the "Sortera" menu on the line above the cards (`archiveOrders` in `app.js`):

- **Bäst matchning:** the home page score, so recipes you can start from the fridge come first. Only offered while the fridge list has something on it, and then picked when the page opens.
- **Nyast först:** by `date`, and the higher file number first on the same day. The default with an empty fridge.
- **A–Ö:** Swedish order, so Å, Ä and Ö come after Z.
- **Fridge match line:** with a fridge list, the cards show "3 av 4 · Saknas: …" whatever the order. Search, filters and Sparade keep the chosen order.
- **Not remembered:** the choice resets on every visit.
- **On phones:** below 520px the word "Sortera" is hidden but screen readers still read it, so the menu fits beside the count.

**Taxonomy:**

- **`meals`:** categories, meaning dish type only. The first one is shown on the card. Recipe files call them `categories`; the recipe index and the browser code call them `meals`.
- **Tags:** diet, cuisine, occasion and practical attributes.
- **Diet tags:** food only. `Vegan` implies `Vegetarian`, `Dairy free` and `Egg free` through `hasTag()`, so vegan recipes don't carry those three.
- **Quick:** the "Under 20 min" button uses `recipe.time` (under 20 minutes). There is no quick category or tag.

**Icons and illustrations:** the colourful pictures are SVG, used directly in `<img>` elements. They live in two folders under `src/assets/`, split by what they're for (paths below are as served):

- `assets/icons/*.svg`: icons with artboards fitted to the artwork. CSS and image dimensions keep them in consistent UI slots, with their proportions preserved. Menu, buttons, categories, ingredient chips, recipe fact boxes, filters and account pages. Templates and the `squareIconPath(name)` helper in `app.js` load them by name, so a file name here is part of the code: rename one and grep for the old name first. This is the active icon collection; the padded square versions in `assets/svgs/` are no longer referenced.
- `assets/illustrations/*.svg`: pictures cropped to the drawing, for when the picture is the point. `noodles` (the hero), `fridge-closed` (the menu), `fridge-viewfinder` (Fota kylen), and `pencil`, `camera`, `light-bulb`, `grocery-basket` and `cook-book` ("Så funkar det": the four steps and the archive note under them). `fridge-opened`, `serving-cloche` and `recipe-archive` are unused since that section went from three steps to four. The bowl and the fridges exist in all nine palette colours; the site uses the blue ones everywhere, so they read as the same set. File names say what the picture is, not its colour, so changing colour means replacing the files.
- `assets/favicon.png`.

`design/` (outside `src/`, so never published) holds art that isn't on the site: `design/unused/` has the icons, illustrations and doodles nothing referenced when the folders were sorted (November 2026), kept in case they're wanted later. New illustrated icons need only the SVG, with no raster conversion.

**Small UI icons** come from the Font Awesome font: arrows, chevrons, close and remove buttons, and the save heart. The colourful icons use SVG.

- **Markup:** `<i class="fas fa-arrow-left" aria-hidden="true"></i>`. `fas` is bold, `far` regular. Arrows, chevrons and close buttons are bold, because it matches the label font's strokes. The save heart is `far` (outline) when not saved and `fas` (filled) when saved. In `app.js` and `kitchen.js`, use `faIcon(name, weight)`.
- **Icons in use:** `arrow-left` (back links), `arrow-up-right` (the ↗ links), `arrow-up` (home page footer), `chevron-down` (`<details>` summaries; it turns over when open), `xmark`, `heart`, and on a recipe's ingredients `plus` (grey: add to the shopping list) and `check` (once it's on the list), both bold. On the home page, "Lägg till råvara" has a bold `plus`; "Fota eller välj bilder" uses the illustrated `assets/icons/camera.svg`.

**Recipe fact boxes:** the boxes under a recipe's description (`recipe.njk`) show an illustrated icon from `assets/icons/`, then the label, then the value, all centered. Each label has one icon: Förberedelse `cutting-board`, Tillagning `timer`, Portioner `cutlery`, Nivå `difficulty-level`, Räcker till `jam-jar`, Verkningstid `kitchen-timer`. Mer än mat recipes (`recipe.food` false) use `bubbles` for Förberedelse and `difficulty-level-pink` for Nivå. A label not in that list shows without an icon. `new-recipe.js` uses the same food fact icons for generated recipes.

**Additional illustrated icons:** the recipe menu and recipe book use `cook-book`, the archive uses `recipe-archive-box`, and tag listings use `hashtag`. The recipe book's filters add `cook-book`, `magic-wand` and `recipe-archive-box`; the new-recipe prompt uses `magic-wand`. Account page headings use `padlock` (sign-in), `password` (new password), `user-profile-purple` (profile) and `gear` (settings). The account button and sign-in summary use `user-profile`, and Google sign-in loads `assets/icons/google.svg`.

- **`src/css/icons.css` is generated** by `node tools/icons.mjs`. The script cuts both fonts down to the listed icons (2.9 KB, inlined) from the full font in `fa/`, which is about 640 KB. To add an icon, add its name to the list in the script, run it and commit `src/css/icons.css`. It needs `fa/` and `pyftsubset` (`pip install fonttools brotli`).
- **`fa/` is in `.gitignore`:** it's the full Font Awesome Pro font, and the repo is public.

## Kylfoto och nya recept (fridge photo and AI recipes)

Two features on the home page, both off until the Supabase address is set in `src/_data/ai.js`. While it's empty, the site builds and behaves exactly as before.

1. **"Fota kylen"** ("Ta en bild av ditt kylskåp" on the page): a yellow card (`#fota`) beside the fridge list in step 01, above it on phones. The visitor takes or picks up to three photos of their fridge or pantry. Claude lists the foods it sees, and they go into the fridge list like typed ones, so the visitor can remove mistakes and the normal matching runs. Foods the site doesn't know show as "Känner inte igen" as usual. The photos are shrunk in the browser (about 1,500 px) and are not stored. The card has no line about where the photos go: Johanna removed "De skickas till Anthropic för analys och sparas inte" in November 2026. They are still sent to Anthropic (the API deletes them within 30 days), so a privacy page, if the site gets one, should say so.
2. **"Hitta på ett recept":** shown once the list has a recognised ingredient. Claude writes a new dinner recipe from the list in the archive's format and voice. It's stored, and the visitor lands on `nytt-recept.html?id=<uuid>`, which draws it with the recipe page's markup and asks OpenAI for its photo. The photo takes about a minute; the recipe shows right away with a placeholder.

The owner chose: **Supabase** for the backend, **option C** for generated recipes (stored with their own page, and the good ones added to the archive by hand with `npm run promote`), and **open to everyone**, held back by daily caps instead of a login.

**How it fits together:**

| File                                                        | Role                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/_data/ai.js`                                           | The Supabase project address. Empty = features off. The layout puts the functions' address in `<meta name="restfest-ai">`                                                                                                                                |
| `src/js/fridge-ai.js`                                       | Home page: the photo button and "Hitta på ett recept". Listens for `restfest:pantry`, which `renderPantry()` in `kitchen.js` now sends                                                                                                                   |
| `src/pages/nytt-recept.njk`, `src/js/new-recipe.js`         | The generated recipe page. `new-recipe.js` is a module (layout front matter `modules:`), draws the same markup as `recipe.njk` and calls `enhanceRecipe()` from `app.js`, so the stepper, fridge comparison, checklist and shopping list work. `noindex` |
| `lib/recipe-amounts.js`                                     | Also copied to `js/recipe-amounts.js` (`eleventy.config.js`), so the new-recipe page marks scalable amounts with the build's own parser                                                                                                                  |
| `supabase/migrations/…_ai_recipes.sql`                      | Tables `generated_recipes` and `ai_requests`, functions `ai_allow` (daily caps) and `claim_recipe_image` (one photo per recipe), public bucket `recipe-images`. RLS on with no policies: only the functions read and write                               |
| `supabase/functions/detect-ingredients`                     | POST photos → `{keys, other}` (Claude, vision)                                                                                                                                                                                                           |
| `supabase/functions/generate-recipe`                        | POST fridge list → `{id, recipe}` (Claude). Checks and mends the answer (`_shared/recipe.ts`), stores it                                                                                                                                                 |
| `supabase/functions/recipe-image`                           | POST `{id}` → makes the photo once (OpenAI), stores it in the bucket                                                                                                                                                                                     |
| `supabase/functions/get-recipe`                             | GET `?id=` → the stored recipe and photo status                                                                                                                                                                                                          |
| `supabase/functions/_shared/`                               | CORS and errors (`http.ts`), database (`db.ts`), caps (`limits.ts`), Claude call (`claude.ts`), recipe format, prompt and checks (`recipe.ts`), photo (`image.ts`)                                                                                       |
| `supabase/functions/_shared/data.ts`, `style-references.ts` | **Generated** by `npm run supabase-data` (`tools/supabase-data.mjs`): ingredient keys, dinner categories, tags used by dinner recipes, three example recipes (45, 29, 200), and the style photos from `supabase/style/` as data URLs                     |
| `supabase/config.toml`                                      | `verify_jwt = false` for the four functions: they're public, and Supabase's new API keys aren't JWTs                                                                                                                                                     |
| `tools/promote.mjs`                                         | `npm run promote -- <id or link>`: writes `src/recept/<next>-<name>.md` and downloads the photo                                                                                                                                                          |

**Models and settings.** Claude answers through structured outputs (`output_config.format` with a JSON schema), so the recipe always has the right fields; enum values can come back in another case, which `recipe.ts` corrects. The photo uses OpenAI's edits endpoint with two archive photos (`supabase/style/29-shakshuka.jpg`, `117-kokoscurry.jpg`, 1024 px) as style references, at 1536×864 (16:9), JPEG. All of these are Supabase secrets, changeable without a deploy:

| Secret                                                         | Default                                     |                                                                                           |
| -------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`                          | —                                           | Required                                                                                  |
| `RATE_LIMIT_SALT`                                              | —                                           | Any long random text. Visitors are counted as a hash of IP + date + salt, never the IP    |
| `ALLOWED_ORIGINS`                                              | `*`                                         | The site's address(es), comma-separated, e.g. `https://oftabraefter.se,http://localhost:8080` |
| `CLAUDE_MODEL` / `CLAUDE_DETECT_MODEL` / `CLAUDE_RECIPE_MODEL` | `claude-sonnet-5-5`                         | Haiku is cheaper and worth trying for the photos                                          |
| `IMAGE_MODEL`, `IMAGE_QUALITY`, `IMAGE_SIZE`                   | `gpt-image-2.5-flare`, `medium`, `1536x864` | `gpt-image-2.5-sunburst` is slower and better                                             |
| `IMAGE_STYLE_REFERENCES`                                       | on                                          | `off` draws from the text alone, if photos start copying the references                   |
| `DETECT_PER_VISITOR`, `DETECT_PER_DAY`                         | 15, 150                                     | Photo analyses per visitor and in total per day                                           |
| `RECIPE_PER_VISITOR`, `RECIPE_PER_DAY`                         | 5, 40                                       | New recipes (and so photos) per visitor and in total per day                              |

**The project:** Supabase project "Restfest" (its display name from before the rename) (`yatffwoobcsrxcxplecd`, region eu-west-1, free plan) in the owner's organization. The migration has been run (tables, functions and bucket checked in the dashboard on 2026-11-11), and `src/_data/ai.js` points to it.

**Setup (once).** Needs a Supabase account, an Anthropic API key and an OpenAI API key. Run in the project folder; `npx supabase` needs no install.

1. Create a Supabase project (region Stockholm, `eu-north-1`). Note its reference, the `abcd…` in `https://abcd….supabase.co`.
2. `npx supabase login`, then `npx supabase link --project-ref <reference>`.
3. `npx supabase db push`: creates the tables, functions and bucket from `supabase/migrations/`.
4. `npx supabase secrets set ANTHROPIC_API_KEY=… OPENAI_API_KEY=… RATE_LIMIT_SALT=$(openssl rand -hex 24)`, and `ALLOWED_ORIGINS=…` once the site's address is known.
5. `npx supabase functions deploy`: deploys all four. If it asks for Docker, add `--use-api`.
6. Set `supabaseUrl` in `src/_data/ai.js` to `https://<reference>.supabase.co`, build and upload `_site/` as usual.
7. **Set monthly spending limits** in the Anthropic Console and on OpenAI's platform. The daily caps bound the volume; the spending limits are the hard stop.

**Adding a generated recipe to the archive.** Find good ones in Supabase's table editor (`generated_recipes`, newest first), or from a page you liked. `npm run promote -- <id or link>` writes `src/recept/<next number>-<shortName>.md` dated today and downloads the photo to `src/assets/recipes/` (as `.jpg`; the build accepts any existing file). Read the recipe through and run `npm start` before publishing: the build checks the format, not the cooking. With `SUPABASE_SECRET_KEY=sb_secret_…` in `.env`, the script also sets `promoted_as`, and the generated page then links to the archive copy. To take a generated page down, set `hidden` to true on its row.

**When the taxonomy changes** (`foods.json`, tags or categories in `src/js/recipes.js`), run `npm run supabase-data` and deploy the functions again, so Claude uses the same keys and tags as the build. The same goes for new style photos in `supabase/style/` (JPEG, about 1024 px wide).

**Limits and things to know:**

- **No heart on generated recipes.** Saved recipes only keep ids from the recipe index, so the page has no save button. The shopping list works; its ids start with `ny-`.
- **Unknown foods from photos** show as "Känner inte igen …" like typed ones and don't count in the archive matching, but they are sent along to "Hitta på ett recept".
- **Free plan limits:** Edge Functions get 150 s of wall-clock time and 2 s of CPU per request. Recipe and photo are separate requests for that reason; each usually takes 20–60 s.
- **Photo retries:** a failed photo is tried once more on the next page view; a photo stuck in "generating" for four minutes can be claimed again. After that the page says there's no photo.
- **The page needs a server:** `nytt-recept.html` loads a module, which browsers don't load from `file://`.
- **Testing the functions locally:** `npx supabase start` and `npx supabase functions serve` (needs Docker), with the secrets in `supabase/functions/.env`.

## Konton och receptbok (accounts and the recipe book)

Visitors can create an account and sign in, with email + password or Google. An account gives them **Min receptbok**, which holds the recipes they generate and the archive recipes they heart and is the same on every device, and **preferences** (diets, foods they don't eat, portions) that Claude follows when it writes them a new recipe. Nothing that worked without an account needs one now.

The design and the plan it was built from are in `docs/superpowers/specs/2026-11-12-accounts-design.md` and `docs/superpowers/plans/2026-11-13-accounts.md`. The design says which choices were the owner's and which were Claude's.

**Off until the key is set.** Accounts need `publishableKey` in `src/_data/ai.js`. While it's empty the six account pages aren't built (`accountPages` in `eleventy.config.js`), the layout has no account button, and every HTML page is byte for byte what it was before accounts existed. `npm test` builds the site both ways and checks this.

**What a visitor gets:**

- **Signed out:** as before, plus a "Logga in" button in the header (a link in the menu row below 520px) and "Spara i receptboken" on a generated recipe, which leads to the sign-in page and back.
- **Signed in:** "Sparat" in the header becomes "Receptbok" and counts hearted and generated recipes together; "Logga in" becomes "Konto". Hearts work as before and are also stored in the account. A recipe generated while signed in goes into the book by itself, and its page has a heart.
- **Signing out** empties the hearts in that browser (they stay in the account) and leaves the fridge list, the shopping list and the week plan alone. Heart changes that hadn't reached the account yet are tried once more and otherwise put aside out of sight (`restfest-saved-stash`), and sent when the same visitor signs in on that browser again.
- **Deleting the account** (Konto) removes the sign-in, the profile and the book. Generated recipes stay: they are never tied to a person, only listed in a book.

**Files:**

| File | Role |
| --- | --- |
| `src/_data/ai.js` | `publishableKey` and `accounts` (true when the project address and the key are set). The layout puts both in `<meta name="restfest-account">` |
| `src/_includes/layouts/base.njk` | With accounts: that meta tag, a one-line script in the head that adds the class `signed-in` to `<html>` before the first paint, the account button and link, the footer's "Integritet" link, and `js/account.js` |
| `src/js/account.js` | **Every page.** Who is signed in, the header's state, loading the Supabase library, keeping the hearts in step with the account. Gives the other scripts `window.restfestAccount` (listed at the top of the file) |
| `lib/account-helpers.js` | Helpers without a browser in them, copied to `js/account-helpers.js` and tested by `npm test`: the return-address check, the queue of unsent heart changes and `bookSync`, which decides when it is sent and when the book is fetched, error texts in Swedish, the "äter inte" list |
| `src/js/account-forms.js` | What the forms share: running a request with the buttons off, showing what went wrong, and marking the field a problem is about (`aria-invalid`, `aria-describedby`, and the keyboard moves there) |
| `src/pages/logga-in.njk`, `nytt-losenord.njk`, `src/js/auth-forms.js` | Sign in, create an account, forgotten password, choose a new password |
| `src/pages/receptbok.njk`, `src/js/recipe-book.js` | Min receptbok |
| `src/pages/profil.njk`, `konto.njk`, `src/js/profile.js` | Name and preferences; email, password, sign out, delete |
| `src/_includes/account-nav.njk` | The menu the three signed-in pages share |
| `src/pages/integritet.njk` | The privacy page. Indexed, unlike the other five. **Keep it true** when what the site stores or sends changes |
| `src/js/new-recipe.js`, `src/js/fridge-ai.js` | The heart on a generated recipe; the sign-in sent along with "Hitta på ett recept" |
| `supabase/migrations/…_accounts.sql` | Tables `profiles`, `saved_recipes`, `saved_generated_recipes`, their row level security, and `my_generated_recipes()` |
| `supabase/migrations/…_profile_cooking_time.sql` | `profiles.max_cooking_minutes`: 15, 30, 45, or null for no time limit. Applied to the project on 2026-11-14 |
| `supabase/migrations/…_lactose_free_diet.sql` | Adds `Lactose free` and allows all six profile diets. Applied to the project on 2026-11-14 |
| `supabase/migrations/…_recipe_book_search_path.sql` | `my_generated_recipes()` again, with an empty search path. **Not on the project yet** (see "Waiting to go out" below) |
| `supabase/functions/_shared/auth.ts` | `userFor(req)`: the signed-in visitor behind a request, or null |
| `supabase/functions/_shared/preferences.ts` | Cleans a profile's preferences and writes them as lines for Claude. Tested by `npm test` |
| `supabase/functions/generate-recipe` | Now takes an optional sign-in: follows the caller's preferences and adds the recipe to their book (`saved` in the answer) |
| `supabase/functions/delete-account` | Deletes the caller's user; the database removes the rest |
| `supabase/templates/` | The three mails in Swedish, pasted into the dashboard by hand (its README says how) |
| `tools/standin/` | A stand-in backend and two checks that need no real project (see "Testing" below) |
| `src/assets/icons/user-profile.svg` | The account button and sign-in summary icon from the active illustrated set |

**How signing in works:**

- **The library** is `@supabase/supabase-js`, pinned in `package.json` and copied from `node_modules` to `js/vendor/supabase.js` (220 KB, about 60 KB compressed), only when the site has accounts. A signed-out visitor never downloads it: `account.js` loads it only on the account pages, or when the browser has `restfest-account` in localStorage, which marks "signed in here".
- **Implicit flow, not PKCE** (`client()` in `account.js`): a link in a mail has to work in a browser other than the one that asked for it, such as signing up on a laptop and opening the mail on a phone.
- **Mail links and Google** come back to `logga-in.html`, which reads the sign-in from the address and goes on to `?till=<path>`, or to the recipe book. Only a path within the site is accepted (`safeReturnPath`). The password link goes to `nytt-losenord.html`.
- **A sign-in that has run out** just signs the visitor out on the next page load, without a message. Supabase being unreachable changes nothing.
- **A sign-in that lands on the wrong page** is passed on. If an address is missing from Supabase's redirect list (setup step 2), a mail link or Google comes back to the front page instead; `account.js` then sends the visitor on to `logga-in.html` or `nytt-losenord.html` with the sign-in intact.
- **Signing in before confirming the address** shows the "Kolla din mejl" box with "Skicka igen". **Signing up with an address that already has an account** says so: Supabase answers such a sign-up as if it worked and sends no mail, which `auth-forms.js` recognises by the empty list of sign-in methods.
- **The name in the account menu** is the profile's, fetched with the book, so a name changed on one device shows on the others.
- **The functions** get the visitor's access token in the `Authorization` header and check it themselves (`userFor`). `verify_jwt` stays off in `config.toml`.

**How the hearts stay in step.** `app.js` still draws hearts from `restfest-saved`, signed in or not. For a signed-in visitor that list is a copy of the account's, and `account.js` keeps it so. The order of things is `bookSync` in `lib/account-helpers.js`, tested by `npm test` (`test/book-sync.test.js`); `account.js` gives it the browser's storage, the tables and the lock.

- **At the first sign-in in a browser**, the hearts it already holds are added to the account, so none is lost.
- **Every change** goes into a queue (`restfest-saved-queue`) and is sent at once. What can't be sent (offline, Supabase down) stays queued and goes with the next page load. The heart click itself is never blocked or undone.
- **Changes of one kind go in one request**, up to 50 recipes at a time, removals first. So the first sign-in with 40 hearts is one request, not 40.
- **On a page load**, at most once a minute, the queue is sent and then the account's lists replace the browser's. So a heart from another device shows up, and a heart removed offline stays removed. `receptbok.html` always fetches, and the page load's own check then sees that it has been done.
- **One tab at a time.** Sending and fetching run inside a lock all the site's tabs share (the Web Locks API, name `restfest-book`), so a tab that is slow to send an old change can't undo a newer one from another tab. A tab that has waited 15 seconds gives up until its next page load. A browser without the API runs each tab for itself, as before.
- **Generated recipes** in the book are kept as ids in `restfest-saved-generated`. They come from `my_generated_recipes()`, so a recipe the owner has hidden is left out of the header's count, as it is on `receptbok.html`. `toggleSave()` in `app.js` tells `account.js` about a change with the event `restfest:save-change`; `account.js` sends `restfest:account` when the sign-in or the book changes.
- **A change the database refuses for good** (a recipe that no longer exists, a full book: status 400, 409 or 422) is dropped from the queue with a console warning. A refused group is first sent again one recipe at a time, so only the recipe that is the trouble is dropped. Everything else, including 404, which is what a table that isn't there yet answers, is tried again.
- **A book holds at most 1000 recipes of each kind** (a trigger in the migration).

**The recipe book's cards.** Archive recipes use `archiveCard()` from `app.js`. `generatedCard()` in `recipe-book.js` repeats that markup for a generated recipe, so there are now three places to change together: `archiveCard()`, `_includes/recipe-card.njk` and `generatedCard()`.

**Preferences and Claude.** `generate-recipe` adds the caller's preferences to the request as a few Swedish lines (`preferencesPrompt`), and `recipeSystem` in `_shared/recipe.ts` has a PREFERENCES section saying how to follow them. Claude leaves out what doesn't fit. If nothing is left to cook from it answers `unsuitable: true`, and the visitor gets a message pointing to their profile. That attempt still counts against the day's cap, since it cost a Claude call. The recipe is not checked against the preferences afterwards. The foods a visitor "doesn't eat" are their own words: they are cleaned, quoted and named as a list of foods, and Claude is told to ignore instructions in them.

The profile's "Hur lång tid får det ta?" card saves a total time budget of 15, 30 or 45 minutes, including preparation and cooking. "Ingen brådska" clears it. On desktop the card fills the remaining sidebar height; on phones it stacks below the portions card. The database column and `generate-recipe` were deployed on 2026-11-14. Like the accounts migration, the cooking-time migration was applied through the SQL API, so it is not in Supabase's migration history yet.

"Laktosfritt" is the sixth diet option (`Lactose free`). It allows lactose-free dairy products. Vegan and dairy-free recipes include it automatically, and the profile checks and locks included choices using `impliedTags`. The database constraint and `generate-recipe` were updated on 2026-11-14; the diet migration was also applied through the SQL API. The generated recipe tag list includes all supported food diets, even before a diet has its own archive recipe.

**Setup (once), the owner's part.** The code can't do these:

1. **Publishable key:** Supabase dashboard → Project Settings → API keys → copy the publishable key (`sb_publishable_…`) into `publishableKey` in `src/_data/ai.js`. It is meant to be public. Never put a secret key there.
2. **Addresses:** Authentication → URL Configuration. Set the Site URL to the site's address, and add the addresses the site runs on to the redirect list: `http://localhost:8080/**` for the local server (and `http://localhost:8765/**` if tests are run on that port, as Claude does), and the public address with `/**` once there is one.
3. **Password length:** Authentication → Sign In / Providers → Email: minimum password length 8, and keep "Confirm email" on. The site checks 8 characters itself, but Supabase's own default is 6.
4. **Mails:** paste the three templates from `supabase/templates/` (see its README for which goes where and the subjects).
5. **Google:** create an OAuth client in Google Cloud Console (Web application), with the redirect address shown on Supabase's Google provider page (`https://yatffwoobcsrxcxplecd.supabase.co/auth/v1/callback`), and enter its id and secret on that page.
6. **Mail delivery, before real visitors:** Supabase's built-in sender only delivers to the project's own team and sends 2 mails an hour. Connect a mail service (Resend, Postmark, AWS SES …) under Authentication → Emails → SMTP Settings; it needs a domain you control. Until then, email sign-up works for your own address only. Google sign-in works for everyone.
7. **A contact address** for the privacy page: `contact` in `src/_data/site.js`.
8. Deploy: `npx supabase db push` (one new migration) and `npx supabase functions deploy`, then build and upload as usual. **Done on 2026-11-13** (see "Things to know" for how); steps 1, 2 and 5 were done then too, and the key is in `ai.js`.

**Things to know:**

- **Google's screen** says the visitor is continuing to `yatffwoobcsrxcxplecd.supabase.co`, not to Ofta bra efter, unless the project gets a custom domain, which is a paid Supabase add-on.
- **Any signed-in visitor can add any generated recipe to their book** if they have its link. The pages are public anyway.
- **"Spara i receptboken" for a signed-out visitor** remembers the click in the browser for an hour (`restfest-save-intent`), and the recipe is saved when they come back from signing in with `?spara=1` in the address. The address alone saves nothing, so a link with `?spara=1` can't put a recipe in someone's book. Signing up on one device and opening the mail on another therefore doesn't save it; the heart is there to click.
- **With Supabase down**, the recipe book page shows its error after about 7 seconds: the library retries reads before giving up.
- **A changed email address** takes effect when the visitor clicks the link sent to the new address.
- **The Google button has no Google logo.** Add the official one if you want it; don't redraw it.
- **Restart `npm start` after adding the key:** which pages are built is decided when the server starts.
- **The accounts migration was run by hand** in the dashboard's SQL editor on 2026-11-13, not with `supabase db push`; the cooking-time and lactose-free migrations were applied through the SQL API on 2026-11-14. Supabase's own list of applied migrations does not include these. Before the next `db push`, run `npx supabase migration list` and, if they show as not applied, `npx supabase migration repair --status applied 20261110220000 20261113120000 20261114120000 20261114130000`. Otherwise the push tries to create the tables and cooking-time column again and stops.
- **The Supabase CLI is version 3 now.** It wants `--remote=yatffwoobcsrxcxplecd` instead of a linked folder, and for a change to production it stops and asks for `--yes`: `npx supabase functions deploy --remote=yatffwoobcsrxcxplecd --use-api --yes`. All five functions were deployed this way on 2026-11-13.
- **Supabase refuses sign-ups from made-up domains** such as `example.com` ("E-postadressen ser inte rätt ut."), so test accounts with such addresses have to be made with the admin API.
- **Not built:** syncing the fridge list, shopping list or week plan to the account; preferences affecting the archive matching; a higher daily cap for signed-in visitors; other sign-in methods; an admin page.

**Testing.** Four things in `tools/standin/` need no real project and touch nothing real:

- **`server.mjs`:** a stand-in for the Supabase project (sign-in, the tables, the functions) in memory, to try the account features in a browser. Its header comment has the two commands: start it, then serve a build with `RESTFEST_SUPABASE_URL` and `RESTFEST_PUBLISHABLE_KEY` pointing at it. Every page and flow of the accounts was checked this way with the Playwright tools.
- **`check-rls.mjs`:** runs the migrations in an in-memory Postgres and checks what each role can reach (44 checks). **Run it after any change to a migration**; it is the only test of the row level security.
- **`check-functions.ts`:** runs `generate-recipe` and `delete-account` with Claude and Supabase replaced (23 checks).
- **`check-account-pages.js`:** 23 checks in a browser against `server.mjs`, run with the Playwright tool (its header says how): the first sign-in's hearts in one request, what `receptbok.html` fetches, the header's count, `?spara=1`, the lock between tabs, and problems tied to their fields.

**Waiting to go out.** One change from 2026-11-13 remains in the repo and not on the Supabase project. It is not urgent, and the site works the same without it:

- **`…_recipe_book_search_path.sql`:** paste it into the dashboard's SQL editor, or use `db push` after the `migration repair` under "Things to know".

## Testing setup that worked

- **Serve the site:** `npx @11ty/eleventy --serve --port 8765 --output=<a folder in the scratchpad>` in the project root, run in the background, then test with the Playwright MCP tools. Give it its own `--output`: the owner often has `npm start` running, and two servers writing to `_site/` overwrite each other. For the same reason `_site/` is no baseline to compare against; build the comparison from a temporary `git worktree` of `main`.
- **A long-running `npm start` goes stale** for code in `lib/` (Node keeps the first version it loaded) and for `eleventy.config.js`. If the owner's preview shows something old, such as the previous site name on category pages, restarting it fixes it.
- **Browser cache gotcha:** the Eleventy server sends no cache headers either, so a reload can show stale CSS, JS or HTML. Refresh them with `fetch(path, {cache: 'reload'})`, or add `?t=…` to the address. Real visitors could hit the same problem after a deploy, so a host setting that makes browsers always check HTML for a newer version is worth recommending.
- **Compare output before and after a refactor:** copy `_site/` to the scratchpad first, then diff the new build against it with the whitespace between tags collapsed. The Eleventy move was checked this way: all 135 recipe pages came out identical.
- **Overflow check:** sweep widths 320–1440 for horizontal overflow on `index.html`, `receptarkiv.html`, `mer-an-mat.html` and one recipe page. The header is tight (see item 13).
- **Clean up afterwards:** stop the server and delete `.playwright-mcp/`, which the browser tool creates in the project.

## Done (items 1–8)

1. **Matching:**
   - Weighted scoring as described above.
   - Unknown words are marked, with "Menade du …?" suggestions.
   - About 30 everyday aliases added, e.g. köttfärs, kycklingfilé, fisk.
   - The example fridge now gives Pastafrittata 4/4 and shows three more suggestions.
   - Fixed the duplicate rödlök ingredient.
   - New home page meta description.
2. **Fake photo upload removed:** the home page is text input only.
3. **Phone menu:** it shows as its own row under the logo, instead of being hidden.
4. **Page weight:** the home page went from 1.86 MB to 560 KB.
   - Icons are now WebP: the heart went from 511 KB to 1 KB.
   - The home page and archive load the slim `data/recipe-index.js` (140 KB, about 38 KB compressed) instead of the 523 KB `recipe-collection.js`.
   - Compression has to be turned on with the host.
5. **A real page per recipe:** `recept/<id>.html` with recipe markup for search engines (JSON-LD, food only) and share tags (OG). The pop-up, address bar and Back/Forward work as described above.
6. **Recipe pop-up:**
   - The close button is sticky.
   - The photo is capped at 260px tall and cropped.
   - Only "Hemma" and "Saknas" labels remain.
   - The summary counts the same rows that get labels.
   - New "Lägg saknade i inköpslistan" button, which changes to "I inköpslistan · visa" once added.
   - **Portion scaling:** the yield fact is a stepper (− number +) on recipe pages and in the pop-up: Portioner for food, Räcker till for Mer än mat (`servingsLabel` in `lib/recipes.js`). It starts at the original value (the lower end for a range). The buttons step to the next whole number, and below 1 to a half; the number can also be typed. Only the number shows: the rest of the fact's wording ("ca", "liter (4 burkar à 2½ dl)") appears only without JavaScript. `lib/recipe-amounts.js` marks quantities in the original ingredient text and yield context; `enhanceServings()` in `app.js` scales from those originals, preserving fractions, ranges and Swedish decimals. Percentages, individual package sizes, recipe references ("recept 111 eller 176"), what something holds ("äggkartong för 12 ägg"), equipment dimensions and per-unit ratios stay fixed, as do ingredient entries marked `tool: true` (towels, brushes, bowls, moulds: things you use and keep). Containers that hold the result, like spray bottles and jars, do scale. Shopping buttons add the displayed amounts with the same stable ids. Instructions retain their original wording; an explanatory line appears when the portions change. Without JavaScript, the original values remain visible. `npm test` checks the quantity parser.
7. **Taxonomy:**
   - Removed the Vego, Ägg- & mjölkfritt and Snabblagat categories.
   - Removed 19 tags that only repeated a category.
   - Diet tags removed from spa items.
   - Consistent category names: plural in the filter, singular on cards (`mealName`).
   - New "Kost" diet buttons in the archive's "Fler filter".
   - Tags sorted so diet comes first.
   - The data was migrated in place. A backup of `recipe-collection.js` from before this is in the previous chat's scratchpad, which is temporary and may be gone.
8. **Spa, cleaning and pet recipes:**
   - Moved to `mer-an-mat.html`; the owner chose "own section".
   - The archive is food only, but the Sparade view still shows saved non-food items.
   - Archive search says when there are matches under Mer än mat.
   - New header link "Mer än mat".
   - To make room, the desktop menu dropped its icons. Below 1200px the Sparat and Inköpslista buttons show icon and count only. Below 960px the menu gets its own row. Below 520px "Så funkar det" was hidden. Since the "Recept" menu (see "Pages") the menu has two entries and shows both at every width.
   - I offered a footer link too but didn't add one; the owner hasn't been asked about that.

**Also done:**

- **Item 16, git:** the owner set it up.
- **Eleventy:** the old `tools/build.mjs` and the three hand-written HTML pages became the templates in `src/`. The output was compared with the old build:
  - **Recipe pages and `data/recipe-index.js`:** identical, apart from the generated-file comment.
  - **The three main pages** changed only where they now share the layout:
    - All of them preload the GT Maru font. Before, only the home page did.
    - The home page footer's "↑" has `aria-hidden="true"` (part of item 14).
    - The home page lost five unused icon-sprite symbols. Only `#icon-heart` is used.
    - `<title>` now comes before the meta description.
  - **`recipe-collection.js` is no longer uploaded.** No page loads it.
- **Markdown recipes:** `src/recipe-collection.js` became the 135 files in `src/recept/` and `src/_data/foods.json`, with collections and pages per category, type and tag (see "Recipes"). A one-off script wrote the files and read each one back through the build's own parsers to compare it with the original data; all 135 matched. The script isn't in the project. Compared with the build before:
  - **Home page, archive, Mer än mat:** identical.
  - **`data/recipe-index.js`:** identical apart from the generated-file comment.
  - **Recipe pages:** identical, including the structured data, apart from the new category and tag links. One apostrophe is now written as `'` rather than `&#39;`.
  - **New:** 95 pages under `kategori/`, `typ/` and `tagg/`, also in the sitemap.
- **Committed and merged:** the Eleventy move and the Markdown recipes are on `main` (PR #1); the `eleventy` branch is deleted.
- **Dates and sorting in the archive:** every recipe has a `date`, and the archive has a "Sortera" menu (see "Dates" and "Archive order" under "Recipes"). The owner chose the options and the default, a single date for the existing recipes, and keeping the date off the page. Compared with the build before:
  - **Food recipe pages (110):** only `datePublished` is new in the structured data.
  - **Spa, cleaning and pet recipe pages:** unchanged.
  - **Archive:** "Bäst matchning" gives exactly the old fridge order. With an empty fridge the archive now opens newest first rather than in file order.
  - **Other pages:** unchanged.
- **New pages reachable:** the archive intro links to the Mat page and its category row, and the Mer än mat headings link to the three type pages (see "Pages" under "Recipes"). The owner left the choice and the copy to me. The build output changed only in `receptarkiv.html`, `mer-an-mat.html` and `kitchen.css`.

- **Recipes 136–205:** added from the owner's document "Restfestrecept 136-205.md", each paired with the photo of the same number, dated `2026-11-10`. A one-off script (not in the project) wrote the files, and every file was read back through the build's own parsers and matched the document word for word. Choices made on the way:
  - **Tags:** the owner chose to add 11 new ones: Brittiskt, Tyskt, Östeuropeiskt, Australiskt, Fermenterat, Chutney, Tvätt, Öron, Nos, Leksak, Aktivering. Fish became Pescetariskt, Lunchbox became Matlåda and Coat became Päls- & tassvård. Tags that repeat a category, plus Quick, Home, Food and Party, were dropped. Spa recipes lost their diet tags, as the taxonomy rules require.
  - **Barnvänligt** (196–205) is a category, `kids`, with the `teddy-bear` icon, at the owner's request, so it shows in the archive's Kategori picker. It is the one category that isn't a dish type, so it comes last in each recipe's `categories` and the cards keep showing the dish type. It started as a tag; the tag was removed because it would have repeated the category.
  - **Ingredient keys:** six new ones in `foods.json`: `zucchini`, `avokado`, `pumpa`, `ingefara`, `mango`, `dadlar`.
  - **Section intros** became `beforeYouStart` as in earlier batches. 191–195 use the document's own vet note, and 144 (surkål) a version of the jar note saying the kraut is filled cold and ferments with a loose lid. 165 (värmekudde) has no patch-test note.
  - **One wording change:** in 164 (tvål), "Taggen vegan gäller om tvålbitarna är veganska. Kontrollera tvålarnas innehåll." became "Vill du ha en vegansk tvål, kontrollera tvålbitarnas innehåll.", since spa recipes have no vegan tag.

- **Kylfoto och nya recept:** a real photo upload (the fake one was removed in item 2) and AI-written recipes with photos, on Supabase. See "Kylfoto och nya recept" for files, setup and limits. Verified in the container, not against the real APIs (no keys there):
  - the four functions type-check and lint with Deno, and ran with Claude, OpenAI and Supabase replaced by stand-ins: 36 checks on answers, errors, caps, CORS, the stored recipe and the photo request, all passing;
  - the home page and `nytt-recept.html` in headless Chrome against a stand-in backend: photo → list, list → recipe → placeholder → photo, stepper, fridge comparison, shopping list, category and tag links, Back, unknown ids, and no overflow at 375 px;
  - `npm run promote` output passes the build, and its front matter reads back unchanged;
  - with `ai.js` empty, the home page has no trace of the features.

- **Konton och receptbok:** sign-in with email + password or Google, Min receptbok, preferences, the profile, account and privacy pages. See "Konton och receptbok" for files, setup and limits. The site was also renamed from Restfest to Ofta bra efter just before (see "The name" at the top). Verified without the real project:
  - `npm test`: 39 tests, among them two full builds (with and without the key);
  - without the key, every HTML page is byte for byte the same as before accounts;
  - the migration in an in-memory Postgres: 35 checks of who can reach what, the limits, and what deleting a user removes;
  - `generate-recipe` and `delete-account` with Claude and Supabase replaced: 19 checks;
  - an independent review of the whole branch found no way to reach another visitor's data; what it did find (hearts lost when signing out with unsent changes, no "skicka igen" before confirming, a silent sign-up for an existing address, a gap in the return-address check) was fixed and re-tested;
  - every page and flow in a browser against the stand-in backend: signing up, in and out, mail links opened in a cleared browser, Google, a new password, hearts merging at sign-in and surviving a backend outage, the recipe book, preferences, deleting the account, keyboard order and labels, and no overflow from 320 to 1440px;
  - a signed-out visitor downloads `js/account.js` and `js/account-helpers.js` and nothing else new, and no request goes to Supabase.

  Then against the real project on 2026-11-13, with two throwaway accounts that were deleted afterwards along with their test recipe and its photo:
  - the access rules with real sign-ins: 25 checks (own rows only, nothing signed out, the limits, the status codes the heart queue relies on);
  - in a browser: sign-in, a wrong password, hearts merging at the first sign-in and following the account between two browsers, the profile and account pages;
  - a sign-in link and a password link opened in a browser that had never seen the site, and a link used twice;
  - signing up with an address that already has an account;
  - one real generated recipe as a signed-in visitor with preferences (vegetarian, no koriander or svamp, 2 portions) and chicken, mushrooms and coriander in the fridge list: none of them in the recipe, tagged Vegetariskt, 2 portions, in the book with its photo;
  - deleting the account from Konto: user, profile and book gone, the recipe's page still there.

  **The review's deferred minors, fixed afterwards on 2026-11-13**, each with a test or check that failed first:
  - the first sign-in sends the browser's hearts in one request, not one each;
  - two open tabs can no longer bring back a heart that was just removed (the lock between tabs);
  - `receptbok.html` fetches the book once, not three times, and draws its cards once, not twice;
  - the header's count leaves out generated recipes the owner has hidden;
  - a link ending in `?spara=1` saves nothing by itself;
  - a problem with a field marks the field and is read with it by a screen reader;
  - the Supabase library is copied into the build only when the site has accounts;
  - the sync logic moved out of `account.js` into `bookSync`, under `npm test` (54 tests now);
  - `generate-recipe` checks the day's cap before the sign-in, and `my_generated_recipes()` has an empty search path. These two are in the repo but **not deployed**: see "Waiting to go out" under "Konton och receptbok".

  They were checked with `npm test`, the three scripts in `tools/standin/`, and a signed-out request to the real project that showed it accepts the new way of asking for the book's ids. They were not run signed in against the real project.

  **Not tested against the real project:** a confirmation mail actually arriving (the built-in sender only reaches the team's own addresses), completing a Google sign-in (the button reaches Google's sign-in page with the right return address; going further needs a Google account), and changing the email address.

**Content caveat to pass on:** Chokladtryfflar and Banansoftis are tagged gluten-free but use oat cream or oat drink. Röd linssoppa and Chili sin carne have oat yoghurt as an optional topping. They're only gluten-free with products labelled "glutenfri". The owner has been told; nothing was changed.

## Remaining items (9–20), with current status

**P2 – Accessibility and polish**

9. **Tiny text.**
   - On the phone archive, about 400 pieces of text are 9px and about 400 more are 11px, often in the monospace label font.
   - Aim for 12–13px minimum, and keep the monospace font for short labels.
   - Not started. Card tag chips are 9–10px (`.ingredient-chips span`), and the pop-up checklist text is 10px.
10. **Duplicate buttons on cards.**
    - Each archive card has a title link, a "Visa recept"/"Visa behandling" link (`.open-recipe`) going to the same place, and a heart. That's about 405 Tab stops in the archive.
    - The whole card is already clickable through the title link's `::after` overlay, so remove `.open-recipe` from `archiveCard()` in `app.js`, and from `src/_includes/recipe-card.njk` (the same card on the category, type and tag pages).
    - Not started.
11. **Phone archive filters fill the first screen.** Collapse them behind one "Filter" button that shows how many filters are active. Not started; the Kost row added in item 7 sits inside "Fler filter". The category links on the new Mat and category pages have the same problem on phones.
12. **Recipe data errors.**
    - Three descriptions give a different time than the card label. For example, Pasta aglio e olio says "15 minuter" but the card says 20 min. **Still open.**
    - Rödlök counted as two ingredients. **Fixed.**
    - Sorting with recipes that have no time. **Fixed in home page matching.** The archive doesn't sort by time.
    - Some `time` values are odd, for example Allrengöringsspray is 20171 minutes ("1–2 veckor"). They only affect the "Under 20 min" filter.
13. **Outdated text.**
    - The home page meta description is **fixed**.
    - The "Demoköket" sticker is still in the header (now only in `src/_includes/layouts/base.njk`), and the archive back link reads "Till demoköket" (`src/pages/receptarkiv.njk`). They make the site look like a prototype.
    - Removing the sticker frees about 80px in the header, which would also allow the desktop menu icons back.
14. **Screen readers.**
    - The saved-recipes count in the header isn't announced.
    - ~~The "↑" in the home page footer is read aloud.~~ **Fixed** by the shared layout.
    - The saved-count part is not started.
15. **Font licence – the owner's decision.**
    - GT Maru (`src/assets/GTMaru*.woff2`) is a paid font; the owner needs to confirm they have a web licence.
    - Rubik (`src/assets/rubik-*.ttf`, open licence) is there but unused.

**P3 – Cleanup**

16. ~~**Put the project under git.**~~ **Done.**
17. **Unused code.**
    - The swap feature is dead because no recipe has `swap`, `tip` or `chips`. The build no longer writes those fields, and the recipe page no longer has the `tip` box. What's left is in:
      - `app.js`: the `matchRecipe` swap logic, plus `recipe.category` and `recipe.chips` in `archiveCard()`.
      - `kitchen.js`: the `match.swap` lines.
      - `kitchen.css`: `.cook-swap`.
    - About half of `styles.css` styles things that no longer exist: `.example-preview`, `.recipe-card`, `.result-notice`, `.small-tip`, `.dropzone`, `.servings` and more.
18. **Unused files:**
    - all under `src/assets/` now
    - `assets/bowl.jpg`, `assets/pasta.jpg`
    - the unused icons, illustrations and doodles, now moved out of `src/` to `design/unused/`
    - the Rubik files, unless item 15 switches to Rubik
    - 3 `.DS_Store` files

    Check references with grep before deleting anything; remember the templates and the recipe files in `src/` too. `.DS_Store` files are in git; they never reach `_site/`.

19. **Code structure.**
    - The four scripts depend on each other's global variables.
    - `styles.css` is no longer minified, but it and `kitchen.css`, which overrides it, are still two stylesheets.
    - Move to JavaScript modules and one readable stylesheet.
    - ~~Generate the header from one source.~~ **Done** with the Eleventy layout.
    - ~~Sort `src/` into folders.~~ **Done:** `pages/`, `css/`, `js/` and `_includes/layouts/`. The built site is unchanged apart from the stylesheets and scripts now being served from `css/` and `js/`.
20. **Link previews and home-screen icon.**
    - Recipe pages have OG tags. `og:image` and canonical links only appear once the address in `src/_data/site.js` is set.
    - The OG tags are in `src/_includes/layouts/base.njk`, which renders them only for recipe pages. The home page, archive, Mer än mat and the category, type and tag pages have none yet.
    - There's no `apple-touch-icon`. It would go in `base.njk`.

## Suggested next steps

Recommended after the new pages were made reachable. The owner still picks; 15 is the owner's decision.

0. **Turn on Kylfoto och nya recept** (setup steps in that section), then try it with real fridge photos before sharing the site. Things to look at: whether the photos look like the archive (otherwise try `IMAGE_QUALITY=high`, or another pair of style photos), whether Claude's recipes sound like the house voice, and the first days' usage against the caps and spending limits.
1. **Item 11, with the category row on the new pages.** On phones the archive filters and the row of 18 category links on the Mat and category pages both fill the first screen. Solve them together.
2. **Item 12, the recipe data errors.** Three recipes give a different time in the description than on the card. Each fix is a one-line edit in that recipe's file in `src/recept/`.
3. **Item 20, once the owner knows the site address.** Setting it in `src/_data/site.js` turns on `sitemap.xml`, canonical links and share images. Every page other than the recipe pages still needs share tags.

Items 10 and 13 are small and can go in alongside any of these. Item 10 now means removing `.open-recipe` from both copies of the card (`app.js` and `src/_includes/recipe-card.njk`).

## Deploy note for the owner

There's no deploy step in the repo. Run `npm run build` and upload everything in `_site/`. A host that builds from GitHub, such as Netlify or Cloudflare Pages, could do this instead, with build command `npm run build` and output folder `_site`.
