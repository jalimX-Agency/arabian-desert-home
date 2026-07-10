import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ReservationContent } from "@/app/(fr)/reservez-votre-sejour/ReservationContent";
import { itAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/DJI_0020-scaled.webp";

export const metadata = {
  title: "Prenota il tuo Soggiorno | Arabian Desert Home — Bivacco di Lusso Agafay",
  description:
    "Prenota il tuo soggiorno nel bivacco di lusso Arabian Desert Home nel deserto di Agafay. Tende a partire da 170 EUR/notte, colazione inclusa. Disponibilità in tempo reale.",
  keywords: [
    "prenotazione bivacco lusso agafay",
    "prenotare tenda deserto marrakech",
    "book luxury desert camp agafay",
    "prenotazione deserto agafay marocco",
    "bivacco lusso agafay prenotazione",
  ],
  openGraph: {
    locale: "it_IT",
    title: "Prenota a Arabian Desert Home | Bivacco di Lusso Agafay",
    description:
      "Prenota la tua notte nel deserto di Agafay. Tende a partire da 170 EUR/notte, colazione inclusa. A 30 km da Marrakech.",
    url: "https://www.arabiandeserthome.ma/it/reservez-votre-sejour",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Prenotazione Arabian Desert Home — Deserto di Agafay" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Prenota | Arabian Desert Home — Deserto di Agafay",
    description: "Prenota la tua notte nel deserto di Agafay. A partire da 170 EUR/notte.",
    images: [OG_IMAGE],
  },
  alternates: itAlternates("/reservez-votre-sejour"),
};

export default function ItalianReservezPage() {
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
