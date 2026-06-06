import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/i18n/context";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arabiandeserthome.com"),
  title: "Arabian Desert Home | Ultra-Premium Desert Retreat in Agafay",
  description:
    "Discover Arabian Desert Home — an ultra-premium luxury retreat nestled in the Agafay Desert near Marrakech. Exclusive tented suites, private desert experiences, romantic escapes, and bespoke events beneath the stars.",
  keywords: [
    "luxury desert retreat",
    "Agafay desert",
    "Marrakech luxury",
    "glamping Morocco",
    "desert tent",
    "romantic escape Morocco",
    "private desert experience",
    "luxury Morocco",
    "desert wedding",
  ],
  authors: [{ name: "Arabian Desert Home" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Arabian Desert Home | Ultra-Premium Desert Retreat",
    description:
      "Where silence speaks and the desert whispers. An exclusive luxury retreat in the Agafay Desert near Marrakech.",
    url: "https://arabiandeserthome.com",
    siteName: "Arabian Desert Home",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/hero.png",
        width: 1344,
        height: 768,
        alt: "Arabian Desert Home — Luxury Retreat at Golden Hour",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arabian Desert Home | Ultra-Premium Desert Retreat",
    description:
      "Where silence speaks and the desert whispers. An exclusive luxury retreat in the Agafay Desert.",
    images: ["/images/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://arabiandeserthome.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              name: "Arabian Desert Home",
              description:
                "Ultra-premium luxury desert retreat in the Agafay Desert near Marrakech, Morocco",
              url: "https://arabiandeserthome.com",
              image: "https://arabiandeserthome.com/images/hero.png",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Agafay",
                addressRegion: "Marrakech-Safi",
                addressCountry: "MA",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 31.45,
                longitude: -8.15,
              },
              priceRange: "$$$$",
              starRating: {
                "@type": "Rating",
                ratingValue: "5",
              },
              amenityFeature: [
                { "@type": "LocationFeatureSpecification", name: "Private Desert Experiences" },
                { "@type": "LocationFeatureSpecification", name: "Luxury Tented Suites" },
                { "@type": "LocationFeatureSpecification", name: "Fine Dining" },
                { "@type": "LocationFeatureSpecification", name: "Spa & Wellness" },
                { "@type": "LocationFeatureSpecification", name: "Event Space" },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${cormorant.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
