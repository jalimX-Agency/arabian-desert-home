import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ArrowRight } from "lucide-react";

export const revalidate = 86400;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
const BASE = "https://www.arabiandeserthome.ma";

export const metadata = {
  title: "Désert d'Agafay : Le Guide Complet 2026 | Arabian Desert Home",
  description:
    "Tout savoir sur le désert d'Agafay : localisation à 30 km de Marrakech, météo, activités, prix, hôtels et bivouacs de luxe. Le guide complet par Arabian Desert Home.",
  keywords: [
    "désert agafay", "agafay", "désert agafay marrakech", "agafay désert guide",
    "bivouac agafay", "hôtel agafay", "agafay prix", "agafay activités",
    "agafay ou merzouga", "désert de pierre marrakech",
  ],
  openGraph: {
    title: "Désert d'Agafay : Le Guide Complet 2026",
    description:
      "Localisation, météo, activités, prix, hébergements — tout ce qu'il faut savoir sur le désert d'Agafay, à 30 minutes de Marrakech.",
    url: `${BASE}/desert-agafay`,
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Désert d'Agafay — paysage lunaire près de Marrakech" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Désert d'Agafay : Le Guide Complet 2026",
    description: "Tout savoir sur le désert d'Agafay, à 30 minutes de Marrakech : activités, prix, météo, hébergements.",
    images: [OG_IMAGE],
  },
  alternates: { canonical: `${BASE}/desert-agafay` },
};

const faqItems = [
  {
    q: "Où se trouve le désert d'Agafay ?",
    a: "Le désert d'Agafay se situe à environ 30 km au sud-ouest de Marrakech, au Maroc, sur le plateau du Kik en direction du barrage Lalla Takerkoust. Comptez 30 à 45 minutes de route depuis la médina de Marrakech.",
  },
  {
    q: "Le désert d'Agafay est-il un vrai désert de sable ?",
    a: "Non — Agafay est un désert de pierre et d'argile (reg), pas un erg de dunes comme Merzouga. Ses collines ocre au relief lunaire offrent un dépaysement total à moins d'une heure de Marrakech, sans les 9 heures de route nécessaires pour atteindre le Sahara.",
  },
  {
    q: "Combien coûte une nuit dans le désert d'Agafay ?",
    a: "Les prix varient de 60 € pour un bivouac simple à plus de 400 € pour un camp de grand luxe. Chez Arabian Desert Home, les tentes-suites démarrent à 170 € la nuit, petit-déjeuner inclus. Le Day Pass (journée avec piscine et déjeuner) démarre à 35 € par personne.",
  },
  {
    q: "Quelle est la meilleure période pour visiter Agafay ?",
    a: "Le printemps (mars-mai) et l'automne (septembre-novembre) offrent des températures idéales de 20 à 28 °C. L'été est chaud en journée (35-40 °C) mais agréable le soir. L'hiver offre des journées douces (18-22 °C) et des nuits fraîches — parfait pour les feux de camp.",
  },
  {
    q: "Quelles activités peut-on faire au désert d'Agafay ?",
    a: "Balade à dromadaire, quad, randonnée équestre, dîner sous les étoiles, coucher de soleil panoramique, observation des étoiles, piscine et hammam. Arabian Desert Home propose toutes ces activités sur son domaine de 6 hectares.",
  },
  {
    q: "Faut-il dormir sur place ou une journée suffit-elle ?",
    a: "Les deux se font. Un Day Pass permet de profiter de la piscine, du déjeuner et des activités en une journée. Mais la magie d'Agafay opère surtout la nuit : ciel étoilé, silence absolu et lever de soleil sur les collines — une nuit en bivouac de luxe est l'expérience complète.",
  },
];

