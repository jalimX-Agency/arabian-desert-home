import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { TenteDetailContent } from "./TenteDetailContent";

export async function generateStaticParams() {
  const suites = await db.suite.findMany({ select: { slug: true } });
  return suites.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const suite = await db.suite.findUnique({ where: { slug }, select: { name: true, description: true, images: true, price: true } });
  if (!suite) return {};
  const image = suite.images?.split(",")[0]?.trim() || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  return {
    title: `${suite.name} — Tente de Luxe Agafay | Arabian Desert Home`,
    description: suite.description,
    keywords: [suite.name, "bivouac luxe agafay", "tente luxe désert marrakech", "glamping agafay morocco"],
    openGraph: {
      title: `${suite.name} | Arabian Desert Home — Désert d'Agafay`,
      description: suite.description,
      url: `https://arabiandeserthome.com/les-tentes/${slug}`,
      images: [{ url: image, width: 1200, height: 800, alt: suite.name }],
    },
    twitter: { card: "summary_large_image" as const, title: suite.name, description: suite.description, images: [image] },
    alternates: { canonical: `https://arabiandeserthome.com/les-tentes/${slug}` },
  };
}

export default async function TenteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const suite = await db.suite.findUnique({ where: { slug } });
  if (!suite) notFound();

  const image = suite.images?.split(",")[0]?.trim() || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: suite.name,
    description: suite.description,
    image,
    brand: { "@type": "Brand", name: "Arabian Desert Home" },
    offers: {
      "@type": "Offer",
      url: `https://arabiandeserthome.com/les-tentes/${slug}`,
      priceCurrency: "EUR",
      price: suite.price,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Arabian Desert Home" },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://arabiandeserthome.com" },
      { "@type": "ListItem", position: 2, name: "Hébergements", item: "https://arabiandeserthome.com/les-tentes" },
      { "@type": "ListItem", position: 3, name: suite.name, item: `https://arabiandeserthome.com/les-tentes/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navigation />
      <main className="flex-1 pt-20">
        <TenteDetailContent suite={suite} />
      </main>
      <Footer />
    </div>
  );
}
