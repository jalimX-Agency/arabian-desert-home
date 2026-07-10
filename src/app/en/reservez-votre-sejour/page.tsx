import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ReservationContent } from "@/app/(fr)/reservez-votre-sejour/ReservationContent";
import { enAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/DJI_0020-scaled.webp";

export const metadata = {
  title: "Book Your Stay | Arabian Desert Home — Luxury Agafay Bivouac",
  description:
    "Book your stay at the luxury Arabian Desert Home bivouac in the Agafay desert. Tents from 170 EUR/night, breakfast included. Real-time availability.",
  keywords: [
    "luxury bivouac agafay booking",
    "book desert tent marrakech",
    "book luxury desert camp agafay",
    "agafay desert reservation morocco",
    "luxury agafay bivouac booking",
  ],
  openGraph: {
    locale: "en_US",
    title: "Book at Arabian Desert Home | Luxury Agafay Bivouac",
    description:
      "Book your night in the Agafay desert. Tents from 170 EUR/night, breakfast included. 30 km from Marrakech.",
    url: "https://www.arabiandeserthome.ma/en/reservez-votre-sejour",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Booking Arabian Desert Home — Agafay Desert" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Book | Arabian Desert Home — Agafay Desert",
    description: "Book your night in the Agafay desert. From 170 EUR/night.",
    images: [OG_IMAGE],
  },
  alternates: enAlternates("/reservez-votre-sejour"),
};

export default function EnglishReservezPage() {
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
