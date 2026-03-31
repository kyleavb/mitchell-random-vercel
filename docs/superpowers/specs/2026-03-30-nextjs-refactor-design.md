# Next.js Refactor — Mitchell College Landing Pages

## Overview

Refactor the static HTML Mitchell College landing page site into a Next.js App Router project deployed on Vercel. The system uses reusable React components driven by MDX content files, enabling multiple landing page variants for different programs and campaigns.

## Goals

- Convert to Next.js (App Router) with Vercel deployment
- Component-based architecture for reusable landing page sections
- MDX content files for non-developer-friendly page authoring
- Updated brand: new purple (#38164B), Nunito + Gentium Book Plus fonts, yellow-green accent (#E1E44A)
- Hero section with full-color photo background, light gradient overlay, and focal-point cropping

## Project Structure

```
mitchell-vercel-deploy/
├── app/
│   ├── layout.tsx              # Root layout (fonts, global styles, metadata)
│   ├── page.tsx                # Root route — renders "business" page
│   └── [slug]/
│       └── page.tsx            # Dynamic route — reads MDX by slug
├── components/
│   ├── Nav.tsx                 # Sticky nav with logo + CTA
│   ├── Hero.tsx                # Hero with focal-point bg image, gradient overlay
│   ├── ExperienceSection.tsx   # "Your Experience Is Your Asset"
│   ├── InfoCards.tsx           # Configurable card grid
│   ├── CareerSection.tsx       # Career possibilities + aside card
│   ├── SecondaryCTA.tsx        # Bottom call-to-action
│   ├── Footer.tsx              # Site footer
│   ├── FormEmbed.tsx           # Pardot iframe wrapper
│   └── ui/                    # Shared primitives
│       ├── Button.tsx
│       ├── Kicker.tsx
│       └── Container.tsx
├── content/
│   └── pages/
│       └── business.mdx        # Current landing page content
├── lib/
│   ├── content.ts              # MDX parsing + frontmatter helpers
│   └── types.ts                # Shared TypeScript types
├── public/
│   └── images/                 # Hero photos, logos
├── styles/
│   └── globals.css             # Tailwind directives + design tokens
├── tailwind.config.ts
├── next.config.mjs
├── vercel.json
└── package.json
```

## Design Tokens

### Colors

| Token              | Value     | Usage                                    |
|---------------------|-----------|------------------------------------------|
| primary             | #38164B   | Hero bg, nav, dark sections              |
| primary-light       | #4E2A63   | Containers, footer, career section       |
| secondary           | #BB0022   | Mitchell Red — CTAs, buttons             |
| secondary-dark      | #990018   | Button hover/gradient                    |
| accent              | #E1E44A   | Highlights, icons, emphasized text       |
| surface             | #FFF8F1   | Warm off-white — light sections          |
| surface-container-low | #FBF2E6 | Alternate light section bg               |
| surface-container   | #F5EDE1   | Card backgrounds                         |
| on-surface          | #1E1B14   | Body text on light backgrounds           |
| on-surface-variant  | #48464C   | Secondary text on light                  |
| on-primary          | #FFFFFF   | Text on dark sections                    |
| on-primary-container | #978FAB  | Secondary text on dark sections          |
| outline             | #79767D   | Borders                                  |
| outline-variant     | #CAC5CD   | Subtle borders                           |

### Typography

| Token          | Font                        | Usage                         |
|-----------------|-----------------------------|-------------------------------|
| font-headline   | Nunito (700, 800, 900)     | Hero headlines, section headings, card titles |
| font-body       | Gentium Book Plus (400, 700, italic) | Body copy, descriptions, nav  |

### Tailwind Configuration

Custom theme in `tailwind.config.ts` extending `colors` and `fontFamily` with the tokens above. Utility-first approach with component-level classes only where repetition warrants extraction.

## Component Specifications

### Nav

- Sticky header, dark background (primary)
- Logo (image or text) on left, CTA button on right
- Mobile: hamburger menu with full-screen overlay
- Props: `logoSrc?`, `logoText`, `ctaText`, `ctaHref`
- Consistent across all pages

### Hero

- Full-viewport-height section with color photo background
- **Focal point system**: `object-fit: cover` + `object-position` driven by `heroFocalPoint: { x, y }` percentages in frontmatter — pure CSS, no JS
- **Light gradient overlay**: left-to-right from `rgba(56, 22, 75, 0.55)` to `transparent` — text readability without washing out the photo
- No grayscale filter (removed from current design)
- Two-column grid: headline + body on left, form card on right
- Headline uses Nunito 800, emphasized word in accent color (#E1E44A) and italic
- Props: `program`, `title`, `titleBreak`, `titleEmphasis`, `bodyText`, `heroImage`, `heroFocalPoint`, `heroAlt`, `formTitle`, `formSubheading`, `formSrc`

### ExperienceSection

- Light surface background
- Two-column grid: intro text (kicker, heading, body paragraphs) on left, course list card on right
- Course list items with check_circle Material Symbol icons in accent color
- Props: `kicker`, `heading`, `body: string[]`, `courses: string[]`

### InfoCards

- Light alternate background (surface-container-low)
- Responsive grid: 3 columns desktop, 2 tablet, 1 mobile
- Each card: Material Symbol icon in accent color, title, body text
- Accepts any number of cards
- Props: `cards: { icon, title, body }[]`

### CareerSection

- Dark background (primary-light)
- Two-column grid: content with role list on left, glassmorphic aside card on right
- Roles displayed in 2-column sub-grid with arrow icons
- Aside card with frosted glass effect, CTA button
- Props: `kicker`, `heading`, `body`, `roles: string[]`, `aside: { heading, body }`, `closingBody`, `ctaText`, `ctaHref`

### SecondaryCTA

- Light surface background, centered layout
- Kicker, heading, body text, primary + optional secondary CTA buttons
- Props: `kicker`, `heading`, `body`, `primaryCta: { text, href }`, `secondaryCta?: { text, href }`

### FormEmbed

- Renders Pardot iframe when `src` is provided
- Shows styled placeholder with instructions when `src` is empty/undefined
- Frosted glass card styling
- Props: `src?`, `title`

### Footer

- Dark background (primary-light)
- 4-column grid: brand + 3 nav columns
- Bottom bar: copyright + social icons
- Static content, shared across all pages — no per-page props

### Shared UI Primitives

- **Button**: `variant` prop (primary, secondary, ghost), renders `<a>` or `<button>`, handles gradient and hover states
- **Kicker**: Uppercase small label text in secondary color
- **Container**: Max-width wrapper with responsive inline padding

## Content System

### MDX File Format

Each landing page is a single `.mdx` file in `content/pages/`. The filename (minus extension) is the URL slug.

Frontmatter defines hero content and an ordered array of sections. Each section has a `type` that maps to a component and the props that component expects.

### Adding a New Landing Page

1. Duplicate an existing `.mdx` file in `content/pages/`
2. Change the slug, hero content, and section data
3. Add hero image to `public/images/`
4. Adjust `heroFocalPoint` to frame the subject correctly
5. Deploy — Next.js static generation picks it up automatically

### Adding a Unique Section

1. Create a new component in `components/`
2. Register the type in the section renderer (in `[slug]/page.tsx`)
3. Use the new type in the MDX frontmatter sections array

## Routing

- `/` — renders the `business` landing page (current page, root route)
- `/[slug]` — renders the landing page matching `content/pages/[slug].mdx`
- `404.html` — preserved as custom 404 with redirect behavior

## Static Generation

All pages are statically generated at build time via `generateStaticParams()` which reads all `.mdx` files from `content/pages/`. This ensures fast load times and strong SEO for landing pages.

## Vercel Configuration

Simplified `vercel.json` — Next.js handles routing natively. Keep security headers and cache headers for static assets.

## Migration Notes

- The existing hero background image URL (Firebase Storage) will be kept until replaced with a local image in `public/images/`
- All current page content is preserved 1:1 in the `business.mdx` file
- The 404 redirect behavior is preserved
- Material Symbols Outlined icon font is retained for card and list icons
