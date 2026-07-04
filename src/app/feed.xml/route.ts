import { db } from "@/lib/db";

const BASE = "https://www.arabiandeserthome.ma";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { title: true, slug: true, excerpt: true, createdAt: true, category: true },
  });

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${BASE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${BASE}/blog/${p.slug}</guid>
      <description>${escapeXml(p.excerpt)}</description>
      <category>${escapeXml(p.category)}</category>
      <pubDate>${p.createdAt.toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog Arabian Desert Home — Désert d'Agafay</title>
    <link>${BASE}/blog</link>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Articles et inspirations sur le désert d'Agafay, le glamping de luxe et les activités à 30 minutes de Marrakech.</description>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
