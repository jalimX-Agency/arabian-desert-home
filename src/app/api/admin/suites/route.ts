import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { notifyIndexNow, localizedUrls } from "@/lib/indexnow";
import { revalidateLocalized } from "@/lib/revalidate";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const suites = await db.suite.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(suites);
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const data = await req.json();
  // The form sends 0 for number fields left untouched: a new tent type needs at least one
  // tent in stock and the default cancellation window, or it would show up as sold out.
  if (!(Number(data.units) >= 1)) data.units = 2;
  data.units = Math.floor(Number(data.units));
  if (!(Number(data.freeCancellationDays) >= 1)) data.freeCancellationDays = 3;
  data.freeCancellationDays = Math.min(60, Math.floor(Number(data.freeCancellationDays)));
  const suite = await db.suite.create({ data });
  notifyIndexNow(localizedUrls(`/les-tentes/${suite.slug}`));
  revalidateLocalized("/les-tentes");
  revalidateLocalized(`/les-tentes/${suite.slug}`);
  revalidateLocalized("/");
  return NextResponse.json(suite, { status: 201 });
}
