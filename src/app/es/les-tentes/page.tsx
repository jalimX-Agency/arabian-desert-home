import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesTentesContent } from "@/app/les-tentes/LesTentesContent";
import { esAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Hotel y Jaimas de Lujo en el Desierto de Agafay | Arabian Desert Home",
  description: "Hotel boutique bajo lona en el desierto de Agafay: Junior Tent desde 170€, Family Tent 220€, Suite 300€. Desayuno incluido, a 30 km de Marrakech.",
  keywords: [
    "hotel agafay", "hotel desierto agafay", "bivouac de lujo agafay", "jaima glamping marrakech",
    "jaima de lujo desierto agafay", "bivouac de lujo agafay con piscina",
    "campamento de lujo agafay marrakech", "glamping agafay marruecos", "suite jaima desierto marruecos",
  ],
  openGraph: {
    title: "Jaimas y Suites de Lujo en el Desierto de Agafay | Arabian Desert Home",
    description: "Duerme bajo las estrellas en nuestras exclusivas suites de jaimas, a 30 km de Marrakech. Desde 170€/noche, desayuno incluido.",
    url: "https://www.arabiandeserthome.ma/es/les-tentes",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Jaimas de lujo Arabian Desert Home — Agafay" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Jaimas y Suites de Lujo | Arabian Desert Home — Agafay",
    description: "Duerme bajo las estrellas en nuestras exclusivas suites de jaimas, a 30 km de Marrakech. Desde 170€/noche.",
    images: [OG_IMAGE],
  },
  alternates: esAlternates("/les-tentes"),
};

export default async function SpanishLesTentesPage() {
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
