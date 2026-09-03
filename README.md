# brand-img-gen

A small TypeScript engine for generating brand image assets — OG images, social banners,
square logos, favicons — from code instead of a design tool. Built on
[satori](https://github.com/vercel/satori) (flexbox → SVG), [resvg](https://github.com/RazrFalcon/resvg)
(SVG → PNG) and [sharp](https://sharp.pixelplumbing.com/) (compositing).

The **core** knows how to render and compose images, and ships a catalog of standard
dimensions (OG, Twitter/X banner, LinkedIn banner, Discord banner, Reddit banner, favicon,
app icon…). It knows nothing about *your* brand. Each project brings its own colors, icon,
fonts and layout in a small set of files, and calls into the core to render them.

## Showcase

Generated with [`examples/`](examples) — a minimal, from-scratch placeholder brand ("Acme",
not tied to any real product) demonstrating the core's layout helpers.

<p align="center">
  <img src="docs/showcase/og.png" width="600" alt="OG image example"><br>
  <sub><code>SPECS.OG</code> — 1200×630</sub>
</p>

<p align="center">
  <img src="docs/showcase/twitter-banner.png" width="500" alt="Twitter/X banner example"><br>
  <sub><code>SPECS.TWITTER_BANNER</code> — 1500×500</sub>
</p>

<p align="center">
  <img src="docs/showcase/logo.png" width="120" alt="Square logo example"><br>
  <sub><code>SPECS.LOGO_SQUARE</code> — 512×512</sub>
</p>

→ [See every generated asset](docs/SHOWCASE.md) (favicon, app icon, LinkedIn/Discord/Reddit banners…).

Regenerate it yourself:

```sh
pnpm generate
```

## How it's organized

```
src/               core engine — generic, no brand knowledge
  vnode.ts          div/span/img — a tiny satori vnode builder
  fonts.ts          loadFont() — load any font file for satori
  pattern.ts        scatterPattern()/diagonalPattern() — repeating icon backgrounds
  layout.ts         bannerFrame/logoFrame/headerRow — recommended centering, gap & padding
  render.ts         renderVnode/renderBanner/renderLayers/buildFavicon — the PNG/ICO pipeline
  specs.ts          SPECS — standard dimensions per asset type (OG, banners, favicon…)
  index.ts          public exports

examples/           one project's "personalization" — swap this for your own brand
  colors.ts, icon.ts, fonts.ts, components.ts, pattern.ts, templates.ts, generate.ts
```

Each brand's personalization is a self-contained set of files:

| file            | responsibility                                             |
|-----------------|-------------------------------------------------------------|
| `colors.ts`     | your palette                                                |
| `icon.ts`       | your icon/logo mark — any SVG, any icon library              |
| `fonts.ts`      | which font files to load                                     |
| `components.ts` | small reusable pieces (icon box, brand wordmark, slogan)     |
| `pattern.ts`    | (optional) background pattern, built on `scatterPattern`     |
| `templates.ts`  | one function per asset (`tplOG`, `tplTwitterBanner`, …)      |
| `generate.ts`   | orchestrates rendering and writes/copies the output files    |

Nothing in `src/` imports from `examples/` — the dependency only goes one way.

## Available specs

`SPECS` is just a catalog of dimensions — it doesn't force any particular layout on you.

| `SPECS.*`          | dimensions | typical use                        |
|---------------------|------------|-------------------------------------|
| `OG`                | 1200×630   | Open Graph / link preview image     |
| `GENERIC_COVER`     | 1200×400   | Generic wide cover image, no fixed platform |
| `TWITTER_BANNER`    | 1500×500   | Twitter/X profile banner            |
| `LINKEDIN_BANNER`   | 720×121    | LinkedIn company page banner        |
| `DISCORD_BANNER`    | 680×240    | Discord server banner               |
| `REDDIT_BANNER`     | 1920×384   | Reddit community banner             |
| `FAVICON_16`        | 16×16      | favicon (small)                     |
| `FAVICON_32`        | 32×32      | favicon (standard)                  |
| `APPLE_TOUCH_ICON`  | 180×180    | iOS home-screen icon                |
| `LOGO_SQUARE`       | 512×512    | square app icon / logo              |
| `BUSINESS_CARD`     | 1004×650   | 85×55mm (ISO/EU) print business card, 300dpi, no bleed |

Need a size that's not listed? `SPECS` is just a plain object — pass your own
`{ width, height }` anywhere a spec is expected, or add to your own copy.

## Adding your own brand

1. Copy the `examples/` directory into your own project as a starting point.
2. Swap `colors.ts` and `icon.ts` for your own.
3. Adjust `templates.ts` — use `bannerFrame(spec, options, ...children)` for the outer
   frame (recommended gap/padding are computed from the spec, or pass your own) and
   `SPECS.*` for standard dimensions. You're not required to use `bannerFrame` at all —
   it's a convenience, not a contract; build the `div`/`span`/`img` tree however you want
   as long as it renders at the target width/height.
4. Point `generate.ts` at wherever your project wants the output files.

Everything under `examples/` is yours to reshape — there's no fixed interface a
"personalization" has to implement:

- **Pattern** — `pattern.ts` isn't required. Build your own from `scatterPattern` (randomly
  placed/sized/rotated stroke icons) or `diagonalPattern` (one filled tile repeated on a
  staggered grid — the "Fall Guys background" look), compose a different background
  entirely with `sharp`, or skip the pattern layer and pass `undefined` to `renderBanner`.
- **Icon** — `icon.ts` can wrap any icon library (Lucide, Heroicons, a custom SVG export,
  a logo file) — the core only ever deals in `<img src="data:image/svg+xml...">` or plain
  vnodes, never a specific icon set.
- **Banners** — `templates.ts` can lay out content however you like per asset: different
  copy, different composition (e.g. left-aligned instead of centered), extra decorative
  elements, per-platform color variants. One function per `SPECS` entry is a convention
  here, not a requirement.

## Core API

```ts
import {
  // primitives
  div, span, img, loadFont,
  // rendering
  renderVnode, renderBanner, renderLayers, buildFavicon,
  // layout
  bannerFrame, logoFrame, headerRow, recommendedGap, recommendedPadding,
  // specs
  SPECS,
} from 'brand-img-gen'
```

- `SPECS` — see [Available specs](#available-specs) above.
- `renderVnode(vnode, w, h, fonts)` → PNG buffer.
- `renderBanner(w, h, content, fonts, background, patternSvg?)` → PNG buffer, with an
  optional pattern layer composited underneath. `background` is a flat `RgbColor`.
- `renderLayers(w, h, layers, fonts, underColor?)` → PNG buffer, compositing an arbitrary
  bottom-to-top stack of layers (`{ kind: 'vnode' | 'svg' | 'png', ... }`). More flexible
  than `renderBanner`: the background can itself be a styled vnode (gradient, non-rectangular
  shape…) instead of a flat color, and there's no fixed "background + pattern + content"
  shape — pass as many or as few layers as the asset needs (e.g. a pattern-only banner with
  no content layer on top).
- `buildFavicon(svg, sizes)` → `{ ico, pngs }`. Sizes above 256 come back as PNGs but are
  left out of the `.ico` itself (its directory format can't address them), so you can
  request e.g. `[16, 32, 192, 512]` in one call.
- `scatterPattern(w, h, count, size, iconPaths)` → SVG string of a randomly scattered-icon
  background, given any 24×24-viewBox icon markup (rendered as strokes).
- `diagonalPattern(w, h, tileMarkup, viewBoxW, viewBoxH, options?)` → SVG string of one
  already-colored/filled tile repeated on a staggered diagonal grid (same size, same
  rotation, alternating row offset) — the "Fall Guys background" look, as opposed to
  `scatterPattern`'s randomized confetti placement.
- `bannerFrame` / `logoFrame` / `headerRow` — layout scaffolding with sensible defaults
  (see `src/layout.ts`), all overridable.
