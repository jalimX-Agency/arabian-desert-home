import type { Prisma, PrismaClient } from "@prisma/client";
import { calendarDay, dayKey, DAY_MS } from "@/lib/calendar-day";
import { windowForDate } from "@/lib/seasonal-price";
import { isDateBlocked } from "@/lib/availability";

/**
 * The admin's Booking-style calendar: one row per bookable item (tent type, activity, Day
 * Pass), one cell per day with that day's price, open/closed state and what is already
 * booked. Edits "paint" a date range: the range is cut out of every existing seasonal
 * window or closure of the item, then the new value is written over it, so overlapping
 * periods never pile up.
 */

export type CalendarItemType = "suite" | "activity" | "dayPass";

export interface CalendarTarget {
  type: CalendarItemType;
  id: string;
}

export interface CalendarCell {
  price: number;
  /** Name of the seasonal period that sets this price, when it is not the base price. */
  season: string | null;
  closed: boolean;
  closure: string | null;
  /** Tents taken that night (tents), or people booked that day (activities, Day Pass). */
  taken: number;
}

export interface CalendarRow {
  type: CalendarItemType;
  id: string;
  name: string;
  currency: string;
  basePrice: number;
  /** Tent count for tents; null for activities and Day Passes (no stock). */
  units: number | null;
  cells: CalendarCell[];
}

const FK = { suite: "suiteId", activity: "activityId", dayPass: "dayPassId" } as const;

type Db = PrismaClient | Prisma.TransactionClient;

export async function loadCalendar(db: PrismaClient, from: Date, days: number): Promise<{ days: string[]; rows: CalendarRow[] }> {
  const start = calendarDay(from).getTime();
  const dayList = Array.from({ length: days }, (_, i) => new Date(start + i * DAY_MS));
  const end = new Date(start + days * DAY_MS);

  const [suites, activities, passes, bookings] = await Promise.all([
    db.suite.findMany({ orderBy: { order: "asc" }, include: { seasonalPrices: true, closures: true } }),
    db.activity.findMany({ orderBy: { order: "asc" }, include: { seasonalPrices: true, closures: true } }),
    db.dayPass.findMany({ orderBy: { order: "asc" }, include: { seasonalPrices: true, closures: true } }),
    db.booking.findMany({
      where: {
        status: { not: "cancelled" },
        OR: [
          // A day early on both sides: stored dates may sit a few hours off UTC midnight.
          { serviceType: "suite", checkIn: { lt: new Date(end.getTime() + DAY_MS) }, checkOut: { gt: new Date(start - DAY_MS) } },
          { serviceType: { in: ["activity", "daypass"] }, date: { gte: new Date(start - DAY_MS), lt: new Date(end.getTime() + DAY_MS) } },
        ],
      },
      select: { serviceType: true, suiteId: true, activityId: true, dayPassId: true, checkIn: true, checkOut: true, date: true, quantity: true, guests: true, children: true },
    }),
  ]);

  const row = (
    type: CalendarItemType,
    item: { id: string; name: string; currency: string; price: number; seasonalPrices: { startDate: Date; endDate: Date; price: number; label: string }[]; closures: { startDate: Date; endDate: Date; label: string }[] },
    units: number | null,
    takenOn: (day: number) => number,
  ): CalendarRow => ({
    type,
    id: item.id,
    name: item.name,
    currency: item.currency,
    basePrice: item.price,
    units,
    cells: dayList.map((d) => {
      const season = windowForDate(item.seasonalPrices, d);
      const closure = item.closures.find((c) => isDateBlocked(d, [c]));
      return {
        price: season?.price ?? item.price,
        season: season?.label ?? null,
        closed: Boolean(closure),
        closure: closure?.label ?? null,
        taken: takenOn(d.getTime()),
      };
    }),
  });

  const nightTaken = (suiteId: string) => (night: number) =>
    bookings
      .filter((b) => b.serviceType === "suite" && b.suiteId === suiteId && b.checkIn && b.checkOut)
      .filter((b) => calendarDay(b.checkIn!).getTime() <= night && night < calendarDay(b.checkOut!).getTime())
      .reduce((n, b) => n + b.quantity, 0);
  const peopleOn = (match: (b: (typeof bookings)[number]) => boolean) => (day: number) =>
    bookings
      .filter((b) => match(b) && b.date && calendarDay(b.date).getTime() === day)
      .reduce((n, b) => n + b.guests + b.children, 0);

  return {
    days: dayList.map((d) => dayKey(d)),
    rows: [
      ...suites.map((s) => row("suite", s, s.units, nightTaken(s.id))),
      ...activities.map((a) => row("activity", a, null, peopleOn((b) => b.activityId === a.id))),
      ...passes.map((p) => row("dayPass", p, null, peopleOn((b) => b.dayPassId === p.id))),
    ],
  };
}

interface Period {
  id: string;
  startDate: Date;
  endDate: Date;
}

/** Removes [start, end] from every period of the list: periods inside it are deleted, the
 *  ones crossing an edge are shortened, and one spanning it is split in two. */
async function cutOut<P extends Period>(
  periods: P[],
  start: number,
  end: number,
  remove: (id: string) => Promise<unknown>,
  recreate: (from: P, startDate: Date, endDate: Date) => Promise<unknown>,
) {
  for (const p of periods) {
    const ps = calendarDay(p.startDate).getTime();
    const pe = calendarDay(p.endDate).getTime();
    if (pe < start || ps > end) continue;
    await remove(p.id);
    if (ps < start) await recreate(p, new Date(ps), new Date(start - DAY_MS));
    if (pe > end) await recreate(p, new Date(end + DAY_MS), new Date(pe));
  }
}

export type CalendarAction =
  | { action: "price"; price: number; label: string }
  | { action: "reset" }
  | { action: "close"; label: string }
  | { action: "open" };

/** Applies one edit to one item over the calendar days [from, to] (both included). */
export async function paintRange(tx: Db, target: CalendarTarget, from: Date, to: Date, edit: CalendarAction) {
  const start = calendarDay(from).getTime();
  const end = calendarDay(to).getTime();
  const fk = FK[target.type];

  if (edit.action === "price" || edit.action === "reset") {
    const windows = await tx.seasonalPrice.findMany({ where: { [fk]: target.id } });
    await cutOut(
      windows,
      start,
      end,
      (id) => tx.seasonalPrice.delete({ where: { id } }),
      (w, startDate, endDate) => tx.seasonalPrice.create({ data: { label: w.label, price: w.price, startDate, endDate, [fk]: target.id } }),
    );
    if (edit.action === "price") {
      await tx.seasonalPrice.create({
        data: { label: edit.label, price: edit.price, startDate: new Date(start), endDate: new Date(end), [fk]: target.id },
      });
    }
    return;
  }

  const closures = await tx.tentClosure.findMany({ where: { [fk]: target.id } });
  await cutOut(
    closures,
    start,
    end,
    (id) => tx.tentClosure.delete({ where: { id } }),
    (c, startDate, endDate) => tx.tentClosure.create({ data: { label: c.label, startDate, endDate, [fk]: target.id } }),
  );
  if (edit.action === "close") {
    await tx.tentClosure.create({ data: { label: edit.label, startDate: new Date(start), endDate: new Date(end), [fk]: target.id } });
  }
}
