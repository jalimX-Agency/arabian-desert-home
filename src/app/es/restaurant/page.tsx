import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { RestaurantContent } from "@/app/(fr)/restaurant/RestaurantContent";
import { esAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Restaurante & Gastronomía | Arabian Desert Home — Desierto de Agafay",
  description: "Saborea la gastronomía marroquí en el corazón del desierto de Agafay. Cena bajo las estrellas, fogata y música gnawa. Menús desde 200 DH.",
  keywords: [
    "restaurante desierto agafay", "cocina marroquí bivouac", "cena desierto marrakech",
    "gastronomía agafay", "restaurante bajo las estrellas marruecos",
    "tajín desierto agafay", "agafay restaurant morocco",
  ],
  openGraph: {
    locale: "es_ES",
    title: "Restaurante Gastronómico en el Desierto de Agafay | Arabian Desert Home",
    description: "Cocina marroquí y mediterránea preparada con productos locales, en un entorno desértico único con vistas al Atlas. Menús desde 200 DH.",
    url: "https://www.arabiandeserthome.ma/es/restaurant",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Restaurante desierto Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Restaurante Desierto Agafay | Arabian Desert Home",
    description: "Gastronomía marroquí bajo las estrellas. Menús desde 200 DH a 30 km de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: esAlternates("/restaurant"),
};

const faqItems = [
  { q: "¿Hay que reservar para cenar en el restaurante del desierto de Agafay?", a: "Sí, la reserva es muy recomendable, especialmente para la cena bajo las estrellas. Reserve con al menos 24 horas de antelación, en particular para grupos y en temporada alta (primavera y otoño)." },
  { q: "¿Se puede cenar sin reservar una jaima?", a: "Sí. El almuerzo y la cena están incluidos en nuestras opciones de Day Pass, y el restaurante también recibe a visitantes externos que no se alojan en nuestras jaimas de lujo." },
  { q: "¿Ofrecen menús vegetarianos o adaptados a alergias?", a: "Sí, hay un menú vegetariano completo disponible, y nuestro equipo adapta los platos a alergias e intolerancias si se indica al reservar." },
  { q: "¿Cuál es el precio de una comida?", a: "Los menús empiezan en 200 DH y llegan hasta 250 DH por persona según la opción elegida, bebidas no incluidas." },
  { q: "¿La cena bajo las estrellas incluye animación?", a: "Sí, las veladas en Dar Agafay incluyen música gnawa en vivo, danza e iluminación ambiental junto a la hoguera, sin coste adicional." },
];

export default async function SpanishRestaurantPage() {
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
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.arabiandeserthome.ma/es" },
      { "@type": "ListItem", position: 2, name: "Restaurante", item: "https://www.arabiandeserthome.ma/es/restaurant" },
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
