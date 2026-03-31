# Next.js Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the static HTML Mitchell College landing page site into a Next.js App Router project with reusable components, MDX content files, updated brand colors/fonts, and a focal-point hero image system.

**Architecture:** Next.js App Router with dynamic `[slug]` routing. Each landing page is an MDX file in `content/pages/` whose frontmatter defines hero content and an ordered sections array. A section renderer maps each section type to a React component. Tailwind CSS provides styling with custom design tokens.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, gray-matter (frontmatter parsing), next/font (Google fonts)

---

## File Map

| File | Responsibility |
|------|---------------|
| `app/layout.tsx` | Root layout: fonts (Nunito, Gentium Book Plus), global styles, metadata, Material Symbols link |
| `app/page.tsx` | Root route — imports and re-exports the `[slug]` page with slug="business" |
| `app/[slug]/page.tsx` | Dynamic route — reads MDX by slug, renders Hero + section renderer |
| `app/not-found.tsx` | Custom 404 with redirect behavior (replaces 404.html) |
| `components/Nav.tsx` | Sticky nav header |
| `components/Hero.tsx` | Hero section with focal-point image + gradient overlay + form |
| `components/FormEmbed.tsx` | Pardot iframe or placeholder |
| `components/ExperienceSection.tsx` | Experience/degree completion section |
| `components/InfoCards.tsx` | Configurable card grid |
| `components/CareerSection.tsx` | Career possibilities + glassmorphic aside |
| `components/SecondaryCTA.tsx` | Bottom CTA |
| `components/Footer.tsx` | Site footer |
| `components/SectionRenderer.tsx` | Maps section type strings to components |
| `components/ui/Button.tsx` | Button primitive (primary, secondary, ghost variants) |
| `components/ui/Kicker.tsx` | Uppercase label text |
| `components/ui/Container.tsx` | Max-width wrapper |
| `lib/content.ts` | MDX file reading + frontmatter parsing |
| `lib/types.ts` | Shared TypeScript interfaces |
| `content/pages/business.mdx` | Current landing page content as MDX frontmatter |
| `styles/globals.css` | Tailwind directives + CSS custom properties |
| `tailwind.config.ts` | Custom theme (colors, fonts, spacing) |
| `next.config.mjs` | Next.js config |
| `vercel.json` | Vercel headers config |
| `.gitignore` | Node modules, .next, .superpowers |
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `postcss.config.mjs` | PostCSS for Tailwind |

---

### Task 1: Initialize Next.js Project & Configuration

**Files:**
- Create: `package.json` (overwrite existing)
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `.gitignore`
- Modify: `vercel.json`
- Delete: `index.html`, `404.html`, `package-lock.json`

- [ ] **Step 1: Initialize Next.js project**

Run:
```bash
cd /home/kerm/code/mitchell-vercel-deploy
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --yes
```

Note: This will scaffold the project structure. If it prompts about existing files, allow overwrite. The old `index.html` and `404.html` will be replaced by Next.js equivalents.

- [ ] **Step 2: Remove old static files**

```bash
rm -f index.html 404.html package-lock.json
rm -rf shared
```

- [ ] **Step 3: Install additional dependencies**

```bash
npm install gray-matter
```

- [ ] **Step 4: Update .gitignore**

Add to `.gitignore`:
```
.superpowers/
```

- [ ] **Step 5: Update vercel.json**

Replace `vercel.json` with:
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

- [ ] **Step 6: Verify project builds**

```bash
npm run build
```

