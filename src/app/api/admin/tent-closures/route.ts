import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const closures = await db.tentClosure.findMany({
    orderBy: { startDate: "asc" },
    include: { suite: { select: { name: true } } },
  });
  return NextResponse.json(closures);
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json();
  const { label, startDate, endDate, suiteIds } = body as {
    label?: string; startDate?: string; endDate?: string; suiteIds?: string[];
  };

  if (!label || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (new Date(endDate) < new Date(startDate)) {
    return NextResponse.json({ error: "endDate must be on or after startDate" }, { status: 400 });
  }
  if (!Array.isArray(suiteIds) || suiteIds.length === 0) {
    return NextResponse.json({ error: "At least one tent is required" }, { status: 400 });
  }

  const { count } = await db.tentClosure.createMany({
    data: suiteIds.map((suiteId) => ({
      label,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      suiteId,
    })),
  });
  return NextResponse.json({ count }, { status: 201 });
}
