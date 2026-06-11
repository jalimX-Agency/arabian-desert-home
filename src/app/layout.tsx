import type { Metadata } from "next";
import { Cinzel, Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AdminSessionProvider } from "@/components/admin/SessionProvider";
import { LanguageProvider } from "@/lib/i18n/context";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arabiandeserthome.com"),
  title: "Arabian Desert Home | Bivouac de Luxe à Agafay, Marrakech",
  description:
    "Arabian Desert Home — bivouac de luxe dans le désert d'Agafay à 30 minutes de Marrakech. Suites-tentes exclusives, restaurant gastronomique, piscine, activités désert (dromadaire, équitation) et événements sous les étoiles.",
  keywords: [
    "bivouac luxe Agafay",
    "désert Agafay Marrakech",
    "camp luxe Marrakech",
    "glamping Maroc",
    "tente luxe désert",
    "Arabian Desert Home",
    "séjour désert Agafay",
    "day pass Agafay",
    "mariage désert Marrakech",
    "restaurant désert Agafay",
    "dromadaire Agafay",
    "équitation désert Maroc",
    "luxury desert retreat Morocco",
    "Agafay desert luxury",
  ],
  authors: [{ name: "Arabian Desert Home" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Arabian Desert Home | Bivouac de Luxe — Désert d'Agafay, Marrakech",
    description:
      "Une invitation à l'évasion au cœur du désert d'Agafay. Bivouac de luxe sur 6 hectares, à seulement 30 minutes de Marrakech.",
    url: "https://arabiandeserthome.com",
    siteName: "Arabian Desert Home",
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png",
        width: 1344,
        height: 768,
        alt: "Arabian Desert Home — Bivouac de Luxe dans le Désert d'Agafay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arabian Desert Home | Bivouac de Luxe — Agafay, Marrakech",
    description:
      "Une invitation à l'évasion dans le désert d'Agafay. Suites-tentes de luxe, restaurant, activités et événements à 30 min de Marrakech.",
    images: ["https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
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
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              name: "Arabian Desert Home",
              description:
                "Bivouac de luxe dans le désert d'Agafay à 30 minutes de Marrakech. Six hectares de pur désert, suites-tentes exclusives, restaurant gastronomique et activités sur mesure.",
              url: "https://arabiandeserthome.com",
              image: "https://arabiandeserthome.com/images/hero.png",
              telephone: "+212667370206",
              email: "info@arabiandeserthome.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Douar Ait Said Lchou",
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
              sameAs: [
                "https://www.instagram.com/arabian_desert_home",
                "https://www.facebook.com/arabian_desert_home",
              ],
              amenityFeature: [
                { "@type": "LocationFeatureSpecification", name: "Piscine" },
                { "@type": "LocationFeatureSpecification", name: "Suites-tentes de luxe" },
                { "@type": "LocationFeatureSpecification", name: "Restaurant gastronomique" },
                { "@type": "LocationFeatureSpecification", name: "Promenade en dromadaire" },
                { "@type": "LocationFeatureSpecification", name: "Randonnée équestre" },
                { "@type": "LocationFeatureSpecification", name: "Day Pass" },
                { "@type": "LocationFeatureSpecification", name: "Événements & Mariages" },
              ],
            }),
          }}
        ></script>
      </head>
      <body
        className={`${cinzel.variable} ${josefin.variable} antialiased bg-background text-foreground`}
      >
        <AdminSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </ThemeProvider>
        </AdminSessionProvider>
      </body>
    </html>
  );
}
