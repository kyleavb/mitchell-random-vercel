# Lighthouse Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce page weight from ~4.3 MB to under 1 MB and eliminate render-blocking external resources to improve Lighthouse scores by 25-35 points.

**Architecture:** Five independent changes: (1) remove static export to enable Vercel image optimization, (2) subset all fonts to Latin and convert to WOFF2, (3) replace the external Material Symbols icon font with inline SVG components, (4) fix the Pardot iframe for CLS and lazy loading, (5) fix OG image URLs.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Vercel deployment, `fonttools`/`pyftsubset` for font subsetting.

---

### Task 1: Remove static export and enable Vercel image optimization

**Files:**
- Modify: `next.config.ts`
- Modify: `vercel.json`
- Modify: `components/Hero.tsx:29` (sizes attribute)

- [ ] **Step 1: Update next.config.ts**

Remove `output: "export"` and `images: { unoptimized: true }`. Keep `reactCompiler: true`.

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
```

- [ ] **Step 2: Update vercel.json**

Remove `buildCommand` and `outputDirectory` (Vercel auto-detects for non-static builds). Keep the `headers` array unchanged.

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

- [ ] **Step 3: Update Hero.tsx sizes attribute**

In `components/Hero.tsx`, line 29, change the `sizes` prop on the hero `<Image>`:

```tsx
// Before:
sizes="100vw"

// After:
sizes="(max-width: 1440px) 100vw, 1440px"
```

- [ ] **Step 4: Verify the build succeeds**

Run: `npx next build`
Expected: Build completes without errors. Output should NOT show `Exporting` phase (that's the static export). It should show `Generating static pages` and then finish.

- [ ] **Step 5: Commit**

```bash
git add next.config.ts vercel.json components/Hero.tsx
git commit -m "perf: remove static export, enable Vercel image optimization"
```

---

### Task 2: Subset fonts to Latin and convert to WOFF2

**Files:**
- Modify: `public/fonts/gentium-plus/` (replace 4 TTF files with 4 WOFF2 files)
- Modify: `public/fonts/decalotype/` (replace 5 OTF files with 5 WOFF2 files)
- Modify: `public/fonts/roundo/` (replace 4 OTF files with 4 WOFF2 files)
- Modify: `app/layout.tsx:5-37` (update font src paths)

- [ ] **Step 1: Install fonttools with WOFF2 support**

```bash
python3 -m pip install --user fonttools brotli
```

Expected: Installs successfully. `brotli` is required for WOFF2 output.

- [ ] **Step 2: Subset and convert Gentium Plus (4 files)**

Run each command. The `--unicodes` flag specifies the Latin subset range. `--flavor=woff2` converts to WOFF2.

```bash
UNICODE_RANGE="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"

cd public/fonts/gentium-plus

pyftsubset GentiumPlus-Regular.ttf --output-file=GentiumPlus-Regular.woff2 --flavor=woff2 --unicodes="$UNICODE_RANGE" --layout-features='*'
pyftsubset GentiumPlus-Bold.ttf --output-file=GentiumPlus-Bold.woff2 --flavor=woff2 --unicodes="$UNICODE_RANGE" --layout-features='*'
pyftsubset GentiumPlus-Italic.ttf --output-file=GentiumPlus-Italic.woff2 --flavor=woff2 --unicodes="$UNICODE_RANGE" --layout-features='*'
pyftsubset GentiumPlus-BoldItalic.ttf --output-file=GentiumPlus-BoldItalic.woff2 --flavor=woff2 --unicodes="$UNICODE_RANGE" --layout-features='*'

rm *.ttf
```

Expected: 4 WOFF2 files, each ~20-50 KB (down from ~800 KB each).

- [ ] **Step 3: Subset and convert Decalotype (5 files)**

```bash
cd public/fonts/decalotype

