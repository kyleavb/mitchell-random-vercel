import Container from "./ui/Container";
import Kicker from "./ui/Kicker";
import { ExperienceSectionData } from "@/lib/types";

export default function ExperienceSection({
  kicker,
  heading,
  body,
  courses,
}: Omit<ExperienceSectionData, "type">) {
  return (
    <section className="bg-surface py-32 max-md:py-16">
      <Container>
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-16 items-start max-lg:grid-cols-1 max-lg:gap-12">
          <div className="flex flex-col gap-6">
            <Kicker>{kicker}</Kicker>
            <h2 className="text-on-surface">{heading}</h2>
            {body.map((paragraph, i) => (
              <p key={i} className="text-on-surface-variant leading-[1.7]">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient flex flex-col gap-4">
              <h3 className="text-on-surface">Sample Coursework</h3>
              <ul className="flex flex-col gap-3 list-none m-0 p-0">
                {courses.map((course, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-on-surface-variant text-[0.9375rem] leading-relaxed"
                  >
                    <span
                      className="material-symbols-outlined text-accent shrink-0 text-xl"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
