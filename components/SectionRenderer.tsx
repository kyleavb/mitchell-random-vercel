import { SectionData } from "@/lib/types";
import ExperienceSection from "./ExperienceSection";
import ProgramsSection from "./ProgramsSection";
import InfoCards from "./InfoCards";
import CareerSection from "./CareerSection";
import SecondaryCTA from "./SecondaryCTA";
import FormSection from "./FormSection";

interface SectionRendererProps {
  sections: SectionData[];
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, i) => {
        switch (section.type) {
          case "experience": {
            const { type: _type, ...props } = section;
            return <ExperienceSection key={i} {...props} />;
          }
          case "programs": {
            const { type: _type, ...props } = section;
            return <ProgramsSection key={i} {...props} />;
          }
          case "infoCards": {
            const { type: _type, ...props } = section;
            return <InfoCards key={i} {...props} />;
          }
          case "career": {
            const { type: _type, ...props } = section;
            return <CareerSection key={i} {...props} />;
          }
          case "secondaryCta": {
            const { type: _type, ...props } = section;
            return <SecondaryCTA key={i} {...props} />;
          }
          case "formSection": {
            const { type: _type, ...props } = section;
            return <FormSection key={i} {...props} />;
          }
          default:
            return null;
        }
      })}
    </>
  );
}
