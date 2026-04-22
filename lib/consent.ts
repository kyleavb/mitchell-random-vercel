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
