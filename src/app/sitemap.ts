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

  // Static routes that currently exist in each non-French locale — extend as more phases ship.
  const LOCALE_READY_PATHS = [
    "/", "/desert-agafay", "/les-tentes", "/les-activites", "/day-pass", "/blog",
    "/reservez-votre-sejour", "/les-evenements", "/restaurant", "/apropo", "/contact",
  ];
  const NON_FR_LOCALES = ["en", "es", "it"];

  const localeStaticRoutes = NON_FR_LOCALES.flatMap((locale) =>
    staticRoutes
      .filter((r) => LOCALE_READY_PATHS.includes(r.url.replace(base, "") || "/"))
      .map((r) => ({
        ...r,
        url: r.url === `${base}/` ? `${base}/${locale}` : r.url.replace(base, `${base}/${locale}`),
        priority: r.priority * 0.9,
      }))
  );

  const dynamicEntries = [
    { items: suites, path: "les-tentes", priority: 0.85, localePriority: 0.75, freq: "monthly" as const },
    { items: activities, path: "les-activites", priority: 0.7, localePriority: 0.6, freq: "monthly" as const },
    { items: dayPasses, path: "day-pass", priority: 0.7, localePriority: 0.6, freq: "monthly" as const },
    { items: blogPosts, path: "blog", priority: 0.75, localePriority: 0.65, freq: "weekly" as const },
  ].flatMap(({ items, path, priority, localePriority, freq }) => [
    ...items.map((item) => ({
      url: `${base}/${path}/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: freq,
      priority,
    })),
    ...NON_FR_LOCALES.flatMap((locale) =>
      items.map((item) => ({
        url: `${base}/${locale}/${path}/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: freq,
        priority: localePriority,
      }))
    ),
  ]);

  return [...staticRoutes, ...localeStaticRoutes, ...dynamicEntries];
}
