import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { RestaurantContent } from "@/app/(fr)/restaurant/RestaurantContent";
import { itAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Ristorante & Gastronomia | Arabian Desert Home — Deserto di Agafay",
  description: "Gustate la gastronomia marocchina nel cuore del deserto di Agafay. Cena sotto le stelle, falò e musica gnawa. Menu a partire da 200 DH.",
  keywords: [
    "ristorante deserto agafay", "cucina marocchina bivacco", "cena deserto marrakech",
    "gastronomia agafay", "ristorante sotto le stelle marocco",
    "tajine deserto agafay", "agafay restaurant morocco",
  ],
  openGraph: {
    locale: "it_IT",
    title: "Ristorante Gastronomico nel Deserto di Agafay | Arabian Desert Home",
    description: "Cucina marocchina e mediterranea preparata con prodotti locali, in un'ambientazione desertica unica con vista sull'Atlante. Menu a partire da 200 DH.",
    url: "https://www.arabiandeserthome.ma/it/restaurant",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Ristorante deserto Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Ristorante Deserto Agafay | Arabian Desert Home",
    description: "Gastronomia marocchina sotto le stelle. Menu a partire da 200 DH, a 30 km da Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: itAlternates("/restaurant"),
};

const faqItems = [
  { q: "Bisogna prenotare per cenare al ristorante nel deserto di Agafay?", a: "Sì, la prenotazione è fortemente consigliata, soprattutto per la cena sotto le stelle. Prenotate almeno 24 ore prima, in particolare per i gruppi e nell'alta stagione (primavera e autunno)." },
  { q: "Si può cenare senza prenotare una tenda?", a: "Sì. Il pranzo e la cena sono inclusi nelle formule Day Pass, e il ristorante accoglie anche visitatori esterni che non soggiornano nelle nostre tende di lusso." },
  { q: "Offrite menu vegetariani o adatti alle allergie?", a: "Sì, è disponibile un menu vegetariano completo, e il nostro team adatta i piatti ad allergie e intolleranze su richiesta al momento della prenotazione." },
  { q: "Quanto costa un pasto?", a: "I menu partono da 200 DH e arrivano a 250 DH a persona a seconda della formula scelta, bevande escluse." },
  { q: "La cena sotto le stelle include animazione?", a: "Sì, le serate al Dar Agafay includono musica gnawa dal vivo, danza e illuminazione d'atmosfera intorno al falò, senza costi aggiuntivi." },
];

export default async function ItalianRestaurantPage() {
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.arabiandeserthome.ma/it" },
      { "@type": "ListItem", position: 2, name: "Ristorante", item: "https://www.arabiandeserthome.ma/it/restaurant" },
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
