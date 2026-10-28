import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isLeadKind, isLeadSource } from "@/lib/lead-source";

export const dynamic = "force-dynamic";

const MAX_PER_MINUTE = 120;

/**
 * Anonymous count of a lead action (WhatsApp tap, phone tap). Stores the kind, the
 * source, the page path and the language: no cookie, no IP, no user agent, nothing that
 * identifies a visitor. Public by design; bounded input and a global rate cap keep it
 * from being used to flood the table.
 */
export async function POST(request: NextRequest) {
  let body: { kind?: unknown; source?: unknown; page?: unknown; lang?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!isLeadKind(body.kind) || !isLeadSource(body.source)) return new Response(null, { status: 400 });
  // Only the form is recorded server-side, when the request is created.
  if (body.kind === "form") return new Response(null, { status: 400 });

  const page = typeof body.page === "string" ? body.page.split("?")[0].slice(0, 120) : "";
  const lang = typeof body.lang === "string" && ["fr", "en", "es", "it"].includes(body.lang) ? body.lang : "fr";

  const recent = await db.leadEvent.count({ where: { createdAt: { gte: new Date(Date.now() - 60_000) } } });
  if (recent >= MAX_PER_MINUTE) return new Response(null, { status: 429 });

  await db.leadEvent.create({ data: { kind: body.kind, source: body.source, page, lang } });
  return new Response(null, { status: 204 });
}
