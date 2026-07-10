import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ArrowRight } from "lucide-react";
import { itAlternates } from "@/lib/seo/hreflang";

export const revalidate = 86400;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
const BASE = "https://www.arabiandeserthome.ma";

export const metadata = {
  title: "Deserto di Agafay: la Guida Completa 2026 | Arabian Desert Home",
  description:
    "Tutto sul deserto di Agafay: posizione a 30 km da Marrakech, clima, attività, prezzi, hotel e bivacchi di lusso. La guida completa firmata Arabian Desert Home.",
  keywords: [
    "deserto agafay", "agafay", "deserto agafay marrakech", "guida deserto agafay",
    "bivacco agafay", "hotel agafay", "prezzi agafay", "attività agafay",
    "agafay o merzouga", "deserto di pietra marrakech",
  ],
  openGraph: {
    title: "Deserto di Agafay: la Guida Completa 2026",
    description:
      "Posizione, clima, attività, prezzi, alloggi — tutto quello che devi sapere sul deserto di Agafay, a 30 minuti da Marrakech.",
    url: `${BASE}/it/desert-agafay`,
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Deserto di Agafay — paesaggio lunare vicino a Marrakech" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Deserto di Agafay: la Guida Completa 2026",
    description: "Tutto sul deserto di Agafay, a 30 minuti da Marrakech: attività, prezzi, clima, alloggi.",
    images: [OG_IMAGE],
  },
  alternates: itAlternates("/desert-agafay"),
};

const faqItems = [
  {
    q: "Dove si trova il deserto di Agafay?",
    a: "Il deserto di Agafay si trova a circa 30 km a sud-ovest di Marrakech, in Marocco, sull'altopiano del Kik in direzione della diga di Lalla Takerkoust. Calcola 30-45 minuti d'auto dalla medina di Marrakech.",
  },
  {
    q: "Il deserto di Agafay è un vero deserto di sabbia?",
    a: "No — Agafay è un deserto di pietra e argilla (reg), non un erg di dune come Merzouga. Le sue colline ocra dall'aspetto lunare offrono un'evasione totale a meno di un'ora da Marrakech, senza le 9 ore di viaggio necessarie per raggiungere il Sahara.",
  },
  {
    q: "Quanto costa una notte nel deserto di Agafay?",
    a: "I prezzi vanno da 60€ per un semplice bivacco a oltre 400€ per un grande campo di lusso. Ad Arabian Desert Home, le suite tenda partono da 170€ a notte, colazione inclusa. Il Day Pass (una giornata con piscina e pranzo) parte da 35€ a persona.",
  },
  {
    q: "Qual è il periodo migliore per visitare Agafay?",
    a: "La primavera (marzo-maggio) e l'autunno (settembre-novembre) offrono temperature ideali di 20-28°C. L'estate è calda di giorno (35-40°C) ma piacevole la sera. L'inverno offre giornate miti (18-22°C) e notti fresche — perfette per i falò.",
  },
  {
    q: "Quali attività si possono fare nel deserto di Agafay?",
    a: "Giri in cammello, quad, equitazione, cena sotto le stelle, tramonto panoramico, osservazione delle stelle, piscina e hammam. Arabian Desert Home offre tutte queste attività nella sua tenuta di 6 ettari.",
  },
  {
    q: "Meglio pernottare o basta una giornata?",
    a: "Entrambe le opzioni funzionano. Un Day Pass permette di godersi piscina, pranzo e attività in una sola giornata. Ma la vera magia di Agafay avviene di notte: cielo stellato, silenzio assoluto e alba sulle colline — una notte in un bivacco di lusso è l'esperienza completa.",
  },
];

