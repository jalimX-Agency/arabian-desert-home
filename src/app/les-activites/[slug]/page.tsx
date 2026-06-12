import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ActiviteDetailContent } from "./ActiviteDetailContent";

export async function generateStaticParams() {
  const activities = await db.activity.findMany({ select: { slug: true } });
  return activities.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = await db.activity.findUnique({ where: { slug }, select: { name: true, description: true, images: true, price: true } });
  if (!activity) return {};
  const image = activity.images?.split(",")[0]?.trim() || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  return {
    title: `${activity.name} — Activité Désert Agafay | Arabian Desert Home`,
    description: activity.description,
    keywords: [activity.name, "activités agafay", "activité désert marrakech", "agafay activities morocco"],
    openGraph: {
      title: `${activity.name} | Arabian Desert Home — Désert d'Agafay`,
      description: activity.description,
      url: `https://arabiandeserthome.ma/les-activites/${slug}`,
      images: [{ url: image, width: 1200, height: 800, alt: activity.name }],
    },
    twitter: { card: "summary_large_image" as const, title: activity.name, description: activity.description, images: [image] },
    alternates: { canonical: `https://arabiandeserthome.ma/les-activites/${slug}` },
  };
}

export default async function ActiviteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = await db.activity.findUnique({ where: { slug } });
  if (!activity) notFound();

  const image = activity.images?.split(",")[0]?.trim() || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: activity.name,
    description: activity.description,
    image,
    brand: { "@type": "Brand", name: "Arabian Desert Home" },
    offers: {
      "@type": "Offer",
      url: `https://arabiandeserthome.ma/les-activites/${slug}`,
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
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://arabiandeserthome.ma" },
      { "@type": "ListItem", position: 2, name: "Activités", item: "https://arabiandeserthome.ma/les-activites" },
      { "@type": "ListItem", position: 3, name: activity.name, item: `https://arabiandeserthome.ma/les-activites/${slug}` },
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
