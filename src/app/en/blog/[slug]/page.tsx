import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { BlogDetailContent } from "@/app/blog/[slug]/BlogDetailContent";
import { enAlternates } from "@/lib/seo/hreflang";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await db.blogPost.findMany({ select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug },
    select: { title: true, titleEn: true, excerpt: true, excerptEn: true, image: true },
  });
  if (!post) return {};
  const title = post.titleEn || post.title;
  const excerpt = post.excerptEn || post.excerpt;
  const image = post.image || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  return {
    title: `${title} | Arabian Desert Home Blog`,
    description: excerpt || title,
    openGraph: {
      title,
      description: excerpt || title,
      url: `https://www.arabiandeserthome.ma/en/blog/${slug}`,
      images: [{ url: image, width: 1200, height: 800, alt: title }],
    },
    twitter: { card: "summary_large_image" as const, title, description: excerpt || "", images: [image] },
    alternates: enAlternates(`/blog/${slug}`),
  };
}

export default async function EnglishBlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });
  if (!post) notFound();

  // Related articles: same category first, then most recent others
  const relatedSelect = { id: true, title: true, titleEn: true, slug: true, image: true, category: true } as const;
  const sameCategory = await db.blogPost.findMany({
    where: { category: post.category, id: { not: post.id } },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: relatedSelect,
  });
  const fill = sameCategory.length < 3
    ? await db.blogPost.findMany({
        where: { id: { notIn: [post.id, ...sameCategory.map((p) => p.id)] } },
        orderBy: { createdAt: "desc" },
        take: 3 - sameCategory.length,
        select: relatedSelect,
      })
    : [];
  const relatedPosts = [...sameCategory, ...fill];

  const title = post.titleEn || post.title;
  const excerpt = post.excerptEn || post.excerpt;

  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    image: post.image || undefined,
    author: { "@type": "Person", name: post.author || "Arabian Desert Home" },
    publisher: { "@type": "Organization", name: "Arabian Desert Home", url: "https://www.arabiandeserthome.ma" },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    url: `https://www.arabiandeserthome.ma/en/blog/${slug}`,
  });

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.arabiandeserthome.ma/en" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.arabiandeserthome.ma/en/blog" },
      { "@type": "ListItem", position: 3, name: title, item: `https://www.arabiandeserthome.ma/en/blog/${slug}` },
    ],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      <Navigation />
      <main className="flex-1 pt-20">
        <BlogDetailContent post={post} relatedPosts={relatedPosts} />
      </main>
      <Footer />
    </div>
  );
}
