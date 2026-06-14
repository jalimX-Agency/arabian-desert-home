import { db } from "@/lib/db";
export async function GET() {
  const data = await db.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } });
  return Response.json(data);
}
