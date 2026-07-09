import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { DayPassContent } from "@/app/day-pass/DayPassContent";
import { itAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Day Pass e Piscina nel Deserto | Arabian Desert Home — Agafay",
  description: "Vivi il deserto di Agafay per un giorno. Day Pass piscina e pranzo da 35 EUR/persona. Serata sotto le stelle con intrattenimento gnawa. Prenota la tua giornata.",
  keywords: [
    "day pass agafay", "day pass deserto marrakech", "giornata piscina deserto agafay",
    "day pass agafay pranzo incluso", "day pass agafay pranzo incluso",
    "giornata deserto marrakech", "day pass agafay piscina deserto",
  ],
  openGraph: {
    title: "Day Pass Piscina e Pranzo nel Deserto di Agafay | Arabian Desert Home",
    description: "Piscina, pranzo marocchino e attività da 35 EUR/persona. A 30 km da Marrakech, prenotazione consigliata con 24h di anticipo.",
    url: "https://www.arabiandeserthome.ma/it/day-pass",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Day Pass Deserto di Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Day Pass Deserto di Agafay | Arabian Desert Home",
    description: "Piscina, pranzo marocchino e attività da 35 EUR/persona. A 30 km da Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: itAlternates("/day-pass"),
};

export default async function ItalianDayPassPage() {
  const passes = await db.dayPass.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <DayPassContent passes={passes} />
      </main>
      <Footer />
    </div>
  );
}
