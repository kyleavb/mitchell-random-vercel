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
