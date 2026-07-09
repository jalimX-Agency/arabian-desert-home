import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ActiviteDetailContent } from "@/app/les-activites/[slug]/ActiviteDetailContent";
import { esAlternates } from "@/lib/seo/hreflang";

export async function generateStaticParams() {
  const activities = await db.activity.findMany({ select: { slug: true } });
  return activities.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = await db.activity.findUnique({
    where: { slug },
    select: { name: true, nameEs: true, description: true, descriptionEs: true, images: true, price: true },
  });
  if (!activity) return {};
  const name = activity.nameEs || activity.name;
  const description = activity.descriptionEs || activity.description;
  const image = activity.images?.split(",")[0]?.trim() || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  return {
    title: `${name} — Actividad en el Desierto de Agafay | Arabian Desert Home`,
    description,
    keywords: [name, "actividades agafay", "actividad desierto marrakech", "actividades agafay marruecos"],
    openGraph: {
      title: `${name} | Arabian Desert Home — Desierto de Agafay`,
      description,
      url: `https://www.arabiandeserthome.ma/es/les-activites/${slug}`,
      images: [{ url: image, width: 1200, height: 800, alt: name }],
    },
    twitter: { card: "summary_large_image" as const, title: name, description, images: [image] },
    alternates: esAlternates(`/les-activites/${slug}`),
  };
}

export default async function SpanishActiviteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = await db.activity.findUnique({ where: { slug } });
  if (!activity) notFound();

  const name = activity.nameEs || activity.name;
  const description = activity.descriptionEs || activity.description;
  const image = activity.images?.split(",")[0]?.trim() || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: { "@type": "Brand", name: "Arabian Desert Home" },
    offers: {
      "@type": "Offer",
      url: `https://www.arabiandeserthome.ma/es/les-activites/${slug}`,
      priceCurrency: "MAD",
      price: activity.price,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Arabian Desert Home" },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.arabiandeserthome.ma/es" },
      { "@type": "ListItem", position: 2, name: "Actividades", item: "https://www.arabiandeserthome.ma/es/les-activites" },
      { "@type": "ListItem", position: 3, name, item: `https://www.arabiandeserthome.ma/es/les-activites/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navigation />
      <main className="flex-1 pt-20">
        <ActiviteDetailContent activity={activity} />
      </main>
      <Footer />
    </div>
  );
}
