import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { parseISODay } from "@/lib/tent-stay";
import { buildDayPlan } from "@/lib/day-plan";

/** GET ?date=YYYY-MM-DD — what to prepare that day (defaults to tomorrow). */
export async function GET(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const day = parseISODay(req.nextUrl.searchParams.get("date")) ?? new Date(Date.now() + 86_400_000);
  return NextResponse.json(await buildDayPlan(db, day));
}
