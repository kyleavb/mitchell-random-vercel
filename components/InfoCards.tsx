import Container from "./ui/Container";
import { InfoCardsSectionData } from "@/lib/types";

export default function InfoCards({
  cards,
}: Omit<InfoCardsSectionData, "type">) {
  return (
    <section className="bg-secondary py-32 max-md:py-16">
      <Container>
        <div className="grid grid-cols-3 gap-12 max-lg:grid-cols-2 max-lg:gap-8 max-md:grid-cols-1 max-md:gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient flex flex-col gap-4"
            >
              <div className="text-primary leading-none mb-2">
                <span
                  className="material-symbols-outlined text-[2.5rem]"
                  aria-hidden="true"
                >
                  {card.icon}
                </span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface">
                {card.title}
              </h3>
              <p className="text-on-surface-variant text-[0.9375rem] leading-[1.7] max-w-none">
                {card.body}
              </p>
              {card.items && (
                <ul className="flex flex-col gap-2 list-none m-0 p-0">
                  {card.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-on-surface-variant text-[0.875rem] leading-relaxed"
                    >
                      <span
                        className="material-symbols-outlined text-primary shrink-0 text-base"
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {card.footnote && (
                <p className="text-on-surface-variant text-[0.9375rem] leading-[1.7] font-medium max-w-none">
                  {card.footnote}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
