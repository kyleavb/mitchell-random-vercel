import Container from "./ui/Container";
import Kicker from "./ui/Kicker";
import Button from "./ui/Button";
import { SecondaryCtaSectionData } from "@/lib/types";

export default function SecondaryCTA({
  kicker,
  heading,
  body,
  primaryCta,
  secondaryCta,
}: Omit<SecondaryCtaSectionData, "type">) {
  return (
    <section className="bg-surface py-32 max-md:py-16 text-center">
      <Container>
        <div className="max-w-[700px] mx-auto flex flex-col items-center gap-6">
          <Kicker>{kicker}</Kicker>
          <h2 className="text-on-surface">{heading}</h2>
          <p className="text-on-surface-variant max-w-[60ch] leading-[1.7]">
            {body}
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center max-md:flex-col max-md:w-full">
            <Button
              href={primaryCta.href}
              className="max-md:w-full max-md:justify-center"
            >
              {primaryCta.text}
            </Button>
            {secondaryCta && (
              <Button
                variant="secondary"
                href={secondaryCta.href}
                className="max-md:w-full max-md:justify-center"
              >
                {secondaryCta.text}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
