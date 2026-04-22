# Consent Banner — Design

**Date:** 2026-04-22
**Owner:** Kyle Van Bergen
**Status:** Approved for planning

## Purpose

Add a simple, site-wide cookie consent banner that interfaces with Google Tag Manager (`GTM-N7HLJZZ8`, installed in `app/layout.tsx`) via Google Consent Mode v2. Lets visitors decline tracking without blocking the site experience.

## Consent Model

**Stance:** Opt-out. US-primary audience (Mitchell College, Connecticut). Consent defaults to granted on first page load; the banner lets visitors flip to denied.

**Default consent signals** (set before GTM loads):

```js
gtag('consent', 'default', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
  functionality_storage: 'granted',
  security_storage: 'granted',
});
```

**On Decline click** — update consent to denied for ad/analytics categories:

```js
gtag('consent', 'update', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
});
```

`functionality_storage` and `security_storage` stay granted (site operation, not optional).

**On Accept click** — no consent update (already granted); persist the choice so the banner doesn't reappear.

## Persistence

- **Key:** `mc-consent` in `localStorage`.
- **Values:** `"accepted"` or `"declined"`.
- **Behavior:**
  - If key absent → banner shows.
  - If key present → banner hidden.
  - If `"declined"` → on every page load, `ConsentInit` pushes a `gtag('consent', 'update', {denied})` call so return visitors stay denied.
- **No expiry.** Choice is sticky until the visitor clears storage. Acceptable for opt-out posture.
- **localStorage blocked:** `try/catch` around reads/writes. On failure, treat as "no choice yet" and let session-level consent updates still fire.

## Component Architecture

### New files

- **`components/ConsentBanner.tsx`** (client component)
  - Renders the bottom bar when no choice is persisted.
  - Handles Accept / Decline clicks: writes to localStorage, calls `gtag` for Decline, hides itself.
  - Returns `null` on first render (pre-hydration); `useEffect` flips visibility after localStorage check to avoid flash on return visitors.

- **`components/ConsentInit.tsx`** (client component, effect-only, renders `null`)
  - On mount, reads `localStorage.mc-consent`. If `"declined"`, pushes `gtag('consent', 'update', {denied})`.
  - Separate from the banner because the denied-update must run even when the banner is hidden (return visitors).

### Modified files

- **`app/layout.tsx`**
  - Add a plain inline `<script>` tag inside the existing `<head>` block, **before** the existing GTM `<Script>` in the component tree. Using `<script dangerouslySetInnerHTML>` rather than `next/script`, because Next.js 16 App Router does not support `strategy="beforeInteractive"` outside `pages/_document`; a `<head>` inline script runs synchronously before any `afterInteractive` body script. Contents:
    ```js
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
      functionality_storage: 'granted',
      security_storage: 'granted',
    });
    ```
  - Mount `<ConsentInit />` and `<ConsentBanner />` inside `<body>`, after `{children}`.

## Page-load Flow

1. Inline `<script>` in `<head>` runs synchronously → dataLayer initialized with consent = granted.
2. GTM script loads (`afterInteractive`) → reads dataLayer, fires tags with consent = granted.
3. React hydrates.
4. `ConsentInit` effect runs → if localStorage has `"declined"`, pushes consent update = denied. GTM respects the mid-session update and denies subsequent tag fires.
5. `ConsentBanner` effect runs → if localStorage key is absent, flips visible state and the bar slides up. Otherwise remains hidden.

## UI & Copy

**Placement:** slim fixed bottom bar, `fixed bottom-0 inset-x-0 z-50`.

**Style:**
- Background: `bg-primary` (Mitchell navy), white text.
- Padding: `py-4 px-6` desktop, `py-3 px-4` mobile.
- Shadow: subtle top-edge shadow so it lifts off content.
- Layout: flex row on desktop (copy left, buttons right); stacks column on mobile.
- Font: `var(--font-body)` (Roundo).
- Slide-up entrance animation via a short CSS keyframe; skipped when `prefers-reduced-motion` is set.

**Copy:**

> We use cookies to improve your experience and analyze site traffic. See our [Privacy Policy](https://mitchell.edu/terms-and-conditions-2/#privacy) for details.

Privacy link: `target="_blank" rel="noopener noreferrer"`.

**Buttons:**
- **Decline** — secondary/ghost (transparent bg, white border, white text).
- **Accept** — primary/filled (white bg, `text-primary`). Emphasized as the default action (opt-out posture).
- Order: Decline left, Accept right.

**Accessibility:**
- `role="region"` with `aria-label="Cookie consent"`.
- Real `<button>` elements.
- Keyboard: Tab through buttons; Esc triggers Accept (equivalent to dismissing, since consent is already granted by default).
- Respects `prefers-reduced-motion`.

## Edge Cases

- **`/thank-you`** — banner mounts there too (lives in root layout). Acceptable.
- **localStorage blocked** — try/catch; consent update still fires for the session; banner may re-show on next visit.
- **Return declined visitor** — brief window where default-granted is live before `ConsentInit` pushes the denied update. Consent Mode v2 queues tag fires against resolved state, so the exposure is a single frame in practice.
- **JS disabled** — GTM `<noscript>` iframe still fires. Consent can't be expressed without JS; acceptable.
- **Route changes** — banner persists across client-side nav (in root layout, no remount).

## Verification Plan

Manual QA (no test framework in this repo):

- [ ] Fresh incognito load: banner appears; GTM Preview shows consent = granted on initial pageview.
- [ ] Click Accept: banner disappears; refresh → stays gone; consent remains granted.
- [ ] Click Decline: banner disappears; GTM Preview shows consent update with denied signals; refresh → stays gone; GTM Preview shows denied from first pageview.
- [ ] Clear `localStorage`, reload: banner reappears.
- [ ] Keyboard-only: Tab lands on Accept/Decline; Esc dismisses.
- [ ] Mobile viewport: bar stacks cleanly; doesn't cover critical content.
- [ ] Screen reader: `role="region"` announces the banner.

## Out of Scope

- Category-level toggles (analytics vs. marketing separately). Decided against given "simple" brief.
- Geo-aware defaults (EU-vs-US logic). Single US-friendly default.
- `/privacy` page scaffold. Using external Mitchell.edu URL.
- Re-prompt / expiry of stored choice.
- Server-side consent gating. Consent Mode v2 handles tag-side behavior in-browser.
