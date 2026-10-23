import { calendarDay, DAY_MS } from "@/lib/calendar-day";

interface PriceWindow {
  startDate: Date;
  endDate: Date;
  price: number;
}

/** The seasonal window that sets the price on `date`, or undefined when the base price applies.
 *  Compared by calendar day (both window ends included), so a browser's local midnight and
 *  the server's UTC midnight give the same answer. When windows overlap, the shortest
 *  (most specific) one wins, whatever order the database returned them in. */
export function windowForDate<W extends PriceWindow>(seasonalPrices: W[], date: Date): W | undefined {
  const day = calendarDay(date).getTime();
  let match: W | undefined;
  let matchSpan = Infinity;
  for (const sp of seasonalPrices) {
    const start = calendarDay(sp.startDate).getTime();
    const end = calendarDay(sp.endDate).getTime();
    if (day < start || day > end) continue;
    if (end - start < matchSpan) {
      match = sp;
      matchSpan = end - start;
    }
  }
  return match;
}

/** Returns the seasonal override price active on `date`, or `basePrice` if none applies. */
export function priceForDate(basePrice: number, seasonalPrices: PriceWindow[], date: Date): number {
  return windowForDate(seasonalPrices, date)?.price ?? basePrice;
}

/** Sums the nightly price (seasonal-aware) for every night from checkIn (inclusive) to checkOut (exclusive). */
export function nightlyTotal(basePrice: number, seasonalPrices: PriceWindow[], checkIn: Date, checkOut: Date): number {
  const start = calendarDay(checkIn).getTime();
  const nights = Math.max(1, Math.round((calendarDay(checkOut).getTime() - start) / DAY_MS));
  let total = 0;
  for (let i = 0; i < nights; i++) {
    total += priceForDate(basePrice, seasonalPrices, new Date(start + i * DAY_MS));
  }
  return total;
}