pyftsubset decalotype.regular.otf --output-file=decalotype.regular.woff2 --flavor=woff2 --unicodes="$UNICODE_RANGE" --layout-features='*'
pyftsubset decalotype.bold.otf --output-file=decalotype.bold.woff2 --flavor=woff2 --unicodes="$UNICODE_RANGE" --layout-features='*'
pyftsubset decalotype.bold-italic.otf --output-file=decalotype.bold-italic.woff2 --flavor=woff2 --unicodes="$UNICODE_RANGE" --layout-features='*'
pyftsubset decalotype.extrabold.otf --output-file=decalotype.extrabold.woff2 --flavor=woff2 --unicodes="$UNICODE_RANGE" --layout-features='*'
pyftsubset decalotype.extrabold-italic.otf --output-file=decalotype.extrabold-italic.woff2 --flavor=woff2 --unicodes="$UNICODE_RANGE" --layout-features='*'

rm *.otf
```

Expected: 5 WOFF2 files, each ~10-20 KB (down from ~45 KB each).

- [ ] **Step 4: Subset and convert Roundo (4 files)**

```bash
cd public/fonts/roundo

pyftsubset roundo.regular.otf --output-file=roundo.regular.woff2 --flavor=woff2 --unicodes="$UNICODE_RANGE" --layout-features='*'
pyftsubset roundo.medium.otf --output-file=roundo.medium.woff2 --flavor=woff2 --unicodes="$UNICODE_RANGE" --layout-features='*'
pyftsubset roundo.semibold.otf --output-file=roundo.semibold.woff2 --flavor=woff2 --unicodes="$UNICODE_RANGE" --layout-features='*'
pyftsubset roundo.bold.otf --output-file=roundo.bold.woff2 --flavor=woff2 --unicodes="$UNICODE_RANGE" --layout-features='*'

rm *.otf
```

Expected: 4 WOFF2 files, each ~8-15 KB (down from ~30 KB each).

- [ ] **Step 5: Update font paths in layout.tsx**

In `app/layout.tsx`, update all `localFont` `src` entries to use `.woff2` extensions:

```tsx
const decalotype = localFont({
  src: [
    { path: "../public/fonts/decalotype/decalotype.regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/decalotype/decalotype.bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/decalotype/decalotype.bold-italic.woff2", weight: "700", style: "italic" },
    { path: "../public/fonts/decalotype/decalotype.extrabold.woff2", weight: "800", style: "normal" },
    { path: "../public/fonts/decalotype/decalotype.extrabold-italic.woff2", weight: "800", style: "italic" },
  ],
  variable: "--font-decalotype",
  display: "swap",
});

