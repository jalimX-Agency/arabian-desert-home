import { db } from "@/lib/db";
import { calendarDay } from "@/lib/calendar-day";
import { priceForDate } from "@/lib/seasonal-price";
import { suitesAvailability } from "@/lib/availability";
import {
  REVEILLON_CHECKOUT, REVEILLON_DATE, SOIREE_CHILD_PERCENT, SOIREE_LABEL, SOIREE_PRICE_EUR, SOIREE_SEATS,
  isReveillonOpen, type ReveillonOffer,
} from "@/lib/reveillon";

/** Seats already taken for the soirée alone (adults + children of every live soirée line). */
export async function soireeSeatsTaken(): Promise<number> {
  const rows = await db.booking.aggregate({
    where: { label: SOIREE_LABEL, date: calendarDay(REVEILLON_DATE), status: { not: "cancelled" } },
    _sum: { guests: true, children: true },
  });
  return (rows._sum.guests ?? 0) + (rows._sum.children ?? 0);
}

/** What can still be booked for the night of 31 Dec: soirée seats, tents left with their price, transport. */
export async function getReveillonOffer(): Promise<ReveillonOffer> {
  const night = calendarDay(REVEILLON_DATE);
  const [suites, taken, transport] = await Promise.all([
    db.suite.findMany({ orderBy: { order: "asc" }, include: { seasonalPrices: true } }),
    soireeSeatsTaken(),
    db.transportOption.findFirst({ where: { active: true }, orderBy: { order: "asc" } }),
  ]);
  const avail = await suitesAvailability(db as never, night, calendarDay(REVEILLON_CHECKOUT), { suiteIds: suites.map((s) => s.id) });
  const left = new Map(avail.map((a) => [a.suiteId, a.left]));

  return {
    soiree: { priceEur: SOIREE_PRICE_EUR, childPercent: SOIREE_CHILD_PERCENT, seats: SOIREE_SEATS, seatsLeft: Math.max(0, SOIREE_SEATS - taken) },
    tents: suites.map((s) => ({
      suiteId: s.id,
      slug: s.slug,
      name: s.name,
      nameEn: s.nameEn,
      nameEs: s.nameEs,
      nameIt: s.nameIt,
      image: s.image,
      maxGuests: s.maxGuests,
      priceEur: priceForDate(s.price, s.seasonalPrices, night),
      left: Math.max(0, left.get(s.id) ?? 0),
    })),
    transport: transport && transport.currency === "EUR" ? { id: transport.id, name: transport.name, priceEur: transport.price } : null,
    open: isReveillonOpen(),
  };
}
