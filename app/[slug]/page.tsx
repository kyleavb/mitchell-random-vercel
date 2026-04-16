import { notFound } from "next/navigation";
import { getPageBySlug, getAllSlugs } from "@/lib/content";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SectionRenderer from "@/components/SectionRenderer";
import Footer from "@/components/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs().filter((slug) => slug !== "home");
  return slugs.map((slug) => ({ slug }));
}

export default async function LandingPage({ params }: PageProps) {
  const { slug } = await params;

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