Expected: Build succeeds with default Next.js scaffold.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js project with Tailwind and TypeScript"
```

---

### Task 2: Design Tokens — Tailwind Config & Global CSS

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `styles/globals.css` (or `app/globals.css` — wherever create-next-app placed it)
- Modify: `app/layout.tsx`

- [ ] **Step 1: Configure Tailwind theme**

Replace `tailwind.config.ts` with:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#38164B",
          light: "#4E2A63",
        },
        secondary: {
          DEFAULT: "#BB0022",
          dark: "#990018",
        },
        accent: "#E1E44A",
        surface: {
          DEFAULT: "#FFF8F1",
          "container-low": "#FBF2E6",
          container: "#F5EDE1",
          "container-high": "#EFE7DB",
          "container-highest": "#E9E1D5",
          "container-lowest": "#FFFFFF",
          dim: "#E1D9CD",
        },
        "on-surface": {
          DEFAULT: "#1E1B14",
          variant: "#48464C",
        },
        "on-primary": {
          DEFAULT: "#FFFFFF",
          container: "#978FAB",
        },
        outline: {
          DEFAULT: "#79767D",
          variant: "#CAC5CD",
        },
      },
      fontFamily: {
        headline: ["var(--font-nunito)", "sans-serif"],
        body: ["var(--font-gentium)", "serif"],
      },
      maxWidth: {
        page: "1440px",
      },
      borderRadius: {
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      boxShadow: {
        ambient: "0 4px 32px rgba(30, 27, 20, 0.04)",
        elevated: "0 8px 48px rgba(30, 27, 20, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Write global CSS**

Replace the global CSS file (check if `app/globals.css` exists from scaffold) with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    @apply font-body text-on-surface bg-surface leading-relaxed;
  }

  ::selection {
    background-color: rgba(187, 0, 34, 0.15);
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  h1,
  h2,
  h3,
  h4 {
    @apply font-headline leading-none text-on-surface;
  }

  h1 {
    font-size: clamp(2.5rem, 6vw, 5rem);
    @apply font-extrabold tracking-tight;
  }

  h2 {
    font-size: clamp(2rem, 4vw, 3.25rem);
    @apply font-bold;
  }

  h3 {
    font-size: clamp(1.25rem, 2vw, 1.75rem);
    @apply font-bold;
  }

  h4 {
    @apply text-xl font-bold;
  }

  p {
    max-width: 65ch;
  }

  :focus-visible {
    @apply outline-2 outline-secondary outline-offset-2;
  }
}

/* Material Symbols */
.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
  display: inline-block;
  vertical-align: middle;
}
```

- [ ] **Step 3: Update root layout with fonts**

Replace `app/layout.tsx` with:
```tsx
import type { Metadata } from "next";
import { Nunito, Gentium_Book_Plus } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const gentium = Gentium_Book_Plus({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-gentium",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mitchell College — Honor the Promise to Yourself",
  description:
    "See how your 60+ transfer credits apply toward a fully online B.A. degree in Business at Mitchell College.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${gentium.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts app/globals.css app/layout.tsx
git commit -m "feat: add design tokens, fonts, and global styles"
```

---

### Task 3: TypeScript Types & Content Loader

**Files:**
- Create: `lib/types.ts`
- Create: `lib/content.ts`

- [ ] **Step 1: Create shared types**

Create `lib/types.ts`:
```ts
export interface FocalPoint {
  x: number;
  y: number;
}

export interface HeroData {
  program: string;
  title: string;
  titleBreak?: boolean;
  titleEmphasis: string;
  bodyText: string;
  heroImage: string;
  heroFocalPoint: FocalPoint;
  heroAlt: string;
  formTitle: string;
  formSubheading: string;
  formSrc?: string;
}

export interface ExperienceSectionData {
  type: "experience";
  kicker: string;
  heading: string;
  body: string[];
  courses: string[];
}

export interface InfoCardData {
  icon: string;
  title: string;
  body: string;
}

export interface InfoCardsSectionData {
  type: "infoCards";
  cards: InfoCardData[];
}

export interface CareerAsideData {
  heading: string;
  body: string;
}

export interface CareerSectionData {
  type: "career";
  kicker: string;
  heading: string;
  body: string;
  roles: string[];
  aside: CareerAsideData;
  closingBody?: string;
  ctaText?: string;
  ctaHref?: string;
}

export interface CtaLink {
  text: string;
  href: string;
}

export interface SecondaryCtaSectionData {
  type: "secondaryCta";
  kicker: string;
  heading: string;
  body: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
}

export type SectionData =
  | ExperienceSectionData
  | InfoCardsSectionData
  | CareerSectionData
  | SecondaryCtaSectionData;

export interface PageData extends HeroData {
  slug: string;
  sections: SectionData[];
}
```

