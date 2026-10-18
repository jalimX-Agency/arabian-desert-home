import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { transportData } from "../fields";

// Editing an option never touches reservations already made: their transport line keeps
// the amount and label saved when it was booked.
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const data = transportData(await req.json());
  if (data.name === "") return NextResponse.json({ error: "Le nom est obligatoire" }, { status: 400 });
  const option = await db.transportOption.update({ where: { id }, data });
  return NextResponse.json(option);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  // Booked lines keep their label and amount; only the link to the option is dropped.
  await db.transportOption.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
