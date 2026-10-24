import { calendarDay, dayKey, DAY_MS } from "@/lib/calendar-day";
import { priceForDate, windowForDate } from "@/lib/seasonal-price";

interface OfferSuite {
  id: string;
  price: number;
  currency: string;
  seasonalPrices?: { startDate: string | Date; endDate: string | Date; price: number }[];
}

export interface TentOffer<S> {
  suite: S;
  price: number;
  currency: string;
  /** Last day (YYYY-MM-DD) the offer price still applies, without a break. */
  until: string;
}

/**
 * The best promotion running today: a tent whose seasonal price today is below its base
 * price, with the last day that price lasts. Prices are never shown without dates, so the
 * offer always travels with its end date. Null when no tent is discounted today.
 */
export function currentTentOffer<S extends OfferSuite>(suites: S[], now: Date = new Date()): TentOffer<S> | null {
  const today = calendarDay(now).getTime();
  let best: TentOffer<S> | null = null;
  for (const suite of suites) {
    const windows = (suite.seasonalPrices ?? []).map((w) => ({ startDate: new Date(w.startDate), endDate: new Date(w.endDate), price: w.price }));
    const active = windowForDate(windows, new Date(today));
    if (!active || active.price >= suite.price) continue;
    if (best && active.price >= best.price) continue;
    let last = today;
    for (let d = today + DAY_MS; d <= today + 365 * DAY_MS; d += DAY_MS) {
      if (priceForDate(suite.price, windows, new Date(d)) !== active.price) break;
      last = d;
    }
    best = { suite, price: active.price, currency: suite.currency, until: dayKey(last) };
  }
  return best;
}
