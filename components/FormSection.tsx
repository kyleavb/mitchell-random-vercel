import Container from "./ui/Container";
import FormEmbed from "./FormEmbed";
import { FormSectionData } from "@/lib/types";

export default function FormSection({
  heading,
  body,
  formTitle,
  formSubheading,
  formSrc,
}: Omit<FormSectionData, "type">) {
  return (
    <section className="bg-white py-32 max-md:py-16">
      <Container>
        <div className="grid grid-cols-[1fr_0.8fr] gap-16 items-start max-lg:grid-cols-1 max-lg:gap-12">
          <div className="flex flex-col gap-6">
            <h2 className="text-on-surface">{heading}</h2>
            {body.map((paragraph, i) => (
              <p
                key={i}
                className="text-on-surface-variant leading-[1.7] max-w-[65ch]"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            ))}
          </div>

          <FormEmbed
            src={formSrc || undefined}
            title={formTitle}
            subheading={formSubheading}
          />
        </div>
      </Container>
    </section>
  );
}