export default function DesertAgafayPage() {
  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Désert d'Agafay : Le Guide Complet 2026",
    description: metadata.description,
    image: OG_IMAGE,
    author: { "@type": "Organization", name: "Arabian Desert Home", url: BASE },
    publisher: { "@type": "Organization", name: "Arabian Desert Home", url: BASE },
    dateModified: new Date().toISOString().slice(0, 10),
    url: `${BASE}/desert-agafay`,
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
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
      { "@type": "ListItem", position: 2, name: "Guide du Désert d'Agafay", item: `${BASE}/desert-agafay` },
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
            <p className="luxury-label text-amber/80 mb-4">Guide Complet 2026</p>
            <h1 className="heading-display text-4xl md:text-6xl text-white mb-6">
              Le Désert d&apos;Agafay
            </h1>
            <p className="body-editorial text-lg text-white/80 max-w-2xl mx-auto">
              À 30 minutes de Marrakech, un désert de pierre aux allures lunaires. Localisation,
              activités, prix, météo et hébergements : tout ce qu&apos;il faut savoir avant de partir.
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

            <h2>Qu&apos;est-ce que le désert d&apos;Agafay ?</h2>
            <p>
              Le <strong>désert d&apos;Agafay</strong> est un plateau désertique de pierre et d&apos;argile
              situé à environ <strong>30 km au sud-ouest de Marrakech</strong>, au Maroc. Contrairement
              aux ergs sahariens de Merzouga ou Zagora, Agafay n&apos;a pas de dunes de sable : c&apos;est
              un <strong>reg</strong> — un désert minéral aux collines ocre et dorées, souvent comparé
              à un paysage lunaire. Par temps clair, les sommets enneigés de l&apos;Atlas se découpent
              à l&apos;horizon, offrant l&apos;un des panoramas les plus spectaculaires du Maroc.
            </p>
            <p>
              Longtemps ignoré des circuits touristiques, Agafay est devenu en quelques années la
              destination désert de référence pour les voyageurs basés à Marrakech : on y accède en
              30 à 45 minutes, sans sacrifier la magie du grand vide.
            </p>

            <h2>Où se trouve Agafay et comment y aller depuis Marrakech ?</h2>
            <p>
              Agafay s&apos;étend sur le plateau du Kik, entre la route d&apos;Amizmiz et le lac de
              Lalla Takerkoust. Depuis le centre de Marrakech (place Jemaa el-Fna), comptez :
            </p>
            <ul>
              <li><strong>En voiture ou taxi privé</strong> : 30 à 45 minutes (environ 40 km de route goudronnée)</li>
              <li><strong>En transfert organisé</strong> : la plupart des camps, dont Arabian Desert Home, organisent la navette aller-retour</li>
              <li><strong>Depuis l&apos;aéroport de Marrakech-Ménara</strong> : environ 35 minutes</li>
            </ul>
            <p>
              C&apos;est cette proximité qui fait d&apos;Agafay une alternative unique : une vraie nuit
              dans le désert sans les 8 à 9 heures de route nécessaires pour rejoindre les dunes de Merzouga.
            </p>

            <h2>Agafay ou Merzouga : quel désert choisir ?</h2>
            <p>
              La question revient chez tous les voyageurs. En résumé : <strong>Merzouga</strong> offre
              les grandes dunes de sable de l&apos;Erg Chebbi, mais exige au minimum 2 à 3 jours de
              voyage depuis Marrakech. <strong>Agafay</strong> offre l&apos;expérience du désert —
              silence, ciel étoilé, bivouac, dromadaires — à 30 minutes de la ville. Pour un séjour
              court à Marrakech, une escale romantique ou une famille avec enfants, Agafay est le
              choix évident. Pour un road trip d&apos;une semaine dédié au Sahara, Merzouga se mérite.
            </p>

            <h2>Météo : la meilleure saison pour visiter Agafay</h2>
            <p>
              Agafay se visite <strong>toute l&apos;année</strong>, avec des nuances :
            </p>
            <ul>
              <li><strong>Printemps (mars-mai)</strong> : 20-28 °C, la période idéale — collines parfois verdies par les pluies</li>
              <li><strong>Été (juin-août)</strong> : 35-40 °C en journée, soirées douces autour de 25 °C — parfait pour les dîners sous les étoiles et la piscine</li>
              <li><strong>Automne (septembre-novembre)</strong> : 22-30 °C, lumières dorées exceptionnelles</li>
              <li><strong>Hiver (décembre-février)</strong> : 18-22 °C le jour, nuits fraîches (5-10 °C) — feux de camp et ciels d&apos;une pureté absolue</li>
            </ul>

            <h2>Que faire au désert d&apos;Agafay ?</h2>
            <p>
              Loin d&apos;être un désert immobile, Agafay concentre une remarquable variété
              d&apos;<Link href="/les-activites">activités désert</Link> :
            </p>
            <ul>
              <li><strong>Balade à dromadaire</strong> au lever ou coucher du soleil</li>
              <li><strong>Quad et buggy</strong> à travers les pistes du plateau</li>
              <li><strong>Randonnée équestre</strong> — Agafay est réputé pour ses chevaux</li>
              <li><strong>Sunset Experience</strong> : apéritif panoramique face à l&apos;Atlas</li>
              <li><strong>Dîner sous les étoiles</strong> avec musique gnawa au coin du feu</li>
              <li><strong>Observation des étoiles</strong> — la Voie Lactée à l&apos;œil nu</li>
              <li><strong>Piscine et détente</strong> avec le <Link href="/day-pass">Day Pass</Link> à la journée</li>
            </ul>

            <h2>Hôtel dans le désert d&apos;Agafay : nos tentes-suites</h2>
            <p>
              On ne trouve pas d&apos;hôtel classique à Agafay — et c&apos;est tant mieux. L&apos;hébergement
              emblématique est le <strong>bivouac de luxe</strong> (ou glamping) : des tentes-suites
              tout confort avec vraie literie, salle de bain privée et service hôtelier, posées en
              plein désert. Chez <strong>Arabian Desert Home</strong>, notre domaine privé de
              6 hectares compte des <Link href="/les-tentes">tentes et suites de luxe</Link> avec
              piscine, <Link href="/restaurant">restaurant gastronomique</Link> marocain et
              activités sur place.
            </p>

            <h2>Prix : quel budget pour Agafay ?</h2>
            <ul>
              <li><strong>Day Pass</strong> (journée piscine + déjeuner + activités) : à partir de 35 € par personne</li>
              <li><strong>Nuit en bivouac de luxe</strong> : de 170 € (Tente Junior) à 300 € (Suite) la tente entière, petit-déjeuner inclus</li>
              <li><strong>Activités</strong> : dromadaire, quad ou randonnée équestre en supplément selon la formule</li>
              <li><strong>Événements privés</strong> : <Link href="/les-evenements">mariages et séminaires</Link> sur devis</li>
            </ul>
            <p>
              Comparé aux 2-3 jours de voyage (transport + hébergement) nécessaires pour Merzouga,
              Agafay offre le meilleur rapport expérience/temps/budget du Maroc pour découvrir le désert.
            </p>

            <h2>Questions fréquentes sur le désert d&apos;Agafay</h2>
            {faqItems.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            <h2>Pour aller plus loin</h2>
            <p>
              Retrouvez nos guides détaillés sur le <Link href="/blog">blog Arabian Desert Home</Link> :
              activités, gastronomie, conseils de saison et récits d&apos;expériences dans le désert
              d&apos;Agafay.
            </p>
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto mt-16 p-8 md:p-10 rounded-2xl border border-amber/15 bg-amber/[0.03] text-center">
            <p className="luxury-label text-amber/70 mb-3">Arabian Desert Home</p>
            <h2 className="heading-display text-2xl md:text-3xl text-foreground mb-4">
              Vivez Agafay de l&apos;intérieur
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Tentes-suites de luxe, restaurant, piscine et activités sur 6 hectares de désert privé,
              à 30 minutes de Marrakech.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/reservez-votre-sejour" className="btn-primary inline-flex items-center justify-center gap-3 cursor-pointer">
                Réserver votre séjour
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/day-pass" className="btn-outline inline-flex items-center justify-center gap-3 cursor-pointer">
                Découvrir le Day Pass
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
