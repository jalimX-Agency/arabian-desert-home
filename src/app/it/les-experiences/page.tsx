import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesExperiencesContent } from "@/app/(fr)/les-experiences/LesExperiencesContent";
import { itAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Esperienze Complete nel Deserto | Arabian Desert Home — Agafay",
  description: "Giornate e serate tutto incluso nel deserto di Agafay: attività, gastronomia e trasporto inclusi, a 30 min da Marrakech.",
  keywords: [
    "esperienze deserto agafay", "giornata completa deserto marrakech", "sunset experience agafay",
    "escursione tutto incluso agafay", "giornata completa deserto marrakech",
  ],
  openGraph: {
    locale: "it_IT",
    title: "Esperienze Complete nel Deserto di Agafay | Arabian Desert Home",
    description: "Giornate e serate tutto incluso nel deserto di Agafay, a 30 km da Marrakech.",
    url: "https://www.arabiandeserthome.ma/it/les-experiences",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Esperienze deserto Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Esperienze Deserto Agafay | Arabian Desert Home",
    description: "Giornate e serate tutto incluso nel deserto di Agafay, a 30 km da Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: itAlternates("/les-experiences"),
};

export default async function ItalianLesExperiencesPage() {
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
