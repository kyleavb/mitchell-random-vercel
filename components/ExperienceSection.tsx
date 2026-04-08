import Container from "./ui/Container";
import Kicker from "./ui/Kicker";
import { ExperienceSectionData } from "@/lib/types";
import { CheckCircleIcon } from "./icons";

export default function ExperienceSection({
  kicker,
  heading,
  body,
  sidebarTitle,
  courses,
}: Omit<ExperienceSectionData, "type">) {
  // Insert courses list after the paragraph ending with ":"
  const splitIndex = body.findIndex((p) => p.trimEnd().endsWith(":")) + 1;
  const bodyBefore = splitIndex > 0 ? body.slice(0, splitIndex) : body;
  const bodyAfter = splitIndex > 0 ? body.slice(splitIndex) : [];

  return (
    <section className="bg-white py-32 max-md:py-16">
      <Container>
        <div className="max-w-[100ch] flex flex-col gap-6">
          <Kicker>{kicker}</Kicker>
          <h2 className="text-on-surface">{heading}</h2>
          {bodyBefore.map((paragraph, i) => (
            <p
              key={i}
              className="text-on-surface-variant leading-[1.7] max-w-[100ch]"
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}
          {courses.length > 0 && (
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              {courses.map((course, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-on-surface-variant text-[0.9375rem] leading-relaxed"
                >
                  <CheckCircleIcon className="w-5 h-5 text-primary shrink-0" />
                  {course}
                </li>
              ))}
            </ul>
          )}
          {bodyAfter.map((paragraph, i) => (
            <p
              key={`after-${i}`}
              className="text-on-surface-variant leading-[1.7] max-w-[100ch]"
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
