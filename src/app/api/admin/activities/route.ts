import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const activities = await db.activity.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(activities);
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const data = await req.json();
  const activity = await db.activity.create({ data });
  return NextResponse.json(activity, { status: 201 });
}
