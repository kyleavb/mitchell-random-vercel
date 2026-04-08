import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const decalotype = localFont({
  src: [
    { path: "../public/fonts/decalotype/decalotype.regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/decalotype/decalotype.bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/decalotype/decalotype.bold-italic.woff2", weight: "700", style: "italic" },
    { path: "../public/fonts/decalotype/decalotype.extrabold.woff2", weight: "800", style: "normal" },
    { path: "../public/fonts/decalotype/decalotype.extrabold-italic.woff2", weight: "800", style: "italic" },
  ],
  variable: "--font-decalotype",
  display: "swap",
});

const roundo = localFont({
  src: [
    { path: "../public/fonts/roundo/roundo.regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/roundo/roundo.medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/roundo/roundo.semibold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/roundo/roundo.bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-roundo",
  display: "swap",
});

const gentiumPlus = localFont({
  src: [
    { path: "../public/fonts/gentium-plus/GentiumPlus-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/gentium-plus/GentiumPlus-Italic.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/gentium-plus/GentiumPlus-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/gentium-plus/GentiumPlus-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-gentium",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mitchell College — Honor the Promise to Yourself",
  description:
    "Mitchell College accepts 60+ transfer credits and offers flexible pathways to help you finish your degree. Honor the promise you made to yourself.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  icons: {
    icon: "/images/Mitchell_Logo_Vertical_Color.png",
  },
  openGraph: {
    title: "Mitchell College — Honor the Promise to Yourself",
    description:
      "Mitchell College accepts 60+ transfer credits and offers flexible pathways to help you finish your degree. Honor the promise you made to yourself.",
    images: [
      {
        url: "https://mitchell-vercel.vercel.app/images/og-hero.jpg",
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
      "https://mitchell-vercel.vercel.app/images/og-hero.jpg",
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
      className={`${decalotype.variable} ${roundo.variable} ${gentiumPlus.variable}`}
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
