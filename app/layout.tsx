import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import ConsentInit from "@/components/ConsentInit";
import "./globals.css";

const GTM_ID = "GTM-N7HLJZZ8";

const decalotype = localFont({
  src: [
    { path: "../public/fonts/decalotype/decalotype.regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/decalotype/decalotype.bold.woff2", weight: "700", style: "normal" },
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
        url: "https://online.mitchell.edu/images/og-hero.jpg",
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
      "https://online.mitchell.edu/images/og-hero.jpg",
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
      className={`${decalotype.variable} ${roundo.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="" />
        <link rel="preconnect" href="https://go.info-education.com" crossOrigin="" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted',functionality_storage:'granted',security_storage:'granted'});`,
          }}
        />
      </head>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <ConsentInit />
      </body>
    </html>
  );
}
