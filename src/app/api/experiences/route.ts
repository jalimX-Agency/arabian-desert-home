import { db } from "@/lib/db";

export async function GET() {
  try {
    const experiences = await db.experience.findMany({
      orderBy: { order: "asc" },
    });
    return Response.json(experiences);
  } catch {
    return Response.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}
