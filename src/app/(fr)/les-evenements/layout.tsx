import type { Metadata } from "next";
import { frAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata: Metadata = {
  title: "Mariage & Événements au Désert d'Agafay | Arabian Desert Home",
  description:
    "Organisez votre événement, séminaire, mariage ou team building dans le désert d'Agafay. 6 hectares de cadre unique à 30 km de Marrakech. Devis personnalisé sous 24 h.",
  keywords: [
    "événement désert agafay",
    "séminaire marrakech désert",
    "mariage désert maroc",
    "team building agafay",
    "mariage désert marrakech",
    "événement privé agafay",
    "corporate event agafay morocco",
  ],
  openGraph: {
    locale: "fr_FR",
    title: "Événements & Séminaires au Désert d'Agafay | Arabian Desert Home",
    description:
      "Mariage, séminaire ou team building sur 6 hectares de désert à 30 km de Marrakech. Cadre unique, service sur mesure.",
    url: "https://www.arabiandeserthome.ma/les-evenements",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Événements désert Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Événements au Désert Agafay | Arabian Desert Home",
    description: "Mariage, séminaire ou team building sur 6 hectares de désert à 30 km de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: frAlternates("/les-evenements"),
};

export default function LesEvenementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
