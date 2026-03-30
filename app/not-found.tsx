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
