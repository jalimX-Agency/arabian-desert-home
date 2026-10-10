import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { LesTentesContent } from "@/app/(fr)/les-tentes/LesTentesContent";
import { itAlternates } from "@/lib/seo/hreflang";

export const revalidate = 3600;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Hotel e Tende di Lusso nel Deserto di Agafay | Arabian Desert Home",
  description: "Hotel boutique sotto tenda nel deserto di Agafay: Tenda Doppia da 170€, Tenda Tripla 190€, Tenda Familiare 220€. Colazione inclusa, a 30 km da Marrakech.",
  keywords: [
    "hotel agafay", "hotel deserto agafay", "bivacco di lusso agafay", "tenda glamping marrakech",
    "tenda di lusso deserto agafay", "bivacco di lusso agafay con piscina",
    "campo di lusso deserto agafay marrakech", "glamping agafay marocco", "suite tenda deserto marocco",
  ],
  openGraph: {
    locale: "it_IT",
    title: "Tende e Suite di Lusso nel Deserto di Agafay | Arabian Desert Home",
    description: "Dormi sotto le stelle nelle nostre esclusive suite tenda, a 30 km da Marrakech. Da 170€/notte, colazione inclusa.",
    url: "https://www.arabiandeserthome.ma/it/les-tentes",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Tende di lusso Arabian Desert Home — Agafay" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Tende e Suite di Lusso | Arabian Desert Home — Agafay",
    description: "Dormi sotto le stelle nelle nostre esclusive suite tenda, a 30 km da Marrakech. Da 170€/notte.",
    images: [OG_IMAGE],
  },
  alternates: itAlternates("/les-tentes"),
};

export default async function ItalianLesTentesPage() {
  const suites = await db.suite.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: suites.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://www.arabiandeserthome.ma/it/les-tentes/${s.slug}`,
              item: {
                "@type": "Product",
                name: s.nameIt || s.name,
                image: s.image,
                brand: { "@type": "Brand", name: "Arabian Desert Home" },
                offers: {
                  "@type": "AggregateOffer",
                  priceCurrency: s.currency,
                  lowPrice: s.price,
                  offerCount: 1,
                  availability: "https://schema.org/InStock",
                },
              },
            })),
          }),
        }}
      />
      <Navigation />
      <main className="flex-1">
        <LesTentesContent suites={suites} />
      </main>
      <Footer />
    </div>
  );
}
