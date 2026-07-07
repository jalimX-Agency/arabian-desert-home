import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ArrowRight } from "lucide-react";
import { enAlternates } from "@/lib/seo/hreflang";

export const revalidate = 86400;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
const BASE = "https://www.arabiandeserthome.ma";

export const metadata = {
  title: "Agafay Desert: The Complete 2026 Guide | Arabian Desert Home",
  description:
    "Everything about the Agafay desert: location 30 km from Marrakech, weather, activities, prices, hotels and luxury bivouacs. The complete guide by Arabian Desert Home.",
  keywords: [
    "agafay desert", "agafay", "agafay desert marrakech", "agafay desert guide",
    "bivouac agafay", "hotel agafay", "agafay prices", "agafay activities",
    "agafay or merzouga", "stone desert marrakech",
  ],
  openGraph: {
    title: "Agafay Desert: The Complete 2026 Guide",
    description:
      "Location, weather, activities, prices, accommodation — everything you need to know about the Agafay desert, 30 minutes from Marrakech.",
    url: `${BASE}/en/desert-agafay`,
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Agafay Desert — lunar landscape near Marrakech" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Agafay Desert: The Complete 2026 Guide",
    description: "Everything about the Agafay desert, 30 minutes from Marrakech: activities, prices, weather, accommodation.",
    images: [OG_IMAGE],
  },
  alternates: enAlternates("/desert-agafay"),
};

const faqItems = [
  {
    q: "Where is the Agafay desert located?",
    a: "The Agafay desert is located about 30 km southwest of Marrakech, Morocco, on the Kik plateau towards the Lalla Takerkoust dam. Allow 30 to 45 minutes by road from the Marrakech medina.",
  },
  {
    q: "Is the Agafay desert a real sand desert?",
    a: "No — Agafay is a stone and clay desert (reg), not a dune-filled erg like Merzouga. Its ochre, lunar-like hills offer total escapism less than an hour from Marrakech, without the 9-hour drive needed to reach the Sahara.",
  },
  {
    q: "How much does a night in the Agafay desert cost?",
    a: "Prices range from €60 for a simple bivouac to over €400 for a grand luxury camp. At Arabian Desert Home, tent suites start at €170 per night, breakfast included. The Day Pass (a day with pool and lunch) starts at €35 per person.",
  },
  {
    q: "What is the best time to visit Agafay?",
    a: "Spring (March-May) and autumn (September-November) offer ideal temperatures of 20-28°C. Summer is hot by day (35-40°C) but pleasant in the evening. Winter offers mild days (18-22°C) and cool nights — perfect for campfires.",
  },
  {
    q: "What activities can you do in the Agafay desert?",
    a: "Camel rides, quad biking, horseback riding, dinner under the stars, panoramic sunset, stargazing, pool and hammam. Arabian Desert Home offers all these activities on its 6-hectare estate.",
  },
  {
    q: "Should you stay overnight or is a day enough?",
    a: "Both work. A Day Pass lets you enjoy the pool, lunch and activities in one day. But Agafay's magic really happens at night: starry sky, absolute silence and sunrise over the hills — a night in a luxury bivouac is the complete experience.",
  },
];

