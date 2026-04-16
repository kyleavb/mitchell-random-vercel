"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./ui/Container";

const PROGRAMS = [
  { label: "Overview", href: "/programs" },
  { label: "Business", href: "/programs/business" },
  { label: "Health and Human Services", href: "/programs/health-and-human-services" },
];

export default function ProgramsNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-primary border-t border-white/10" aria-label="Programs">
      <Container>
        <ul className="flex items-center gap-1 list-none m-0 p-0 overflow-x-auto">
          {PROGRAMS.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`inline-block px-5 py-3 text-sm font-headline font-bold tracking-wide no-underline whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-accent border-b-2 border-accent"
                      : "text-white/70 hover:text-white border-b-2 border-transparent"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}
