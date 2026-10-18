import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { transportData } from "./fields";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const options = await db.transportOption.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(options);
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const data = transportData(await req.json());
  if (!data.name) return NextResponse.json({ error: "Le nom est obligatoire" }, { status: 400 });
  const option = await db.transportOption.create({
    data: { ...data, name: data.name as string, price: (data.price as number | undefined) ?? 0 },
  });
  return NextResponse.json(option, { status: 201 });
}
