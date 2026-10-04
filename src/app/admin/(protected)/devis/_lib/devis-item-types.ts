import { format } from "date-fns";
import { computeItemPrice, toWindows, type Catalog, type EditableItem, type ServiceType } from "../../reservations/_lib/item-types";
import { priceForDate } from "@/lib/seasonal-price";
import { roundMoney } from "@/lib/money";
import { nightsBetween, unitModeTotal, type DevisPriceMode } from "@/lib/devis-pricing";
import type { DevisItem } from "./devis-utils";

export type DevisLineKind = "catalog" | "custom";
export type { DevisPriceMode };

/** A quote line in the editor: a catalogue line behaves like a reservation item,
 *  a free line is just a label with a quantity and a unit price. */
export type EditableDevisItem = EditableItem & {
  kind: DevisLineKind;
  label: string;
  description: string;
  /** Free line: price of one unit (negative = discount). Catalogue line in `unit` mode:
   *  price per person (activity, day pass) or per night (tent). */
  unitPrice: number;
  /** Catalogue lines only. */
  priceMode: DevisPriceMode;
  /** A saved catalogue line opens with its quoted amount frozen. The freeze lifts as soon as
   *  the admin changes what the price depends on (people, dates, item…), so the line
   *  re-prices instead of silently keeping the old amount. */
  lockedFromSave?: boolean;
};

/** Fields a catalogue line's price depends on. */
export const PRICING_FIELDS = [
  "serviceType", "suiteId", "activityId", "dayPassId", "checkIn", "checkOut", "date",
  "quantity", "guests", "children",
] as const satisfies readonly (keyof EditableDevisItem)[];

export function emptyDevisItem(currency: string, kind: DevisLineKind = "catalog"): EditableDevisItem {
  return {
    key: `new-${Date.now()}-${Math.random()}`,
    kind,
    serviceType: "suite",
    suiteId: "", activityId: "", dayPassId: "",
    checkIn: "", checkOut: "", date: "",
    // A free line (transport, discount…) has no people unless the admin sets them.
    quantity: 1, guests: kind === "custom" ? 0 : 2, children: 0,
    totalAmount: 0, currency,
    customPrice: false,
    priceMode: "catalog",
    label: "", description: "", unitPrice: 0,
  };
}

export function devisItemToEditable(item: DevisItem): EditableDevisItem {
  const isCustom = item.kind === "custom";
  const ymd = (d: string | null | undefined) => (d ? format(new Date(d), "yyyy-MM-dd") : "");
  // A unit price on a catalogue line means it was quoted per person / per night; otherwise
  // the saved amount is kept as a fixed total until the admin edits the line.
  const priceMode: DevisPriceMode = isCustom ? "catalog" : item.unitPrice > 0 ? "unit" : "total";
  return {
    key: item.id,
    id: item.id,
    kind: isCustom ? "custom" : "catalog",
    serviceType: (isCustom ? "suite" : item.serviceType) as ServiceType,
    suiteId: item.suiteId ?? "",
    activityId: item.activityId ?? "",
    dayPassId: item.dayPassId ?? "",
    // A free line edits its period as `date` (start) + `checkOut` (optional end).
    checkIn: isCustom ? "" : ymd(item.checkIn),
    checkOut: ymd(item.checkOut),
    date: isCustom ? ymd(item.date ?? item.checkIn) : ymd(item.date),
    quantity: item.quantity,
    guests: item.guests,
    children: item.children,
    totalAmount: item.totalAmount,
    currency: item.currency,
    customPrice: priceMode !== "catalog",
    priceMode,
    lockedFromSave: priceMode === "total",
    label: item.label,
    description: item.description ?? "",
    unitPrice: item.unitPrice,
  };
}

/** The catalogue entry a line points at, if it is loaded. */
export function catalogEntryFor(item: EditableDevisItem, catalog: Catalog) {
  if (item.kind === "custom") return null;
  return (
    item.serviceType === "suite" ? catalog.suites.find((s) => s.id === item.suiteId)
    : item.serviceType === "activity" ? catalog.activities.find((a) => a.id === item.activityId)
    : catalog.dayPasses.find((p) => p.id === item.dayPassId)
  ) ?? null;
}

/** True when the catalogue rates are in another currency than the quote (85 EUR in a MAD quote). */
export function hasCurrencyMismatch(item: EditableDevisItem, catalog: Catalog): boolean {
  const entry = catalogEntryFor(item, catalog);
  return entry !== null && entry.currency !== item.currency;
}

