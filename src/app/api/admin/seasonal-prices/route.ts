import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const prices = await db.seasonalPrice.findMany({
    orderBy: { startDate: "asc" },
    include: {
      suite: { select: { name: true } },
      activity: { select: { name: true } },
      dayPass: { select: { name: true } },
    },
  });
  return NextResponse.json(prices);
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json();
  const { label, startDate, endDate, price, suiteId, activityId, dayPassId } = body;

  if (!label || !startDate || !endDate || !price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const targetCount = [suiteId, activityId, dayPassId].filter(Boolean).length;
  if (targetCount !== 1) {
    return NextResponse.json({ error: "Exactly one of suiteId, activityId, dayPassId is required" }, { status: 400 });
  }
  if (new Date(endDate) < new Date(startDate)) {
    return NextResponse.json({ error: "endDate must be on or after startDate" }, { status: 400 });
  }

  const seasonalPrice = await db.seasonalPrice.create({
    data: {
      label,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      price: Number(price),
      suiteId: suiteId || null,
      activityId: activityId || null,
      dayPassId: dayPassId || null,
    },
  });
  return NextResponse.json(seasonalPrice, { status: 201 });
}
