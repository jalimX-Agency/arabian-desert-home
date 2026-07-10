import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ApropoContent } from "@/app/apropo/ApropoContent";
import { esAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Sobre Nosotros | Arabian Desert Home — Nuestra Historia, Desierto de Agafay",
  description:
    "Descubre la historia de Arabian Desert Home, bivouac de lujo en el desierto de Agafay desde hace varios años. 6 hectáreas de naturaleza preservada a 30 km de Marrakech.",
  keywords: [
    "sobre arabian desert home",
    "historia bivouac agafay",
    "about arabian desert home",
    "luxury camp agafay morocco story",
  ],
  openGraph: {
    locale: "es_ES",
    title: "Sobre Nosotros | Arabian Desert Home — Bivouac de Lujo Agafay",
    description: "Descubre la historia y los valores de Arabian Desert Home, bivouac de lujo en el desierto de Agafay.",
    url: "https://www.arabiandeserthome.ma/es/apropo",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Sobre Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Sobre Nosotros | Arabian Desert Home",
    description: "La historia de Arabian Desert Home, bivouac de lujo en el desierto de Agafay.",
    images: [OG_IMAGE],
  },
  alternates: esAlternates("/apropo"),
};

export default function SpanishApropoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <ApropoContent />
      </main>
      <Footer />
    </div>
  );
}
