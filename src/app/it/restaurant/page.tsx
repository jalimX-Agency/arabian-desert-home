import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { RestaurantContent } from "@/app/restaurant/RestaurantContent";
import { itAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Ristorante & Gastronomia | Arabian Desert Home — Deserto di Agafay",
  description: "Gustate la gastronomia marocchina nel cuore del deserto di Agafay. Cena sotto le stelle, falò e musica gnawa. Menu a partire da 200 DH.",
  keywords: [
    "ristorante deserto agafay", "cucina marocchina bivacco", "cena deserto marrakech",
    "gastronomia agafay", "ristorante sotto le stelle marocco",
    "tajine deserto agafay", "agafay restaurant morocco",
  ],
  openGraph: {
    title: "Ristorante Gastronomico nel Deserto di Agafay | Arabian Desert Home",
    description: "Cucina marocchina e mediterranea preparata con prodotti locali, in un'ambientazione desertica unica con vista sull'Atlante. Menu a partire da 200 DH.",
    url: "https://www.arabiandeserthome.ma/it/restaurant",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Ristorante deserto Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Ristorante Deserto Agafay | Arabian Desert Home",
    description: "Gastronomia marocchina sotto le stelle. Menu a partire da 200 DH, a 30 km da Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: itAlternates("/restaurant"),
};

export default async function ItalianRestaurantPage() {
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
