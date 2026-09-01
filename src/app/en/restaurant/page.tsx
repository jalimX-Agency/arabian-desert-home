import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { RestaurantContent } from "@/app/(fr)/restaurant/RestaurantContent";
import { enAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Restaurant & Gastronomy | Arabian Desert Home — Agafay Desert",
  description: "Savor Moroccan gastronomy in the heart of the Agafay desert. Dinner under the stars, campfire and gnawa music. Menus from 200 DH.",
  keywords: [
    "agafay desert restaurant", "moroccan cuisine bivouac", "desert dinner marrakech",
    "agafay gastronomy", "restaurant under the stars morocco",
    "tajine desert agafay", "agafay restaurant morocco",
  ],
  openGraph: {
    locale: "en_US",
    title: "Gastronomic Restaurant in the Agafay Desert | Arabian Desert Home",
    description: "Moroccan and Mediterranean cuisine prepared with local produce, in a unique desert setting with Atlas views. Menus from 200 DH.",
    url: "https://www.arabiandeserthome.ma/en/restaurant",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Agafay desert restaurant — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Agafay Desert Restaurant | Arabian Desert Home",
    description: "Moroccan gastronomy under the stars. Menus from 200 DH, 30 km from Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: enAlternates("/restaurant"),
};

const faqItems = [
  { q: "Do I need to book a table at the Agafay desert restaurant?", a: "Yes, booking is strongly recommended, especially for the dinner under the stars. Reserve at least 24 hours ahead, particularly for groups and during high season (spring and autumn)." },
  { q: "Can I dine here without booking a tent?", a: "Yes. Lunch and dinner are included in our Day Pass packages, and the restaurant also welcomes outside visitors who aren't staying in our tents-suites." },
  { q: "Do you offer vegetarian menus or cater to allergies?", a: "Yes, a full vegetarian menu is available, and our team can adapt dishes to allergies and intolerances on request when you book." },
  { q: "How much does a meal cost?", a: "Menus start at 200 DH and go up to 250 DH per person depending on the option chosen, drinks not included." },
  { q: "Does the dinner under the stars include entertainment?", a: "Yes, evenings at Dar Agafay include live gnawa music, dance and ambient lighting around the campfire, at no extra cost." },
];

export default async function EnglishRestaurantPage() {
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.arabiandeserthome.ma/en" },
      { "@type": "ListItem", position: 2, name: "Restaurant", item: "https://www.arabiandeserthome.ma/en/restaurant" },
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
