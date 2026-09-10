import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const body = await req.json();
  const { label, startDate, endDate } = body;

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    return NextResponse.json({ error: "endDate must be on or after startDate" }, { status: 400 });
  }

  const closure = await db.tentClosure.update({
    where: { id },
    data: {
      ...(label !== undefined && { label }),
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(endDate !== undefined && { endDate: new Date(endDate) }),
    },
  });
  return NextResponse.json(closure);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  await db.tentClosure.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
