import Container from "./ui/Container";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-light">
      <Container>
        <div className="flex flex-col items-center text-center gap-12 py-16">
          <div className="flex flex-col items-center gap-4 max-w-lg">
            <p className="font-headline text-xl font-bold text-on-primary">
              Mitchell College
            </p>
            <p className="text-white/50 text-sm">
              437 Pequot Ave, New London, CT 06320
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col items-center justify-center">
          <p className="text-white/50 text-sm">
            &copy; {year} Mitchell College. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
