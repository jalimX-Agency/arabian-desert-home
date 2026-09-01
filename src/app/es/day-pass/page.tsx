import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { DayPassContent } from "@/app/(fr)/day-pass/DayPassContent";
import { esAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Day Pass y Piscina en el Desierto | Arabian Desert Home — Agafay",
  description: "Disfruta del desierto de Agafay durante un día. Day Pass piscina y almuerzo desde 35€/persona. Velada bajo las estrellas con espectáculo gnawa. Reserva tu día.",
  keywords: [
    "day pass agafay", "day pass desierto marrakech", "día piscina desierto agafay",
    "day pass agafay almuerzo incluido", "day pass agafay almuerzo incluido",
    "día desierto marrakech", "day pass agafay piscina desierto",
  ],
  openGraph: {
    locale: "es_ES",
    title: "Day Pass Piscina y Almuerzo en el Desierto de Agafay | Arabian Desert Home",
    description: "Piscina, almuerzo marroquí y actividades desde 35€/persona. A 30 km de Marrakech, reserva recomendada con 24h de antelación.",
    url: "https://www.arabiandeserthome.ma/es/day-pass",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Day Pass Desierto de Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Day Pass Desierto de Agafay | Arabian Desert Home",
    description: "Piscina, almuerzo marroquí y actividades desde 35€/persona. A 30 km de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: esAlternates("/day-pass"),
};

const faqItems = [
  { q: "¿Cuánto dura el Day Pass?", a: "El Day Pass es válido de 11h a 16h, para que disfrute plenamente de la piscina, el almuerzo y las actividades en un solo día." },
  { q: "¿El precio incluye el almuerzo?", a: "Sí, un almuerzo marroquí completo está incluido en todas las opciones de Day Pass, además del acceso a la piscina y las zonas de descanso." },
  { q: "¿Hay descuento para niños?", a: "Sí, los niños tienen un -50% en todas las opciones de Day Pass." },
  { q: "¿Hay que reservar con antelación?", a: "Sí, se requiere reservar con al menos 24 horas de antelación para garantizar su plaza, especialmente los fines de semana y en temporada alta." },
  { q: "¿El traslado desde Marrakech está incluido?", a: "El traslado se puede organizar bajo petición al reservar; calcule entre 30 y 45 minutos desde el centro de Marrakech." },
];

export default async function SpanishDayPassPage() {
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
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.arabiandeserthome.ma/es" },
      { "@type": "ListItem", position: 2, name: "Day Pass", item: "https://www.arabiandeserthome.ma/es/day-pass" },
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
