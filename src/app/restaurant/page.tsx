import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { RestaurantContent } from "./RestaurantContent";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Restaurant & Gastronomie | Arabian Desert Home — Désert d'Agafay",
  description: "Savourez la gastronomie marocaine au cœur du désert d'Agafay. Dîner sous les étoiles, feu de camp et musique gnawa. Menus à partir de 200 DH.",
  keywords: [
    "restaurant désert agafay", "cuisine marocaine bivouac", "dîner désert marrakech",
    "gastronomie agafay", "restaurant sous les étoiles maroc",
    "tajine désert agafay", "agafay restaurant morocco",
  ],
  openGraph: {
    title: "Restaurant Gastronomique au Désert d'Agafay | Arabian Desert Home",
    description: "Cuisine marocaine et méditerranéenne préparée avec des produits locaux, dans un cadre désertique unique avec vue sur l'Atlas. Menus à partir de 200 DH.",
    url: "https://arabiandeserthome.com/restaurant",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Restaurant désert Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Restaurant Désert Agafay | Arabian Desert Home",
    description: "Gastronomie marocaine sous les étoiles. Menus à partir de 200 DH à 30 km de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: { canonical: "https://arabiandeserthome.com/restaurant" },
};

export default async function RestaurantPage() {
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