export default function EnglishDesertAgafayPage() {
  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Agafay Desert: The Complete 2026 Guide",
    description: metadata.description,
    image: OG_IMAGE,
    author: { "@type": "Organization", name: "Arabian Desert Home", url: BASE },
    publisher: { "@type": "Organization", name: "Arabian Desert Home", url: BASE },
    dateModified: new Date().toISOString().slice(0, 10),
    url: `${BASE}/en/desert-agafay`,
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
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/en` },
      { "@type": "ListItem", position: 2, name: "Agafay Desert Guide", item: `${BASE}/en/desert-agafay` },
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
            <p className="luxury-label text-amber/80 mb-4">Complete 2026 Guide</p>
            <h1 className="heading-display text-4xl md:text-6xl text-white mb-6">
              The Agafay Desert
            </h1>
            <p className="body-editorial text-lg text-white/80 max-w-2xl mx-auto">
              30 minutes from Marrakech, a stone desert with a lunar feel. Location,
              activities, prices, weather and accommodation: everything you need to know before you go.
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

            <h2>What is the Agafay Desert?</h2>
            <p>
              The <strong>Agafay desert</strong> is a stone and clay desert plateau located about
              <strong> 30 km southwest of Marrakech</strong>, Morocco. Unlike the Saharan ergs of
              Merzouga or Zagora, Agafay has no sand dunes: it&apos;s a <strong>reg</strong> — a
              mineral desert of ochre and golden hills, often compared to a lunar landscape. On
              clear days, the snow-capped Atlas peaks stand out on the horizon, offering one of
              Morocco&apos;s most spectacular panoramas.
            </p>
            <p>
              Long overlooked by tourist circuits, Agafay has become, in just a few years, the
              go-to desert destination for travellers based in Marrakech: reachable in 30 to 45
              minutes, without sacrificing the magic of wide open space.
            </p>

            <h2>Where is Agafay and how do you get there from Marrakech?</h2>
            <p>
              Agafay stretches across the Kik plateau, between the Amizmiz road and Lalla
              Takerkoust lake. From central Marrakech (Jemaa el-Fna square), allow:
            </p>
            <ul>
              <li><strong>By car or private taxi</strong>: 30 to 45 minutes (about 40 km of paved road)</li>
              <li><strong>Organised transfer</strong>: most camps, including Arabian Desert Home, arrange round-trip shuttles</li>
              <li><strong>From Marrakech-Ménara airport</strong>: about 35 minutes</li>
            </ul>
            <p>
              It&apos;s this proximity that makes Agafay a unique alternative: a real night in the
              desert without the 8 to 9 hour drive needed to reach the Merzouga dunes.
            </p>

            <h2>Agafay or Merzouga: which desert should you choose?</h2>
            <p>
              Every traveller asks this. In short: <strong>Merzouga</strong> offers the great sand
              dunes of Erg Chebbi, but requires at least 2 to 3 days of travel from Marrakech.
              <strong> Agafay</strong> offers the desert experience — silence, starry sky, bivouac,
              camels — 30 minutes from the city. For a short Marrakech stay, a romantic getaway or
              a family with children, Agafay is the obvious choice. For a week-long Sahara road
              trip, Merzouga is worth the journey.
            </p>

            <h2>Weather: the best season to visit Agafay</h2>
            <p>
              Agafay can be visited <strong>year-round</strong>, with some nuances:
            </p>
            <ul>
              <li><strong>Spring (March-May)</strong>: 20-28°C, the ideal period — hills sometimes turn green after rain</li>
              <li><strong>Summer (June-August)</strong>: 35-40°C by day, mild evenings around 25°C — perfect for dinners under the stars and the pool</li>
              <li><strong>Autumn (September-November)</strong>: 22-30°C, exceptional golden light</li>
              <li><strong>Winter (December-February)</strong>: 18-22°C by day, cool nights (5-10°C) — campfires and absolutely pure skies</li>
            </ul>

            <h2>What to do in the Agafay desert?</h2>
            <p>
              Far from being a still desert, Agafay concentrates a remarkable variety of
              <Link href="/en/les-activites"> desert activities</Link>:
            </p>
            <ul>
              <li><strong>Camel ride</strong> at sunrise or sunset</li>
              <li><strong>Quad and buggy</strong> across the plateau&apos;s tracks</li>
              <li><strong>Horseback riding</strong> — Agafay is renowned for its horses</li>
              <li><strong>Sunset Experience</strong>: panoramic aperitif facing the Atlas</li>
              <li><strong>Dinner under the stars</strong> with gnawa music by the fire</li>
              <li><strong>Stargazing</strong> — the Milky Way with the naked eye</li>
              <li><strong>Pool and relaxation</strong> with the <Link href="/en/day-pass">Day Pass</Link></li>
            </ul>

            <h2>Hotel in the Agafay desert: our tent suites</h2>
            <p>
              You won&apos;t find a classic hotel in Agafay — and that&apos;s a good thing. The
              signature accommodation is the <strong>luxury bivouac</strong> (or glamping): fully
              comfortable tent suites with real bedding, a private bathroom and hotel-level
              service, set right in the desert. At <strong>Arabian Desert Home</strong>, our
              private 6-hectare estate features <Link href="/en/les-tentes">luxury tents and
              suites</Link> with a pool, a Moroccan <Link href="/restaurant">gourmet
              restaurant</Link> and on-site activities.
            </p>

            <h2>Prices: what budget for Agafay?</h2>
            <ul>
              <li><strong>Day Pass</strong> (day with pool + lunch + activities): from €35 per person</li>
              <li><strong>Night in a luxury bivouac</strong>: from €170 (Junior Tent) to €300 (Suite) for the whole tent, breakfast included</li>
              <li><strong>Activities</strong>: camel ride, quad or horseback riding as extras depending on the package</li>
              <li><strong>Private events</strong>: <Link href="/les-evenements">weddings and seminars</Link> on request</li>
            </ul>
            <p>
              Compared to the 2-3 days of travel (transport + accommodation) required for Merzouga,
              Agafay offers the best experience-to-time-to-budget ratio in Morocco to discover the desert.
            </p>

            <h2>Frequently asked questions about the Agafay desert</h2>
            {faqItems.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            <h2>Learn more</h2>
            <p>
              Find our detailed guides on the <Link href="/en/blog">Arabian Desert Home blog</Link>:
              activities, gastronomy, seasonal tips and experience stories from the Agafay desert.
            </p>
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto mt-16 p-8 md:p-10 rounded-2xl border border-amber/15 bg-amber/[0.03] text-center">
            <p className="luxury-label text-amber/70 mb-3">Arabian Desert Home</p>
            <h2 className="heading-display text-2xl md:text-3xl text-foreground mb-4">
              Experience Agafay From the Inside
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Luxury tent suites, restaurant, pool and activities on 6 hectares of private desert,
              30 minutes from Marrakech.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/reservez-votre-sejour" className="btn-primary inline-flex items-center justify-center gap-3 cursor-pointer">
                Book Your Stay
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/en/day-pass" className="btn-outline inline-flex items-center justify-center gap-3 cursor-pointer">
                Discover the Day Pass
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
