# GT Maru and GT Maru Mono in Ofta bra efter

Researched 10 November 2026 against Grilli Type's sources and the actual version 2.000 font files in `src/assets/fonts/`. The axis coordinates and feature inventories below were read from those files with fontTools; recheck them if the font files are replaced.

## Design and roles

Thierry Blancpain designed GT Maru around rounded Latin lettering on Japanese wayfinding signs. Rounded terminals, monolinear strokes, and short ascenders and descenders give it its compact character. Mono translates that design into a square rhythm: its character advance equals its capital height. These are Latin fonts inspired by Japanese signage; that origin does not imply Japanese character coverage. See the [design story](https://www.gt-maru.com/) and [family overview](https://www.grillitype.com/typeface/gt-maru).

For Ofta bra efter, proportional Maru handles prose, recipe titles, headings, and ordinary controls. Mono supplies the existing short labels, metadata, badges, and counters. Its wide cells need room: a character advances 1440/2048 em, about 8.44px at 12px. Keep long passages proportional and avoid tightening Mono to squeeze in long labels. This is a project recommendation, not a foundry rule.

The family also contains Mega and Emoji. They are separate designs and are not installed here. The minisite's optical-size controls and outline/shaded/glow effects belong to Mega. Neither Maru nor Mono has those axes or effects.

## Weight coordinates: the migration trap

Both installed variable fonts expose the same named instances:

| Named style | Old static CSS weight | Variable `wght` coordinate |
| --- | ---: | ---: |
| Light | 300 | 300 |
| Regular | 400 | **437** |
| Medium | 500 | **600** |
| Bold | 700 | **728** |
| Black | 900 | 900 |

The variable range is **300–900**, with a file default of **300**. There is no `avar` remapping table. Every value within that range is available, including fractional values. CSS `font-weight: normal` requests 400; it does not select the instance called Regular. Likewise, `font-weight: 500` is an intermediate design, not the named Medium.

This explains why reusing static weight numbers can make a variable-font migration look too light. The site's weight tokens are:

```css
--font-weight-regular: 437;
--font-weight-body: 500;
--font-weight-medium: 600;
--font-weight-bold: 728;
--font-weight-black: 900;
```

Body 500 is a deliberate increase above the named Regular, while staying below Medium. Inherited label text also receives this baseline. Explicit Medium, Bold, and Black styles use their named coordinates, including weights inside `font` shorthands. Bare `font: 12px ...` shorthands previously reset weight to 400; those now specify the body token.

Use `font-weight` to control weight. An inherited `font-variation-settings: "wght" ...` can override descendant weight rules and break the hierarchy. Prefer these tokens over `bold` and `bolder`, which do not know this font's named coordinates. Headings and semantic bold text receive the Bold token explicitly.

Maru's advance widths vary slightly with weight. Mono's ordinary letters, digits, and spaces retain their 1440-unit cells. Weight changes in proportional text can therefore affect wrapping; check actual page widths after tuning.

## Upright, oblique, and CSS italic

Both files have a **`slnt` axis from 0 to +7**, default 0, and no `ital` axis. Their Oblique instances combine each named weight with `slnt: 7`.

There is a second quirk: these files draw a right-leaning design at **positive** `slnt`. CSS normally maps positive oblique angles to negative OpenType slant coordinates. A plain `font-style: italic` or `oblique 7deg` must not be assumed to reach the intended instance in these particular files.

The CSS registers upright and italic faces for each family, reusing the same VF URLs. Each italic face pins `"slnt" 7` in its `@font-face` descriptor. This lets semantic `<em>` and ordinary `font-style: italic` select the supplied Oblique design at any weight. It does not create a separate cursive italic design. `font-synthesis: none` prevents artificial bold and slant.

For a future deliberately partial slant, use a scoped rule such as:

```css
.expressive-heading {
  font-weight: var(--font-weight-bold);
  font-variation-settings: "slnt" 3.5;
}
```

Only the slant is set at low level, leaving weight under normal CSS control. Reset it with `"slnt" 0` or `font-variation-settings: normal` when needed; a parent's explicit variation settings inherit. The [CSS Fonts specification](https://www.w3.org/TR/css-fonts-4/#font-variation-settings-def) explains axis mapping and precedence.

## OpenType features actually present

The installed fonts share these GSUB tags: `aalt`, `case`, `ccmp`, `dnom`, `frac`, `liga`, `locl`, `numr`, `ordn`, `rclt`, `sinf`, `ss01`, `ss02`, `subs`, `sups`, and `zero`. Maru additionally contains `pnum` and `tnum`. Both contain the GPOS tags `kern`, `mark`, and `mkmk`.

| Feature | What it does here | Appropriate use |
| --- | --- | --- |
| `ss01` | Single-story **a and g** in both Maru and Mono, including relevant accented forms such as å and ä | Optional, scoped brand or display treatment |
| `ss02` | Alternate `!` and `¡` in both fonts | Optional expressive punctuation |
| `case` | Capital-height punctuation and related forms | Short all-capital labels |
| `tnum` / `pnum` | Tabular / proportional digits in Maru | Tabular for changing or aligned numbers; proportional for prose |
| `zero` | Slashed zero in both fonts | Codes or identifiers where 0/O ambiguity matters |
| `frac`, `numr`, `dnom` | Fraction construction | Isolated ingredient fractions |
| `sups`, `subs`, `sinf`, `ordn` | Superior, inferior, and ordinal forms | Suitable notation, using supported glyphs |
| `liga`, `rclt`, `locl`, `ccmp` | Ligatures, contextual/localized forms, and composition | Preserve normal shaping |
| `kern`, `mark`, `mkmk` | Pair positioning and combining-mark placement | Preserve normal shaping |

Examples for future component styles:

```css
/* An optional display decision; not enabled across the site. */
.brand-treatment { font-feature-settings: "ss01" 1; }

/* Apply only to an all-capital label. */
.uppercase-label { font-feature-settings: "case" 1; }

/* Useful in proportional Maru; Mono digits already have equal advances. */
.numeric-counter { font-variant-numeric: tabular-nums; }

/* Wrap just the fraction, e.g. <span class="fraction">1/2</span> dl. */
.fraction { font-variant-numeric: diagonal-fractions; }

.reference-code { font-variant-numeric: slashed-zero; }
```

Keep fractions scoped: globally enabling them can reinterpret unrelated slash-separated numbers. Use semantic numeric properties when available. Feature-setting lists replace one another, so a component needing both alternates must list both: `"ss01" 1, "ss02" 1`. Default alternates remain unchanged in Ofta bra efter pending visual evaluation.

The purchase page also lists features from Mega. Its alternate `l` and `ss03`–`ss08` effects are not features of these two installed fonts. Both fonts here use `ss01` for a **and** g and `ss02` for exclamation marks. The [foundry's specimen PDF](https://www.grillitype.com/api/storage/app/uploads/public/60d/347/abd/60d347abd7499952514160.pdf) separates the subfamilies' feature examples.

## Language, proportions, and spacing

Both files contain ÅÄÖåäö, é, combining marks, typographic quotation marks, en/em dashes, the mathematical minus, degree sign, multiplication sign, and fractions including ¼, ½, ¾, ⅓, and ⅔. Keep the document's `lang="sv"` so browser language behavior follows the Swedish content. Glyph presence alone is not proof of complete support for another language.

Both fonts use 2048 units per em, a capital height of 1440, and an x-height of 1100. Their matching proportions make mixed Maru/Mono lines practical without a separate scale correction. Short ascenders and descenders do not remove the need for breathing room around accents and multiple lines.

The existing body line-height remains 1.5, with longer recipe directions at 1.6. Start body text with normal tracking; assess existing negative heading tracking at actual sizes before tightening it further. Keep Mono's tracking near normal when its grid rhythm matters. Avoid global stylistic alternates, slashed zeros, forced fractions, or exaggerated spacing: apply features where they serve the content.

Neither file contains `opsz`, `wdth`, or `GRAD`. `font-optical-sizing: auto` cannot improve these fonts, `font-stretch` cannot interpolate their width, and weight cannot be adjusted through a grade axis. Choose weight, font size, line-height, and spacing directly.

## Loading and verification

`src/css/styles.css` registers only the VF files for these family names. The original static files remain on disk, but are not registered as competing faces. WOFF2 is first, followed by the supplied variable WOFF fallback. The WOFF2 files total **179,684 bytes** (about 175.5 KiB): Maru 94,368 and Mono 85,316.

The shared layout preloads both WOFF2 URLs from `assets/fonts/`, including the `base` prefix on nested pages, with `crossorigin` to match font requests. `font-display: swap` keeps text available while loading. The obsolete preload pointed outside the fonts directory at a removed static file.

After changing fonts or weights, verify the home page, archive, a long recipe, a category/tag page, and the recipe dialog. In browser developer tools, confirm the rendered font and successful VF requests; a computed family name alone does not prove which face rendered. Check mobile widths, Swedish accents, emphasis, long labels, and recipe fractions. This session verified font metadata/outlines, the build, and font URLs; browser visual verification was unavailable.
