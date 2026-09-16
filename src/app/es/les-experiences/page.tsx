import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesExperiencesContent } from "@/app/(fr)/les-experiences/LesExperiencesContent";
import { esAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Experiencias Completas en el Desierto | Arabian Desert Home — Agafay",
  description: "Días y noches todo incluido en el desierto de Agafay: actividades, gastronomía y transporte incluidos, a 30 min de Marrakech.",
  keywords: [
    "experiencias desierto agafay", "día completo desierto marrakech", "sunset experience agafay",
    "excursión todo incluido agafay", "día completo desierto marrakech",
  ],
  openGraph: {
    locale: "es_ES",
    title: "Experiencias Completas en el Desierto de Agafay | Arabian Desert Home",
    description: "Días y noches todo incluido en el desierto de Agafay, a 30 km de Marrakech.",
    url: "https://www.arabiandeserthome.ma/es/les-experiences",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Experiencias desierto Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Experiencias Desierto Agafay | Arabian Desert Home",
    description: "Días y noches todo incluido en el desierto de Agafay, a 30 km de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: esAlternates("/les-experiences"),
};

export default async function SpanishLesExperiencesPage() {
  const experiences = await db.activity.findMany({
    where: { category: { in: ["Expérience", "Aventure"] } },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <LesExperiencesContent experiences={experiences} />
      </main>
      <Footer />
    </div>
  );
}
