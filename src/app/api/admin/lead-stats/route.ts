import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

/** GET ?days=30 — lead actions by source and kind, plus booking requests by source. */
export async function GET(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const days = Math.min(365, Math.max(1, Number(req.nextUrl.searchParams.get("days")) || 30));
  const since = new Date(Date.now() - days * 86_400_000);

  const [events, reservations] = await Promise.all([
    db.leadEvent.groupBy({ by: ["source", "kind"], where: { createdAt: { gte: since } }, _count: { _all: true } }),
    db.reservation.groupBy({ by: ["source"], where: { createdAt: { gte: since }, channel: "website" }, _count: { _all: true } }),
  ]);

  const counts: Record<string, Record<string, number>> = {};
  for (const e of events) (counts[e.source] ??= {})[e.kind] = e._count._all;
  const requests: Record<string, number> = {};
  for (const r of reservations) requests[r.source ?? "unknown"] = r._count._all;

  return NextResponse.json({ days, counts, requests });
}
