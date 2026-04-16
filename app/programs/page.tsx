import { getPageBySlug } from "@/lib/content";
import Nav from "@/components/Nav";
import ProgramsNav from "@/components/ProgramsNav";
import Hero from "@/components/Hero";
import SectionRenderer from "@/components/SectionRenderer";
import Footer from "@/components/Footer";

export default function ProgramsPage() {
  const page = getPageBySlug("programs");

  return (
    <>
      <a className="absolute -top-full left-4 z-[100] px-4 py-2 bg-secondary text-white font-semibold no-underline rounded-md focus:top-4" href="#main-content">
        Skip to content
      </a>

      <Nav
        logoText="Mitchell College"
        logoSrc="/images/Mitchell_Logo_Horizontal_White.png"
        ctaText="Request Info"
        ctaHref="#inquiry-form"
      />
      <ProgramsNav />

      <main id="main-content">
        <Hero {...page} />
        <SectionRenderer sections={page.sections} />
      </main>

      <Footer />
    </>
  );
}
