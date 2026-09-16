import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesExperiencesContent } from "@/app/(fr)/les-experiences/LesExperiencesContent";
import { enAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Full-Day Desert Experiences | Arabian Desert Home — Agafay",
  description: "All-inclusive days and evenings in the Agafay desert: activities, gastronomy and transport included, 30 min from Marrakech.",
  keywords: [
    "agafay desert experiences", "full day desert marrakech", "sunset experience agafay",
    "all inclusive excursion agafay", "full day desert trip marrakech",
  ],
  openGraph: {
    locale: "en_US",
    title: "Full-Day Desert Experiences in Agafay | Arabian Desert Home",
    description: "All-inclusive days and evenings in the Agafay desert, 30 km from Marrakech.",
    url: "https://www.arabiandeserthome.ma/en/les-experiences",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Agafay desert experiences — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Agafay Desert Experiences | Arabian Desert Home",
    description: "All-inclusive days and evenings in the Agafay desert, 30 km from Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: enAlternates("/les-experiences"),
};

export default async function EnglishLesExperiencesPage() {
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
