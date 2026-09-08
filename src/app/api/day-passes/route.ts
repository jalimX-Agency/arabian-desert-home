import { db } from "@/lib/db";
export async function GET() {
  const data = await db.dayPass.findMany({ orderBy: { order: "asc" }, include: { seasonalPrices: true } });
  return Response.json(data);
}
