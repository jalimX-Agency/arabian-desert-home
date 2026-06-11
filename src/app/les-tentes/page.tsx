import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesTentesContent } from "./LesTentesContent";

export const metadata = {
  title: "Hébergements — Tentes & Suites de Luxe | Arabian Desert Home",
  description: "Découvrez nos tentes et suites de luxe au cœur du désert d'Agafay. Tente Junior à partir de 170 €, Tente Familiale 220 €, Suite 300 €. Petit-déjeuner inclus.",
};

export default async function LesTentesPage() {
  const suites = await db.suite.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <LesTentesContent suites={suites} />
      </main>
      <Footer />
    </div>
  );
}
