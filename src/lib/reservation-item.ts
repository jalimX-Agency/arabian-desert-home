import { peopleTotal } from "@/lib/devis-pricing";
import { transportTotal, transportUnits } from "@/lib/transport";
import { calendarDay } from "@/lib/calendar-day";
import { db } from "@/lib/db";
import { priceForDate, nightlyTotal } from "@/lib/seasonal-price";
import { isDateBlocked, rangeOverlapsClosure, suitesAvailability } from "@/lib/availability";

export interface CartItemInput {
  serviceType: "suite" | "activity" | "daypass" | "transport";
  suiteId?: string;
  activityId?: string;
  dayPassId?: string;
  transportId?: string;
  /** Transport only: where the guest wants to be picked up (hotel, riad, airport + flight…). */
  pickup?: string;
  checkIn?: string;
  checkOut?: string;
  date?: string;
  quantity?: number; // suites only — how many of this tent type
  guests?: number;
  children?: number;
  experiences?: string;
  /** Admin-only escape hatch for manually recording a stay during a closed period
   *  (it also lets the admin go past the tent count). */
  allowClosedPeriod?: boolean;
  /** A guest moving one of their own stays: that booking must not count against itself. */
  excludeBookingId?: string;
  /** Admin-only: record this item in a currency other than the catalog item's own
   *  (e.g. an OTA/phone booking quoted in EUR). The public site never sets this. */
  currencyOverride?: string;
}

export interface PricedItem {
  serviceType: string;
  suiteId: string | null;
  activityId: string | null;
  dayPassId: string | null;
  checkIn: Date | null;
  checkOut: Date | null;
  date: Date | null;
  quantity: number;
  guests: number;
  children: number;
  experiences: string | null;
  totalAmount: number;
  currency: string;
  /** Transport lines are saved as free lines ("custom") carrying their own label. */
  label?: string | null;
  transportId?: string | null;
}

/** Validates and prices one cart item against the DB (seasonal-aware). Throws with a user-facing message on bad input. */
export async function priceCartItem(item: CartItemInput): Promise<PricedItem> {
  const guests = item.guests ?? 2;
  const children = item.children ?? 0;

  if (item.serviceType === "suite") {
    if (!item.suiteId || !item.checkIn || !item.checkOut) {
      throw new Error("Suite booking requires suiteId, checkIn, checkOut");
    }
    const quantity = Math.max(1, item.quantity ?? 1);
    const suite = await db.suite.findUnique({ where: { id: item.suiteId }, include: { seasonalPrices: true, closures: true } });
    if (!suite) throw new Error("Suite not found");
    // Stored as the calendar day (UTC midnight), whatever time zone the visitor picked it in.
    const checkIn = calendarDay(item.checkIn);
    const checkOut = calendarDay(item.checkOut);
    if (!item.allowClosedPeriod && rangeOverlapsClosure(checkIn, checkOut, suite.closures)) {
      throw new Error(`${suite.name} n'est pas disponible sur ces dates`);
    }
    if (!item.allowClosedPeriod) {
      const [avail] = await suitesAvailability(db as never, checkIn, checkOut, {
        suiteIds: [suite.id],
        excludeBookingId: item.excludeBookingId,
      });
      if (avail && quantity > avail.left) {
        throw new Error(
          avail.left <= 0
            ? `${suite.name} est complète sur ces dates`
            : `${suite.name} : il ne reste que ${avail.left} tente${avail.left > 1 ? "s" : ""} sur ces dates`,
        );
      }
    }
    return {
      serviceType: "suite",
      suiteId: suite.id,
      activityId: null,
      dayPassId: null,
      checkIn,
      checkOut,
      date: null,
      quantity,
      guests,
      children,
      experiences: item.experiences || null,
      totalAmount: nightlyTotal(suite.price, suite.seasonalPrices, checkIn, checkOut) * quantity,
      currency: item.currencyOverride ?? suite.currency,
    };
  }

  if (item.serviceType === "activity") {
    if (!item.activityId || !item.date) {
      throw new Error("Activity booking requires activityId and date");
    }
    const activity = await db.activity.findUnique({ where: { id: item.activityId }, include: { seasonalPrices: true, closures: true } });
    if (!activity) throw new Error("Activity not found");
    const date = calendarDay(item.date);
    if (!item.allowClosedPeriod && isDateBlocked(date, activity.closures)) {
      throw new Error(`${activity.name} n'est pas disponible à cette date`);
    }
    const unitPrice = priceForDate(activity.price, activity.seasonalPrices, date);
    return {
      serviceType: "activity",
      suiteId: null,
      activityId: activity.id,
      dayPassId: null,
      checkIn: null,
      checkOut: null,
      date,
      quantity: 1,
      guests,
      children,
      experiences: item.experiences || null,
      totalAmount: peopleTotal(unitPrice, guests, children, activity.childPricePercent),
      currency: item.currencyOverride ?? activity.currency,
    };
  }

  if (item.serviceType === "daypass") {
    if (!item.dayPassId || !item.date) {
      throw new Error("Day pass booking requires dayPassId and date");
    }
    const pass = await db.dayPass.findUnique({ where: { id: item.dayPassId }, include: { seasonalPrices: true, closures: true } });
    if (!pass) throw new Error("Day pass not found");
    const date = calendarDay(item.date);
    if (!item.allowClosedPeriod && isDateBlocked(date, pass.closures)) {
      throw new Error(`${pass.name} n'est pas disponible à cette date`);
    }
    const unitPrice = priceForDate(pass.price, pass.seasonalPrices, date);
    return {
      serviceType: "daypass",
      suiteId: null,
      activityId: null,
      dayPassId: pass.id,
      checkIn: null,
      checkOut: null,
      date,
      quantity: 1,
      guests,
      children,
      experiences: item.experiences || null,
      totalAmount: peopleTotal(unitPrice, guests, children, pass.childPricePercent),
      currency: item.currencyOverride ?? pass.currency,
    };
  }

  if (item.serviceType === "transport") {
    if (!item.transportId || !item.date) {
      throw new Error("Transport booking requires transportId and date");
    }
    const opt = await db.transportOption.findUnique({ where: { id: item.transportId } });
    if (!opt || !opt.active) throw new Error("Transport not available");
    const passengers = guests + children;
    const pickup = item.pickup?.trim().slice(0, 200);
    // A free line whose amount is frozen now: later price changes in the admin only
    // apply to new bookings.
    return {
      serviceType: "custom",
      suiteId: null,
      activityId: null,
      dayPassId: null,
      checkIn: null,
      checkOut: null,
      date: calendarDay(item.date),
      quantity: transportUnits(opt, passengers),
      guests,
      children,
      experiences: null,
      totalAmount: transportTotal(opt, passengers),
      currency: item.currencyOverride ?? opt.currency,
      label: pickup ? `${opt.name} — Prise en charge : ${pickup}` : opt.name,
      transportId: opt.id,
    };
  }

  throw new Error("Invalid serviceType");
}
