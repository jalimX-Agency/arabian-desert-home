import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ReservationContent } from "@/app/reservez-votre-sejour/ReservationContent";
import { esAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/DJI_0020-scaled.webp";

export const metadata = {
  title: "Reserva tu Estancia | Arabian Desert Home — Bivouac de Lujo Agafay",
  description:
    "Reserva tu estancia en el bivouac de lujo Arabian Desert Home en el desierto de Agafay. Tiendas desde 170 EUR/noche, desayuno incluido. Disponibilidad en tiempo real.",
  keywords: [
    "reserva bivouac lujo agafay",
    "reservar tienda desierto marrakech",
    "book luxury desert camp agafay",
    "reserva desierto agafay marruecos",
    "bivouac lujo agafay reserva",
  ],
  openGraph: {
    locale: "es_ES",
    title: "Reservar en Arabian Desert Home | Bivouac de Lujo Agafay",
    description:
      "Reserva tu noche en el desierto de Agafay. Tiendas desde 170 EUR/noche, desayuno incluido. A 30 km de Marrakech.",
    url: "https://www.arabiandeserthome.ma/es/reservez-votre-sejour",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Reserva Arabian Desert Home — Desierto de Agafay" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Reservar | Arabian Desert Home — Desierto de Agafay",
    description: "Reserva tu noche en el desierto de Agafay. Desde 170 EUR/noche.",
    images: [OG_IMAGE],
  },
  alternates: esAlternates("/reservez-votre-sejour"),
};

export default function SpanishReservezPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <ReservationContent />
      </main>
      <Footer />
    </div>
  );
}
