import { db } from "@/lib/db";

export const revalidate = 3600;
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { DayPassContent } from "./DayPassContent";
import { frAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Day Pass Piscine & Désert | Arabian Desert Home — Agafay",
  description: "Profitez du désert d'Agafay à la journée. Day Pass piscine & déjeuner à partir de 35 EUR/pers. Soirée sous les étoiles avec animation gnawa. Réservez votre journée.",
  keywords: [
    "day pass agafay", "day pass désert marrakech", "piscine désert agafay journée",
    "day pass agafay déjeuner inclus", "agafay day pass lunch included",
    "journée désert marrakech", "day pass agafay desert pool",
  ],
  openGraph: {
    locale: "fr_FR",
    title: "Day Pass Piscine & Déjeuner au Désert d'Agafay | Arabian Desert Home",
    description: "Piscine, déjeuner marocain et activités à partir de 35 EUR/pers. À 30 km de Marrakech, réservation conseillée 24 h à l'avance.",
    url: "https://www.arabiandeserthome.ma/day-pass",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Day Pass Désert Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Day Pass Désert Agafay | Arabian Desert Home",
    description: "Piscine, déjeuner marocain et activités à partir de 35 EUR/pers. À 30 km de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: frAlternates("/day-pass"),
};

const faqItems = [
  { q: "Combien de temps dure le Day Pass ?", a: "Le Day Pass est valable de 11h à 16h, vous permettant de profiter pleinement de la piscine, du déjeuner et des activités en une journée." },
  { q: "Le prix inclut-il le déjeuner ?", a: "Oui, un déjeuner marocain complet est inclus dans toutes les formules Day Pass, ainsi que l'accès à la piscine et aux espaces détente." },
  { q: "Y a-t-il une réduction pour les enfants ?", a: "Oui, les enfants bénéficient de -50% sur toutes les formules Day Pass." },
  { q: "Faut-il réserver à l'avance ?", a: "Oui, la réservation au moins 24h à l'avance est requise pour garantir votre place, surtout le week-end et en haute saison." },
  { q: "Le transfert depuis Marrakech est-il inclus ?", a: "Le transfert peut être organisé sur demande lors de la réservation ; comptez environ 30 à 45 minutes depuis le centre de Marrakech." },
];

export default async function DayPassPage() {
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
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.arabiandeserthome.ma" },
      { "@type": "ListItem", position: 2, name: "Day Pass", item: "https://www.arabiandeserthome.ma/day-pass" },
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
