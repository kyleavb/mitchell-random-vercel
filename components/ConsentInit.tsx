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