/** The catalogue's own unit price for the line's date (per person, or per night for a tent). */
export function catalogUnitPrice(item: EditableDevisItem, catalog: Catalog): number | null {
  const entry = catalogEntryFor(item, catalog);
  if (!entry) return null;
  const day = item.serviceType === "suite" ? item.checkIn : item.date;
  return day ? priceForDate(entry.price, toWindows(entry.seasonalPrices), new Date(day)) : entry.price;
}

/** Catalogue rates can't be used when they are in another currency: such a line is priced per
 *  person / per night instead. */
export function normaliseDevisItem(item: EditableDevisItem, catalog: Catalog): EditableDevisItem {
  if (item.kind === "catalog" && item.priceMode === "catalog" && hasCurrencyMismatch(item, catalog)) {
    return { ...item, priceMode: "unit", customPrice: true };
  }
  return item;
}

/** Applies an edit to a line, lifting the save-time price freeze when a pricing field changes. */
export function applyDevisItemPatch(item: EditableDevisItem, patch: Partial<EditableDevisItem>): EditableDevisItem {
  const next = { ...item, ...patch };
  if ("priceMode" in patch) {
    next.lockedFromSave = false;
    next.customPrice = next.priceMode !== "catalog";
  } else if (item.lockedFromSave && PRICING_FIELDS.some((f) => f in patch && patch[f] !== item[f])) {
    next.priceMode = "catalog";
    next.customPrice = false;
    next.lockedFromSave = false;
  }
  return next;
}

/** Free lines are quantity × unit price; catalogue lines follow their pricing mode. */
export function computeDevisLineTotal(item: EditableDevisItem, catalog: Catalog): number {
  if (item.kind === "custom") return roundMoney(Math.max(1, item.quantity) * item.unitPrice);
  if (item.priceMode === "total") return item.totalAmount;
  if (item.priceMode === "unit") {
    const entry = catalogEntryFor(item, catalog);
    return unitModeTotal({
      serviceType: item.serviceType,
      unitPrice: item.unitPrice,
      guests: item.guests,
      children: item.children,
      quantity: item.quantity,
      nights: nightsBetween(item.checkIn, item.checkOut),
      childPricePercent: entry && "childPricePercent" in entry ? entry.childPricePercent : 50,
    });
  }
  return roundMoney(computeItemPrice(item, catalog));
}

export function isDevisItemValid(item: EditableDevisItem): boolean {
  if (item.kind === "custom") return item.label.trim() !== "" && Number.isFinite(item.unitPrice);
  if (item.priceMode === "unit" && !(item.unitPrice > 0)) return false;
  if (item.priceMode === "total" && !(item.totalAmount >= 0)) return false;
  return item.serviceType === "suite"
    ? item.suiteId !== "" && item.checkIn !== "" && item.checkOut !== ""
    : item.serviceType === "activity"
      ? item.activityId !== "" && item.date !== ""
      : item.dayPassId !== "" && item.date !== "";
}

export function devisItemToPayload(item: EditableDevisItem) {
  if (item.kind === "custom") {
    return {
      kind: "custom" as const,
      label: item.label.trim(),
      description: item.description.trim() || null,
      // One day → `date`; a period → `checkIn`/`checkOut`.
      date: item.date && !item.checkOut ? item.date : undefined,
      checkIn: item.date && item.checkOut ? item.date : undefined,
      checkOut: item.date && item.checkOut ? item.checkOut : undefined,
      guests: Math.max(0, item.guests),
      children: Math.max(0, item.children),
      quantity: Math.max(1, item.quantity),
      unitPrice: roundMoney(item.unitPrice),
    };
  }
  return {
    kind: "catalog" as const,
    serviceType: item.serviceType,
    suiteId: item.serviceType === "suite" ? item.suiteId : undefined,
    activityId: item.serviceType === "activity" ? item.activityId : undefined,
    dayPassId: item.serviceType === "daypass" ? item.dayPassId : undefined,
    checkIn: item.serviceType === "suite" ? item.checkIn : undefined,
    checkOut: item.serviceType === "suite" ? item.checkOut : undefined,
    date: item.serviceType !== "suite" ? item.date : undefined,
    quantity: item.serviceType === "suite" ? item.quantity : 1,
    guests: item.guests,
    children: item.children,
    label: item.label.trim() || undefined,
    description: item.description.trim() || null,
    priceMode: item.priceMode,
    unitPrice: item.priceMode === "unit" ? roundMoney(item.unitPrice) : undefined,
    totalAmount: item.totalAmount,
  };
}
