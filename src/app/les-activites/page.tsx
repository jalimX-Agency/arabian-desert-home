import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesActivitesContent } from "./LesActivitesContent";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Activités & Expériences Désert | Arabian Desert Home — Agafay",
  description: "Randonnée équestre, quad, dromadaire, Sunset Experience… Découvrez toutes les activités et expériences dans le désert d'Agafay à 30 min de Marrakech.",
  keywords: [
    "activités agafay", "quad désert marrakech", "dromadaire agafay",
    "équitation désert agafay", "agafay activities camel quad",
    "activités désert agafay enfants", "sunset désert agafay",
  ],
  openGraph: {
    title: "Activités & Expériences Désert d'Agafay | Arabian Desert Home",
    description: "Balades à dromadaire, quad, équitation et couchers de soleil sur 6 hectares de désert à 30 km de Marrakech.",
    url: "https://www.arabiandeserthome.ma/les-activites",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Activités désert Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Activités Désert Agafay | Arabian Desert Home",
    description: "Balades à dromadaire, quad, équitation et couchers de soleil sur 6 hectares à 30 km de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: { canonical: "https://www.arabiandeserthome.ma/les-activites" },
};

export default async function LesActivitesPage() {
  const activities = await db.activity.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <LesActivitesContent activities={activities} />
      </main>
      <Footer />
    </div>
  );
}
