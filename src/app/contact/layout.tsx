import type { Metadata } from "next";
import { frAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata: Metadata = {
  title: "Contact | Arabian Desert Home — Désert d'Agafay, Marrakech",
  description:
    "Contactez Arabian Desert Home pour toute question ou réservation. Situés à 30 km de Marrakech dans le désert d'Agafay. Réponse sous 24 heures.",
  keywords: [
    "contact arabian desert home",
    "réservation bivouac agafay",
    "contact désert agafay marrakech",
    "arabian desert home phone",
  ],
  openGraph: {
    title: "Contact Arabian Desert Home | Bivouac de Luxe Agafay",
    description: "Contactez-nous pour réserver votre séjour dans le désert d'Agafay. Réponse garantie sous 24 heures.",
    url: "https://www.arabiandeserthome.ma/contact",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Contact Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Arabian Desert Home",
    description: "Contactez-nous pour réserver votre séjour dans le désert d'Agafay.",
    images: [OG_IMAGE],
  },
  alternates: frAlternates("/contact"),
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
