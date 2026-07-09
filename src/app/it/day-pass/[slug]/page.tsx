import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { DayPassDetailContent } from "@/app/day-pass/[slug]/DayPassDetailContent";
import { itAlternates } from "@/lib/seo/hreflang";

export async function generateStaticParams() {
  const passes = await db.dayPass.findMany({ select: { slug: true } });
  return passes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pass = await db.dayPass.findUnique({
    where: { slug },
    select: { name: true, nameIt: true, description: true, descriptionIt: true, image: true, price: true },
  });
  if (!pass) return {};
  const name = pass.nameIt || pass.name;
  const description = pass.descriptionIt || pass.description;
  const image = pass.image || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  return {
    title: `${name} — Day Pass Deserto di Agafay | Arabian Desert Home`,
    description,
    keywords: [name, "day pass agafay", "day pass deserto marrakech", "day pass agafay piscina deserto"],
    openGraph: {
      title: `${name} | Arabian Desert Home — Day Pass Deserto di Agafay`,
      description,
      url: `https://www.arabiandeserthome.ma/it/day-pass/${slug}`,
      images: [{ url: image, width: 1200, height: 800, alt: name }],
    },
    twitter: { card: "summary_large_image" as const, title: name, description, images: [image] },
    alternates: itAlternates(`/day-pass/${slug}`),
  };
}

export default async function ItalianDayPassDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pass = await db.dayPass.findUnique({ where: { slug } });
  if (!pass) notFound();

  const name = pass.nameIt || pass.name;
  const description = pass.descriptionIt || pass.description;
  const image = pass.image || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: { "@type": "Brand", name: "Arabian Desert Home" },
    offers: {
      "@type": "Offer",
      url: `https://www.arabiandeserthome.ma/it/day-pass/${slug}`,
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.arabiandeserthome.ma/it" },
      { "@type": "ListItem", position: 2, name: "Day Pass", item: "https://www.arabiandeserthome.ma/it/day-pass" },
      { "@type": "ListItem", position: 3, name, item: `https://www.arabiandeserthome.ma/it/day-pass/${slug}` },
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