- [ ] **Step 2: Create content loader**

Create `lib/content.ts`:
```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PageData } from "./types";

const contentDir = path.join(process.cwd(), "content", "pages");

export function getPageBySlug(slug: string): PageData {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);
  return data as PageData;
}

export function getAllSlugs(): string[] {
  const files = fs.readdirSync(contentDir);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts lib/content.ts
git commit -m "feat: add TypeScript types and MDX content loader"
```

---

### Task 4: MDX Content File — Business Landing Page

**Files:**
- Create: `content/pages/business.mdx`

- [ ] **Step 1: Create content directory**

```bash
mkdir -p content/pages
```

- [ ] **Step 2: Create business.mdx**

Create `content/pages/business.mdx`:
```yaml
---
slug: business
program: "Professional Studies — Business"
title: "Honor the Promise"
titleBreak: true
titleEmphasis: "Yourself."
bodyText: "You've done the work. Now, get the credit. See how your 60+ transfer credits apply toward a fully online B.A. degree in Business."
heroImage: "https://firebasestorage.googleapis.com/v0/b/ruttlp.appspot.com/o/attachments%2FShfcawU84NhWEFelABly%2FvWrgfeaf1mOc0ebwCHoSV?alt=media&token=2133cca2-4d1d-4a96-b39d-17b1658551cf"
heroFocalPoint: { x: 50, y: 30 }
heroAlt: ""
formTitle: "Let Us Help You Honor the Promise You Made to Yourself"
formSubheading: "You've done the work. Now, get the credit. See how your 60+ transfer credits apply toward a fully online B.A. degree in Business."
formSrc: ""

sections:
  - type: experience
    kicker: "Degree Completion"
    heading: "Your Experience Is Your Asset. Use It."
    body:
      - "Life happened. Career took priority. You didn't \"stop\" — you gained real-world experience. Now, it's time to match that experience with credentials that will move you forward faster in an environment that supports your learning needs and goals."
      - "Mitchell College's Professional Studies–Business degree program is specifically engineered for the 60-credit-plus transfer student. This isn't about starting over. It's about accelerating your momentum alongside peers who share your drive. It's about achieving what's possible for you."
      - "You will gain practical knowledge through courses like Economics, Market Research, Human Resource Management, and Business Law. Through your learning journey, you will strengthen the communication, critical thinking, and leadership skills employers value most, preparing you to solve problems and lead with confidence."
    courses:
      - "Economics"
      - "Market Research"
      - "Human Resource Management"
      - "Business Law"
      - "Communication & Leadership"
      - "Critical Thinking & Problem Solving"

  - type: infoCards
    cards:
      - icon: "payments"
        title: "Cost & Financial Aid"
        body: "At $500 per credit for this degree-completion program, you can move forward at a pace that fits your budget and schedule. You can take courses as you're able and explore federal or state financial aid options."
      - icon: "support_agent"
        title: "Support Services"
        body: "Mitchell is nationally recognized for supporting students wherever they are in their education journey. We'll pair you with an academic advisor experienced in working with adult learners, helping you map transferred credits, succeed in your coursework, and stay on track to graduate. You'll also have access to tutoring, career services, library support, technology assistance, and health and wellness resources."
      - icon: "schedule"
        title: "Flexibility"
        body: "This fully online, asynchronous program lets you schedule your coursework around your life, with no required live lectures. Start in spring, summer, or fall and enroll full time or part time. Move forward at a pace that works for you."

  - type: career
    kicker: "What's Next"
    heading: "Career Possibilities"
    body: "A business degree can open doors across industries. Graduates pursue roles such as:"
    roles:
      - "Marketing Manager"
      - "Human Resource Specialist"
      - "Project or Program Manager"
      - "Operations Manager"
      - "Market Research Analyst"
      - "Entrepreneur"
      - "Business Strategy & Innovation Leader"
      - "Organizational Change Consultant"
    aside:
      heading: "Your Community Awaits"
      body: "Join a community of motivated adult learners, supported by advisors and faculty who understand your journey and celebrate your individual experience."
    closingBody: "Mitchell College emphasizes transferable skills and adaptable thinking, so you're not boxed into one path. You graduate prepared to evolve and advance as industries change."
    ctaText: "Request Information"
    ctaHref: "#inquiry-form"

  - type: secondaryCta
    kicker: "Take the Next Step"
    heading: "See What's Possible for You"
    body: "Request information today and see what's possible for you. Our team is ready to help you map your transfer credits and start your path to a B.A. in Business."
    primaryCta:
      text: "Request Information"
      href: "#inquiry-form"
    secondaryCta:
      text: "Call Admissions"
      href: "tel:+18604431209"
---
```

