import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");
  const featured = searchParams.get("featured");

  // If slug is provided, return a single suite
  if (slug) {
    const suite = await db.suite.findUnique({ where: { slug } });
    return Response.json(suite);
  }

  const where = featured === "true" ? { featured: true } : {};

  const data = await db.suite.findMany({
    where,
    orderBy: { order: "asc" },
  });
  return Response.json(data);
}
