"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "./ui/Container";
import Button from "./ui/Button";
import { MenuIcon, CloseIcon } from "./icons";

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const SITE_LINKS: NavLink[] = [
  {
    label: "Programs",
    href: "/programs",
    children: [
      { label: "Business", href: "/programs/business" },
      { label: "Health and Human Services", href: "/programs/health-and-human-services" },
    ],
  },
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

function NavDropdown({ item }: { item: NavLink }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={item.href}
        className="text-sm font-headline font-bold text-on-primary/80 no-underline hover:text-on-primary transition-colors tracking-wide inline-flex items-center gap-1"
        onClick={() => setOpen(false)}
      >
        {item.label}
        <svg
          className={`w-3 h-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 12 12"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </Link>

      <div
        className={`absolute top-full left-0 pt-2 transition-all duration-150 ${
          open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"
        }`}
      >
        <div className="bg-primary-light rounded-lg shadow-elevated border border-white/10 py-2 min-w-[220px]">
          <Link
            href={item.href}
            className="block px-4 py-2 text-sm font-headline font-bold text-on-primary/80 no-underline hover:text-on-primary hover:bg-white/5 transition-colors tracking-wide"
            onClick={() => setOpen(false)}
          >
            All Programs
          </Link>
          <div className="border-t border-white/10 my-1" />
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="block px-4 py-2 text-sm font-headline text-on-primary/70 no-underline hover:text-on-primary hover:bg-white/5 transition-colors"
              onClick={() => setOpen(false)}
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
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
                {SITE_LINKS.map((item) =>
                  item.children ? (
                    <NavDropdown key={item.href} item={item} />
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-headline font-bold text-on-primary/80 no-underline hover:text-on-primary transition-colors tracking-wide"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>
            )}

            <div className="hidden md:flex items-center">
              <Button href={ctaHref} fallbackHref="/contact">
                {ctaText}
              </Button>
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
            SITE_LINKS.map((item) => (
              <div key={item.href} className="flex flex-col items-center gap-3">
                <Link
                  href={item.href}
                  className="text-lg font-headline font-bold text-on-primary no-underline tracking-wide"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="text-base font-headline text-on-primary/60 no-underline tracking-wide"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          <Button href={ctaHref} fallbackHref="/contact" onClick={() => setMobileOpen(false)}>
            {ctaText}
          </Button>
        </nav>
      </div>
    </>
  );
}
