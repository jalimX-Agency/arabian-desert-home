import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesActivitesContent } from "@/app/les-activites/LesActivitesContent";
import { esAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Actividades y Experiencias en el Desierto | Arabian Desert Home — Agafay",
  description: "Equitación, quad, paseos en camello, Sunset Experience... Descubre todas las actividades y experiencias en el desierto de Agafay, a 30 min de Marrakech.",
  keywords: [
    "actividades agafay", "quad desierto marrakech", "paseo en camello agafay",
    "equitación desierto agafay", "actividades agafay camello quad",
    "actividades desierto agafay niños", "atardecer desierto agafay",
  ],
  openGraph: {
    title: "Actividades y Experiencias en el Desierto de Agafay | Arabian Desert Home",
    description: "Paseos en camello, quad, equitación y atardeceres en 6 hectáreas de desierto, a 30 km de Marrakech.",
    url: "https://www.arabiandeserthome.ma/es/les-activites",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Actividades en el desierto de Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Actividades en el Desierto de Agafay | Arabian Desert Home",
    description: "Paseos en camello, quad, equitación y atardeceres en 6 hectáreas, a 30 km de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: esAlternates("/les-activites"),
};

export default async function SpanishLesActivitesPage() {
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
