import Container from "./ui/Container";
import Kicker from "./ui/Kicker";
import FormEmbed from "./FormEmbed";
import { ContactDetailsSectionData } from "@/lib/types";

export default function ContactDetailsSection({
  kicker,
  heading,
  body,
  contacts,
  formTitle,
  formSubheading,
  formSrc,
}: Omit<ContactDetailsSectionData, "type">) {
  return (
    <section className="bg-white py-32 max-md:py-16">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-16 items-start">
          <div className="flex flex-col gap-8">
            {kicker && <Kicker>{kicker}</Kicker>}
            <h2 className="text-on-surface">{heading}</h2>
            {body && (
              <p className="text-on-surface-variant leading-[1.7] max-w-[65ch]">
                {body}
              </p>
            )}

            <div className="flex flex-col gap-6">
              {contacts.map((contact, i) => (
                <div
                  key={i}
                  className="bg-surface-container-low rounded-xl p-6 flex flex-col gap-1"
                >
                  <p className="font-headline font-bold text-on-surface">
                    {contact.name}
                  </p>
                  <p className="text-on-surface-variant text-sm">
                    {contact.title}
                  </p>
                  <p className="text-sm mt-2">
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-secondary no-underline hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </p>
                  <p className="text-sm">
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-secondary no-underline hover:underline"
                    >
                      {contact.email}
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {formTitle && (
            <FormEmbed
              src={formSrc || undefined}
              title={formTitle}
              subheading={formSubheading || ""}
            />
          )}
        </div>
      </Container>
    </section>
  );
}
