import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ArrowRight } from "lucide-react";
import { esAlternates } from "@/lib/seo/hreflang";

export const revalidate = 86400;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
const BASE = "https://www.arabiandeserthome.ma";

export const metadata = {
  title: "Desierto de Agafay: La Guía Completa 2026 | Arabian Desert Home",
  description:
    "Todo sobre el desierto de Agafay: ubicación a 30 km de Marrakech, clima, actividades, precios, hoteles y bivouacs de lujo. La guía completa de Arabian Desert Home.",
  keywords: [
    "desierto agafay", "agafay", "desierto agafay marrakech", "guía desierto agafay",
    "bivouac agafay", "hotel agafay", "precios agafay", "actividades agafay",
    "agafay o merzouga", "desierto de piedra marrakech",
  ],
  openGraph: {
    title: "Desierto de Agafay: La Guía Completa 2026",
    description:
      "Ubicación, clima, actividades, precios, alojamiento — todo lo que necesitas saber sobre el desierto de Agafay, a 30 minutos de Marrakech.",
    url: `${BASE}/es/desert-agafay`,
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Desierto de Agafay — paisaje lunar cerca de Marrakech" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Desierto de Agafay: La Guía Completa 2026",
    description: "Todo sobre el desierto de Agafay, a 30 minutos de Marrakech: actividades, precios, clima, alojamiento.",
    images: [OG_IMAGE],
  },
  alternates: esAlternates("/desert-agafay"),
};

const faqItems = [
  {
    q: "¿Dónde está ubicado el desierto de Agafay?",
    a: "El desierto de Agafay se encuentra a unos 30 km al suroeste de Marrakech, Marruecos, sobre la meseta de Kik en dirección a la presa de Lalla Takerkoust. Calcula entre 30 y 45 minutos por carretera desde la medina de Marrakech.",
  },
  {
    q: "¿Es Agafay un desierto de arena de verdad?",
    a: "No — Agafay es un desierto de piedra y arcilla (reg), no un erg de dunas como Merzouga. Sus colinas ocres de aspecto lunar ofrecen una evasión total a menos de una hora de Marrakech, sin las 9 horas de viaje necesarias para llegar al Sáhara.",
  },
  {
    q: "¿Cuánto cuesta una noche en el desierto de Agafay?",
    a: "Los precios van desde 60€ para un bivouac sencillo hasta más de 400€ para un gran campamento de lujo. En Arabian Desert Home, las suites de jaima empiezan en 170€ por noche, desayuno incluido. El Day Pass (un día con piscina y almuerzo) empieza en 35€ por persona.",
  },
  {
    q: "¿Cuál es la mejor época para visitar Agafay?",
    a: "La primavera (marzo-mayo) y el otoño (septiembre-noviembre) ofrecen temperaturas ideales de 20-28°C. El verano es caluroso de día (35-40°C) pero agradable por la noche. El invierno ofrece días suaves (18-22°C) y noches frescas — perfecto para hogueras.",
  },
  {
    q: "¿Qué actividades se pueden hacer en el desierto de Agafay?",
    a: "Paseos en camello, quad, equitación, cena bajo las estrellas, atardecer panorámico, observación de estrellas, piscina y hammam. Arabian Desert Home ofrece todas estas actividades en su propiedad de 6 hectáreas.",
  },
  {
    q: "¿Conviene pasar la noche o basta con un día?",
    a: "Ambas opciones funcionan. Un Day Pass te permite disfrutar de la piscina, el almuerzo y las actividades en un solo día. Pero la magia de Agafay ocurre realmente de noche: cielo estrellado, silencio absoluto y amanecer sobre las colinas — una noche en un bivouac de lujo es la experiencia completa.",
  },
];

