import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { parseISODay } from "@/lib/tent-stay";
import { loadCalendar, paintRange, type CalendarAction, type CalendarTarget } from "@/lib/availability-calendar";

const TYPES = ["suite", "activity", "dayPass"];
const MAX_DAYS = 120;

function day(value: unknown): Date | null {
  return typeof value === "string" ? parseISODay(value) ?? null : null;
}

/** GET ?from=YYYY-MM-DD&days=N — prices, closures and bookings per item and day. */
export async function GET(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const from = day(req.nextUrl.searchParams.get("from")) ?? new Date();
  const days = Math.min(MAX_DAYS, Math.max(1, Number(req.nextUrl.searchParams.get("days")) || 31));
  return NextResponse.json(await loadCalendar(db, from, days));
}

/** POST { targets, from, to, action, price?, label? } — one edit over a date range for
 *  several items at once, all or nothing. */
export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json();
  const from = day(body.from);
  const to = day(body.to);
  const targets = body.targets as CalendarTarget[] | undefined;

  if (!from || !to || to < from) return NextResponse.json({ error: "Dates invalides" }, { status: 400 });
  if ((to.getTime() - from.getTime()) / 86_400_000 > 730) return NextResponse.json({ error: "Période trop longue (2 ans maximum)" }, { status: 400 });
  if (!Array.isArray(targets) || targets.length === 0 || targets.some((t) => !TYPES.includes(t?.type) || typeof t.id !== "string")) {
    return NextResponse.json({ error: "Choisissez au moins un élément" }, { status: 400 });
  }

  const label = typeof body.label === "string" && body.label.trim() ? body.label.trim().slice(0, 80) : "";
  let edit: CalendarAction;
  switch (body.action) {
    case "price": {
      const price = Math.round(Number(body.price));
      if (!Number.isFinite(price) || price <= 0) return NextResponse.json({ error: "Prix invalide" }, { status: 400 });
      edit = { action: "price", price, label: label || "Tarif du calendrier" };
      break;
    }
    case "capacity": {
      const units = Math.floor(Number(body.units));
      if (!Number.isFinite(units) || units < 0 || units > 50) return NextResponse.json({ error: "Nombre de tentes invalide (0 à 50)" }, { status: 400 });
      if (targets.some((t) => t.type !== "suite")) return NextResponse.json({ error: "La capacité ne s'applique qu'aux tentes" }, { status: 400 });
      edit = { action: "capacity", units };
      break;
    }
    case "capacityReset":
      if (targets.some((t) => t.type !== "suite")) return NextResponse.json({ error: "La capacité ne s'applique qu'aux tentes" }, { status: 400 });
      edit = { action: "capacityReset" };
      break;
    case "reset":
      edit = { action: "reset" };
      break;
    case "close":
      edit = { action: "close", label: label || "Fermé" };
      break;
    case "open":
      edit = { action: "open" };
      break;
    default:
      return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  }

  await db.$transaction(async (tx) => {
    for (const target of targets) await paintRange(tx, target, from, to, edit);
  }, { timeout: 30_000 });

  return NextResponse.json({ success: true });
}
