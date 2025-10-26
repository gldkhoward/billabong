import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Billabong House — Where Momentum Gathers",
  description: "A riverfront residency home in Drummoyne for builders, researchers, and creators. Focus hard. Ship together. Part of the Arrayah network.",
  keywords: ["residency", "coliving", "coworking", "builder house", "Drummoyne", "Sydney", "Arrayah"],
  openGraph: {
    title: "Billabong House — Where Momentum Gathers",
    description: "A riverfront residency home in Drummoyne for builders, researchers, and creators.",
    type: "website",
    locale: "en_AU",
    siteName: "Billabong House",
  },
  twitter: {
    card: "summary_large_image",
    title: "Billabong House — Where Momentum Gathers",
    description: "A riverfront residency home in Drummoyne for builders, researchers, and creators.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Billabong House",
              url: "https://billabong.house",
              description: "A riverfront residency home in Drummoyne for builders, researchers, and creators.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Drummoyne",
                addressRegion: "NSW",
                addressCountry: "AU",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
