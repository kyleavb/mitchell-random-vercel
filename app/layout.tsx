import type { Metadata } from "next";
import { Nunito, Gentium_Book_Plus } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const gentiumBookPlus = Gentium_Book_Plus({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-gentium",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mitchell College — Honor the Promise to Yourself",
  description:
    "Mitchell College accepts 60+ transfer credits and offers flexible pathways to help you finish your degree. Honor the promise you made to yourself.",
  icons: {
    icon: "/images/Mitchell_Logo_Vertical_Color.png",
  },
  openGraph: {
    title: "Mitchell College — Honor the Promise to Yourself",
    description:
      "Mitchell College accepts 60+ transfer credits and offers flexible pathways to help you finish your degree. Honor the promise you made to yourself.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Students around a table, laughing and studying",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mitchell College — Honor the Promise to Yourself",
    description:
      "Mitchell College accepts 60+ transfer credits and offers flexible pathways to help you finish your degree. Honor the promise you made to yourself.",
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${gentiumBookPlus.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
