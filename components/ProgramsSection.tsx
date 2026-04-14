import Container from "./ui/Container";
import { ProgramsSectionData } from "@/lib/types";

export default function ProgramsSection({
  programs,
}: Omit<ProgramsSectionData, "type">) {
  return (
    <section className="bg-surface-container-low py-32 max-md:py-16">
      <Container>
        <div className="grid md:grid-cols-2 gap-12">
          {programs.map((program, i) => (
            <div key={i} className="flex flex-col gap-4">
              <h3 className="text-primary">{program.title}</h3>
              <p className="text-on-surface-variant leading-[1.7] max-w-none">
                {program.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
