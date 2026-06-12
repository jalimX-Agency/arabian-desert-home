import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { BlogDetailContent } from "./BlogDetailContent";

export async function generateStaticParams() {
  const posts = await db.blogPost.findMany({ select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug }, select: { title: true, excerpt: true, image: true } });
  if (!post) return {};
  const image = post.image || "https://pub-1d9eafere01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";
  return {
    title: `${post.title} | Arabian Desert Home Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      url: `https://www.arabiandeserthome.ma/blog/${slug}`,
      images: [{ url: image, width: 1200, height: 800, alt: post.title }],
    },
    twitter: { card: "summary_large_image" as const, title: post.title, description: post.excerpt || "", images: [image] },
    alternates: { canonical: `https://www.arabiandeserthome.ma/blog/${slug}` },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });
  if (!post) notFound();

  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image || undefined,
    author: { "@type": "Person", name: post.author || "Arabian Desert Home" },
    publisher: { "@type": "Organization", name: "Arabian Desert Home", url: "https://www.arabiandeserthome.ma" },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    url: `https://www.arabiandeserthome.ma/blog/${slug}`,
  });

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.arabiandeserthome.ma" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.arabiandeserthome.ma/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://www.arabiandeserthome.ma/blog/${slug}` },
    ],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      <Navigation />
      <main className="flex-1 pt-20">
        <BlogDetailContent post={post} />
      </main>
      <Footer />
    </div>
  );
}
