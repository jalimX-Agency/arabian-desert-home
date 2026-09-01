import { db } from "@/lib/db";

export const revalidate = 3600;
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { RestaurantContent } from "./RestaurantContent";
import { frAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Restaurant & Gastronomie | Arabian Desert Home — Désert d'Agafay",
  description: "Savourez la gastronomie marocaine au cœur du désert d'Agafay. Dîner sous les étoiles, feu de camp et musique gnawa. Menus à partir de 200 DH.",
  keywords: [
    "restaurant désert agafay", "cuisine marocaine bivouac", "dîner désert marrakech",
    "gastronomie agafay", "restaurant sous les étoiles maroc",
    "tajine désert agafay", "agafay restaurant morocco",
  ],
  openGraph: {
    locale: "fr_FR",
    title: "Restaurant Gastronomique au Désert d'Agafay | Arabian Desert Home",
    description: "Cuisine marocaine et méditerranéenne préparée avec des produits locaux, dans un cadre désertique unique avec vue sur l'Atlas. Menus à partir de 200 DH.",
    url: "https://www.arabiandeserthome.ma/restaurant",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Restaurant désert Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Restaurant Désert Agafay | Arabian Desert Home",
    description: "Gastronomie marocaine sous les étoiles. Menus à partir de 200 DH à 30 km de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: frAlternates("/restaurant"),
};

const faqItems = [
  { q: "Faut-il réserver pour dîner au restaurant du désert d'Agafay ?", a: "Oui, la réservation est fortement recommandée, surtout pour le dîner sous les étoiles. Réservez au moins 24 heures à l'avance, en particulier pour les groupes et pendant la haute saison (printemps et automne)." },
  { q: "Le restaurant est-il accessible sans réserver une tente ?", a: "Oui. Le déjeuner et le dîner sont inclus dans les formules Day Pass, et le restaurant accueille aussi les visiteurs extérieurs qui ne séjournent pas dans nos tentes-suites." },
  { q: "Proposez-vous des menus végétariens ou adaptés aux allergies ?", a: "Oui, un menu végétarien complet est disponible, et nos équipes adaptent les plats aux allergies et intolérances sur simple demande lors de la réservation." },
  { q: "Quel est le prix d'un repas ?", a: "Les menus démarrent à 200 DH et vont jusqu'à 250 DH par personne selon la formule choisie, boissons non incluses." },
  { q: "Le dîner sous les étoiles inclut-il une animation ?", a: "Oui, les soirées au Dar Agafay incluent musique gnawa live, danse et éclairage d'ambiance autour du feu de camp, sans supplément." },
];

export default async function RestaurantPage() {
  const venues = await db.diningVenue.findMany({ orderBy: { order: "asc" } });

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
      { "@type": "ListItem", position: 2, name: "Restaurant", item: "https://www.arabiandeserthome.ma/restaurant" },
    ],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      <Navigation />
      <main className="flex-1 pt-20">
        <RestaurantContent venues={venues} />
      </main>
      <Footer />
    </div>
  );
}
