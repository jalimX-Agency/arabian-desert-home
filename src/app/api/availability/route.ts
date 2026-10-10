import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { suitesAvailability } from "@/lib/availability";
import { nightlyTotal } from "@/lib/seasonal-price";

export const dynamic = "force-dynamic";

const MAX_NIGHTS = 60;

/**
 * What a stay looks like for every tent type:
 *   GET /api/availability?checkIn=2026-11-10&checkOut=2026-11-12
 *   → [{ suiteId, units, left, closed, nights, total, currency }]
 * `total` is the price of ONE tent for the whole stay (seasonal rates included);
 * the page multiplies it by the number of tents chosen. Public: counts and prices
 * only, never guest data. Prices only come back once dates are given, so the tents
 * page can keep them hidden until the visitor picks a stay.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const checkIn = new Date(params.get("checkIn") ?? "");
  const checkOut = new Date(params.get("checkOut") ?? "");

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    return Response.json({ error: "checkIn and checkOut are required (YYYY-MM-DD)" }, { status: 400 });
  }
  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000);
  if (nights < 1 || nights > MAX_NIGHTS) {
    return Response.json({ error: `The stay must be between 1 and ${MAX_NIGHTS} nights` }, { status: 400 });
  }

  const [availability, suites] = await Promise.all([
    suitesAvailability(db as never, checkIn, checkOut),
    db.suite.findMany({ select: { id: true, price: true, currency: true, seasonalPrices: true } }),
  ]);
  const byId = new Map(suites.map((s) => [s.id, s]));

  const result = availability.map((a) => {
    const suite = byId.get(a.suiteId);
    return {
      ...a,
      nights,
      total: suite ? nightlyTotal(suite.price, suite.seasonalPrices, checkIn, checkOut) : 0,
      currency: suite?.currency ?? "EUR",
    };
  });
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
