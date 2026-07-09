import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { TenteDetailContent } from "@/app/les-tentes/[slug]/TenteDetailContent";
import { itAlternates } from "@/lib/seo/hreflang";

export async function generateStaticParams() {
  const suites = await db.suite.findMany({ select: { slug: true } });
  return suites.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const suite = await db.suite.findUnique({
    where: { slug },
    select: { name: true, nameIt: true, description: true, descriptionIt: true, images: true, price: true },
  });
  if (!suite) return {};
  const name = suite.nameIt || suite.name;
  const description = suite.descriptionIt || suite.description;
  const image = suite.images?.split(",")[0]?.trim() || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  return {
    title: `${name} — Tenda di Lusso Agafay | Arabian Desert Home`,
    description,
    keywords: [name, "bivacco di lusso agafay", "tenda di lusso deserto marrakech", "glamping agafay marocco"],
    openGraph: {
      title: `${name} | Arabian Desert Home — Deserto di Agafay`,
      description,
      url: `https://www.arabiandeserthome.ma/it/les-tentes/${slug}`,
      images: [{ url: image, width: 1200, height: 800, alt: name }],
    },
    twitter: { card: "summary_large_image" as const, title: name, description, images: [image] },
    alternates: itAlternates(`/les-tentes/${slug}`),
  };
}

export default async function ItalianTenteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const suite = await db.suite.findUnique({ where: { slug } });
  if (!suite) notFound();

  const name = suite.nameIt || suite.name;
  const description = suite.descriptionIt || suite.description;
  const image = suite.images?.split(",")[0]?.trim() || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: { "@type": "Brand", name: "Arabian Desert Home" },
    offers: {
      "@type": "Offer",
      url: `https://www.arabiandeserthome.ma/it/les-tentes/${slug}`,
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.arabiandeserthome.ma/it" },
      { "@type": "ListItem", position: 2, name: "Alloggi", item: "https://www.arabiandeserthome.ma/it/les-tentes" },
      { "@type": "ListItem", position: 3, name, item: `https://www.arabiandeserthome.ma/it/les-tentes/${slug}` },
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
