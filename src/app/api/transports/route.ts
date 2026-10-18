import { db } from "@/lib/db";

export async function GET() {
  const data = await db.transportOption.findMany({ where: { active: true }, orderBy: { order: "asc" } });
  return Response.json(data);
}