export default function ItalianDesertAgafayPage() {
  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Deserto di Agafay: la Guida Completa 2026",
    description: metadata.description,
    image: OG_IMAGE,
    author: { "@type": "Organization", name: "Arabian Desert Home", url: BASE },
    publisher: { "@type": "Organization", name: "Arabian Desert Home", url: BASE },
    dateModified: new Date().toISOString().slice(0, 10),
    url: `${BASE}/it/desert-agafay`,
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
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/it` },
      { "@type": "ListItem", position: 2, name: "Guida al Deserto di Agafay", item: `${BASE}/it/desert-agafay` },
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
            <p className="luxury-label text-amber/80 mb-4">Guida Completa 2026</p>
            <h1 className="heading-display text-4xl md:text-6xl text-white mb-6">
              Il Deserto di Agafay
            </h1>
            <p className="body-editorial text-lg text-white/80 max-w-2xl mx-auto">
              A 30 minuti da Marrakech, un deserto di pietra dall'atmosfera lunare. Posizione,
              attività, prezzi, clima e alloggi: tutto quello che devi sapere prima di partire.
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

            <h2>Cos'è il Deserto di Agafay?</h2>
            <p>
              Il <strong>deserto di Agafay</strong> è un altopiano desertico di pietra e argilla situato a circa
              <strong> 30 km a sud-ovest di Marrakech</strong>, in Marocco. A differenza degli erg sahariani di
              Merzouga o Zagora, Agafay non ha dune di sabbia: è un <strong>reg</strong> — un
              deserto minerale di colline ocra e dorate, spesso paragonato a un paesaggio
              lunare. Nelle giornate limpide, le vette innevate dell'Atlante si stagliano
              all'orizzonte, offrendo uno dei panorami più spettacolari del Marocco.
            </p>
            <p>
              A lungo trascurato dai circuiti turistici, Agafay è diventato, in pochi anni, la
              destinazione desertica di riferimento per i viaggiatori di base a Marrakech: raggiungibile in 30-45
              minuti, senza rinunciare alla magia degli spazi aperti.
            </p>

            <h2>Dove si trova Agafay e come arrivarci da Marrakech?</h2>
            <p>
              Agafay si estende sull'altopiano del Kik, tra la strada per Amizmiz e il lago
              Lalla Takerkoust. Dal centro di Marrakech (piazza Jemaa el-Fna), calcola:
            </p>
            <ul>
              <li><strong>In auto o taxi privato</strong>: 30-45 minuti (circa 40 km di strada asfaltata)</li>
              <li><strong>Transfer organizzato</strong>: la maggior parte dei campi, incluso Arabian Desert Home, organizza navette andata e ritorno</li>
              <li><strong>Dall'aeroporto di Marrakech-Ménara</strong>: circa 35 minuti</li>
            </ul>
            <p>
              È proprio questa vicinanza a rendere Agafay un'alternativa unica: una vera notte nel
              deserto senza le 8-9 ore di viaggio necessarie per raggiungere le dune di Merzouga.
            </p>

            <h2>Agafay o Merzouga: quale deserto scegliere?</h2>
            <p>
              Ogni viaggiatore se lo chiede. In breve: <strong>Merzouga</strong> offre le grandi dune
              di sabbia dell'Erg Chebbi, ma richiede almeno 2-3 giorni di viaggio da Marrakech.
              <strong> Agafay</strong> offre l'esperienza del deserto — silenzio, cielo stellato, bivacco,
              cammelli — a 30 minuti dalla città. Per un breve soggiorno a Marrakech, una fuga romantica o
              una famiglia con bambini, Agafay è la scelta evidente. Per un road trip di una settimana nel
              Sahara, Merzouga vale il viaggio.
            </p>

            <h2>Clima: la stagione migliore per visitare Agafay</h2>
            <p>
              Agafay si può visitare <strong>tutto l'anno</strong>, con alcune sfumature:
            </p>
            <ul>
              <li><strong>Primavera (marzo-maggio)</strong>: 20-28°C, il periodo ideale — le colline talvolta rinverdiscono dopo la pioggia</li>
              <li><strong>Estate (giugno-agosto)</strong>: 35-40°C di giorno, serate miti intorno ai 25°C — perfette per le cene sotto le stelle e la piscina</li>
              <li><strong>Autunno (settembre-novembre)</strong>: 22-30°C, luce dorata eccezionale</li>
              <li><strong>Inverno (dicembre-febbraio)</strong>: 18-22°C di giorno, notti fresche (5-10°C) — falò e cieli assolutamente tersi</li>
            </ul>

            <h2>Cosa fare nel deserto di Agafay?</h2>
            <p>
              Lungi dall'essere un deserto immobile, Agafay concentra una notevole varietà di
              <Link href="/it/les-activites"> attività nel deserto</Link>:
            </p>
            <ul>
              <li><strong>Giro in cammello</strong> all'alba o al tramonto</li>
              <li><strong>Quad e buggy</strong> sulle piste dell'altopiano</li>
              <li><strong>Equitazione</strong> — Agafay è rinomata per i suoi cavalli</li>
              <li><strong>Sunset Experience</strong>: aperitivo panoramico di fronte all'Atlante</li>
              <li><strong>Cena sotto le stelle</strong> con musica gnawa accanto al fuoco</li>
              <li><strong>Osservazione delle stelle</strong> — la Via Lattea a occhio nudo</li>
              <li><strong>Piscina e relax</strong> con il <Link href="/it/day-pass">Day Pass</Link></li>
            </ul>

            <h2>Hotel nel deserto di Agafay: le nostre suite tenda</h2>
            <p>
              Ad Agafay non troverai un hotel classico — ed è un bene. La
              sistemazione tipica è il <strong>bivacco di lusso</strong> (o glamping): suite tenda
              pienamente confortevoli con letti veri, bagno privato e servizio
              da hotel, immerse nel deserto. Ad <strong>Arabian Desert Home</strong>, la nostra
              tenuta privata di 6 ettari offre <Link href="/it/les-tentes">tende e suite di
              lusso</Link> con piscina, un <Link href="/it/restaurant">ristorante gourmet</Link>
              marocchino e attività in loco.
            </p>

            <h2>Prezzi: quale budget per Agafay?</h2>
            <ul>
              <li><strong>Day Pass</strong> (giornata con piscina + pranzo + attività): da 35€ a persona</li>
              <li><strong>Notte in un bivacco di lusso</strong>: da 170€ (Junior Tent) a 300€ (Suite) per l'intera tenda, colazione inclusa</li>
              <li><strong>Attività</strong>: giro in cammello, quad o equitazione come extra a seconda del pacchetto</li>
              <li><strong>Eventi privati</strong>: <Link href="/it/les-evenements">matrimoni e seminari</Link> su richiesta</li>
            </ul>
            <p>
              Rispetto ai 2-3 giorni di viaggio (trasporto + alloggio) necessari per Merzouga,
              Agafay offre il miglior rapporto esperienza-tempo-budget del Marocco per scoprire il deserto.
            </p>

            <h2>Domande frequenti sul deserto di Agafay</h2>
            {faqItems.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            <h2>Per saperne di più</h2>
            <p>
              Trova le nostre guide dettagliate sul <Link href="/it/blog">blog di Arabian Desert Home</Link>:
              attività, gastronomia, consigli stagionali e racconti di esperienze dal deserto di Agafay.
            </p>
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto mt-16 p-8 md:p-10 rounded-2xl border border-amber/15 bg-amber/[0.03] text-center">
            <p className="luxury-label text-amber/70 mb-3">Arabian Desert Home</p>
            <h2 className="heading-display text-2xl md:text-3xl text-foreground mb-4">
              Vivi Agafay dall'Interno
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Suite tenda di lusso, ristorante, piscina e attività su 6 ettari di deserto privato,
              a 30 minuti da Marrakech.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/it/reservez-votre-sejour" className="btn-primary inline-flex items-center justify-center gap-3 cursor-pointer">
                Prenota il Tuo Soggiorno
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/it/day-pass" className="btn-outline inline-flex items-center justify-center gap-3 cursor-pointer">
                Scopri il Day Pass
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
