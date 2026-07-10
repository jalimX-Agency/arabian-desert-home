import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { RestaurantContent } from "@/app/restaurant/RestaurantContent";
import { enAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Restaurant & Gastronomy | Arabian Desert Home — Agafay Desert",
  description: "Savor Moroccan gastronomy in the heart of the Agafay desert. Dinner under the stars, campfire and gnawa music. Menus from 200 DH.",
  keywords: [
    "agafay desert restaurant", "moroccan cuisine bivouac", "desert dinner marrakech",
    "agafay gastronomy", "restaurant under the stars morocco",
    "tajine desert agafay", "agafay restaurant morocco",
  ],
  openGraph: {
    title: "Gastronomic Restaurant in the Agafay Desert | Arabian Desert Home",
    description: "Moroccan and Mediterranean cuisine prepared with local produce, in a unique desert setting with Atlas views. Menus from 200 DH.",
    url: "https://www.arabiandeserthome.ma/en/restaurant",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Agafay desert restaurant — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Agafay Desert Restaurant | Arabian Desert Home",
    description: "Moroccan gastronomy under the stars. Menus from 200 DH, 30 km from Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: enAlternates("/restaurant"),
};

export default async function EnglishRestaurantPage() {
  const venues = await db.diningVenue.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <RestaurantContent venues={venues} />
      </main>
      <Footer />
    </div>
  );
}
