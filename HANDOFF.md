# Restfest – handoff

Restfest is a Swedish recipe site built around "Vad blir det till middag?" (what's for dinner?). You type what's in your fridge and it suggests dinners from a recipe archive. It's a static site built with Eleventy; the browser code has no framework. ChatGPT Sites originally generated it. A previous chat reviewed it and listed 20 issues, P0 to P3. Items 1–8 and 16 are done, the site has moved to Eleventy, and each recipe is now a Markdown file with pages per category, type and tag. The other items remain.

**How the owner likes to work:** they pick items by number ("Do 7", "Continue with 6 and 8"). Don't start the next item until asked. Ask before content or product decisions, and give a recommended option. Reply in English; all site copy is Swedish. When a batch is done, summarise it in plain language: what changed, what was verified, what to deploy and any caveats.

**Git:** the project is on GitHub (`johannaefageras/restfest`, branch `main`). Commit only when the owner asks, on a branch.

## How the site works

Eleventy builds the site from `src/` into `_site/`. `_site/` is generated and not in git.

| File | Role |
|---|---|
| `src/_includes/base.njk` | **The layout every page shares:** head, header, footer, recipe pop-up, shopping dialog, icon sprite and scripts. The header and footer exist only here |
| `src/index.njk` | Home page: the fridge list (`kitchen.js`) and the dinner suggestion |
| `src/receptarkiv.njk` | Recipe archive with search and filters, food only |
| `src/mer-an-mat.njk` | "Mer än mat": spa, cleaning and pet recipes, in three sections |
| `src/recept/<id>.md` | **The recipes**, one Markdown file each (135). Builds `recept/<id>.html`. Format under "Recipes" below |
| `src/recept/recept.11tydata.js` | Settings for every recipe file: layout, address, and the computed `recipe` the templates use |
| `src/_includes/recipe.njk` | The recipe page layout |
| `src/kategori.njk`, `src/typ.njk`, `src/tagg.njk` | Build one page per category, recipe type and tag from the collections, with the layout `src/_includes/listing.njk` and the cards in `src/_includes/recipe-card.njk` |
| `src/recipe-index.njk` | Builds `data/recipe-index.js`: the slim index for the home page and archive, with no amounts and no instructions |
| `src/sitemap.njk` | Builds `sitemap.xml`, only when the site address is set |
| `src/_data/foods.json` | **The ingredient list:** each key with its name, food group and the words people type for it. Recipes refer to these keys |
| `src/_data/site.js` | The site's public address (empty for now). Setting it adds canonical links, `og:image` and `sitemap.xml` |
| `src/recipes.js` | Taxonomy and helpers: `foodGroups`, `mealTypes` (the categories), `mealName()`, `nonFoodMeals`, `isFood()`, `dietTags`, `impliedTags`, `allTags()`, `hasTag()`, `recipeTagLabels`, `foods` with extra aliases. Used by the browser, and loaded by the build (`lib/taxonomy.js`) so both use the same lists |
| `lib/recipe-body.js` | Build only: reads the Markdown below a recipe's front matter (steps, tips, extra sections) |
| `lib/recipes.js` | Build only: checks a recipe's front matter and works out its page, card and index entry; groups the recipes for the category, type and tag pages |
| `lib/taxonomy.js` | Build only: loads `src/recipes.js` and `foods.json`; makes the page addresses for categories, types and tags |
| `src/app.js` | Shared code: saving, shopping list, archive rendering and filters, Mer än mat grids, ingredient matching, the recipe pop-up |
| `src/kitchen.js` | Home page only: the fridge list, unknown-ingredient suggestions, the best match and three more |
| `src/styles.css` | Minified original styles, much of it dead (item 17) |
| `src/kitchen.css` | Everything newer. It overrides `styles.css` |
| `eleventy.config.js` | Which files are copied as they are, which files the local server watches, and the recipe collections |

- **Scripts:** they are plain scripts sharing one global scope, loaded in this order: `data/recipe-index.js` → `recipes.js` → `app.js` → `kitchen.js` (home page only). A page lists extra scripts in its front matter (`scripts: [kitchen.js]`).
- **Paths:** pages use relative paths. Pages one folder down (recipes, categories, types, tags) set `base: '../'`, and the layout puts `{{ base }}` in front of every path and adds `data-base` to `<html>` for `app.js`. Opening the built files from disk still works.
- **URLs are unchanged from before Eleventy:** `receptarkiv.html`, `mer-an-mat.html`, `recept/<id>.html`. Pages other than `index.njk` need a `permalink:` ending in `.html`, otherwise Eleventy writes `name/index.html`.
- **New URLs:** `kategori/<slug>.html` (17 food categories), `typ/<slug>.html` (`mat`, `hemmaspa`, `hushall-och-stad`, `husdjur`) and `tagg/<slug>.html` (74 tags). The slug comes from the Swedish label: "Fika & bakning" → `fika-och-bakning`. Renaming a label changes the address; the build stops if two labels give the same one.
- **localStorage keys:** `restfest-pantry`, `restfest-saved`, `restfest-shopping-list`.

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

Each recipe is `src/recept/<id>.md`. The id is the file name, a number and a name (`01-rodbetspytt`). **Don't rename existing files:** saved recipes and shopping lists in visitors' browsers use the id. A new recipe takes the next number (136 now), and its photos go in `src/assets/recipes/<id>.webp` (1200 px wide) and `<id>-card.webp` (600 px).

**Front matter** (YAML) holds what the site works with:

```yaml
---
title: Rödbetspytt i torn med gyllene äggula
description: Gårdagens kokta potatis, en burk inlagda rödbetor …
image: assets/recipes/01-rodbetspytt.webp            # the large photo, path from src/
cardImage: assets/recipes/01-rodbetspytt-card.webp   # the photo on cards
alt: Rödbetspytt i torn med gyllene äggula           # the photo's alt text
categories: [main, breakfast]       # keys from mealTypes in src/recipes.js; the first is shown on the card
tags: [Vegetarian, Gluten free, Swedish]   # keys from recipeTagLabels in src/recipes.js
time: 35                            # total minutes, for "Under 20 min"; leave out when it isn't one number
timeLabel: 35 min                   # shown on the card
facts:                              # the boxes under the description, in this order
  Förberedelse: 15 min
  Portioner: '4'
  Nivå: Nybörjare
beforeYouStart: …                   # optional, the "Bra att veta." box
pantryKeys: [potatis, lok, rodbetor, agg]  # the main ingredients for fridge matching (keys from foods.json)
ingredients:
  - title: Pytt                     # groups are optional: without titles, list the items directly
    items:
      - name: 800 g kokt, kall potatis
        key: potatis                # links the ingredient to foods.json for matching
      - name: 1 tsk salt
        basic: true                 # always assumed at home
      - name: Byt honungen mot ljus sirap.
        note: true                  # a note line, not an ingredient
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

**Checks:** the build stops with a message naming the file when a category, tag label or ingredient key is unknown, when required fields are missing, when `image` or `cardImage` points to a file that doesn't exist, or when the text has something the page can't show (with the line number). A new tag needs its Swedish label in `recipeTagLabels` first; a new ingredient key needs an entry in `foods.json`.

**Collections** (`eleventy.config.js`):
- `recipes`: all recipes in id order.
- `recipeCategories`: food categories with recipes.
- `recipeTypes`: Mat, Hemmaspa & behandlingar, Hushåll & städ, Husdjur. The type follows from the categories: `spa`, `household` or `pets`, otherwise food.
- `recipeTags`: every tag, sorted by Swedish label. Tag pages count implied tags as the archive does, so Vegetariskt includes the vegan recipes.
- Eleventy also makes a collection per raw tag from `tags`, e.g. `collections.Vegan`.

**Pages:** how visitors and search engines reach the new pages:
- The archive intro links to the Mat page ("gå direkt till en kategori"). The Mat page and every category page have a row of links to all categories.
- The three section headings on Mer än mat link to their type pages. `mer-an-mat.njk` renders those sections from `collections.recipeTypes`, so the label, icon and intro come from `lib/taxonomy.js`.
- Each recipe page links its categories (in the line above the title) and its tags to their pages.
- The header and footer don't link to them.

The home page, archive and Mer än mat draw their recipe cards with JavaScript, so without it the category and type pages are the only links to the recipe pages. Following plain links from `index.html` reaches all 233 pages. On phones the row of 17 category links fills most of the first screen (compare item 11). The cards on these pages are rendered at build time with the same markup as `archiveCard()` in `app.js`, so change both together; `app.js` then shows which hearts are saved.

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

**Taxonomy:**
- **`meals`:** categories, meaning dish type only. The first one is shown on the card. Recipe files call them `categories`; the recipe index and the browser code call them `meals`.
- **Tags:** diet, cuisine, occasion and practical attributes.
- **Diet tags:** food only. `Vegan` implies `Vegetarian`, `Dairy free` and `Egg free` through `hasTag()`, so vegan recipes don't carry those three.
- **Quick:** the "Under 20 min" button uses `recipe.time` (under 20 minutes). There is no quick category or tag.

**Icons:** they are lossless WebP, under `src/` (paths below are as served):
- `assets/icons/square/*.webp` at 128px.
- `assets/icons/fitted/*.webp` at 160px. The fridge picture is 480px.
- `assets/icons/favicon.png`.

The original SVGs are still in the same folders but nothing loads them; they are item 18 cleanup. The previous chat converted them with a one-off script: Chrome canvas via playwright-core, then `cwebp -lossless -z 9`. That script was never added to the project, so a new icon needs the conversion redone.

**Small UI icons** come from Font Awesome, not WebP: arrows, chevrons, close and remove buttons, and the save heart. The colourful icons stay WebP.
- **Markup:** `<i class="fas fa-arrow-left" aria-hidden="true"></i>`. `fas` is bold, `far` regular. Arrows, chevrons and close buttons are bold, because it matches the label font's strokes. The save heart is `far` (outline) when not saved and `fas` (filled) when saved. In `app.js` and `kitchen.js`, use `faIcon(name, weight)`.
- **Icons in use:** `arrow-left` (back links), `arrow-up-right` (the ↗ links), `arrow-up` (home page footer), `chevron-down` (`<details>` summaries; it turns over when open), `xmark`, `heart`, and on a recipe's ingredients `plus` (grey: add to the shopping list) and `check` (once it's on the list), both bold. The boxes under a recipe's description (`recipe.njk`) have one per label: Förberedelse `knife-kitchen`, Tillagning `fire-flame-curved`, Portioner `utensils`, Nivå `signal-bars`, Räcker till `jar`, Verkningstid `hourglass-half`.
- **`src/icons.css` is generated** by `node tools/icons.mjs`. The script cuts both fonts down to the listed icons (2.9 KB, inlined) from the full font in `fa/`, which is about 640 KB. To add an icon, add its name to the list in the script, run it and commit `src/icons.css`. It needs `fa/` and `pyftsubset` (`pip install fonttools brotli`).
- **`fa/` is in `.gitignore`:** it's the full Font Awesome Pro font, and the repo is public.

## Testing setup that worked

- **Serve the site:** `npx @11ty/eleventy --serve --port 8765` in the project root, run in the background, then test with the Playwright MCP tools.
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
   - The owner chose to skip portion scaling: amounts are written inside the ingredient text, so scaling would need the data restructured.
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
   - To make room, the desktop menu dropped its icons. Below 1200px the Sparat and Inköpslista buttons show icon and count only. Below 960px the menu gets its own row. Below 520px "Så funkar det" is hidden.
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
- **New pages reachable:** the archive intro links to the Mat page and its category row, and the Mer än mat headings link to the three type pages (see "Pages" under "Recipes"). The owner left the choice and the copy to me. The build output changed only in `receptarkiv.html`, `mer-an-mat.html` and `kitchen.css`.

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
    - The "Demoköket" sticker is still in the header (now only in `src/_includes/base.njk`), and the archive back link reads "Till demoköket" (`src/receptarkiv.njk`). They make the site look like a prototype.
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
    - `assets/dish-*.svg`, `assets/doodle-*.svg`, `assets/chefs-hat.svg`
    - the Rubik files, unless item 15 switches to Rubik
    - all `*.svg` icons under `assets/icons/square` (63) and `assets/icons/fitted` (13), replaced by WebP
    - some WebP icons that nothing references
    - 3 `.DS_Store` files

    Check references with grep before deleting anything; remember the templates and the recipe files in `src/` too. `.DS_Store` files are in git; they never reach `_site/`.
19. **Code structure.**
    - The four scripts depend on each other's global variables.
    - `styles.css` is minified onto single lines and `kitchen.css` overrides it.
    - Move to JavaScript modules and one readable stylesheet.
    - ~~Generate the header from one source.~~ **Done** with the Eleventy layout.
20. **Link previews and home-screen icon.**
    - Recipe pages have OG tags. `og:image` and canonical links only appear once the address in `src/_data/site.js` is set.
    - The OG tags are in `src/_includes/base.njk`, which renders them only for recipe pages. The home page, archive, Mer än mat and the category, type and tag pages have none yet.
    - There's no `apple-touch-icon`. It would go in `base.njk`.

## Suggested next steps

Recommended after the new pages were made reachable. The owner still picks; 15 is the owner's decision.

1. **Item 11, with the category row on the new pages.** On phones the archive filters and the row of 17 category links on the Mat and category pages both fill the first screen. Solve them together.
2. **Item 12, the recipe data errors.** Three recipes give a different time in the description than on the card. Each fix is a one-line edit in that recipe's file in `src/recept/`.
3. **Item 20, once the owner knows the site address.** Setting it in `src/_data/site.js` turns on `sitemap.xml`, canonical links and share images. Every page other than the recipe pages still needs share tags.

Items 10 and 13 are small and can go in alongside any of these. Item 10 now means removing `.open-recipe` from both copies of the card (`app.js` and `src/_includes/recipe-card.njk`).

## Deploy note for the owner

There's no deploy step in the repo. Run `npm run build` and upload everything in `_site/`. A host that builds from GitHub, such as Netlify or Cloudflare Pages, could do this instead, with build command `npm run build` and output folder `_site`.
