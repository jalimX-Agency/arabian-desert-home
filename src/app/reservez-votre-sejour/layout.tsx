import type { Metadata } from "next";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/DJI_0020-scaled.webp";

export const metadata: Metadata = {
  title: "Réserver votre Séjour | Arabian Desert Home — Bivouac Luxe Agafay",
  description:
    "Réservez votre séjour au bivouac de luxe Arabian Desert Home dans le désert d'Agafay. Tentes à partir de 170 EUR/nuit, petit-déjeuner inclus. Disponibilités en temps réel.",
  keywords: [
    "réservation bivouac luxe agafay",
    "réserver tente désert marrakech",
    "book luxury desert camp agafay",
    "réservation désert agafay maroc",
    "bivouac luxe agafay réservation",
  ],
  openGraph: {
    title: "Réserver au Arabian Desert Home | Bivouac de Luxe Agafay",
    description:
      "Réservez votre nuit dans le désert d'Agafay. Tentes à partir de 170 EUR/nuit, petit-déjeuner inclus. À 30 km de Marrakech.",
    url: "https://arabiandeserthome.ma/reservez-votre-sejour",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Réservation Arabian Desert Home — Désert d'Agafay" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Réserver | Arabian Desert Home — Désert d'Agafay",
    description: "Réservez votre nuit dans le désert d'Agafay. À partir de 170 EUR/nuit.",
    images: [OG_IMAGE],
  },
  alternates: { canonical: "https://arabiandeserthome.ma/reservez-votre-sejour" },
};

export default function ReservezLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
