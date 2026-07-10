import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesActivitesContent } from "@/app/(fr)/les-activites/LesActivitesContent";
import { enAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Desert Activities & Experiences | Arabian Desert Home — Agafay",
  description: "Horseback riding, quad biking, camel rides, Sunset Experience... Discover all activities and experiences in the Agafay desert, 30 min from Marrakech.",
  keywords: [
    "agafay activities", "quad desert marrakech", "agafay camel ride",
    "agafay desert horseback riding", "agafay activities camel quad",
    "agafay desert activities kids", "agafay desert sunset",
  ],
  openGraph: {
    title: "Desert Activities & Experiences in Agafay | Arabian Desert Home",
    description: "Camel rides, quad biking, horseback riding and sunsets across 6 hectares of desert, 30 km from Marrakech.",
    url: "https://www.arabiandeserthome.ma/en/les-activites",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Agafay desert activities — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Agafay Desert Activities | Arabian Desert Home",
    description: "Camel rides, quad biking, horseback riding and sunsets across 6 hectares, 30 km from Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: enAlternates("/les-activites"),
};

export default async function EnglishLesActivitesPage() {
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
