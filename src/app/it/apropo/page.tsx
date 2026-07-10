import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ApropoContent } from "@/app/apropo/ApropoContent";
import { itAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Chi Siamo | Arabian Desert Home — La Nostra Storia, Deserto di Agafay",
  description:
    "Scopri la storia di Arabian Desert Home, bivacco di lusso nel deserto di Agafay da diversi anni. 6 ettari di natura preservata a 30 km da Marrakech.",
  keywords: [
    "chi siamo arabian desert home",
    "storia bivacco agafay",
    "about arabian desert home",
    "luxury camp agafay morocco story",
  ],
  openGraph: {
    title: "Chi Siamo | Arabian Desert Home — Bivacco di Lusso Agafay",
    description: "Scopri la storia e i valori di Arabian Desert Home, bivacco di lusso nel deserto di Agafay.",
    url: "https://www.arabiandeserthome.ma/it/apropo",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Chi Siamo Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Chi Siamo | Arabian Desert Home",
    description: "La storia di Arabian Desert Home, bivacco di lusso nel deserto di Agafay.",
    images: [OG_IMAGE],
  },
  alternates: itAlternates("/apropo"),
};

export default function ItalianApropoPage() {
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
