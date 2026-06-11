import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { DayPassContent } from "./DayPassContent";

export const metadata = {
  title: "Day Pass Piscine & Désert | Arabian Desert Home — Agafay",
  description: "Profitez du désert d'Agafay à la journée. Day Pass piscine & déjeuner à partir de 350 MAD. Soirée sous les étoiles avec animation gnawa. Réservez votre journée.",
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
