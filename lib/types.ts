export interface FocalPoint {
  x: number;
  y: number;
}

export interface HeroData {
  program: string;
  title: string;
  titleBreak?: boolean;
  titleEmphasis: string;
  bodyText: string;
  heroImage: string;
  heroFocalPoint: FocalPoint;
  heroAlt: string;
  formTitle: string;
  formSubheading: string;
  formSrc?: string;
}

export interface ExperienceSectionData {
  type: "experience";
  kicker: string;
  heading: string;
  body: string[];
  courses: string[];
}

export interface InfoCardData {
  icon: string;
  title: string;
  body: string;
}

export interface InfoCardsSectionData {
  type: "infoCards";
  cards: InfoCardData[];
}

export interface CareerAsideData {
  heading: string;
  body: string;
}

export interface CareerSectionData {
  type: "career";
  kicker: string;
  heading: string;
  body: string;
  roles: string[];
  aside: CareerAsideData;
  closingBody?: string;
  ctaText?: string;
  ctaHref?: string;
}

export interface CtaLink {
  text: string;
  href: string;
}

export interface SecondaryCtaSectionData {
  type: "secondaryCta";
  kicker: string;
  heading: string;
  body: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
}

export type SectionData =
  | ExperienceSectionData
  | InfoCardsSectionData
  | CareerSectionData
  | SecondaryCtaSectionData;

export interface PageData extends HeroData {
  slug: string;
  sections: SectionData[];
}
