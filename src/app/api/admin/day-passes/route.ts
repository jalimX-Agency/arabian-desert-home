import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const passes = await db.dayPass.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(passes);
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const data = await req.json();
  const pass = await db.dayPass.create({ data });
  return NextResponse.json(pass, { status: 201 });
}
