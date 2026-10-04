import { roundMoney } from "@/lib/money";

/** How a catalogue line of a quote is priced:
 *  - `catalog`: the site's own rates (seasonal prices included), in the catalogue's currency;
 *  - `unit`: a price the admin typed per person (activities, day passes) or per night (tents),
 *    still multiplied by the people / nights, so the line follows every change;
 *  - `total`: a fixed amount for the whole line (package price). */
export type DevisPriceMode = "catalog" | "unit" | "total";
export const DEVIS_PRICE_MODES: readonly DevisPriceMode[] = ["catalog", "unit", "total"];

export function parseDevisPriceMode(value: unknown): DevisPriceMode | null {
  return DEVIS_PRICE_MODES.includes(value as DevisPriceMode) ? (value as DevisPriceMode) : null;
}

/** Whole nights between two dates (0 when either is missing or the range is empty). */
export function nightsBetween(checkIn: string | Date | null | undefined, checkOut: string | Date | null | undefined): number {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Number.isFinite(ms) ? Math.max(0, Math.round(ms / 86_400_000)) : 0;
}

/** The child rate derived from an adult unit price. */
export function childUnitPrice(unitPrice: number, childPricePercent: number): number {
  return roundMoney((unitPrice * childPricePercent) / 100);
}

/** Line total for a price typed per person (activity, day pass) or per night (tent). */
export function unitModeTotal(line: {
  serviceType: string;
  unitPrice: number;
  guests: number;
  children: number;
  quantity: number;
  nights: number;
  childPricePercent: number;
}): number {
  if (line.serviceType === "suite") {
    return roundMoney(line.unitPrice * line.nights * Math.max(1, line.quantity));
  }
  return roundMoney(
    line.guests * line.unitPrice + line.children * childUnitPrice(line.unitPrice, line.childPricePercent),
  );
}
