import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/content";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SectionRenderer from "@/components/SectionRenderer";
import Footer from "@/components/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PROGRAM_SLUGS = ["business", "health-and-human-services"];

export async function generateStaticParams() {
  return PROGRAM_SLUGS.map((slug) => ({ slug }));
}

export default async function ProgramPage({ params }: PageProps) {
  const { slug } = await params;

  if (!PROGRAM_SLUGS.includes(slug)) {
    notFound();
  }

  let page;
  try {
    page = getPageBySlug(slug);
  } catch {
    notFound();
  }

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

      <main id="main-content">
        <Hero {...page} />
        <SectionRenderer sections={page.sections} />
      </main>

      <Footer />
    </>
  );
}
