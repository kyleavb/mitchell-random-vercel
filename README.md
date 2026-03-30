# Mitchell College Landing Pages

Next.js landing page system for Mitchell College paid media campaigns. Each landing page is driven by an MDX content file and rendered using reusable React components.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding a New Landing Page

1. Duplicate `content/pages/business.mdx`
2. Change the `slug` and update content (hero, sections, etc.)
3. Add a hero image to `public/images/` and update `heroImage` path
4. Adjust `heroFocalPoint: { x, y }` to frame the subject correctly
5. Deploy — static generation picks it up automatically at `/<slug>`

## Project Structure

- `app/` — Next.js App Router pages and layout
- `components/` — Reusable section components (Hero, InfoCards, etc.)
- `components/ui/` — Shared primitives (Button, Kicker, Container)
- `content/pages/` — MDX content files (one per landing page)
- `lib/` — TypeScript types and content loader
- `public/images/` — Static assets (hero photos, logos)

## Deployment

Deployed to Vercel. Push to main to trigger a build.
