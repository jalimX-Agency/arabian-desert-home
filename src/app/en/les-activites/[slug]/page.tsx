import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ActiviteDetailContent } from "@/app/les-activites/[slug]/ActiviteDetailContent";
import { enAlternates } from "@/lib/seo/hreflang";

export async function generateStaticParams() {
  const activities = await db.activity.findMany({ select: { slug: true } });
  return activities.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = await db.activity.findUnique({
    where: { slug },
    select: { name: true, nameEn: true, description: true, descriptionEn: true, images: true, price: true },
  });
  if (!activity) return {};
  const name = activity.nameEn || activity.name;
  const description = activity.descriptionEn || activity.description;
  const image = activity.images?.split(",")[0]?.trim() || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  return {
    title: `${name} — Agafay Desert Activity | Arabian Desert Home`,
    description,
    keywords: [name, "agafay activities", "desert activity marrakech", "agafay activities morocco"],
    openGraph: {
      title: `${name} | Arabian Desert Home — Agafay Desert`,
      description,
      url: `https://www.arabiandeserthome.ma/en/les-activites/${slug}`,
      images: [{ url: image, width: 1200, height: 800, alt: name }],
    },
    twitter: { card: "summary_large_image" as const, title: name, description, images: [image] },
    alternates: enAlternates(`/les-activites/${slug}`),
  };
}

export default async function EnglishActiviteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = await db.activity.findUnique({ where: { slug } });
  if (!activity) notFound();

  const name = activity.nameEn || activity.name;
  const description = activity.descriptionEn || activity.description;
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
      url: `https://www.arabiandeserthome.ma/en/les-activites/${slug}`,
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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.arabiandeserthome.ma/en" },
      { "@type": "ListItem", position: 2, name: "Activities", item: "https://www.arabiandeserthome.ma/en/les-activites" },
      { "@type": "ListItem", position: 3, name, item: `https://www.arabiandeserthome.ma/en/les-activites/${slug}` },
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
