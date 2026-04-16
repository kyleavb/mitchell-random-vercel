import Link from "next/link";
import Container from "./ui/Container";
import { ArrowForwardIcon } from "./icons";
import { ProgramsSectionData } from "@/lib/types";

export default function ProgramsSection({
  programs,
}: Omit<ProgramsSectionData, "type">) {
  return (
    <section className="bg-surface-container-low py-32 max-md:py-16">
      <Container>
        <div className="grid md:grid-cols-2 gap-12">
          {programs.map((program, i) =>
            program.href ? (
              <Link
                key={i}
                href={program.href}
                className="flex flex-col gap-4 no-underline group rounded-xl p-8 -m-8 transition-colors hover:bg-surface-container"
              >
                <h3 className="text-primary group-hover:text-secondary transition-colors">
                  {program.title}
                </h3>
                <p className="text-on-surface-variant leading-[1.7] max-w-none">
                  {program.body}
                </p>
                <span className="inline-flex items-center gap-2 font-headline font-bold text-sm text-secondary tracking-wide">
                  Learn More <ArrowForwardIcon className="w-4 h-4" />
                </span>
              </Link>
            ) : (
              <div key={i} className="flex flex-col gap-4">
                <h3 className="text-primary">{program.title}</h3>
                <p className="text-on-surface-variant leading-[1.7] max-w-none">
                  {program.body}
                </p>
              </div>
            )
          )}
        </div>
      </Container>
    </section>
  );
}
