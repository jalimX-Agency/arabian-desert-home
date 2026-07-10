import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { DayPassContent } from "@/app/(fr)/day-pass/DayPassContent";
import { enAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Desert Day Pass & Pool | Arabian Desert Home — Agafay",
  description: "Enjoy the Agafay desert for a day. Pool & lunch Day Pass from 35 EUR/person. Evening under the stars with gnawa entertainment. Book your day.",
  keywords: [
    "agafay day pass", "desert day pass marrakech", "agafay desert pool day",
    "agafay day pass lunch included", "agafay day pass lunch included",
    "desert day marrakech", "agafay day pass desert pool",
  ],
  openGraph: {
    title: "Pool & Lunch Day Pass in the Agafay Desert | Arabian Desert Home",
    description: "Pool, Moroccan lunch and activities from 35 EUR/person. 30 km from Marrakech, booking recommended 24h in advance.",
    url: "https://www.arabiandeserthome.ma/en/day-pass",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Agafay Desert Day Pass — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Agafay Desert Day Pass | Arabian Desert Home",
    description: "Pool, Moroccan lunch and activities from 35 EUR/person. 30 km from Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: enAlternates("/day-pass"),
};

export default async function EnglishDayPassPage() {
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