export default function SpanishDesertAgafayPage() {
  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Desierto de Agafay: La Guía Completa 2026",
    description: metadata.description,
    image: OG_IMAGE,
    author: { "@type": "Organization", name: "Arabian Desert Home", url: BASE },
    publisher: { "@type": "Organization", name: "Arabian Desert Home", url: BASE },
    dateModified: new Date().toISOString().slice(0, 10),
    url: `${BASE}/es/desert-agafay`,
  });

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
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${BASE}/es` },
      { "@type": "ListItem", position: 2, name: "Guía del Desierto de Agafay", item: `${BASE}/es/desert-agafay` },
    ],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      <Navigation />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative py-20 md:py-28 px-6 md:px-12 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${OG_IMAGE}')` }}
          />
          <div className="absolute inset-0 bg-warm-black/70" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <p className="luxury-label text-amber/80 mb-4">Guía Completa 2026</p>
            <h1 className="heading-display text-4xl md:text-6xl text-white mb-6">
              El Desierto de Agafay
            </h1>
            <p className="body-editorial text-lg text-white/80 max-w-2xl mx-auto">
              A 30 minutos de Marrakech, un desierto de piedra con aire lunar. Ubicación,
              actividades, precios, clima y alojamiento: todo lo que necesitas saber antes de ir.
            </p>
          </div>
        </section>

        {/* Article body */}
        <article className="bg-background py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert body-editorial
            prose-headings:heading-editorial prose-headings:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-amber prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-li:text-muted-foreground">

            <h2>¿Qué es el Desierto de Agafay?</h2>
            <p>
              El <strong>desierto de Agafay</strong> es una meseta desértica de piedra y arcilla situada a
              unos <strong>30 km al suroeste de Marrakech</strong>, Marruecos. A diferencia de los ergs
              saharianos de Merzouga o Zagora, Agafay no tiene dunas de arena: es un <strong>reg</strong> — un
              desierto mineral de colinas ocres y doradas, a menudo comparado con un paisaje lunar. En
              días despejados, las cumbres nevadas del Atlas se recortan en el horizonte, ofreciendo uno de
              los panoramas más espectaculares de Marruecos.
            </p>
            <p>
              Ignorado durante mucho tiempo por los circuitos turísticos, Agafay se ha convertido, en solo
              unos años, en el destino desértico de referencia para los viajeros alojados en Marrakech: se
              llega en 30 a 45 minutos, sin renunciar a la magia de los grandes espacios.
            </p>

            <h2>¿Dónde está Agafay y cómo llegar desde Marrakech?</h2>
            <p>
              Agafay se extiende por la meseta de Kik, entre la carretera de Amizmiz y el lago de Lalla
              Takerkoust. Desde el centro de Marrakech (plaza Jemaa el-Fna), calcula:
            </p>
            <ul>
              <li><strong>En coche o taxi privado</strong>: 30 a 45 minutos (unos 40 km de carretera asfaltada)</li>
              <li><strong>Traslado organizado</strong>: la mayoría de los campamentos, incluido Arabian Desert Home, organizan traslados de ida y vuelta</li>
              <li><strong>Desde el aeropuerto de Marrakech-Ménara</strong>: unos 35 minutos</li>
            </ul>
            <p>
              Es esta cercanía la que convierte a Agafay en una alternativa única: una auténtica noche en el
              desierto sin las 8 o 9 horas de viaje necesarias para llegar a las dunas de Merzouga.
            </p>

            <h2>Agafay o Merzouga: ¿qué desierto elegir?</h2>
            <p>
              Todos los viajeros se hacen esta pregunta. En resumen: <strong>Merzouga</strong> ofrece las
              grandes dunas de arena del Erg Chebbi, pero requiere al menos 2 o 3 días de viaje desde
              Marrakech. <strong>Agafay</strong> ofrece la experiencia del desierto — silencio, cielo
              estrellado, bivouac, camellos — a 30 minutos de la ciudad. Para una escapada corta a
              Marrakech, un fin de semana romántico o una familia con niños, Agafay es la elección obvia.
              Para un road trip de una semana por el Sáhara, Merzouga merece el viaje.
            </p>

            <h2>Clima: la mejor época para visitar Agafay</h2>
            <p>
              Agafay se puede visitar <strong>todo el año</strong>, con algunos matices:
            </p>
            <ul>
              <li><strong>Primavera (marzo-mayo)</strong>: 20-28°C, el período ideal — las colinas a veces reverdecen tras la lluvia</li>
              <li><strong>Verano (junio-agosto)</strong>: 35-40°C de día, noches suaves alrededor de 25°C — perfecto para cenas bajo las estrellas y la piscina</li>
              <li><strong>Otoño (septiembre-noviembre)</strong>: 22-30°C, luz dorada excepcional</li>
              <li><strong>Invierno (diciembre-febrero)</strong>: 18-22°C de día, noches frescas (5-10°C) — hogueras y cielos absolutamente puros</li>
            </ul>

            <h2>¿Qué hacer en el desierto de Agafay?</h2>
            <p>
              Lejos de ser un desierto inmóvil, Agafay concentra una notable variedad de
              <Link href="/es/les-activites"> actividades en el desierto</Link>:
            </p>
            <ul>
              <li><strong>Paseo en camello</strong> al amanecer o al atardecer</li>
              <li><strong>Quad y buggy</strong> por las pistas de la meseta</li>
              <li><strong>Equitación</strong> — Agafay es conocido por sus caballos</li>
              <li><strong>Sunset Experience</strong>: aperitivo panorámico frente al Atlas</li>
              <li><strong>Cena bajo las estrellas</strong> con música gnawa junto al fuego</li>
              <li><strong>Observación de estrellas</strong> — la Vía Láctea a simple vista</li>
              <li><strong>Piscina y relax</strong> con el <Link href="/es/day-pass">Day Pass</Link></li>
            </ul>

            <h2>Hotel en el desierto de Agafay: nuestras suites de jaima</h2>
            <p>
              No encontrarás un hotel clásico en Agafay — y eso es bueno. El alojamiento por excelencia es
              el <strong>bivouac de lujo</strong> (o glamping): suites de jaima totalmente confortables, con
              ropa de cama de verdad, baño privado y un servicio de nivel hotelero, instaladas justo en el
              desierto. En <strong>Arabian Desert Home</strong>, nuestra propiedad privada de 6 hectáreas
              cuenta con <Link href="/es/les-tentes">jaimas y suites de lujo</Link> con piscina, un{" "}
              <Link href="/es/restaurant">restaurante gourmet</Link> marroquí y actividades in situ.
            </p>

            <h2>Precios: ¿qué presupuesto para Agafay?</h2>
            <ul>
              <li><strong>Day Pass</strong> (día con piscina + almuerzo + actividades): desde 35€ por persona</li>
              <li><strong>Noche en un bivouac de lujo</strong>: desde 170€ (Junior Tent) hasta 300€ (Suite) por jaima entera, desayuno incluido</li>
              <li><strong>Actividades</strong>: paseo en camello, quad o equitación como extras según el paquete</li>
              <li><strong>Eventos privados</strong>: <Link href="/es/les-evenements">bodas y seminarios</Link> bajo petición</li>
            </ul>
            <p>
              En comparación con los 2-3 días de viaje (transporte + alojamiento) necesarios para Merzouga,
              Agafay ofrece la mejor relación experiencia-tiempo-presupuesto de Marruecos para descubrir el desierto.
            </p>

            <h2>Preguntas frecuentes sobre el desierto de Agafay</h2>
            {faqItems.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            <h2>Saber más</h2>
            <p>
              Encuentra nuestras guías detalladas en el <Link href="/es/blog">blog de Arabian Desert Home</Link>:
              actividades, gastronomía, consejos según la temporada e historias de experiencias en el desierto de Agafay.
            </p>
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto mt-16 p-8 md:p-10 rounded-2xl border border-amber/15 bg-amber/[0.03] text-center">
            <p className="luxury-label text-amber/70 mb-3">Arabian Desert Home</p>
            <h2 className="heading-display text-2xl md:text-3xl text-foreground mb-4">
              Vive Agafay Desde Dentro
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Suites de jaima de lujo, restaurante, piscina y actividades en 6 hectáreas de desierto
              privado, a 30 minutos de Marrakech.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/es/reservez-votre-sejour" className="btn-primary inline-flex items-center justify-center gap-3 cursor-pointer">
                Reserva Tu Estancia
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/es/day-pass" className="btn-outline inline-flex items-center justify-center gap-3 cursor-pointer">
                Descubre el Day Pass
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
