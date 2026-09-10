import { db } from "@/lib/db";
import { priceForDate, nightlyTotal } from "@/lib/seasonal-price";
import { rangeOverlapsClosure } from "@/lib/availability";

export interface CartItemInput {
  serviceType: "suite" | "activity" | "daypass";
  suiteId?: string;
  activityId?: string;
  dayPassId?: string;
  checkIn?: string;
  checkOut?: string;
  date?: string;
  quantity?: number; // suites only — how many of this tent type
  guests?: number;
  children?: number;
  experiences?: string;
  /** Admin-only escape hatch for manually recording a stay during a closed period. */
  allowClosedPeriod?: boolean;
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
    const checkIn = new Date(item.checkIn);
    const checkOut = new Date(item.checkOut);
    if (!item.allowClosedPeriod && rangeOverlapsClosure(checkIn, checkOut, suite.closures)) {
      throw new Error(`${suite.name} n'est pas disponible sur ces dates`);
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
      currency: suite.currency,
    };
  }

  if (item.serviceType === "activity") {
    if (!item.activityId || !item.date) {
      throw new Error("Activity booking requires activityId and date");
    }
    const activity = await db.activity.findUnique({ where: { id: item.activityId }, include: { seasonalPrices: true } });
    if (!activity) throw new Error("Activity not found");
    const date = new Date(item.date);
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
      totalAmount: guests * unitPrice + children * Math.round(unitPrice * activity.childPricePercent / 100),
      currency: activity.currency,
    };
  }

  if (item.serviceType === "daypass") {
    if (!item.dayPassId || !item.date) {
      throw new Error("Day pass booking requires dayPassId and date");
    }
    const pass = await db.dayPass.findUnique({ where: { id: item.dayPassId }, include: { seasonalPrices: true } });
    if (!pass) throw new Error("Day pass not found");
    const date = new Date(item.date);
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
      totalAmount: guests * unitPrice + children * Math.round(unitPrice * pass.childPricePercent / 100),
      currency: pass.currency,
    };
  }

  throw new Error("Invalid serviceType");
}
