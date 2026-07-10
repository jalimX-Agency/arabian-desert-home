import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesTentesContent } from "@/app/(fr)/les-tentes/LesTentesContent";
import { enAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Hotel & Luxury Tents in the Agafay Desert | Arabian Desert Home",
  description: "Boutique hotel under canvas in the Agafay desert: Junior Tent from €170, Family Tent €220, Suite €300. Breakfast included, 30 km from Marrakech.",
  keywords: [
    "hotel agafay", "hotel agafay desert", "luxury bivouac agafay", "glamping tent marrakech",
    "luxury tent agafay desert", "luxury bivouac agafay with pool",
    "luxury desert camp agafay marrakech", "glamping agafay morocco", "tent suite desert morocco",
  ],
  openGraph: {
    title: "Luxury Tents & Suites in the Agafay Desert | Arabian Desert Home",
    description: "Sleep under the stars in our exclusive tent suites, 30 km from Marrakech. From €170/night, breakfast included.",
    url: "https://www.arabiandeserthome.ma/en/les-tentes",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Luxury tents Arabian Desert Home — Agafay" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Luxury Tents & Suites | Arabian Desert Home — Agafay",
    description: "Sleep under the stars in our exclusive tent suites, 30 km from Marrakech. From €170/night.",
    images: [OG_IMAGE],
  },
  alternates: enAlternates("/les-tentes"),
};

export default async function EnglishLesTentesPage() {
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
