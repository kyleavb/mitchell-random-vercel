"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "./ui/Container";
import Button from "./ui/Button";
import { MenuIcon, CloseIcon } from "./icons";

interface NavLink {
  label: string;
  href: string;
}

const SITE_LINKS: NavLink[] = [
  { label: "Programs", href: "/programs" },
  { label: "Admissions", href: "/admissions" },
  { label: "Tuition & Fees", href: "/tuition-and-fees" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
];

interface NavProps {
  logoText: string;
  logoSrc?: string;
  logoHref?: string;
  ctaText: string;
  ctaHref: string;
  minimal?: boolean;
}

export default function Nav({ logoText, logoSrc, logoHref = "/", ctaText, ctaHref, minimal }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary-light backdrop-blur-xl">
        <Container>
          <div className="flex items-center justify-between gap-8 py-4">
            <a
              href={logoHref}
              className="shrink-0 font-headline text-[1.75rem] font-bold text-on-primary no-underline tracking-tight"
            >
              {logoSrc ? (
                <Image src={logoSrc} alt={logoText} width={200} height={56} className="max-h-14 w-auto" />
              ) : (
                logoText
              )}
            </a>

            {!minimal && (
              <nav className="hidden lg:flex items-center gap-6" aria-label="Main">
                {SITE_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-sm font-headline font-bold text-on-primary/80 no-underline hover:text-on-primary transition-colors tracking-wide"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            )}

            <div className="hidden md:flex items-center">
              <Button href={ctaHref}>{ctaText}</Button>
            </div>

            {!minimal && (
              <button
                className="flex lg:hidden flex-col justify-center items-center w-10 h-10 bg-transparent border-none cursor-pointer text-on-primary p-2"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            )}

            {minimal && (
              <button
                className="flex md:hidden flex-col justify-center items-center w-10 h-10 bg-transparent border-none cursor-pointer text-on-primary p-2"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            )}
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
          <CloseIcon className="w-6 h-6" />
        </button>

        <nav className="flex flex-col items-center gap-6">
          {!minimal &&
            SITE_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-lg font-headline font-bold text-on-primary no-underline tracking-wide"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          <Button href={ctaHref} onClick={() => setMobileOpen(false)}>
            {ctaText}
          </Button>
        </nav>
      </div>
    </>
  );
}
