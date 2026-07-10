import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesTentesContent } from "@/app/(fr)/les-tentes/LesTentesContent";
import { itAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Hotel e Tende di Lusso nel Deserto di Agafay | Arabian Desert Home",
  description: "Hotel boutique sotto tenda nel deserto di Agafay: Junior Tent da 170€, Family Tent 220€, Suite 300€. Colazione inclusa, a 30 km da Marrakech.",
  keywords: [
    "hotel agafay", "hotel deserto agafay", "bivacco di lusso agafay", "tenda glamping marrakech",
    "tenda di lusso deserto agafay", "bivacco di lusso agafay con piscina",
    "campo di lusso deserto agafay marrakech", "glamping agafay marocco", "suite tenda deserto marocco",
  ],
  openGraph: {
    title: "Tende e Suite di Lusso nel Deserto di Agafay | Arabian Desert Home",
    description: "Dormi sotto le stelle nelle nostre esclusive suite tenda, a 30 km da Marrakech. Da 170€/notte, colazione inclusa.",
    url: "https://www.arabiandeserthome.ma/it/les-tentes",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Tende di lusso Arabian Desert Home — Agafay" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Tende e Suite di Lusso | Arabian Desert Home — Agafay",
    description: "Dormi sotto le stelle nelle nostre esclusive suite tenda, a 30 km da Marrakech. Da 170€/notte.",
    images: [OG_IMAGE],
  },
  alternates: itAlternates("/les-tentes"),
};

export default async function ItalianLesTentesPage() {
  const suites = await db.suite.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <LesTentesContent suites={suites} />
      </main>
      <Footer />
    </div>
  );
}
