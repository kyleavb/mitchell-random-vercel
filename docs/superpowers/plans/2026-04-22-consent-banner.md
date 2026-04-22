# Consent Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a site-wide cookie consent banner that interfaces with GTM (`GTM-N7HLJZZ8`) via Google Consent Mode v2. Opt-out default: consent granted until declined.

**Architecture:** A plain inline `<script>` in `<head>` sets `gtag('consent', 'default', {granted})` before the GTM loader runs. A client component `ConsentBanner` renders a slim bottom bar with Accept/Decline buttons, persisting choice to `localStorage`. A separate `ConsentInit` client component fires a `gtag('consent', 'update', {denied})` for return visitors who previously declined, so their tags stay denied across sessions.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, `next/script` for GTM. No test framework — **each task uses manual browser verification** instead of automated tests.

**Spec:** `docs/superpowers/specs/2026-04-22-consent-banner-design.md`

---

## File Structure

**Create:**
- `components/ConsentBanner.tsx` — client component; bottom bar UI, Accept/Decline handlers, localStorage persistence, slide-up animation, accessibility wiring.
- `components/ConsentInit.tsx` — client component; effect-only (renders `null`); on mount reads `localStorage` and pushes a denied consent update if prior choice was `"declined"`.
- `lib/consent.ts` — shared constants and the `gtag` type declaration; avoids repeating `declare global` in multiple files.

**Modify:**
- `app/layout.tsx` — add inline `<script>` in `<head>` with the default consent block; mount `<ConsentInit />` and `<ConsentBanner />` inside `<body>`.

---

## Preflight

- [ ] **Step 0.1: Confirm GTM is installed and GA4 is (or will be) configured inside the GTM container**

Read `app/layout.tsx`. Verify the GTM inline `<Script id="gtm">` block is present and `GTM_ID = "GTM-N7HLJZZ8"`. No code change in this step.

- [ ] **Step 0.2: Start the dev server for later manual verification**

Run: `npm run dev`
Expected: server listening on `http://localhost:3000` (or similar). Leave it running for subsequent task verification.

---

## Task 1: Add `lib/consent.ts` with types and constants

**Files:**
- Create: `lib/consent.ts`

- [ ] **Step 1.1: Create the file**

```ts
// lib/consent.ts

export const CONSENT_STORAGE_KEY = "mc-consent";

export type ConsentChoice = "accepted" | "declined";

export type ConsentState = Record<
  | "ad_storage"
  | "ad_user_data"
  | "ad_personalization"
  | "analytics_storage"
  | "functionality_storage"
  | "security_storage",
  "granted" | "denied"
>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // localStorage unavailable (private mode with storage disabled);
    // session-level consent update still applies.
  }
}

export function pushConsentUpdate(state: Partial<ConsentState>): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", state);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["consent", "update", state]);
}

export const DENIED_UPDATE: Partial<ConsentState> = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};
```

- [ ] **Step 1.2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 1.3: Commit**

```bash
git add lib/consent.ts
git commit -m "add consent helpers and gtag types"
```

---

## Task 2: Inline consent-default script in `<head>`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 2.1: Add the default-consent inline script to `<head>`**

In `app/layout.tsx`, locate the existing `<head>` block (currently contains three `<link rel="preconnect">` tags). Add a new `<script>` tag **after the preconnects and before the closing `</head>`**, using `dangerouslySetInnerHTML`:

```tsx
<head>
  <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
  <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="" />
  <link rel="preconnect" href="https://go.info-education.com" crossOrigin="" />
  <script
    dangerouslySetInnerHTML={{
      __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted',functionality_storage:'granted',security_storage:'granted'});`,
    }}
  />
</head>
```

The existing `<Script id="gtm" strategy="afterInteractive">` block stays unchanged and below `<head>`. The inline `<script>` in `<head>` runs synchronously on HTML parse, before any `afterInteractive` script.

- [ ] **Step 2.2: Verify ordering in the browser**

In an incognito window, open `http://localhost:3000`. Open DevTools → **Network** tab, filter by "gtm". Then DevTools → **Application** → Storage → Local Storage → confirm nothing is set for `mc-consent`.

Open **Console**, run:
```js
window.dataLayer.slice(0, 3)
```
Expected: first entry is the consent-default push (an `Arguments` array with `["consent", "default", {...}]`). Confirms the inline script ran before GTM's `gtm.start` push.

- [ ] **Step 2.3: Commit**

```bash
git add app/layout.tsx
git commit -m "set default GTM consent to granted before loader"
```

