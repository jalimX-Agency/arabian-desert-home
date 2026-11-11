import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isLeadSource } from "@/lib/lead-source";
import { countryFromHeader, deviceFromUserAgent, hasAdminSessionCookie, isBotUserAgent } from "@/lib/visit";

export const dynamic = "force-dynamic";

const MAX_PER_MINUTE = 600;

/**
 * Anonymous count of a page view. Stores the source, the page path, the language, the
 * country (from the hosting edge), the device class and whether it opened the visit: no
 * cookie, no IP, no user agent kept. Public by design; bounded input, robots dropped and a
 * global rate cap keep the table from being flooded.
 */
export async function POST(request: NextRequest) {
  let body: { source?: unknown; page?: unknown; lang?: unknown; entry?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!isLeadSource(body.source) || typeof body.page !== "string") return new Response(null, { status: 400 });

  const ua = request.headers.get("user-agent");
  // Robots and the owner's own browsing are acknowledged but not counted.
  if (isBotUserAgent(ua) || hasAdminSessionCookie(request.headers.get("cookie"))) return new Response(null, { status: 204 });

  const page = body.page.split("?")[0].slice(0, 120);
  if (!page.startsWith("/") || /^\/(admin|mes-reservations|devis|api)(\/|$)/.test(page)) return new Response(null, { status: 204 });
  const lang = typeof body.lang === "string" && ["fr", "en", "es", "it"].includes(body.lang) ? body.lang : "fr";

  const recent = await db.siteVisit.count({ where: { createdAt: { gte: new Date(Date.now() - 60_000) } } });
  if (recent >= MAX_PER_MINUTE) return new Response(null, { status: 429 });

  await db.siteVisit.create({
    data: {
      source: body.source,
      page,
      lang,
      country: countryFromHeader(request.headers.get("x-vercel-ip-country")),
      device: deviceFromUserAgent(ua),
      entry: body.entry === true,
    },
  });
  return new Response(null, { status: 204 });
}
