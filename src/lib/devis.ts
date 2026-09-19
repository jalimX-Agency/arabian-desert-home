import { db } from "@/lib/db";
import { priceCartItem } from "@/lib/reservation-item";

export const DEVIS_STATUSES = [
  "draft", "sent", "accepted", "refused", "expired", "converted", "cancelled",
] as const;

export const DEVIS_INCLUDE = {
  items: {
    include: { suite: { select: { name: true } }, activity: { select: { name: true } }, dayPass: { select: { name: true } } },
    orderBy: { order: "asc" },
  },
} as const;

export interface DevisItemInput {
  kind?: "catalog" | "custom";
  serviceType?: "suite" | "activity" | "daypass";
  suiteId?: string | null;
  activityId?: string | null;
  dayPassId?: string | null;
  label?: string;
  description?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  date?: string | null;
  quantity?: number;
  guests?: number;
  children?: number;
  unitPrice?: number;
  totalAmount?: number;
}

/** Sequential per-year reference, e.g. DEV-2026-0007. */
export async function nextDevisReference(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `DEV-${year}-`;
  const last = await db.devis.findFirst({
    where: { reference: { startsWith: prefix } },
    orderBy: { reference: "desc" },
    select: { reference: true },
  });
  const lastSeq = last ? Number(last.reference.slice(prefix.length)) : 0;
  return `${prefix}${String((Number.isFinite(lastSeq) ? lastSeq : 0) + 1).padStart(4, "0")}`;
}

/** Prices one quote line. Catalogue lines go through the same engine as bookings — seasonal
 *  rates included — while free lines are quantity × unit price exactly as the admin typed them.
 *  Quotes are always allowed on closed dates: a closure can be lifted before the stay. */
export async function priceDevisItem(item: DevisItemInput, currency: string, order: number) {
  if (item.kind === "custom") {
    const quantity = Math.max(1, item.quantity ?? 1);
    const unitPrice = Math.round(item.unitPrice ?? 0);
    return {
      kind: "custom",
      serviceType: "custom",
      suiteId: null,
      activityId: null,
      dayPassId: null,
      label: (item.label ?? "").trim() || "Prestation",
      description: item.description?.trim() || null,
      checkIn: null,
      checkOut: null,
      date: item.date ? new Date(item.date) : null,
      quantity,
      guests: 0,
      children: 0,
      unitPrice,
      totalAmount: quantity * unitPrice,
      currency,
      order,
    };
  }

  const priced = await priceCartItem({
    serviceType: (item.serviceType ?? "suite") as "suite" | "activity" | "daypass",
    suiteId: item.suiteId ?? undefined,
    activityId: item.activityId ?? undefined,
    dayPassId: item.dayPassId ?? undefined,
    checkIn: item.checkIn ?? undefined,
    checkOut: item.checkOut ?? undefined,
    date: item.date ?? undefined,
    quantity: item.quantity,
    guests: item.guests,
    children: item.children,
    allowClosedPeriod: true,
    currencyOverride: currency,
  });

  // The admin may override a catalogue line's price in the quote; honour it when sent.
  const quoted = typeof item.totalAmount === "number" && item.totalAmount !== priced.totalAmount
    ? Math.round(item.totalAmount)
    : priced.totalAmount;

  return {
    kind: "catalog",
    serviceType: priced.serviceType,
    suiteId: priced.suiteId,
    activityId: priced.activityId,
    dayPassId: priced.dayPassId,
    label: (item.label ?? "").trim() || await catalogName(priced),
    description: item.description?.trim() || null,
    checkIn: priced.checkIn,
    checkOut: priced.checkOut,
    date: priced.date,
    quantity: priced.quantity,
    guests: priced.guests,
    children: priced.children,
    unitPrice: 0,
    totalAmount: quoted,
    currency,
    order,
  };
}

/** Snapshot of the catalogue name, so a later rename doesn't rewrite an old quote. */
async function catalogName(priced: { suiteId: string | null; activityId: string | null; dayPassId: string | null }): Promise<string> {
  if (priced.suiteId) return (await db.suite.findUnique({ where: { id: priced.suiteId }, select: { name: true } }))?.name ?? "—";
  if (priced.activityId) return (await db.activity.findUnique({ where: { id: priced.activityId }, select: { name: true } }))?.name ?? "—";
  if (priced.dayPassId) return (await db.dayPass.findUnique({ where: { id: priced.dayPassId }, select: { name: true } }))?.name ?? "—";
  return "—";
}

export type PricedDevisItem = Awaited<ReturnType<typeof priceDevisItem>>;

export async function priceDevisItems(items: DevisItemInput[], currency: string) {
  const priced: PricedDevisItem[] = [];
  for (let i = 0; i < items.length; i++) priced.push(await priceDevisItem(items[i], currency, i));
  return { items: priced, totalAmount: priced.reduce((sum, i) => sum + i.totalAmount, 0) };
}

export function defaultValidUntil(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d;
}

export function isDevisExpired(devis: { status: string; validUntil: Date }): boolean {
  return devis.status === "expired" || (devis.status === "sent" && devis.validUntil.getTime() < Date.now());
}