---

## Task 3: Create `ConsentInit` (return-visitor denied update)

**Files:**
- Create: `components/ConsentInit.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 3.1: Create the component**

```tsx
// components/ConsentInit.tsx
"use client";

import { useEffect } from "react";
import { DENIED_UPDATE, pushConsentUpdate, readConsent } from "@/lib/consent";

export default function ConsentInit() {
  useEffect(() => {
    if (readConsent() === "declined") {
      pushConsentUpdate(DENIED_UPDATE);
    }
  }, []);

  return null;
}
```

- [ ] **Step 3.2: Mount in layout**

In `app/layout.tsx`, add the import near the other imports:

```tsx
import ConsentInit from "@/components/ConsentInit";
```

Inside `<body>`, after `{children}`, add `<ConsentInit />`:

```tsx
<body>
  <noscript>
    <iframe
      src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
      height="0"
      width="0"
      style={{ display: "none", visibility: "hidden" }}
    />
  </noscript>
  {children}
  <ConsentInit />
</body>
```

- [ ] **Step 3.3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3.4: Manual verify — declined return visitor**

In incognito DevTools console:
```js
localStorage.setItem("mc-consent", "declined")
```
Refresh the page. In Console:
```js
window.dataLayer.filter(e => Array.isArray(e) && e[0] === "consent")
```
Expected: two entries — first is `["consent","default",{granted...}]`, second is `["consent","update",{denied...}]`. Confirms `ConsentInit` pushed the denied update.

Clean up:
```js
localStorage.removeItem("mc-consent")
```

- [ ] **Step 3.5: Commit**

```bash
git add components/ConsentInit.tsx app/layout.tsx
git commit -m "add ConsentInit for return-visitor denied update"
```

---

## Task 4: Create `ConsentBanner` skeleton (visibility logic, renders placeholder)

**Files:**
- Create: `components/ConsentBanner.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 4.1: Create the skeleton**

```tsx
// components/ConsentBanner.tsx
"use client";

import { useEffect, useState } from "react";
import { readConsent } from "@/lib/consent";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readConsent() === null) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 bg-primary text-white"
    >
      <div className="mx-auto max-w-6xl px-6 py-4 max-md:px-4 max-md:py-3">
        placeholder
      </div>
    </div>
  );
}
```

- [ ] **Step 4.2: Mount in layout**

In `app/layout.tsx`, add the import:

```tsx
import ConsentBanner from "@/components/ConsentBanner";
```

Add `<ConsentBanner />` next to `<ConsentInit />`:

```tsx
{children}
<ConsentInit />
<ConsentBanner />
```

- [ ] **Step 4.3: Manual verify — visibility rules**

Incognito `http://localhost:3000`:
- Banner placeholder appears at bottom.
- In Console: `localStorage.setItem("mc-consent","accepted")`, refresh → banner gone.
- `localStorage.removeItem("mc-consent")`, refresh → banner back.
- `localStorage.setItem("mc-consent","declined")`, refresh → banner gone.

No React hydration warnings in Console. (Server renders `null` — `visible` starts `false`; client flips it after mount.)

Clean up:
```js
localStorage.removeItem("mc-consent")
```

- [ ] **Step 4.4: Commit**

```bash
git add components/ConsentBanner.tsx app/layout.tsx
git commit -m "add ConsentBanner skeleton with visibility logic"
```

---

## Task 5: Build banner UI — copy, buttons, layout, accessibility

**Files:**
- Modify: `components/ConsentBanner.tsx`

- [ ] **Step 5.1: Replace the placeholder with the real UI**

Update `components/ConsentBanner.tsx` so the full component reads:

```tsx
"use client";

import { useEffect, useState } from "react";
import { readConsent } from "@/lib/consent";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readConsent() === null) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 bg-primary text-white shadow-[0_-4px_16px_rgba(0,0,0,0.15)]"
      style={{ fontFamily: "var(--font-body), sans-serif" }}
    >
      <div className="mx-auto max-w-6xl px-6 py-4 max-md:px-4 max-md:py-3 flex items-center gap-6 max-md:flex-col max-md:items-stretch max-md:gap-3">
        <p className="text-sm leading-relaxed flex-1">
          We use cookies to improve your experience and analyze site traffic. See our{" "}
          <a
            href="https://mitchell.edu/terms-and-conditions-2/#privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Privacy Policy
          </a>{" "}
          for details.
        </p>
        <div className="flex items-center gap-3 max-md:justify-end">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium border border-white/70 text-white rounded-md hover:bg-white/10 transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium bg-white text-primary rounded-md hover:bg-white/90 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
```

