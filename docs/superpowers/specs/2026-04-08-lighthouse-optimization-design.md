# Lighthouse Optimization — Design Spec

**Date:** 2026-04-08
**Branch:** `lighthouse-optimization`
**Site:** https://online.mitchell.edu/ (paid media landing page, not indexed)

## Context

The site is a Next.js landing page deployed on Vercel. Current configuration uses static export with disabled image optimization, un-subsetted font files totaling 3.5+ MB, and a render-blocking external Google Fonts stylesheet for icons. These issues significantly impact Lighthouse performance scores.

## Goals

- Improve Lighthouse Performance score by 25-35 points
- Reduce total page weight from ~4.3 MB to under 1 MB
- Eliminate render-blocking external resources
- Fix CLS risks from the Pardot iframe

## Non-Goals

- SEO improvements (site is intentionally not indexed — paid media only)
- Visual redesign or copy changes
- Analytics/conversion tracking additions

---

## 1. Remove Static Export, Enable Vercel Image Optimization

### Files Changed
- `next.config.ts`: Remove `output: "export"` and `images: { unoptimized: true }`
- `vercel.json`: Remove `outputDirectory: "out"`
- `components/Hero.tsx`: Update `sizes` attribute from `"100vw"` to `"(max-width: 1440px) 100vw, 1440px"`

### Rationale
Static export disables Vercel's Image Optimization API. Removing it allows Vercel to automatically serve WebP/AVIF at responsive dimensions. The 471 KB hero JPEG becomes ~150-200 KB WebP on desktop, ~80 KB on mobile.

### What We Keep
- `priority={true}` on hero image (correct for LCP element)
- `fill` layout mode with focal-point positioning

---

## 2. Subset All Fonts, Convert to WOFF2

### Files Changed
- `public/fonts/gentium-plus/`: Replace 4 TTF files (3.2 MB) with Latin-subset WOFF2 files (~150-200 KB)
- `public/fonts/decalotype/`: Replace 5 OTF files (236 KB) with Latin-subset WOFF2 files (~80 KB)
- `public/fonts/roundo/`: Replace 4 OTF files (124 KB) with Latin-subset WOFF2 files (~40 KB)
- `app/layout.tsx`: Update all `localFont` src paths from `.otf`/`.ttf` to `.woff2`

### Unicode Range
Latin subset: `U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`

### Tooling
`fonttools` with `pyftsubset` for subsetting, `brotli` compression via WOFF2 output flag.

### What We Keep
All font variants currently loaded:
- Gentium Plus: Regular, Bold, Italic, BoldItalic
- Decalotype: Regular, Bold, BoldItalic, ExtraBold, ExtraBoldItalic
- Roundo: Regular, Medium, SemiBold, Bold

---

## 3. Replace Material Symbols with Inline SVGs

### Files Changed
- New file: `components/icons.tsx` — exports React components for 6 icons
- `components/InfoCards.tsx`: Replace `<span className="material-symbols-outlined">` with SVG components
- `components/CareerSection.tsx`: Same replacement
- Any other component using Material Symbols icon spans
- `app/layout.tsx`: Remove the Google Fonts `<link>` stylesheet for Material Symbols

### Icons to Implement
| Icon name | Used in |
|-----------|---------|
| `payments` | InfoCards (Cost card) |
| `support_agent` | InfoCards (Support card) |
| `schedule` | InfoCards (Flexibility card) |
| `check_circle` | InfoCards (list items), ExperienceSection (course list), CareerSection (role list) |
| `work` | CareerSection |
| `arrow_forward` | CareerSection (CTA), SecondaryCta |

### SVG Source
Google Material Symbols outlined variant, matching the current visual weight (wght 400, FILL 0, GRAD 0, opsz 24).

### Rationale
Eliminates a render-blocking external CSS request. SVGs inline directly into the HTML with zero network overhead.

---

## 4. Pardot Iframe Fixes

### Files Changed
- `components/FormEmbed.tsx`

### Changes
- Add `loading="lazy"` to the iframe element
- Replace hard-coded `height="820px"` with a wrapper div using `min-height: 820px` to reserve space and prevent CLS
- Add `sandbox="allow-same-origin allow-forms allow-popups allow-scripts"` for security

### Rationale
The iframe is below the fold on most viewports. Lazy loading defers the network request. Reserving space with min-height prevents layout shift when the form loads.

---

## 5. Fix OG Image URL

### Files Changed
- `app/layout.tsx`

### Changes
Update hardcoded OG image URLs from `https://mitchell-vercel.vercel.app/images/og-hero.jpg` to `https://online.mitchell.edu/images/og-hero.jpg` in both `openGraph.images` and `twitter.images`.

---

## Expected Outcomes

| Metric | Before (estimated) | After (estimated) |
|--------|--------------------|--------------------|
| Total page weight | ~4.3 MB | ~800 KB-1 MB |
| Gentium Plus fonts | 3.2 MB | ~150-200 KB |
| Hero image (mobile) | 471 KB | ~80 KB |
| External requests | Google Fonts CDN | None |
| LCP | ~3-4s (4G) | ~1.5-2s (4G) |
| CLS | Risk from iframe | Mitigated |
| Lighthouse Performance | Estimated +25-35 points |
