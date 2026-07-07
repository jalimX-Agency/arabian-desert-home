import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cinzel, Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AdminSessionProvider } from "@/components/admin/SessionProvider";
import { LanguageProvider } from "@/lib/i18n/context";
import { frAlternates } from "@/lib/seo/hreflang";
import { faqSchemaFr, faqSchemaEn, lodgingSchemaFr, lodgingSchemaEn } from "@/lib/seo/schema";
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
  metadataBase: new URL("https://www.arabiandeserthome.ma"),
  title: "Arabian Desert Home | Bivouac & Hôtel de Luxe à Agafay, Marrakech",
  description:
    "Arabian Desert Home — bivouac de luxe dans le désert d'Agafay à 30 minutes de Marrakech. Suites-tentes exclusives, restaurant gastronomique, piscine, activités désert (dromadaire, équitation) et événements sous les étoiles.",
  keywords: [
    "bivouac luxe Agafay",
    "hôtel Agafay",
    "hôtel désert Agafay Marrakech",
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
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Arabian Desert Home | Bivouac de Luxe — Désert d'Agafay, Marrakech",
    description:
      "Une invitation à l'évasion au cœur du désert d'Agafay. Bivouac de luxe sur 6 hectares, à seulement 30 minutes de Marrakech.",
    url: "https://www.arabiandeserthome.ma",
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
  alternates: frAlternates("/"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const lang = pathname.startsWith("/en") ? "en" : "fr";

  const faqSchema = JSON.stringify(lang === "en" ? faqSchemaEn : faqSchemaFr);
  const lodgingSchema = JSON.stringify(lang === "en" ? lodgingSchemaEn : lodgingSchemaFr);

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${cinzel.variable} ${josefin.variable} antialiased bg-background text-foreground`}>
        <script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
        <script id="structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: lodgingSchema }} />
        <AdminSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <LanguageProvider initialLanguage={lang === "en" ? "en" : undefined} locked={lang === "en"}>
              {children}
              <Toaster />
            </LanguageProvider>
          </ThemeProvider>
        </AdminSessionProvider>
      </body>
    </html>
  );
}
