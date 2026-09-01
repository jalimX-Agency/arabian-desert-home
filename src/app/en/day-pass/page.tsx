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
    locale: "en_US",
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

const faqItems = [
  { q: "How long does the Day Pass last?", a: "The Day Pass runs from 11am to 4pm, letting you fully enjoy the pool, lunch and activities in one day." },
  { q: "Does the price include lunch?", a: "Yes, a full Moroccan lunch is included in every Day Pass option, along with access to the pool and lounge areas." },
  { q: "Is there a discount for children?", a: "Yes, children get 50% off every Day Pass option." },
  { q: "Do I need to book in advance?", a: "Yes, booking at least 24 hours ahead is required to guarantee your spot, especially on weekends and during high season." },
  { q: "Is transfer from Marrakech included?", a: "Transfer can be arranged on request when you book — allow about 30 to 45 minutes from central Marrakech." },
];

export default async function EnglishDayPassPage() {
  const passes = await db.dayPass.findMany({ orderBy: { order: "asc" } });

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.arabiandeserthome.ma/en" },
      { "@type": "ListItem", position: 2, name: "Day Pass", item: "https://www.arabiandeserthome.ma/en/day-pass" },
    ],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      <Navigation />
      <main className="flex-1 pt-20">
        <DayPassContent passes={passes} />
      </main>
      <Footer />
    </div>
  );
}
