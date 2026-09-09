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

const TARGET_FK = { suite: "suiteId", activity: "activityId", dayPass: "dayPassId" } as const;

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json();
  const { label, startDate, endDate, price, targetType, targetIds, suiteId, activityId, dayPassId } = body;

  if (!label || !startDate || !endDate || !price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (new Date(endDate) < new Date(startDate)) {
    return NextResponse.json({ error: "endDate must be on or after startDate" }, { status: 400 });
  }

  // Preferred shape: one period applied to several items of the same type at once.
  if (targetType) {
    if (!(targetType in TARGET_FK)) {
      return NextResponse.json({ error: "Invalid targetType" }, { status: 400 });
    }
    if (!Array.isArray(targetIds) || targetIds.length === 0) {
      return NextResponse.json({ error: "targetIds must be a non-empty array" }, { status: 400 });
    }
    const fkField = TARGET_FK[targetType as keyof typeof TARGET_FK];
    const { count } = await db.seasonalPrice.createMany({
      data: targetIds.map((id: string) => ({
        label,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        price: Number(price),
        [fkField]: id,
      })),
    });
    return NextResponse.json({ count }, { status: 201 });
  }

  // Legacy shape: a single suiteId/activityId/dayPassId.
  const targetCount = [suiteId, activityId, dayPassId].filter(Boolean).length;
  if (targetCount !== 1) {
    return NextResponse.json({ error: "Exactly one of suiteId, activityId, dayPassId is required" }, { status: 400 });
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
