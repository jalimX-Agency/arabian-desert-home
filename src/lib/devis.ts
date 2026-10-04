import { db } from "@/lib/db";
import { priceCartItem } from "@/lib/reservation-item";
import { roundMoney, sumMoney } from "@/lib/money";
import { nightsBetween, parseDevisPriceMode, unitModeTotal, type DevisPriceMode } from "@/lib/devis-pricing";

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
  /** Catalogue lines only; see DevisPriceMode. Missing = an older client: keep the sent total. */
  priceMode?: DevisPriceMode;
}

const money = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? roundMoney(v) : null);

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
    const unitPrice = money(item.unitPrice) ?? 0;
    return {
      kind: "custom",
      serviceType: "custom",
      suiteId: null,
      activityId: null,
      dayPassId: null,
      label: (item.label ?? "").trim() || "Prestation",
      description: item.description?.trim() || null,
      // Dates and people are optional on a free line and purely informative.
      checkIn: item.checkIn && item.checkOut ? new Date(item.checkIn) : null,
      checkOut: item.checkIn && item.checkOut ? new Date(item.checkOut) : null,
      date: item.date ? new Date(item.date) : null,
      quantity,
      guests: Math.max(0, Math.round(item.guests ?? 0)),
      children: Math.max(0, Math.round(item.children ?? 0)),
      unitPrice,
      totalAmount: roundMoney(quantity * unitPrice),
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

  const entry = await catalogEntry(priced);
  const mode = parseDevisPriceMode(item.priceMode);
  let quoted: number;
  let unitPrice = 0;

  if (mode === "unit") {
    unitPrice = money(item.unitPrice) ?? 0;
    if (unitPrice <= 0) throw new Error(`${entry.name} : indiquez le prix par ${priced.serviceType === "suite" ? "nuit" : "personne"}`);
    quoted = unitModeTotal({
      serviceType: priced.serviceType,
      unitPrice,
      guests: priced.guests,
      children: priced.children,
      quantity: priced.quantity,
      nights: nightsBetween(priced.checkIn, priced.checkOut),
      childPricePercent: entry.childPricePercent,
    });
  } else if (mode === "total") {
    const typed = money(item.totalAmount);
    if (typed === null || typed < 0) throw new Error(`${entry.name} : montant du forfait invalide`);
    quoted = typed;
  } else if (mode === "catalog") {
    // Catalogue rates are in the catalogue's currency: never relabel 85 EUR as 85 MAD.
    if (entry.currency !== currency) {
      throw new Error(`${entry.name} : le tarif du catalogue est en ${entry.currency}, saisissez un prix en ${currency}`);
    }
    quoted = roundMoney(priced.totalAmount);
  } else {
    // Older client without a mode: keep the amount it sent when it differs from the catalogue.
    const sent = money(item.totalAmount);
    quoted = sent !== null && sent !== priced.totalAmount ? sent : roundMoney(priced.totalAmount);
  }

  return {
    kind: "catalog",
    serviceType: priced.serviceType,
    suiteId: priced.suiteId,
    activityId: priced.activityId,
    dayPassId: priced.dayPassId,
    label: (item.label ?? "").trim() || entry.name,
    description: item.description?.trim() || null,
    checkIn: priced.checkIn,
    checkOut: priced.checkOut,
    date: priced.date,
    quantity: priced.quantity,
    guests: priced.guests,
    children: priced.children,
    // Set only for a price per person / per night, so the editor can reopen the line in that mode.
    unitPrice,
    totalAmount: quoted,
    currency,
    order,
  };
}

/** The catalogue entry behind a line: its name (snapshotted, so a later rename doesn't rewrite
 *  an old quote), the currency its rates are in, and its child rate. */
async function catalogEntry(priced: { suiteId: string | null; activityId: string | null; dayPassId: string | null }) {
  const select = { name: true, currency: true, childPricePercent: true } as const;
  const row =
    priced.suiteId ? await db.suite.findUnique({ where: { id: priced.suiteId }, select })
    : priced.activityId ? await db.activity.findUnique({ where: { id: priced.activityId }, select })
    : priced.dayPassId ? await db.dayPass.findUnique({ where: { id: priced.dayPassId }, select })
    : null;
  return row ?? { name: "—", currency: "", childPricePercent: 50 };
}

export type PricedDevisItem = Awaited<ReturnType<typeof priceDevisItem>>;

export async function priceDevisItems(items: DevisItemInput[], currency: string) {
  const priced: PricedDevisItem[] = [];
  for (let i = 0; i < items.length; i++) priced.push(await priceDevisItem(items[i], currency, i));
  return { items: priced, totalAmount: sumMoney(priced.map((i) => i.totalAmount)) };
}

export function defaultValidUntil(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d;
}

export function isDevisExpired(devis: { status: string; validUntil: Date }): boolean {
  return devis.status === "expired" || (devis.status === "sent" && devis.validUntil.getTime() < Date.now());
}
