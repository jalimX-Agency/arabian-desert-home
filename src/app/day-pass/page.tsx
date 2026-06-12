import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { DayPassContent } from "./DayPassContent";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Day Pass Piscine & Désert | Arabian Desert Home — Agafay",
  description: "Profitez du désert d'Agafay à la journée. Day Pass piscine & déjeuner à partir de 350 MAD. Soirée sous les étoiles avec animation gnawa. Réservez votre journée.",
  keywords: [
    "day pass agafay", "day pass désert marrakech", "piscine désert agafay journée",
    "day pass agafay déjeuner inclus", "agafay day pass lunch included",
    "journée désert marrakech", "day pass agafay desert pool",
  ],
  openGraph: {
    title: "Day Pass Piscine & Déjeuner au Désert d'Agafay | Arabian Desert Home",
    description: "Piscine, déjeuner marocain et activités à partir de 350 MAD/pers. À 30 km de Marrakech, réservation conseillée 24 h à l'avance.",
    url: "https://www.arabiandeserthome.ma/day-pass",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Day Pass Désert Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Day Pass Désert Agafay | Arabian Desert Home",
    description: "Piscine, déjeuner marocain et activités à partir de 350 MAD. À 30 km de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: { canonical: "https://www.arabiandeserthome.ma/day-pass" },
};

export default async function DayPassPage() {
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
