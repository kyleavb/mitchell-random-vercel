import Link from "next/link";
import Container from "./ui/Container";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="bg-surface-container-low border-b border-outline-variant/30">
      <Container>
        <nav aria-label="Breadcrumb" className="py-3">
          <ol className="flex items-center gap-2 list-none m-0 p-0 text-sm">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="text-on-surface-variant/50" aria-hidden="true">
                    /
                  </span>
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-secondary no-underline hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-on-surface-variant">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </div>
  );
}
