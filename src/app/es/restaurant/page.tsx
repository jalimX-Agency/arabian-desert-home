import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { RestaurantContent } from "@/app/restaurant/RestaurantContent";
import { esAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Restaurante & Gastronomía | Arabian Desert Home — Desierto de Agafay",
  description: "Saborea la gastronomía marroquí en el corazón del desierto de Agafay. Cena bajo las estrellas, fogata y música gnawa. Menús desde 200 DH.",
  keywords: [
    "restaurante desierto agafay", "cocina marroquí bivouac", "cena desierto marrakech",
    "gastronomía agafay", "restaurante bajo las estrellas marruecos",
    "tajín desierto agafay", "agafay restaurant morocco",
  ],
  openGraph: {
    title: "Restaurante Gastronómico en el Desierto de Agafay | Arabian Desert Home",
    description: "Cocina marroquí y mediterránea preparada con productos locales, en un entorno desértico único con vistas al Atlas. Menús desde 200 DH.",
    url: "https://www.arabiandeserthome.ma/es/restaurant",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Restaurante desierto Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Restaurante Desierto Agafay | Arabian Desert Home",
    description: "Gastronomía marroquí bajo las estrellas. Menús desde 200 DH a 30 km de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: esAlternates("/restaurant"),
};

export default async function SpanishRestaurantPage() {
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
