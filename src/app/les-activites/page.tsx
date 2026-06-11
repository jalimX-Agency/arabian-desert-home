import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesActivitesContent } from "./LesActivitesContent";

export const metadata = {
  title: "Activités & Expériences Désert | Arabian Desert Home — Agafay",
  description: "Randonnée équestre, quad, dromadaire, Sunset Experience… Découvrez toutes les activités et expériences dans le désert d'Agafay à 30 min de Marrakech.",
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
