import type { Metadata } from "next";
import { frAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata: Metadata = {
  title: "À Propos | Arabian Desert Home — Notre Histoire, Désert d'Agafay",
  description:
    "Découvrez l'histoire d'Arabian Desert Home, bivouac de luxe dans le désert d'Agafay depuis plusieurs années. 6 hectares de nature préservée à 30 km de Marrakech.",
  keywords: [
    "à propos arabian desert home",
    "histoire bivouac agafay",
    "about arabian desert home",
    "luxury camp agafay morocco story",
  ],
  openGraph: {
    locale: "fr_FR",
    title: "À Propos | Arabian Desert Home — Bivouac de Luxe Agafay",
    description: "Découvrez l'histoire et les valeurs d'Arabian Desert Home, bivouac de luxe dans le désert d'Agafay.",
    url: "https://www.arabiandeserthome.ma/apropo",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "À propos Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "À Propos | Arabian Desert Home",
    description: "L'histoire d'Arabian Desert Home, bivouac de luxe dans le désert d'Agafay.",
    images: [OG_IMAGE],
  },
  alternates: frAlternates("/apropo"),
};

export default function ApropoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