const roundo = localFont({
  src: [
    { path: "../public/fonts/roundo/roundo.regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/roundo/roundo.medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/roundo/roundo.semibold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/roundo/roundo.bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-roundo",
  display: "swap",
});

const gentiumPlus = localFont({
  src: [
    { path: "../public/fonts/gentium-plus/GentiumPlus-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/gentium-plus/GentiumPlus-Italic.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/gentium-plus/GentiumPlus-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/gentium-plus/GentiumPlus-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-gentium",
  display: "swap",
});
```

- [ ] **Step 6: Verify build succeeds and fonts render**

Run: `npx next build`
Expected: Build completes. No font-related errors.

- [ ] **Step 7: Commit**

```bash
git add public/fonts/ app/layout.tsx
git commit -m "perf: subset all fonts to Latin, convert to WOFF2"
```

---

### Task 3: Replace Material Symbols with inline SVG components

**Files:**
- Create: `components/icons.tsx`
- Modify: `components/InfoCards.tsx`
- Modify: `components/ExperienceSection.tsx`
- Modify: `components/CareerSection.tsx`
- Modify: `components/Nav.tsx`
- Modify: `app/layout.tsx:88-93` (remove Google Fonts link)
- Modify: `app/globals.css:117-121` (remove `.material-symbols-outlined` rule)

The site uses 7 Material Symbols icons total: `payments`, `support_agent`, `schedule`, `check_circle`, `arrow_forward`, `menu`, `close`. SVG paths are sourced from the Material Symbols outlined set (wght 400, FILL 0, GRAD 0, opsz 24).

- [ ] **Step 1: Fetch SVG paths and create components/icons.tsx**

Fetch the SVG path data for each icon from Google's Material Symbols source. Each icon URL follows this pattern:
```
https://fonts.google.com/metadata/icons?key=material_symbols&icon=<icon_name>
```

Or download directly from: `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined` and extract the `d` attribute from each icon's SVG.

A reliable method: visit `https://fonts.google.com/icons?icon.query=<name>&icon.set=Material+Symbols` and copy the SVG for the outlined variant (wght 400, FILL 0, GRAD 0, opsz 24).

Each icon is a React component accepting `className` for sizing/color via Tailwind. All use the `0 -960 960 960` viewBox (Material Symbols grid). `aria-hidden="true"` is set by default since these are decorative.

Structure for each icon component (repeat for all 7 icons: `payments`, `support_agent`, `schedule`, `check_circle`, `arrow_forward`, `menu`, `close`):

```tsx
interface IconProps {
  className?: string;
}

export function PaymentsIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" className={className} aria-hidden="true">
      <path d="<PASTE_SVG_PATH_HERE>" />
    </svg>
  );
}

// Repeat pattern for: SupportAgentIcon, ScheduleIcon, CheckCircleIcon,
// ArrowForwardIcon, MenuIcon, CloseIcon
```

- [ ] **Step 2: Update InfoCards.tsx**

Replace the `material-symbols-outlined` spans with the icon components. The card icons are dynamic (driven by `card.icon` string from MDX data), so create a lookup map.

Replace the full file content with:

```tsx
import Container from "./ui/Container";
import { InfoCardsSectionData } from "@/lib/types";
import { PaymentsIcon, SupportAgentIcon, ScheduleIcon, CheckCircleIcon } from "./icons";

const cardIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  payments: PaymentsIcon,
  support_agent: SupportAgentIcon,
  schedule: ScheduleIcon,
};

export default function InfoCards({
  cards,
}: Omit<InfoCardsSectionData, "type">) {
  return (
    <section className="bg-secondary py-32 max-md:py-16">
      <Container>
        <div className="grid grid-cols-3 gap-12 max-lg:grid-cols-2 max-lg:gap-8 max-md:grid-cols-1 max-md:gap-6">
          {cards.map((card, i) => {
            const CardIcon = cardIcons[card.icon];
            return (
              <div
                key={i}
                className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient flex flex-col gap-4"
              >
                {CardIcon && (
                  <div className="text-primary leading-none mb-2">
                    <CardIcon className="w-10 h-10" />
                  </div>
                )}
                <h3 className="font-headline text-xl font-bold text-on-surface">
                  {card.title}
                </h3>
                <p className="text-on-surface-variant text-[0.9375rem] leading-[1.7] max-w-none">
                  {card.body}
                </p>
                {card.items && (
                  <ul className="flex flex-col gap-2 list-none m-0 p-0">
                    {card.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-2 text-on-surface-variant text-[0.875rem] leading-relaxed"
                      >
                        <CheckCircleIcon className="w-4 h-4 text-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {card.footnote && (
                  <p className="text-on-surface-variant text-[0.9375rem] leading-[1.7] font-medium max-w-none">
                    {card.footnote}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Update ExperienceSection.tsx**

Replace the `material-symbols-outlined` span for `check_circle` in the courses list.

In `components/ExperienceSection.tsx`, add the import at the top:

```tsx
import { CheckCircleIcon } from "./icons";
```

Then replace lines 36-41 (the `<span>` inside the course `<li>`):

```tsx
// Before:
<span
  className="material-symbols-outlined text-primary shrink-0 text-xl"
  aria-hidden="true"
>
  check_circle
</span>

// After:
<CheckCircleIcon className="w-5 h-5 text-primary shrink-0" />
```

- [ ] **Step 4: Update CareerSection.tsx**

Replace `arrow_forward` icon in the `RoleList` component.

In `components/CareerSection.tsx`, add the import at the top:

```tsx
import { ArrowForwardIcon } from "./icons";
```

Then replace lines 14-18 (the `<span>` inside the role `<li>`):

```tsx
// Before:
<span
  className="material-symbols-outlined text-accent shrink-0 text-lg"
  aria-hidden="true"
>
  arrow_forward
</span>

// After:
<ArrowForwardIcon className="w-[1.125rem] h-[1.125rem] text-accent shrink-0" />
```

- [ ] **Step 5: Update Nav.tsx**

Replace `menu` and `close` icons.

In `components/Nav.tsx`, add the import at the top:

```tsx
import { MenuIcon, CloseIcon } from "./icons";
```

Replace line 43 (the menu button span):

```tsx
// Before:
<span className="material-symbols-outlined text-2xl">menu</span>

// After:
<MenuIcon className="w-6 h-6" />
```

Replace line 60 (the close button span):

```tsx
// Before:
<span className="material-symbols-outlined text-2xl">close</span>

// After:
<CloseIcon className="w-6 h-6" />
```

- [ ] **Step 6: Remove Google Fonts link from layout.tsx**

In `app/layout.tsx`, delete the entire `<head>` block (lines 88-93):

```tsx
// Delete this:
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
```

- [ ] **Step 7: Remove .material-symbols-outlined CSS rule from globals.css**

In `app/globals.css`, delete lines 117-121:

```css
/* Delete this: */
.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
  display: inline-block;
  vertical-align: middle;
}
```

- [ ] **Step 8: Verify build succeeds and no material-symbols references remain**

Run: `npx next build`
Expected: Build completes without errors.

Run: `grep -r "material-symbols" components/ app/`
Expected: No matches found.

- [ ] **Step 9: Commit**

```bash
git add components/icons.tsx components/InfoCards.tsx components/ExperienceSection.tsx components/CareerSection.tsx components/Nav.tsx app/layout.tsx app/globals.css
git commit -m "perf: replace Material Symbols font with inline SVG icons"
```

---

### Task 4: Fix Pardot iframe for CLS and lazy loading

**Files:**
- Modify: `components/FormEmbed.tsx`

- [ ] **Step 1: Update FormEmbed.tsx**

Replace the iframe section of `components/FormEmbed.tsx`. Add `loading="lazy"`, use a wrapper with `min-height` for CLS reservation, and add `sandbox` for security.

Replace lines 26-33 (the `<div className="pardot-form">` block):

```tsx
// Before:
        <div className="pardot-form">
          {src ? (
            <iframe
              src={src}
              title="Request Information Form"
              className="w-full border-none"
              style={{ colorScheme: "light", height: "820px" }}
            />

// After:
        <div className="pardot-form" style={{ minHeight: "820px" }}>
          {src ? (
            <iframe
              src={src}
              title="Request Information Form"
              className="w-full border-none"
              style={{ colorScheme: "light", height: "820px" }}
              loading="lazy"
              sandbox="allow-same-origin allow-forms allow-popups allow-scripts"
            />
```

No other lines change — the else branch (placeholder div) and closing tags stay the same.

- [ ] **Step 2: Verify build succeeds**

Run: `npx next build`
Expected: Build completes without errors.

- [ ] **Step 3: Commit**

```bash
git add components/FormEmbed.tsx
git commit -m "perf: add lazy loading and CLS fix to Pardot iframe"
```

---

### Task 5: Fix OG image URLs

**Files:**
- Modify: `app/layout.tsx:58-65,71-73`

- [ ] **Step 1: Update OG image URLs in layout.tsx**

In `app/layout.tsx`, replace the two occurrences of the old domain:

In `openGraph.images` (line 60):

```tsx
// Before:
url: "https://mitchell-vercel.vercel.app/images/og-hero.jpg",

// After:
url: "https://online.mitchell.edu/images/og-hero.jpg",
```

In `twitter.images` (line 73):

```tsx
// Before:
"https://mitchell-vercel.vercel.app/images/og-hero.jpg",

// After:
"https://online.mitchell.edu/images/og-hero.jpg",
```

- [ ] **Step 2: Verify build succeeds**

Run: `npx next build`
Expected: Build completes without errors.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "fix: update OG image URLs to production domain"
```
