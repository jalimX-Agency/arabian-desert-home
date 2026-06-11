import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { RestaurantContent } from "./RestaurantContent";

export const metadata = {
  title: "Restaurant & Gastronomie | Arabian Desert Home — Désert d'Agafay",
  description: "Savourez la gastronomie marocaine au cœur du désert d'Agafay. Dîner sous les étoiles, feu de camp et musique gnawa. Menus à partir de 200 DH.",
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
