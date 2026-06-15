import { db } from "@/lib/db";

export const revalidate = 3600;
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesTentesContent } from "./LesTentesContent";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Hébergements — Tentes & Suites de Luxe | Arabian Desert Home",
  description: "Découvrez nos tentes et suites de luxe au cœur du désert d'Agafay. Tente Junior à partir de 170 €, Tente Familiale 220 €, Suite 300 €. Petit-déjeuner inclus.",
  keywords: [
    "bivouac luxe agafay", "glamping tente marrakech", "tente luxe désert agafay",
    "bivouac luxe agafay avec piscine", "luxury desert camp agafay marrakech",
    "glamping agafay morocco", "suite tente désert maroc",
  ],
  openGraph: {
    title: "Tentes & Suites de Luxe dans le Désert d'Agafay | Arabian Desert Home",
    description: "Dormez sous les étoiles dans nos suites-tentes exclusives à 30 km de Marrakech. À partir de 170 €/nuit, petit-déjeuner inclus.",
    url: "https://www.arabiandeserthome.ma/les-tentes",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Tentes de luxe Arabian Desert Home — Agafay" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Tentes & Suites de Luxe | Arabian Desert Home — Agafay",
    description: "Dormez sous les étoiles dans nos suites-tentes exclusives à 30 km de Marrakech. À partir de 170 €/nuit.",
    images: [OG_IMAGE],
  },
  alternates: { canonical: "https://www.arabiandeserthome.ma/les-tentes" },
};

export default async function LesTentesPage() {
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
