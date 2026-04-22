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
