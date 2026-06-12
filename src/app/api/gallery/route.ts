import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (featured === "true") where.featured = true;

  const images = await db.galleryImage.findMany({
    where,
    orderBy: { order: "asc" },
  });
  return Response.json(images);
}
