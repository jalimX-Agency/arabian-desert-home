import { db } from "@/lib/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.arabiandeserthome.ma";

  const [suites, activities, dayPasses, blogPosts] = await Promise.all([
    db.suite.findMany({ select: { slug: true, updatedAt: true } }),
    db.activity.findMany({ select: { slug: true, updatedAt: true } }),
    db.dayPass.findMany({ select: { slug: true, updatedAt: true } }),
    db.blogPost.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes = [
    { path: "/", priority: 1.0 },
    { path: "/desert-agafay", priority: 0.95 },
    { path: "/les-tentes", priority: 0.9 },
    { path: "/reservez-votre-sejour", priority: 0.9 },
    { path: "/les-activites", priority: 0.8 },
    { path: "/day-pass", priority: 0.8 },
    { path: "/les-evenements", priority: 0.7 },
    { path: "/restaurant", priority: 0.7 },
    { path: "/blog", priority: 0.8 },
    { path: "/apropo", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
  ].map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));

  return [
    ...staticRoutes,
    ...suites.map((s) => ({
      url: `${base}/les-tentes/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...activities.map((a) => ({
      url: `${base}/les-activites/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...dayPasses.map((d) => ({
      url: `${base}/day-pass/${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...blogPosts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];
}
