import { db } from "@/lib/db";

export async function GET() {
  try {
    const suites = await db.suite.findMany({
      orderBy: { order: "asc" },
    });
    return Response.json(suites);
  } catch {
    return Response.json({ error: "Failed to fetch suites" }, { status: 500 });
  }
}
