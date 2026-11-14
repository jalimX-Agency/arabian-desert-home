import { NextRequest } from "next/server";
import { db } from "@/lib/db";

/** Public list for the booking form. The admin passes ?all=1 to also get hidden activities. */
export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all") === "1";
  const data = await db.activity.findMany({
    where: all ? undefined : { published: true },
    orderBy: { order: "asc" },
    include: { seasonalPrices: true, closures: { select: { startDate: true, endDate: true } } },
  });
  return Response.json(data);
}
