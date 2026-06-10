import { db } from "@/lib/db";
export async function GET() {
  const data = await db.spaTreatment.findMany({ orderBy: { order: "asc" } });
  return Response.json(data);
}
