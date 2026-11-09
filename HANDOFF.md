# Restfest – handoff

Restfest is a Swedish recipe site built around "Vad blir det till middag?" (what's for dinner?). You type what's in your fridge and it suggests dinners from a recipe archive. It's a static site with no framework and no dependencies. ChatGPT Sites originally generated it. A previous chat reviewed it and listed 20 issues, P0 to P3. Items 1–8 are done. Items 9–20 remain.

**How the owner likes to work:** they pick items by number ("Do 7", "Continue with 6 and 8"). Don't start the next item until asked. Ask before content or product decisions, and give a recommended option. Reply in English; all site copy is Swedish. When a batch is done, summarise it in plain language: what changed, what was verified, what to deploy and any caveats.

**The project isn't under git.** Item 16 recommends setting it up, ideally before any further changes. There's nothing to roll back to.

## How the site works

| File | Role |
|---|---|
| `index.html` | Home page: the fridge list (`kitchen.js`) and the dinner suggestion |
| `receptarkiv.html` | Recipe archive with search and filters, food only |
| `mer-an-mat.html` | "Mer än mat": spa, cleaning and pet recipes, in three sections |
| `recept/<id>.html` | One generated page per recipe (135 in total). **Generated, don't edit** |
| `recipe-collection.js` | **The recipe source data.** `collectionFoods` and `collectionRecipes`, written as JSON in a JS file |
| `data/recipe-index.js` | **Generated** slim index for the home page and archive: no amounts and no instructions |
| `recipes.js` | Taxonomy and helpers: `foodGroups`, `mealTypes`, `mealName()`, `nonFoodMeals`, `isFood()`, `dietTags`, `impliedTags`, `allTags()`, `hasTag()`, `recipeTagLabels`, `foods` with extra aliases |
| `app.js` | Shared code: saving, shopping list, archive rendering and filters, Mer än mat grids, ingredient matching, the recipe pop-up |
| `kitchen.js` | Home page only: the fridge list, unknown-ingredient suggestions, the best match and three more |
| `styles.css` | Minified original styles, much of it dead (item 17) |
| `kitchen.css` | Everything newer. It overrides `styles.css` |
| `tools/build.mjs` | Build script. Generates `data/recipe-index.js` and `recept/*.html`, plus `sitemap.xml` when `SITE_URL` is set |

- **Scripts:** they are plain scripts sharing one global scope, loaded in this order: `data/recipe-index.js` → `recipes.js` → `app.js` → `kitchen.js` (home page only).
- **localStorage keys:** `restfest-pantry`, `restfest-saved`, `restfest-shopping-list`.

**Build:** run `node tools/build.mjs` after editing any of these:
- `recipe-collection.js`
- `recipes.js`
- the build script itself
- the header, footer or shopping dialog in `receptarkiv.html`. Recipe pages copy theirs from there and add `../` to the paths.

`SITE_URL` at the top of the build script is empty. Setting it adds canonical links, `og:image` and `sitemap.xml`.

**The header exists in three hand-written copies:** `index.html`, `receptarkiv.html` and `mer-an-mat.html`. Change all three, then rebuild.

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
- **`meals`:** categories, meaning dish type only. The first one is shown on the card.
- **Tags:** diet, cuisine, occasion and practical attributes.
- **Diet tags:** food only. `Vegan` implies `Vegetarian`, `Dairy free` and `Egg free` through `hasTag()`, so vegan recipes don't carry those three.
- **Quick:** the "Under 20 min" button uses `recipe.time` (under 20 minutes). There is no quick category or tag.

**Icons:** they are lossless WebP:
- `assets/icons/square/*.webp` at 128px.
- `assets/icons/fitted/*.webp` at 160px. The fridge picture is 480px.
- `assets/icons/favicon.png`.

The original SVGs are still in the same folders but nothing loads them; they are item 18 cleanup. The previous chat converted them with a one-off script: Chrome canvas via playwright-core, then `cwebp -lossless -z 9`. That script was never added to the project, so a new icon needs the conversion redone.

## Testing setup that worked

- **Serve the site:** `python3 -m http.server 8765` in the project root, then test with the Playwright MCP tools.
- **Browser cache gotcha:** the Python server sends no cache headers, so the browser keeps stale CSS, JS and HTML. Before reloading, refresh them with `fetch(path, {cache: 'reload'})`, or add `?t=…` to the address. Real visitors could hit the same problem after a deploy, so a host setting that makes browsers always check HTML for a newer version is worth recommending.
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

**Content caveat to pass on:** Chokladtryfflar and Banansoftis are tagged gluten-free but use oat cream or oat drink. Röd linssoppa and Chili sin carne have oat yoghurt as an optional topping. They're only gluten-free with products labelled "glutenfri". The owner has been told; nothing was changed.

## Remaining items (9–20), with current status

**P2 – Accessibility and polish**

9. **Tiny text.**
   - On the phone archive, about 400 pieces of text are 9px and about 400 more are 11px, often in the monospace label font.
   - Aim for 12–13px minimum, and keep the monospace font for short labels.
   - Not started. Card tag chips are 9–10px (`.ingredient-chips span`), and the pop-up checklist text is 10px.
10. **Duplicate buttons on cards.**
    - Each archive card has a title link, a "Visa recept"/"Visa behandling" link (`.open-recipe`) going to the same place, and a heart. That's about 405 Tab stops in the archive.
    - The whole card is already clickable through the title link's `::after` overlay, so remove `.open-recipe` from `archiveCard()` in `app.js`.
    - Not started.
11. **Phone archive filters fill the first screen.** Collapse them behind one "Filter" button that shows how many filters are active. Not started; the Kost row added in item 7 sits inside "Fler filter".
12. **Recipe data errors.**
    - Three descriptions give a different time than the card label. For example, Pasta aglio e olio says "15 minuter" but the card says 20 min. **Still open.**
    - Rödlök counted as two ingredients. **Fixed.**
    - Sorting with recipes that have no time. **Fixed in home page matching.** The archive doesn't sort by time.
    - Some `time` values are odd, for example Allrengöringsspray is 20171 minutes ("1–2 veckor"). They only affect the "Under 20 min" filter.
13. **Outdated text.**
    - The home page meta description is **fixed**.
    - The "Demoköket" sticker is still in all three headers, and the archive back link reads "Till demoköket". They make the site look like a prototype.
    - Removing the sticker frees about 80px in the header, which would also allow the desktop menu icons back.
14. **Screen readers.**
    - The saved-recipes count in the header isn't announced.
    - The "↑" in the home page footer (`Till kylskåpet <span>↑</span>` in `index.html`) is read aloud: add `aria-hidden="true"` (other pages already have it).
    - Not started.
15. **Font licence – the owner's decision.**
    - GT Maru (`assets/GTMaru*.woff2`) is a paid font; the owner needs to confirm they have a web licence.
    - Rubik (`assets/rubik-*.ttf`, open licence) is there but unused.

**P3 – Cleanup**

16. **Put the project under git.** Do this first.
17. **Unused code.**
    - The swap feature is dead because no recipe has `swap`, `tip` or `chips`. Its code is in `app.js` (`matchRecipe` swap logic), `kitchen.js` (`match.swap` lines), `tools/build.mjs` (the index fields `chips`/`category`/`swap` and `recipe.tip`), `kitchen.css` (`.cook-swap`) and `archiveCard()` (`recipe.category`, `recipe.chips`).
    - About half of `styles.css` styles things that no longer exist: `.example-preview`, `.recipe-card`, `.result-notice`, `.small-tip`, `.dropzone`, `.servings` and more.
18. **Unused files:**
    - `assets/bowl.jpg`, `assets/pasta.jpg`
    - `assets/dish-*.svg`, `assets/doodle-*.svg`, `assets/chefs-hat.svg`
    - the Rubik files, unless item 15 switches to Rubik
    - all `*.svg` icons under `assets/icons/square` (63) and `assets/icons/fitted` (13), replaced by WebP
    - some WebP icons that nothing references
    - 3 `.DS_Store` files

    Check references with grep before deleting anything. `recipe-collection.js` looks unused by the pages but **must stay**: it's the source data for the build.
19. **Code structure.**
    - The four scripts depend on each other's global variables.
    - `styles.css` is minified onto single lines and `kitchen.css` overrides it.
    - Move to JavaScript modules and one readable stylesheet.
    - Also consider generating the header from one source; it's in three hand-written copies plus the recipe pages.
20. **Link previews and home-screen icon.**
    - Recipe pages have OG tags. `og:image` and canonical links only appear once `SITE_URL` is set.
    - `index.html`, `receptarkiv.html` and `mer-an-mat.html` have no OG tags.
    - There's no `apple-touch-icon`.

**Previously suggested order:** 16 first, then the rest. 15 is the owner's decision.

## Deploy note for the owner

There's no deploy step in the repo. After changes, upload the changed files plus the regenerated `data/` and `recept/`. Upload `mer-an-mat.html` too if it hasn't gone up yet.
