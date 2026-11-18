# Ofta bra efter

**Rädda resterna.** A Swedish recipe site for making dinner from what is already in the fridge.

[oftabraefter.se](https://oftabraefter.se)

Enter ingredients, find matching recipes, save favourites and plan the week. The archive also includes drinks, baking, pantry recipes and **Mer än mat**: home spa, cleaning, pet treats and gardening ideas for things left over.

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

## Commands

| Command | What it does |
| --- | --- |
| `npm start` | Starts the local Eleventy server. |
| `npm run build` | Deletes `_site/` and builds a fresh copy of the website there. |
| `npm test` | Runs the Node test suite, including builds with and without accounts. |
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

## Project structure

| Path | Contents |
| --- | --- |
| [src/pages/](src/pages/) | Page templates, listing pages, sitemap and generated browser-data templates. |
| [src/recept/](src/recept/) | One Markdown file per archive recipe. |
| [src/_includes/](src/_includes/) | Shared layouts, recipe cards, account navigation and shopping-list markup. |
| [src/_data/](src/_data/) | Site settings, Supabase settings and the food catalogue. |
| [src/js/](src/js/) | Browser behaviour and the shared taxonomy in `recipes.js`. |
| [src/css/](src/css/) | Fonts, design tokens, page styles, dark theme and UI icons. |
| [src/assets/](src/assets/) | Recipe photos, illustrations, icons, fonts and the sharing image. |
| [lib/](lib/) | Build-time recipe validation and parsing, plus helpers shared with browser code. |
| [supabase/](supabase/) | Database migrations, Edge Functions, photo references and auth-email templates. |
| [tools/](tools/) | Data generation, recipe promotion and backend test helpers. |
| [test/](test/) | Automated tests. |
| [design/](design/) | Design source files, outside the published site. |
| `_site/` | Generated website. Ignored by Git; do not edit it directly. |

[eleventy.config.js](eleventy.config.js) defines collections, copied assets and the `src/` → `_site/` build. Templates set explicit permalinks, so the `pages/` folder does not appear in public URLs.

## Add or edit recipes

1. Copy a similar recipe in `src/recept/` and give a new recipe the next unused numeric filename prefix, followed by a short slug.
2. Edit its YAML front matter: title, publication date (`YYYY-MM-DD`), description, image paths, alt text, categories, tags, time label and ingredients. Set `time` to a number of minutes when applicable.
3. Put its photos in `src/assets/recipes/`. Both `image` and `cardImage` are paths relative to `src/` and must point to existing files; they can use the same photo.
4. Write the instructions as numbered Markdown steps. Optional `###` headings group steps; `##` headings introduce extra sections with bullet lists. A paragraph starting with bold text becomes a tip.
5. Preview the page, regenerate Supabase data if needed, then run the build and tests.

**Keep existing recipe filenames unchanged.** Their IDs are used in public URLs, saved recipes and shopping lists.

Ingredient keys come from [src/_data/foods.json](src/_data/foods.json), with browser aliases and additions in [src/js/recipes.js](src/js/recipes.js). That script also defines `mealTypes`, `recipeTagLabels` and diet rules. [lib/taxonomy.js](lib/taxonomy.js) loads the same definitions for the build and supplies type-page details.

`pantryKeys` identifies the main ingredients used for fridge matching. Ingredient entries can have a `key`, `basic: true` for assumed pantry staples, `tool: true` for equipment whose amount should not scale, or `note: true` for a note line. Ingredients can be a plain list or titled groups. Yield information belongs in `facts`, which also supplies the recipe page's information boxes.

Non-food recipes use exactly one category: `spa`, `household`, `pets` or `garden`. They appear under **Mer än mat** and stay out of dinner matching and food-recipe structured data.

The build reports missing fields, unknown categories, tags or ingredient keys, missing images and unsupported Markdown. It checks the data format; recipes still need editorial review. See [Recipes in HANDOFF.md](HANDOFF.md#recipes) for the full front-matter example and content conventions.

### Add a generated recipe to the archive

Once a generated recipe has a finished photo:

```sh
npm run promote -- "<recipe-uuid-or-url>"
```

Replace the argument with its UUID or full `nytt-recept.html?id=…` URL. The script fetches the recipe, assigns the next number and today's Stockholm date, and saves the Markdown and photo locally. Review both before publishing.

The script optionally reads `SUPABASE_SECRET_KEY` from the local, ignored `.env` file. With that key, it also marks the stored recipe as promoted so its generated page links to the archive version. Without it, the script explains how to set `promoted_as` manually.

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

Provider credentials belong in Supabase secrets, not browser files. The publishable browser key is public; access is controlled by database policies and function checks. Database migrations, authentication redirects, Google sign-in and email delivery need separate backend setup. See [HANDOFF.md](HANDOFF.md) for the setup and migration-history notes, and [supabase/templates/README.md](supabase/templates/README.md) for the Swedish auth-email templates.

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

Tests cover ingredient matching, recipe parsing, preferences, shopping-list grouping and sync, offline behaviour and account-dependent builds. Backend and browser checks are described in [HANDOFF.md](HANDOFF.md). Automated checks do not replace testing real sign-ins, fridge photos and generated recipes against the configured backend.

If a preview stays stale after changing `lib/` or `eleventy.config.js`, restart `npm start`. For stale CSS or browser scripts, reload without the browser cache.

## Publish

Build the site and upload **the contents of `_site/`** to the web root. For a host that builds from Git:

| Setting | Value |
| --- | --- |
| Node.js | `24` |
| Build command | `npm run build` |
| Publish directory | `_site` |

Preserve the generated directories and `.html` URLs. The frontend is static; it does not need an application server or a catch-all SPA rewrite. Backend changes require their own Supabase migration or function deployment and are not published by the Eleventy build.

## Further notes and licence

[HANDOFF.md](HANDOFF.md) records architecture decisions, detailed setup, known issues and previous verification. Check dated deployment notes against the current backend before applying changes.

Project code is licensed under the [MIT licence](LICENSE). Bundled commercial typefaces have separate licensing terms.