Note: buttons are wired as no-ops in this task; click behavior lands in Task 6.

- [ ] **Step 5.2: Manual verify — appearance**

Incognito `http://localhost:3000`. Banner appears at the bottom:
- Mitchell navy (`bg-primary`), white text.
- Copy reads correctly; "Privacy Policy" is underlined and opens `mitchell.edu/terms-and-conditions-2/#privacy` in a new tab on click.
- Decline (outlined) and Accept (filled white) buttons visible on the right.
- Resize browser to mobile width (~375px): layout stacks — text on top, buttons row on bottom aligned right.
- Tab key focuses "Privacy Policy" link, then Decline, then Accept.
- Screen reader (VoiceOver / NVDA spot check if available): announces "Cookie consent region."

- [ ] **Step 5.3: Commit**

```bash
git add components/ConsentBanner.tsx
git commit -m "build consent banner UI with copy and buttons"
```

---

## Task 6: Wire Accept / Decline handlers

**Files:**
- Modify: `components/ConsentBanner.tsx`

- [ ] **Step 6.1: Add handlers and connect to buttons**

Update `components/ConsentBanner.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DENIED_UPDATE,
  pushConsentUpdate,
  readConsent,
  writeConsent,
} from "@/lib/consent";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readConsent() === null) {
      setVisible(true);
    }
  }, []);

  const handleAccept = useCallback(() => {
    writeConsent("accepted");
    setVisible(false);
  }, []);

  const handleDecline = useCallback(() => {
    writeConsent("declined");
    pushConsentUpdate(DENIED_UPDATE);
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 bg-primary text-white shadow-[0_-4px_16px_rgba(0,0,0,0.15)]"
      style={{ fontFamily: "var(--font-body), sans-serif" }}
    >
      <div className="mx-auto max-w-6xl px-6 py-4 max-md:px-4 max-md:py-3 flex items-center gap-6 max-md:flex-col max-md:items-stretch max-md:gap-3">
        <p className="text-sm leading-relaxed flex-1">
          We use cookies to improve your experience and analyze site traffic. See our{" "}
          <a
            href="https://mitchell.edu/terms-and-conditions-2/#privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Privacy Policy
          </a>{" "}
          for details.
        </p>
        <div className="flex items-center gap-3 max-md:justify-end">
          <button
            type="button"
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-medium border border-white/70 text-white rounded-md hover:bg-white/10 transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium bg-white text-primary rounded-md hover:bg-white/90 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6.2: Manual verify — Accept flow**

Incognito `http://localhost:3000`. In Console, clear any stored choice: `localStorage.removeItem("mc-consent")`, refresh.
- Click **Accept** → banner disappears immediately.
- Console: `localStorage.getItem("mc-consent")` → `"accepted"`.
- Refresh → banner stays hidden.
- Console: `window.dataLayer.filter(e => Array.isArray(e) && e[0] === "consent")` → only the initial default-granted entry. No update pushed (correct — consent is already granted).

- [ ] **Step 6.3: Manual verify — Decline flow**

Clear state:
```js
localStorage.removeItem("mc-consent")
```
Refresh.
- Click **Decline** → banner disappears.
- Console: `localStorage.getItem("mc-consent")` → `"declined"`.
- Console: `window.dataLayer.filter(e => Array.isArray(e) && e[0] === "consent")` → two entries: default-granted, then update-denied.
- Refresh → banner stays hidden. `ConsentInit` fires the denied-update on load; same filter in console shows the denied update.

Clean up:
```js
localStorage.removeItem("mc-consent")
```

- [ ] **Step 6.4: Commit**

```bash
git add components/ConsentBanner.tsx
git commit -m "wire consent banner Accept and Decline handlers"
```

---

## Task 7: Slide-up entrance + `prefers-reduced-motion`

**Files:**
- Modify: `app/globals.css`
- Modify: `components/ConsentBanner.tsx`

- [ ] **Step 7.1: Add keyframes and a utility class in `globals.css`**

Append to `app/globals.css` (outside any `@theme` or `@layer base` block, at file end):

```css
@keyframes consent-slide-up {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

.consent-banner-enter {
  animation: consent-slide-up 260ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .consent-banner-enter {
    animation: none;
  }
}
```

- [ ] **Step 7.2: Apply the class in the banner**

