import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const testimonials = await db.testimonial.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const data = await req.json();
  const testimonial = await db.testimonial.create({ data });
  return NextResponse.json(testimonial, { status: 201 });
}
