# Typography guidelines

Three typefaces from Schick Toikka, one role each.

| Role | Typeface | Used for |
|---|---|---|
| Display | **Trio Grotesk** | Headlines, section titles, product names, pull quotes, large numbers |
| Body | **Spot Grotesk** | Running text, lead paragraphs, navigation, buttons, form fields |
| Labels | **Spot Semi** | Eyebrows, metadata, captions, tags, prices, small UI labels |

"Spot Semi" is our name for **Spot Semi Mono**. The files keep their original names (`SpotSemiMono-*.otf`), but in CSS the family is registered as `"Spot Semi"`.

Spot Grotesk and Spot Semi come from the same family, so body text and labels match closely. Trio Grotesk gives the headlines a separate voice.

---

## 1. The typefaces

### Trio Grotesk (display)

A revival of Kaart Antieke, a small formal sans published by Lettergieterij Amsterdam in 1909. Schick Toikka drew it from printed specimens, and it keeps traces of letterpress: soft stroke endings and junctions, a wide stance, loose spacing and a large lowercase. Those traits were made for small sizes. At display sizes the loose spacing needs to be tightened (see [Tracking](#4-tracking)).

- Weights: Regular 400, Medium 500, Bold 700, each with an italic
- Main use: **Bold 700** for headlines, **Medium 500** as a quieter alternative

### Spot Grotesk (body)

- Weights: Light 300, Regular 400, Medium 500, Bold 700, each with an italic
- Main use: **Regular 400** for text, **Medium 500** for buttons and UI emphasis, *Italic* for emphasis inside text

### Spot Semi (labels)

A semi-monospaced cut of Spot. Letters keep some of the rhythm of a monospace without fixed widths, so it reads more naturally than a full mono at small sizes.

- Weights: Light 300, Regular 400, Medium 500, Bold 700, each with an italic
- Main use: **Regular 400**, usually in all caps at 12px

> Spot Semi is **not** fixed-width. Don't use it for code blocks or for columns of figures that must line up character by character.

---

## 2. Loading the fonts

### Files

Convert the desktop `.otf` files to `.woff2` for the web. Check that your Schick Toikka license covers web embedding; desktop and web licenses are often sold separately.

Suggested structure:

```
/fonts/
  TrioGrotesk-Regular.woff2        TrioGrotesk-Italic.woff2
  TrioGrotesk-Medium.woff2         TrioGrotesk-MediumItalic.woff2
  TrioGrotesk-Bold.woff2           TrioGrotesk-BoldItalic.woff2
  SpotGrotesk-Regular.woff2        SpotGrotesk-RegularItalic.woff2
  SpotGrotesk-Medium.woff2         SpotGrotesk-MediumItalic.woff2
  SpotGrotesk-Bold.woff2           SpotGrotesk-BoldItalic.woff2
  SpotSemiMono-Regular.woff2       SpotSemiMono-Medium.woff2
```

Only ship the weights you use. The set above covers everything in this guide. Spot Grotesk Light and the Spot Semi italics are optional.

### @font-face

```css
/* Trio Grotesk — display */
@font-face { font-family: "Trio Grotesk"; src: url("/fonts/TrioGrotesk-Regular.woff2") format("woff2"); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: "Trio Grotesk"; src: url("/fonts/TrioGrotesk-Italic.woff2") format("woff2"); font-weight: 400; font-style: italic; font-display: swap; }
@font-face { font-family: "Trio Grotesk"; src: url("/fonts/TrioGrotesk-Medium.woff2") format("woff2"); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: "Trio Grotesk"; src: url("/fonts/TrioGrotesk-MediumItalic.woff2") format("woff2"); font-weight: 500; font-style: italic; font-display: swap; }
@font-face { font-family: "Trio Grotesk"; src: url("/fonts/TrioGrotesk-Bold.woff2") format("woff2"); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: "Trio Grotesk"; src: url("/fonts/TrioGrotesk-BoldItalic.woff2") format("woff2"); font-weight: 700; font-style: italic; font-display: swap; }

/* Spot Grotesk — body */
@font-face { font-family: "Spot Grotesk"; src: url("/fonts/SpotGrotesk-Regular.woff2") format("woff2"); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: "Spot Grotesk"; src: url("/fonts/SpotGrotesk-RegularItalic.woff2") format("woff2"); font-weight: 400; font-style: italic; font-display: swap; }
@font-face { font-family: "Spot Grotesk"; src: url("/fonts/SpotGrotesk-Medium.woff2") format("woff2"); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: "Spot Grotesk"; src: url("/fonts/SpotGrotesk-MediumItalic.woff2") format("woff2"); font-weight: 500; font-style: italic; font-display: swap; }
@font-face { font-family: "Spot Grotesk"; src: url("/fonts/SpotGrotesk-Bold.woff2") format("woff2"); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: "Spot Grotesk"; src: url("/fonts/SpotGrotesk-BoldItalic.woff2") format("woff2"); font-weight: 700; font-style: italic; font-display: swap; }

/* Spot Semi (Spot Semi Mono) — labels */
@font-face { font-family: "Spot Semi"; src: url("/fonts/SpotSemiMono-Regular.woff2") format("woff2"); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: "Spot Semi"; src: url("/fonts/SpotSemiMono-Medium.woff2") format("woff2"); font-weight: 500; font-style: normal; font-display: swap; }
```

### Preload

Preload only the files that render above the fold, usually one per role:

```html
<link rel="preload" href="/fonts/TrioGrotesk-Bold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/SpotGrotesk-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/SpotSemiMono-Regular.woff2" as="font" type="font/woff2" crossorigin>
```

---

## 3. Base settings

```css
:root {
  /* Families */
  --font-display: "Trio Grotesk", system-ui, sans-serif;
  --font-body:    "Spot Grotesk", system-ui, sans-serif;
  --font-label:   "Spot Semi", ui-monospace, monospace;

  /* Tracking (see section 4) */
  --track-display-lg: -0.045em;   /* Trio ≥ 36px */
  --track-display-sm: -0.0225em;  /* Trio 20–32px */
  --track-label:       0.08em;    /* Spot Semi, all caps */

  /* Body size */
  --text-base: 17px;
}

html {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.6;
  font-kerning: normal;
  font-feature-settings: "kern";
  font-synthesis: none;            /* never fake bold or italic */
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
```

`font-synthesis: none` matters here. Every weight and italic you use should be a real font file. If a style is missing, the browser shows the nearest real style instead of a smeared fake.

---

## 4. Tracking

Trio Grotesk was drawn for small type, with loose spacing, so it needs **negative tracking at display sizes**. Tighten more as the size grows.

| Trio Grotesk size | Letter-spacing |
|---|---|
| 36px and up (hero, page titles, article titles) | `-0.045em` |
| 20–32px (H3, card titles, spec values, wordmark) | `-0.0225em` |
| Below 20px | `0` (avoid Trio this small; use Spot Grotesk) |
| All caps, any size | `0` and turn on `"case"` |

Spot Grotesk body text uses the default spacing (`letter-spacing: 0`).

Spot Semi labels in all caps get `+0.08em`. Sentence-case Spot Semi at 13–14px needs no tracking.

---

## 5. OpenType features

These are taken from the font files themselves.

### Trio Grotesk

| Feature | What it does | Use |
|---|---|---|
| `kern` | Kerning | Always on |
| `liga` | Standard ligatures (fi, fl) | On (browser default) |
| `case` | Case-sensitive forms: raises `( ) [ ] { } - – — / \ « » ‹ › ¡ ¿` to cap height | On for **all-caps** headings |
| `cpsp` | Capital spacing: adds spacing for all-caps text | Optional for all caps. Use it *or* manual tracking, not both |
| `tnum` | Tabular figures | Tables, prices or counters set in Trio that must align |
| `frac`, `sups`, `subs`, `sinf`, `numr`, `dnom`, `ordn` | Fractions, superscripts/subscripts, ordinals | As needed in content |
| `dlig` | Discretionary ligature on I/Í (the Dutch IJ) | Off unless you set Dutch |
| `ss01` / `salt` | Circled numerals ① ② ③ | **Off** for normal text. Can be used on purpose for step numbers |

> Don't turn on `ss01` or `salt` globally on Trio. They replace every digit with a circled numeral, so "8 HP" would render with a circled 8.

### Spot Grotesk and Spot Semi

| Feature | What it does | Use |
|---|---|---|
| `kern` | Kerning | Always on |
| `case` | Capital-height accents on Å, Ä, Á and similar | On for **all-caps** labels |
| `ss01` | Alternate **A** (applies to Á Ă Â Ä À Ā Ą Å Ã Æ as well) | Optional brand choice; apply consistently |
| `ss02` | Alternate **&** | Optional brand choice |
| `frac`, `sups`, `subs`, `sinf`, `numr`, `dnom` | Fractions and super/subscripts | As needed |

Spot has no tabular or oldstyle figure options.

If you adopt the alternate A or &, turn it on for **both** Spot Grotesk and Spot Semi so body text and labels match:

```css
:root { --spot-alternates: "ss01", "ss02"; }
```

---

## 6. Type scale

Fluid sizes use `clamp()` so they scale between mobile and desktop without breakpoints.

| Token | Font | Weight | Size | Line height | Tracking |
|---|---|---|---|---|---|
| Display / H1 | Trio Grotesk | 700 | `clamp(44px, 6.4vw, 92px)` | 0.96 | -0.045em |
| H2 article | Trio Grotesk | 700 | `clamp(32px, 4vw, 52px)` | 1.02 | -0.045em |
| H2 section | Trio Grotesk | 700 | `clamp(30px, 3.4vw, 44px)` | 1.02 | -0.045em |
| Pull quote | Trio Grotesk | 700 | `clamp(26px, 3vw, 36px)` | 1.12 | -0.045em |
| Spec value | Trio Grotesk | 700 | 32px | 1.0 | -0.0225em |
| H3 / card title | Trio Grotesk | 700 | 24–26px | 1.1–1.15 | -0.0225em |
| Lead | Spot Grotesk | 400 | `calc(var(--text-base) + 3px)` | 1.5 | 0 |
| Body | Spot Grotesk | 400 | `var(--text-base)` (17px) | 1.6 | 0 |
| Small body | Spot Grotesk | 400 | `calc(var(--text-base) - 1px)` | 1.5 | 0 |
| UI / button | Spot Grotesk | 500 | 15–16px | 1.2 | 0 |
| Label | Spot Semi | 400 | 12px, all caps | 1.3 | +0.08em |
| Price / meta | Spot Semi | 400 | 14px | 1.3 | 0 |

Body size can range from 16 to 18px. 17px works well for Spot Grotesk at a 60–70 character measure.

---

## 7. Component CSS

```css
/* ---------- Display: Trio Grotesk ---------- */
.display, h1, h2, h3, .h-quote, .h-value {
  font-family: var(--font-display);
  font-weight: 700;
  font-feature-settings: "kern", "liga";
  text-wrap: balance;
  margin: 0;
}

h1, .display {
  font-size: clamp(44px, 6.4vw, 92px);
  line-height: 0.96;
  letter-spacing: var(--track-display-lg);
}

h2 {
  font-size: clamp(32px, 4vw, 52px);
  line-height: 1.02;
  letter-spacing: var(--track-display-lg);
}

.h-section {
  font-size: clamp(30px, 3.4vw, 44px);
}

h3 {
  font-size: 24px;
  line-height: 1.15;
  letter-spacing: var(--track-display-sm);
}

.h-quote {
  font-size: clamp(26px, 3vw, 36px);
  line-height: 1.12;
  letter-spacing: var(--track-display-lg);
}

.h-value {               /* large numbers: "8 HP", "€340" */
  font-size: 32px;
  line-height: 1;
  letter-spacing: var(--track-display-sm);
}

/* All-caps display variant */
.display--caps {
  text-transform: uppercase;
  letter-spacing: 0;
  font-feature-settings: "kern", "liga", "case";
}

/* ---------- Body: Spot Grotesk ---------- */
p, li {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.6;
  max-width: 65ch;
  text-wrap: pretty;
}

.lead {
  font-size: calc(var(--text-base) + 3px);
  line-height: 1.5;
  max-width: 34em;
}

em    { font-style: italic; }   /* real Spot Grotesk Italic */
strong { font-weight: 500; }    /* Medium reads as emphasis without shouting */

a {
  color: inherit;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.button {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 16px;
  line-height: 1.2;
  padding: 14px 22px;
}

/* ---------- Labels: Spot Semi ---------- */
.label, .eyebrow, figcaption, .tag {
  font-family: var(--font-label);
  font-weight: 400;
  font-size: 12px;
  line-height: 1.3;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
  font-feature-settings: "kern", "case";
}

.meta, .price {
  font-family: var(--font-label);
  font-size: 14px;
  letter-spacing: 0;
}

/* Inline technical tokens inside body text, e.g. 1V/oct */
.token {
  font-family: var(--font-label);
  font-size: 0.88em;
  padding: 1px 5px;
  border-radius: 3px;
}
```

### Example markup

```html
<p class="eyebrow">New · Series 3 Eurorack</p>
<h1>Voltage you can hold in one hand.</h1>
<p class="lead">Halvton builds analog modules in small batches in Gothenburg.</p>

<article>
  <p class="label">Journal · No. 14</p>
  <h2>Why we still tune every oscillator by ear</h2>
  <p>Each VCO-2 is tracked across eight octaves at <span class="token">1V/oct</span>, first against the counter and then <em>by ear</em>.</p>
  <h3>What the counter misses</h3>
  <figure>
    <blockquote class="h-quote">“The meter says it’s in tune. The chord says otherwise.”</blockquote>
    <figcaption>Erik Sand, calibration</figcaption>
  </figure>
</article>
```

---

## 8. Pairing rules

- **One role per typeface.** Trio for anything set as a heading, Spot Grotesk for anything meant to be read, Spot Semi for anything meant to be scanned.
- **Keep Trio at 20px and above.** At text sizes it competes with Spot Grotesk. Use Spot Grotesk Medium for small emphasis instead.
- **Keep Spot Semi short.** Labels, captions, tags and metadata only, never full paragraphs.
- **Use real weights.** Don't apply `font-weight: 600`; no file exists for it, and with `font-synthesis: none` the browser would fall back to 500 or 700 anyway.
- **All caps belongs to Spot Semi labels and, occasionally, Trio headings.** Don't set Spot Grotesk body text in caps.
- **Tighten Trio by size.** Use -0.045em on large headlines and -0.0225em on small headings. Never use positive tracking on Trio in mixed case.
- **Choose the Spot alternates once.** If you use the alternate A/&, apply them everywhere Spot appears.
- **Figures.** For aligned numbers in Trio use `tnum`. Spot has no tabular option, so put aligned numeric tables in Trio or use a true monospace.

---

## 9. Checklist

- [ ] Web license confirmed; `.woff2` files generated
- [ ] Only the used weights are shipped and declared
- [ ] Above-the-fold fonts preloaded
- [ ] `font-synthesis: none` and kerning set on the root
- [ ] Trio tracking set by size; caps use `case` with 0 tracking
- [ ] Spot Semi labels use caps, `+0.08em` and `case`
- [ ] Trio `ss01` / `salt` not enabled globally
- [ ] Body measure limited to about 65ch
