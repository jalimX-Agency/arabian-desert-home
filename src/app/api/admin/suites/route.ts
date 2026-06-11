import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const suites = await db.suite.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(suites);
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const data = await req.json();
  const suite = await db.suite.create({ data });
  return NextResponse.json(suite, { status: 201 });
}
