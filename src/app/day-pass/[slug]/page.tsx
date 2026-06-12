import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { DayPassDetailContent } from "./DayPassDetailContent";

export async function generateStaticParams() {
  const passes = await db.dayPass.findMany({ select: { slug: true } });
  return passes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pass = await db.dayPass.findUnique({ where: { slug }, select: { name: true, description: true, image: true, price: true } });
  if (!pass) return {};
  const image = pass.image || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  return {
    title: `${pass.name} — Day Pass Désert Agafay | Arabian Desert Home`,
    description: pass.description,
    keywords: [pass.name, "day pass agafay", "day pass désert marrakech", "agafay day pass desert pool"],
    openGraph: {
      title: `${pass.name} | Arabian Desert Home — Day Pass Désert d'Agafay`,
      description: pass.description,
      url: `https://arabiandeserthome.ma/day-pass/${slug}`,
      images: [{ url: image, width: 1200, height: 800, alt: pass.name }],
    },
    twitter: { card: "summary_large_image" as const, title: pass.name, description: pass.description, images: [image] },
    alternates: { canonical: `https://arabiandeserthome.ma/day-pass/${slug}` },
  };
}

export default async function DayPassDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pass = await db.dayPass.findUnique({ where: { slug } });
  if (!pass) notFound();

  const image = pass.image || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pass.name,
    description: pass.description,
    image,
    brand: { "@type": "Brand", name: "Arabian Desert Home" },
    offers: {
      "@type": "Offer",
      url: `https://arabiandeserthome.ma/day-pass/${slug}`,
      priceCurrency: "MAD",
      price: pass.price,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Arabian Desert Home" },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://arabiandeserthome.ma" },
      { "@type": "ListItem", position: 2, name: "Day Pass", item: "https://arabiandeserthome.ma/day-pass" },
      { "@type": "ListItem", position: 3, name: pass.name, item: `https://arabiandeserthome.ma/day-pass/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navigation />
      <main className="flex-1 pt-20">
        <DayPassDetailContent pass={pass} />
      </main>
      <Footer />
    </div>
  );
}
