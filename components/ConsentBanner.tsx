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
