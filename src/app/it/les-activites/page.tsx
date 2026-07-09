import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesActivitesContent } from "@/app/les-activites/LesActivitesContent";
import { itAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Attività ed Esperienze nel Deserto | Arabian Desert Home — Agafay",
  description: "Equitazione, quad, giri in cammello, Sunset Experience... Scopri tutte le attività e le esperienze nel deserto di Agafay, a 30 minuti da Marrakech.",
  keywords: [
    "attività agafay", "quad deserto marrakech", "giro in cammello agafay",
    "equitazione deserto agafay", "attività agafay cammello quad",
    "attività deserto agafay bambini", "tramonto deserto agafay",
  ],
  openGraph: {
    title: "Attività ed Esperienze nel Deserto ad Agafay | Arabian Desert Home",
    description: "Giri in cammello, quad, equitazione e tramonti su 6 ettari di deserto, a 30 km da Marrakech.",
    url: "https://www.arabiandeserthome.ma/it/les-activites",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Attività nel deserto di Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Attività nel Deserto di Agafay | Arabian Desert Home",
    description: "Giri in cammello, quad, equitazione e tramonti su 6 ettari, a 30 km da Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: itAlternates("/les-activites"),
};

export default async function ItalianLesActivitesPage() {
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
