import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Thank You — Mitchell College",
  description:
    "Thank you for your interest in Mitchell College. We'll be in touch soon.",
};

export default function ThankYouPage() {
  return (
    <>
      <Nav
        logoText="Mitchell College"
        logoSrc="/images/Mitchell_Logo_Horizontal_White.png"
        logoHref="https://mitchell.edu/"
        ctaText="Visit Mitchell College"
        ctaHref="https://mitchell.edu/"
        minimal
      />

      <main className="bg-surface min-h-[70vh] flex items-center">
        <Container className="py-24 max-md:py-16">
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
            <h1 className="text-primary">Thank You!</h1>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-none">
              Thank you for your interest in Mitchell College! An admissions
              counselor will be in touch with you soon to help you take the next
              step toward finishing your degree.
            </p>
            <Button href="https://mitchell.edu/" variant="primary" className="mt-4">
              Visit Mitchell College
            </Button>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
