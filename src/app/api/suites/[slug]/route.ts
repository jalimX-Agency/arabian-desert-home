import { db } from "@/lib/db";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (slug) {
    const suite = await db.suite.findUnique({ where: { slug } });
    return Response.json(suite);
  }
  const data = await db.suite.findMany({ orderBy: { order: "asc" } });
  return Response.json(data);
}