- [ ] **Step 3: Commit**

```bash
git add content/pages/business.mdx
git commit -m "feat: add business landing page MDX content"
```

---

### Task 5: UI Primitives — Button, Kicker, Container

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Kicker.tsx`
- Create: `components/ui/Container.tsx`

- [ ] **Step 1: Create Button component**

Create `components/ui/Button.tsx`:
```tsx
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  variant?: ButtonVariant;
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-secondary to-secondary-dark text-white border-none hover:brightness-110 active:scale-[0.97]",
  secondary:
    "bg-primary-light text-on-primary border-none hover:brightness-110 active:scale-[0.97]",
  ghost:
    "bg-transparent border border-white/15 text-on-primary backdrop-blur-sm hover:bg-white/5 active:scale-[0.97]",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 px-10 py-4 rounded-md font-body font-bold text-sm tracking-widest no-underline cursor-pointer transition-all whitespace-nowrap";

export default function Button({
  variant = "primary",
  href,
  children,
  className = "",
  onClick,
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Create Kicker component**

Create `components/ui/Kicker.tsx`:
```tsx
interface KickerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Kicker({ children, className = "" }: KickerProps) {
  return (
    <span
      className={`font-body text-[0.6875rem] font-bold tracking-[0.3em] uppercase text-secondary ${className}`}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Create Container component**

Create `components/ui/Container.tsx`:
```tsx
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`max-w-page mx-auto px-8 max-md:px-4 ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add components/ui/
git commit -m "feat: add Button, Kicker, and Container UI primitives"
```

---

### Task 6: Nav Component

**Files:**
- Create: `components/Nav.tsx`

- [ ] **Step 1: Create Nav component**

Create `components/Nav.tsx`:
```tsx
"use client";

import { useState } from "react";
import Container from "./ui/Container";
import Button from "./ui/Button";

interface NavProps {
  logoText: string;
  logoSrc?: string;
  ctaText: string;
  ctaHref: string;
}

export default function Nav({ logoText, logoSrc, ctaText, ctaHref }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary-light backdrop-blur-xl">
        <Container>
          <div className="flex items-center justify-between gap-8 py-4">
            <a
              href="#"
              className="shrink-0 font-headline text-[1.75rem] font-bold text-on-primary no-underline tracking-tight"
            >
              {logoSrc ? (
                <img src={logoSrc} alt={logoText} className="max-h-10 w-auto" />
              ) : (
                logoText
              )}
            </a>

            <div className="hidden md:flex items-center">
              <Button href={ctaHref}>{ctaText}</Button>
            </div>

            <button
              className="flex md:hidden flex-col justify-center items-center w-10 h-10 bg-transparent border-none cursor-pointer text-on-primary p-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-primary flex flex-col items-center justify-center gap-8 transition-transform duration-300 ${
          mobileOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <button
          className="absolute top-6 right-6 bg-transparent border-none text-on-primary cursor-pointer flex items-center justify-center p-2"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <nav className="flex flex-col items-center gap-6">
          <Button href={ctaHref} onClick={() => setMobileOpen(false)}>
            {ctaText}
          </Button>
        </nav>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Nav.tsx
git commit -m "feat: add Nav component with mobile menu"
```

---

### Task 7: FormEmbed Component

**Files:**
- Create: `components/FormEmbed.tsx`

- [ ] **Step 1: Create FormEmbed component**

Create `components/FormEmbed.tsx`:
```tsx
interface FormEmbedProps {
  src?: string;
  title: string;
  subheading: string;
}

export default function FormEmbed({ src, title, subheading }: FormEmbedProps) {
  return (
    <div
      className="bg-white/5 backdrop-blur-xl p-10 rounded-xl"
      id="inquiry-form"
    >
      <h2 className="font-headline text-2xl font-bold text-on-primary mb-4">
        {title}
      </h2>
      <p className="text-on-primary-container text-[0.9375rem] mb-8 max-w-none leading-relaxed">
        {subheading}
      </p>

      <div className="min-h-[320px] flex items-center justify-center">
        {src ? (
          <iframe
            src={src}
            title="Request Information Form"
            className="w-full min-h-[320px] border-none rounded-md"
          />
        ) : (
          <div className="w-full min-h-[320px] border-2 border-dashed border-white/15 rounded-md flex items-center justify-center text-on-primary-container text-sm text-center p-8">
            Pardot form will be embedded here.
            <br />
            Replace this placeholder with the iframe URL.
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/FormEmbed.tsx
git commit -m "feat: add FormEmbed component with placeholder support"
```

---

### Task 8: Hero Component

**Files:**
- Create: `components/Hero.tsx`

- [ ] **Step 1: Create Hero component**

Create `components/Hero.tsx`:
```tsx
import Container from "./ui/Container";
import Kicker from "./ui/Kicker";
import FormEmbed from "./FormEmbed";
import { HeroData } from "@/lib/types";

export default function Hero({
  program,
  title,
  titleBreak,
  titleEmphasis,
  bodyText,
  heroImage,
  heroFocalPoint,
  heroAlt,
  formTitle,
  formSubheading,
  formSrc,
}: HeroData) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary py-32 max-md:py-16">
      {/* Background image — full color, focal-point positioned */}
      <img
        src={heroImage}
        alt={heroAlt}
        role={heroAlt ? undefined : "presentation"}
        className="absolute inset-0 z-0 w-full h-full object-cover"
        style={{
          objectPosition: `${heroFocalPoint.x}% ${heroFocalPoint.y}%`,
        }}
      />

      {/* Subtle gradient overlay — lets photo color through */}
      <div
        className="absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to right, rgba(56, 22, 75, 0.55), rgba(56, 22, 75, 0.25), transparent)",
        }}
      />

      <Container className="relative z-[2] w-full">
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-16 items-center max-lg:grid-cols-1 max-lg:gap-12">
          <div className="flex flex-col gap-6">
            <Kicker>{program}</Kicker>

            <h1 className="text-on-primary">
              {title}
              {titleBreak && <br />} to{" "}
              <em className="italic text-accent">{titleEmphasis}</em>
            </h1>

            <p className="text-on-primary-container text-lg max-w-[55ch]">
              {bodyText}
            </p>

            <div className="mt-12 pl-6 border-l border-white/20">
              <p className="text-white/40 text-sm font-body uppercase tracking-[0.2em] max-w-none">
                Est. 1938
              </p>
              <p className="text-white/60 text-xs font-body max-w-none">
                New London, Connecticut
              </p>
            </div>
          </div>

          <FormEmbed
            src={formSrc || undefined}
            title={formTitle}
            subheading={formSubheading}
          />
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: add Hero component with focal-point image and light overlay"
```

---

### Task 9: ExperienceSection Component

**Files:**
- Create: `components/ExperienceSection.tsx`

- [ ] **Step 1: Create ExperienceSection component**

Create `components/ExperienceSection.tsx`:
```tsx
import Container from "./ui/Container";
import Kicker from "./ui/Kicker";
import { ExperienceSectionData } from "@/lib/types";

export default function ExperienceSection({
  kicker,
  heading,
  body,
  courses,
}: Omit<ExperienceSectionData, "type">) {
  return (
    <section className="bg-surface py-32 max-md:py-16">
      <Container>
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-16 items-start max-lg:grid-cols-1 max-lg:gap-12">
          <div className="flex flex-col gap-6">
            <Kicker>{kicker}</Kicker>
            <h2 className="text-on-surface">{heading}</h2>
            {body.map((paragraph, i) => (
              <p key={i} className="text-on-surface-variant leading-[1.7]">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient flex flex-col gap-4">
              <h3 className="text-on-surface">Sample Coursework</h3>
              <ul className="flex flex-col gap-3 list-none m-0 p-0">
                {courses.map((course, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-on-surface-variant text-[0.9375rem] leading-relaxed"
                  >
                    <span
                      className="material-symbols-outlined text-accent shrink-0 text-xl"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ExperienceSection.tsx
git commit -m "feat: add ExperienceSection component"
```

---

### Task 10: InfoCards Component

**Files:**
- Create: `components/InfoCards.tsx`

- [ ] **Step 1: Create InfoCards component**

Create `components/InfoCards.tsx`:
```tsx
import Container from "./ui/Container";
import { InfoCardsSectionData } from "@/lib/types";

export default function InfoCards({
  cards,
}: Omit<InfoCardsSectionData, "type">) {
  return (
    <section className="bg-surface-container-low py-32 max-md:py-16">
      <Container>
        <div className="grid grid-cols-3 gap-12 max-lg:grid-cols-2 max-lg:gap-8 max-md:grid-cols-1 max-md:gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient flex flex-col gap-4"
            >
              <div className="text-accent leading-none mb-2">
                <span
                  className="material-symbols-outlined text-[2.5rem]"
                  aria-hidden="true"
                >
                  {card.icon}
                </span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface">
                {card.title}
              </h3>
              <p className="text-on-surface-variant text-[0.9375rem] leading-[1.7] max-w-none">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/InfoCards.tsx
git commit -m "feat: add InfoCards component"
```

---

### Task 11: CareerSection Component

**Files:**
- Create: `components/CareerSection.tsx`

- [ ] **Step 1: Create CareerSection component**

Create `components/CareerSection.tsx`:
```tsx
import Container from "./ui/Container";
import Kicker from "./ui/Kicker";
import Button from "./ui/Button";
import { CareerSectionData } from "@/lib/types";

export default function CareerSection({
  kicker,
  heading,
  body,
  roles,
  aside,
  closingBody,
  ctaText,
  ctaHref,
}: Omit<CareerSectionData, "type">) {
  return (
    <section className="bg-primary-light py-32 max-md:py-16">
      <Container>
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-16 items-center max-lg:grid-cols-1 max-lg:gap-12">
          <div className="flex flex-col gap-6">
            <Kicker>{kicker}</Kicker>
            <h2 className="text-on-primary">{heading}</h2>
            <p className="text-on-primary-container leading-[1.7] max-w-none">
              {body}
            </p>

            <ul className="grid grid-cols-2 gap-3 list-none m-0 p-0 max-md:grid-cols-1">
              {roles.map((role, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 py-3 px-4 bg-white/5 rounded-md text-on-primary text-[0.9375rem] font-medium transition-colors hover:bg-white/[0.08]"
                >
                  <span
                    className="material-symbols-outlined text-accent shrink-0 text-lg"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                  {role}
                </li>
              ))}
            </ul>

            {closingBody && (
              <p className="text-on-primary-container leading-[1.7] max-w-none">
                {closingBody}
              </p>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-12 rounded-xl flex flex-col gap-6">
            <h3 className="text-on-primary">{aside.heading}</h3>
            <p className="text-on-primary-container leading-[1.7] max-w-none">
              {aside.body}
            </p>
            {ctaText && ctaHref && (
              <Button href={ctaHref}>{ctaText}</Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/CareerSection.tsx
git commit -m "feat: add CareerSection component with glassmorphic aside"
```

---

### Task 12: SecondaryCTA Component

**Files:**
- Create: `components/SecondaryCTA.tsx`

- [ ] **Step 1: Create SecondaryCTA component**

Create `components/SecondaryCTA.tsx`:
```tsx
import Container from "./ui/Container";
import Kicker from "./ui/Kicker";
import Button from "./ui/Button";
import { SecondaryCtaSectionData } from "@/lib/types";

export default function SecondaryCTA({
  kicker,
  heading,
  body,
  primaryCta,
  secondaryCta,
}: Omit<SecondaryCtaSectionData, "type">) {
  return (
    <section className="bg-surface py-32 max-md:py-16 text-center">
      <Container>
        <div className="max-w-[700px] mx-auto flex flex-col items-center gap-6">
          <Kicker>{kicker}</Kicker>
          <h2 className="text-on-surface">{heading}</h2>
          <p className="text-on-surface-variant max-w-[60ch] leading-[1.7]">
            {body}
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center max-md:flex-col max-md:w-full">
            <Button
              href={primaryCta.href}
              className="max-md:w-full max-md:justify-center"
            >
              {primaryCta.text}
            </Button>
            {secondaryCta && (
              <Button
                variant="secondary"
                href={secondaryCta.href}
                className="max-md:w-full max-md:justify-center"
              >
                {secondaryCta.text}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SecondaryCTA.tsx
git commit -m "feat: add SecondaryCTA component"
```

---

### Task 13: Footer Component

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: Create Footer component**

Create `components/Footer.tsx`:
```tsx
import Container from "./ui/Container";

export default function Footer() {
  return (
    <footer className="bg-primary-light py-32 max-md:py-16">
      <Container>
        <div className="grid grid-cols-4 gap-12 pt-16 border-t border-white/10 max-lg:grid-cols-2 max-lg:gap-8 max-md:grid-cols-1">
          {/* Brand */}
          <div>
            <p className="font-body text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-on-primary mb-6">
              Mitchell College
            </p>
            <p className="text-sm text-white/70 leading-[1.7] max-w-[30ch]">
              Empowering adult learners to honor their promise and complete their
              degree — since 1938 in New London, Connecticut.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              <li className="mb-2">
                <span className="font-body text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-on-primary">
                  Navigate
                </span>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 no-underline transition-colors hover:text-accent">
                  Academics
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 no-underline transition-colors hover:text-accent">
                  Admissions
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 no-underline transition-colors hover:text-accent">
                  Campus Life
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 no-underline transition-colors hover:text-accent">
                  Alumni
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              <li className="mb-2">
                <span className="font-body text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-on-primary">
                  Connect
                </span>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 no-underline transition-colors hover:text-accent">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 no-underline transition-colors hover:text-accent">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 no-underline transition-colors hover:text-accent">
                  Give
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 no-underline transition-colors hover:text-accent">
                  Press Room
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              <li className="mb-2">
                <span className="font-body text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-on-primary">
                  Legal
                </span>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 no-underline transition-colors hover:text-accent">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 no-underline transition-colors hover:text-accent">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/70 no-underline transition-colors hover:text-accent">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between gap-6 flex-wrap mt-16 pt-8 border-t border-white/5 max-md:flex-col max-md:items-start max-md:gap-4">
          <p className="text-[0.8125rem] text-white/70 max-w-none">
            &copy; {new Date().getFullYear()} Mitchell College. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Facebook"
              rel="noopener noreferrer"
              target="_blank"
              className="inline-flex items-center justify-center text-white/70 no-underline transition-colors hover:text-on-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              rel="noopener noreferrer"
              target="_blank"
              className="inline-flex items-center justify-center text-white/70 no-underline transition-colors hover:text-on-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="YouTube"
              rel="noopener noreferrer"
              target="_blank"
              className="inline-flex items-center justify-center text-white/70 no-underline transition-colors hover:text-on-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add Footer component"
```

---

### Task 14: SectionRenderer & Page Routes

**Files:**
- Create: `components/SectionRenderer.tsx`
- Create: `app/[slug]/page.tsx`
- Modify: `app/page.tsx`
- Create: `app/not-found.tsx`

- [ ] **Step 1: Create SectionRenderer**

Create `components/SectionRenderer.tsx`:
```tsx
import { SectionData } from "@/lib/types";
import ExperienceSection from "./ExperienceSection";
import InfoCards from "./InfoCards";
import CareerSection from "./CareerSection";
import SecondaryCTA from "./SecondaryCTA";

interface SectionRendererProps {
  sections: SectionData[];
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, i) => {
        switch (section.type) {
          case "experience": {
            const { type, ...props } = section;
            return <ExperienceSection key={i} {...props} />;
          }
          case "infoCards": {
            const { type, ...props } = section;
            return <InfoCards key={i} {...props} />;
          }
          case "career": {
            const { type, ...props } = section;
            return <CareerSection key={i} {...props} />;
          }
          case "secondaryCta": {
            const { type, ...props } = section;
            return <SecondaryCTA key={i} {...props} />;
          }
          default:
            return null;
        }
      })}
    </>
  );
}
```

- [ ] **Step 2: Create dynamic [slug] page**

Create `app/[slug]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { getPageBySlug, getAllSlugs } from "@/lib/content";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SectionRenderer from "@/components/SectionRenderer";
import Footer from "@/components/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function LandingPage({ params }: PageProps) {
  const { slug } = await params;

  let page;
  try {
    page = getPageBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <>
      <a className="absolute -top-full left-4 z-[100] px-4 py-2 bg-secondary text-white font-semibold no-underline rounded-md focus:top-4" href="#main-content">
        Skip to content
      </a>

      <Nav
        logoText="Mitchell College"
        ctaText="Request Info"
        ctaHref="#inquiry-form"
      />

      <main id="main-content">
        <Hero {...page} />
        <SectionRenderer sections={page.sections} />
      </main>

      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Create root page**

Replace `app/page.tsx` with:
```tsx
import { getPageBySlug } from "@/lib/content";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SectionRenderer from "@/components/SectionRenderer";
import Footer from "@/components/Footer";

export default function HomePage() {
  const page = getPageBySlug("business");

  return (
    <>
      <a className="absolute -top-full left-4 z-[100] px-4 py-2 bg-secondary text-white font-semibold no-underline rounded-md focus:top-4" href="#main-content">
        Skip to content
      </a>

      <Nav
        logoText="Mitchell College"
        ctaText="Request Info"
        ctaHref="#inquiry-form"
      />

      <main id="main-content">
        <Hero {...page} />
        <SectionRenderer sections={page.sections} />
      </main>

      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Create not-found page**

Create `app/not-found.tsx`:
```tsx
"use client";

import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    const attempted = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    window.location.replace(
      `/?UTM_COMMENT=404Redir&attempted_url=${attempted}`
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <p className="text-on-surface-variant">Redirecting…</p>
    </div>
  );
}
```

- [ ] **Step 5: Clean up scaffolded files**

Remove any default scaffold files that are no longer needed:
```bash
rm -f app/favicon.ico app/page.module.css
```

- [ ] **Step 6: Verify full build**

```bash
npm run build
```

Expected: Build succeeds. The root route renders the business landing page. The `[slug]` route generates a static page for "business".

- [ ] **Step 7: Verify dev server**

```bash
npm run dev
```

Open `http://localhost:3000` in browser. Verify:
- Nav renders with "Mitchell College" and "Request Info" button
- Hero shows with the Firebase image, no grayscale, light gradient overlay
- All sections render with correct content
- Fonts are Nunito (headlines) and Gentium Book Plus (body)
- Colors match new purple (#38164B) and accent yellow (#E1E44A)
- Mobile menu works on narrow viewport

- [ ] **Step 8: Commit**

```bash
git add app/ components/SectionRenderer.tsx
git commit -m "feat: add page routes, section renderer, and 404 redirect"
```

---

### Task 15: Final Cleanup & Verification

**Files:**
- Verify all files

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors or warnings.

- [ ] **Step 2: Run production preview**

```bash
npm run start
```

Open `http://localhost:3000`. Verify:
- Page matches the original HTML version in content and layout
- New purple (#38164B) is used in nav, hero overlay, dark sections
- Accent yellow (#E1E44A) on emphasized hero text, icons, hover states
- Nunito on all headlines, Gentium Book Plus on all body text
- Hero photo shows in full color with light gradient
- Form placeholder renders correctly
- All responsive breakpoints work (mobile, tablet, desktop)
- Skip link, focus indicators, and ARIA attributes are present
- 404 redirect works (visit `/nonexistent`)

- [ ] **Step 3: Commit final state**

```bash
git add -A
git commit -m "feat: complete Next.js refactor with component architecture"
```
