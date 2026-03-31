import Container from "./ui/Container";
import Kicker from "./ui/Kicker";
import FormEmbed from "./FormEmbed";
import { HeroData } from "@/lib/types";

export default function Hero({
  program,
  title,
  titleBreak,
  titleEmphasis,
  bodyText,
  heroImage,
  heroFocalPoint,
  heroAlt,
  formTitle,
  formSubheading,
  formSrc,
}: HeroData) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary py-32 max-md:py-16">
      {/* Background image — full color, focal-point positioned */}
      <img
        src={heroImage}
        alt={heroAlt}
        role={heroAlt ? undefined : "presentation"}
        className="absolute inset-0 z-0 w-full h-full object-cover"
        style={{
          objectPosition: `${heroFocalPoint.x}% ${heroFocalPoint.y}%`,
        }}
      />

      {/* Violet gradient overlay — brand primary base per §4.2 */}
      <div
        className="absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to right, rgba(56, 22, 75, 0.85), rgba(56, 22, 75, 0.6), rgba(56, 22, 75, 0.35))",
        }}
      />

      <Container className="relative z-[2] w-full">
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-16 items-center max-lg:grid-cols-1 max-lg:gap-12">
          <div className="flex flex-col gap-6">
            <Kicker className="text-white">{program}</Kicker>

            <h1 className="text-on-primary">
              {title}
              {titleBreak && <br />} to{" "}
              <em className="italic text-accent">{titleEmphasis}</em>
            </h1>

            <p className="text-on-primary-container text-lg max-w-[55ch]">
              {bodyText}
            </p>

            <div className="mt-12 pl-6 border-l border-white/20">
              <p className="text-white/40 text-sm font-body uppercase tracking-[0.2em] max-w-none">
                Est. 1938
              </p>
              <p className="text-white/60 text-xs font-body max-w-none">
                New London, Connecticut
              </p>
            </div>
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