In `components/ConsentBanner.tsx`, append `consent-banner-enter` to the outer `<div>`'s `className`:

```tsx
className="fixed bottom-0 inset-x-0 z-50 bg-primary text-white shadow-[0_-4px_16px_rgba(0,0,0,0.15)] consent-banner-enter"
```

- [ ] **Step 7.3: Manual verify — animation**

Incognito `http://localhost:3000`, clear `mc-consent`, refresh. Banner slides up from below viewport on appear.

In DevTools → **Rendering** tab, enable "Emulate CSS media feature prefers-reduced-motion: reduce". Refresh. Banner appears without animation.

Turn emulation off.

- [ ] **Step 7.4: Commit**

```bash
git add app/globals.css components/ConsentBanner.tsx
git commit -m "add consent banner slide-up with reduced-motion support"
```

---

## Task 8: Esc-key dismissal (Accept)

**Files:**
- Modify: `components/ConsentBanner.tsx`

- [ ] **Step 8.1: Add keydown listener for Esc**

In `components/ConsentBanner.tsx`, add a new `useEffect` after the existing mount effect:

```tsx
useEffect(() => {
  if (!visible) return;
  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") {
      handleAccept();
    }
  }
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [visible, handleAccept]);
```

Because the effect depends on `handleAccept`, keep `handleAccept` wrapped in `useCallback` (already done in Task 6).

- [ ] **Step 8.2: Manual verify — Esc dismissal**

Incognito, clear `mc-consent`, refresh. Banner appears. Press **Esc**.
- Banner disappears.
- `localStorage.getItem("mc-consent")` → `"accepted"`.
- No denied-update pushed.

- [ ] **Step 8.3: Commit**

```bash
git add components/ConsentBanner.tsx
git commit -m "dismiss consent banner on Escape key"
```

---

## Task 9: Full verification pass

No new code. Runs through the spec's verification plan end-to-end.

- [ ] **Step 9.1: Build the production bundle and run it**

```bash
npm run build
npm start
```

Expected: build succeeds with no type errors or warnings tied to consent files. Server listens on `http://localhost:3000`.

- [ ] **Step 9.2: Fresh incognito load with GTM Preview**

In the GTM container UI, enter **Preview** mode targeting `http://localhost:3000`. Open the site in the debug window.
- Tag Assistant shows a page-view hit with `analytics_storage = granted`, `ad_storage = granted`.
- Banner is visible.

- [ ] **Step 9.3: Accept path**

Click **Accept** in the banner.
- Banner disappears.
- Navigate to another page (`/info`, `/programs`, etc.). Banner stays hidden.
- Refresh. Banner stays hidden. Tag Assistant continues to show consent = granted.

Clear state between sub-tests:
```js
localStorage.removeItem("mc-consent")
```
and refresh.

- [ ] **Step 9.4: Decline path**

Fresh incognito session. Click **Decline**.
- Banner disappears.
- Tag Assistant shows a consent `update` event with all four ad/analytics signals `denied`.
- Subsequent page views show `analytics_storage = denied`, `ad_storage = denied`.
- Refresh. Banner stays hidden. Tag Assistant shows denied from page 1 (confirms `ConsentInit` pushed the denied update before GA4 fired).

- [ ] **Step 9.5: localStorage cleared → banner returns**

In DevTools, clear all local storage for the site. Refresh. Banner reappears.

- [ ] **Step 9.6: Keyboard-only**

Fresh incognito. Load site. Press Tab repeatedly — focus should reach Privacy Policy link, Decline, Accept. Press Esc — banner dismisses, `mc-consent` = `"accepted"`.

- [ ] **Step 9.7: Mobile viewport**

Resize to ~375px wide (iPhone SE). Banner stacks cleanly: text on top, buttons row below. Doesn't cover the site footer's critical content (scroll to bottom to confirm).

- [ ] **Step 9.8: `/thank-you` page**

Visit `/thank-you` directly in a fresh incognito session. Banner appears there too (expected — mounted in root layout).

- [ ] **Step 9.9: Reduced motion**

DevTools → Rendering → enable `prefers-reduced-motion: reduce`. Fresh incognito load. Banner appears instantly without slide-up animation.

- [ ] **Step 9.10: Screen reader spot check (if available)**

With VoiceOver (macOS) or NVDA (Windows) running, load the site fresh. The banner should be announced as a "Cookie consent region." Tab through to confirm the buttons are announced by label.

- [ ] **Step 9.11: Ship**

If every check above passes, push the branch:

```bash
git push
```
