import { db } from "@/lib/db";

export async function GET() {
  try {
    const experiences = await db.activity.findMany({
      where: {
        category: { in: ["Expérience", "Aventure"] },
      },
      orderBy: { order: "asc" },
    });
    return Response.json(experiences);
  } catch {
    return Response.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}
