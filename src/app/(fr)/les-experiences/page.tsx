import { db } from "@/lib/db";

export const revalidate = 3600;
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesExperiencesContent } from "./LesExperiencesContent";
import { frAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Expériences Désert Complètes | Arabian Desert Home — Agafay",
  description: "Journées et soirées tout compris dans le désert d'Agafay : activités, gastronomie et transport inclus, à 30 min de Marrakech.",
  keywords: [
    "expériences désert agafay", "journée désert marrakech", "sunset experience agafay",
    "excursion tout compris agafay", "journée complète désert marrakech",
  ],
  openGraph: {
    locale: "fr_FR",
    title: "Expériences Désert Complètes d'Agafay | Arabian Desert Home",
    description: "Journées et soirées tout compris dans le désert d'Agafay, à 30 km de Marrakech.",
    url: "https://www.arabiandeserthome.ma/les-experiences",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Expériences désert Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Expériences Désert Agafay | Arabian Desert Home",
    description: "Journées et soirées tout compris dans le désert d'Agafay, à 30 km de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: frAlternates("/les-experiences"),
};

export default async function LesExperiencesPage() {
  const experiences = await db.activity.findMany({
    where: { category: { in: ["Expérience", "Aventure"] } },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <LesExperiencesContent experiences={experiences} />
      </main>
      <Footer />
    </div>
  );
}
