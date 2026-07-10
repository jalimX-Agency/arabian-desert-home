import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { DayPassContent } from "@/app/(fr)/day-pass/DayPassContent";
import { esAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Day Pass y Piscina en el Desierto | Arabian Desert Home — Agafay",
  description: "Disfruta del desierto de Agafay durante un día. Day Pass piscina y almuerzo desde 35€/persona. Velada bajo las estrellas con espectáculo gnawa. Reserva tu día.",
  keywords: [
    "day pass agafay", "day pass desierto marrakech", "día piscina desierto agafay",
    "day pass agafay almuerzo incluido", "day pass agafay almuerzo incluido",
    "día desierto marrakech", "day pass agafay piscina desierto",
  ],
  openGraph: {
    title: "Day Pass Piscina y Almuerzo en el Desierto de Agafay | Arabian Desert Home",
    description: "Piscina, almuerzo marroquí y actividades desde 35€/persona. A 30 km de Marrakech, reserva recomendada con 24h de antelación.",
    url: "https://www.arabiandeserthome.ma/es/day-pass",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Day Pass Desierto de Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Day Pass Desierto de Agafay | Arabian Desert Home",
    description: "Piscina, almuerzo marroquí y actividades desde 35€/persona. A 30 km de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: esAlternates("/day-pass"),
};

export default async function SpanishDayPassPage() {
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
