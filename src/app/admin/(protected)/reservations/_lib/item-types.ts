import { format } from "date-fns";
import { priceForDate, nightlyTotal } from "@/lib/seasonal-price";
import type { Booking } from "./reservation-utils";

export interface SeasonalWindow { id: string; label: string; startDate: string; endDate: string; price: number }
export interface CatalogSuite { id: string; name: string; price: number; currency: string; maxGuests: number; maxChildren: number; seasonalPrices?: SeasonalWindow[] }
export interface CatalogActivity { id: string; name: string; price: number; currency: string; childPricePercent: number; seasonalPrices?: SeasonalWindow[] }
export interface CatalogDayPass { id: string; name: string; price: number; currency: string; childPricePercent: number; seasonalPrices?: SeasonalWindow[] }

export interface Catalog {
  suites: CatalogSuite[];
  activities: CatalogActivity[];
  dayPasses: CatalogDayPass[];
}

export function toWindows(sp: SeasonalWindow[] | undefined) {
  return (sp ?? []).map((w) => ({ startDate: new Date(w.startDate), endDate: new Date(w.endDate), price: w.price }));
}

export type ServiceType = "suite" | "activity" | "daypass";

export interface EditableItem {
  key: string;
  id?: string;
  serviceType: ServiceType;
  suiteId: string;
  activityId: string;
  dayPassId: string;
  checkIn: string;
  checkOut: string;
  date: string;
  quantity: number;
  guests: number;
  children: number;
  totalAmount: number;
  currency: string;
  customPrice: boolean;
  /** The booking's status as loaded — read-only here; only used to flag items the
   *  client cancelled from their own page so the admin notices and can remove them. */
  status?: string;
}

export function bookingToEditable(b: Booking): EditableItem {
  return {
    key: b.id,
    id: b.id,
    serviceType: b.serviceType as ServiceType,
    suiteId: b.suiteId ?? "",
    activityId: b.activityId ?? "",
    dayPassId: b.dayPassId ?? "",
    checkIn: b.checkIn ? format(new Date(b.checkIn), "yyyy-MM-dd") : "",
    checkOut: b.checkOut ? format(new Date(b.checkOut), "yyyy-MM-dd") : "",
    date: b.date ? format(new Date(b.date), "yyyy-MM-dd") : "",
    quantity: b.quantity,
    guests: b.guests,
    children: b.children,
    totalAmount: b.totalAmount,
    currency: b.currency ?? "MAD",
    customPrice: false,
    status: b.status,
  };
}

export function emptyItem(): EditableItem {
  return {
    key: `new-${Date.now()}-${Math.random()}`,
    serviceType: "suite",
    suiteId: "", activityId: "", dayPassId: "",
    checkIn: "", checkOut: "", date: "",
    quantity: 1, guests: 2, children: 0,
    totalAmount: 0, currency: "MAD",
    customPrice: false,
  };
}

export function computeItemPrice(item: EditableItem, catalog: Catalog): number {
  if (item.serviceType === "suite") {
    const suite = catalog.suites.find((s) => s.id === item.suiteId);
    if (!suite || !item.checkIn || !item.checkOut) return item.totalAmount;
    return nightlyTotal(suite.price, toWindows(suite.seasonalPrices), new Date(item.checkIn), new Date(item.checkOut)) * Math.max(1, item.quantity);
  }
  if (item.serviceType === "activity") {
    const act = catalog.activities.find((a) => a.id === item.activityId);
    if (!act || !item.date) return item.totalAmount;
    const unit = priceForDate(act.price, toWindows(act.seasonalPrices), new Date(item.date));
    return item.guests * unit + item.children * Math.round((unit * act.childPricePercent) / 100);
  }
  if (item.serviceType === "daypass") {
    const pass = catalog.dayPasses.find((p) => p.id === item.dayPassId);
    if (!pass || !item.date) return item.totalAmount;
    const unit = priceForDate(pass.price, toWindows(pass.seasonalPrices), new Date(item.date));
    return item.guests * unit + item.children * Math.round((unit * pass.childPricePercent) / 100);
  }
  return item.totalAmount;
}

export function fetchCatalog(
  setSuites: (v: CatalogSuite[]) => void,
  setActivities: (v: CatalogActivity[]) => void,
  setDayPasses: (v: CatalogDayPass[]) => void,
) {
  fetch("/api/suites").then((r) => r.json()).then(setSuites).catch(() => {});
  fetch("/api/activities").then((r) => r.json()).then(setActivities).catch(() => {});
  fetch("/api/day-passes").then((r) => r.json()).then(setDayPasses).catch(() => {});
}

export function isItemValid(it: EditableItem): boolean {
  return it.serviceType === "suite"
    ? it.suiteId !== "" && it.checkIn !== "" && it.checkOut !== ""
    : it.serviceType === "activity"
    ? it.activityId !== "" && it.date !== ""
    : it.dayPassId !== "" && it.date !== "";
}

export function itemToPayload(it: EditableItem) {
  return {
    id: it.id,
    serviceType: it.serviceType,
    suiteId: it.serviceType === "suite" ? it.suiteId : undefined,
    activityId: it.serviceType === "activity" ? it.activityId : undefined,
    dayPassId: it.serviceType === "daypass" ? it.dayPassId : undefined,
    checkIn: it.serviceType === "suite" ? it.checkIn : undefined,
    checkOut: it.serviceType === "suite" ? it.checkOut : undefined,
    date: it.serviceType !== "suite" ? it.date : undefined,
    quantity: it.serviceType === "suite" ? it.quantity : 1,
    guests: it.guests,
    children: it.children,
    totalAmount: it.totalAmount,
    currency: it.currency,
  };
}
