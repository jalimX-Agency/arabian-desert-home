import { priceForDate } from "@/lib/seasonal-price";
import { roundMoney } from "@/lib/money";
import { childUnitPrice, nightsBetween, type DevisPriceMode } from "@/lib/devis-pricing";

/**
 * How a quote line's amount is made up — "170 € × 3 nuits × 2 tentes" — so the client (and the
 * admin, months later) can see where a number comes from. Language-neutral on purpose: it is
 * stored with the line when the quote is saved, and rendered per language wherever it is shown
 * (PDF, client page, editor). Pure: safe to import from the browser.
 */
export type BreakdownPart =
  | { kind: "nights"; qty: number; rate: number }
  | { kind: "adults"; qty: number; rate: number }
  | { kind: "children"; qty: number; rate: number; percent: number }
  | { kind: "units"; qty: number; rate: number };

export interface DevisBreakdown {
  v: 1;
  mode: DevisPriceMode | "custom";
  parts: BreakdownPart[];
  /** Tents only: every part is priced for ONE tent and multiplied by this. */
  tents?: number;
}

export interface WindowLike {
  startDate: Date | string;
  endDate: Date | string;
  price: number;
}

const toDate = (v: Date | string) => (v instanceof Date ? v : new Date(v));

/** Nights of a stay grouped by consecutive equal rate, seasonal windows included. */
export function nightSegments(
  basePrice: number,
  windows: WindowLike[],
  checkIn: Date | string,
  checkOut: Date | string,
): { qty: number; rate: number }[] {
  const start = toDate(checkIn);
  const nights = Math.max(1, Math.round((toDate(checkOut).getTime() - start.getTime()) / 86_400_000));
  const wins = windows.map((w) => ({ startDate: toDate(w.startDate), endDate: toDate(w.endDate), price: w.price }));
  const segments: { qty: number; rate: number }[] = [];
  for (let i = 0; i < nights; i++) {
    const night = new Date(start);
    night.setDate(night.getDate() + i);
    const rate = priceForDate(basePrice, wins, night);
    const last = segments[segments.length - 1];
    if (last && last.rate === rate) last.qty += 1;
    else segments.push({ qty: 1, rate });
  }
  return segments;
}

export function breakdownTotal(b: DevisBreakdown): number {
  const perUnit = b.parts.reduce((sum, p) => sum + p.qty * p.rate, 0);
  return roundMoney(perUnit * Math.max(1, b.tents ?? 1));
}

export interface LineBreakdownInput {
  serviceType: string;
  mode: DevisPriceMode;
  /** Typed price, used in `unit` mode (per night for a tent, per adult otherwise). */
  unitPrice: number;
  guests: number;
  children: number;
  quantity: number;
  checkIn?: Date | string | null;
  checkOut?: Date | string | null;
  date?: Date | string | null;
  /** The catalogue's own rate and seasonal windows (used in `catalog` mode). */
  basePrice: number;
  windows: WindowLike[];
  childPricePercent: number;
}

/** Breakdown of a catalogue line (tent, activity, day pass). */
export function buildLineBreakdown(input: LineBreakdownInput): DevisBreakdown {
  const { serviceType, mode } = input;
  if (mode === "total") return { v: 1, mode, parts: [] };

  if (serviceType === "suite") {
    const tents = Math.max(1, input.quantity);
    if (mode === "unit") {
      const nights = nightsBetween(input.checkIn ?? null, input.checkOut ?? null);
      return { v: 1, mode, tents, parts: nights > 0 ? [{ kind: "nights", qty: nights, rate: input.unitPrice }] : [] };
    }
    if (!input.checkIn || !input.checkOut) return { v: 1, mode, tents, parts: [] };
    const parts = nightSegments(input.basePrice, input.windows, input.checkIn, input.checkOut)
      .map((s): BreakdownPart => ({ kind: "nights", qty: s.qty, rate: s.rate }));
    return { v: 1, mode, tents, parts };
  }

  const rate =
    mode === "unit" ? input.unitPrice
    : input.date ? priceForDate(
        input.basePrice,
        input.windows.map((w) => ({ startDate: toDate(w.startDate), endDate: toDate(w.endDate), price: w.price })),
        toDate(input.date),
      )
    : input.basePrice;
  const parts: BreakdownPart[] = [];
  if (input.guests > 0) parts.push({ kind: "adults", qty: input.guests, rate });
  if (input.children > 0) {
    parts.push({
      kind: "children",
      qty: input.children,
      rate: childUnitPrice(rate, input.childPricePercent),
      percent: input.childPricePercent,
    });
  }
  return { v: 1, mode, parts };
}

/** Breakdown of a free line: quantity × unit price. */
export function customBreakdown(quantity: number, unitPrice: number): DevisBreakdown {
  return { v: 1, mode: "custom", parts: [{ kind: "units", qty: Math.max(1, quantity), rate: unitPrice }] };
}

/** Best effort for quotes saved before breakdowns were stored: rebuilt from what the line
 *  kept (quantity, unit price, people, dates). Null when the amount can't be explained. */
export function fallbackBreakdown(item: {
  kind: string;
  serviceType: string;
  quantity: number;
  guests: number;
  children: number;
  unitPrice: number;
  totalAmount: number;
  checkIn?: Date | string | null;
  checkOut?: Date | string | null;
}): DevisBreakdown | null {
  if (item.kind === "custom") return customBreakdown(item.quantity, item.unitPrice);
  if (!(item.unitPrice > 0)) return null;
  const base = {
    serviceType: item.serviceType,
    mode: "unit" as const,
    unitPrice: item.unitPrice,
    guests: item.guests,
    children: item.children,
    quantity: item.quantity,
    checkIn: item.checkIn,
    checkOut: item.checkOut,
    basePrice: item.unitPrice,
    windows: [] as WindowLike[],
  };
  // The child percentage wasn't kept: recover it from the saved total.
  let percent = 50;
  if (item.serviceType !== "suite" && item.children > 0) {
    const childRate = Math.round((item.totalAmount - item.guests * item.unitPrice) / item.children);
    // Prefer the usual round percentages (50 first) that reproduce the saved child rate.
    const candidates = [50, ...Array.from({ length: 21 }, (_, i) => i * 5), ...Array.from({ length: 101 }, (_, i) => i)];
    percent = candidates.find((p) => childUnitPrice(item.unitPrice, p) === childRate) ?? 50;
  }
  return buildLineBreakdown({ ...base, childPricePercent: percent });
}

export type BreakdownLang = "fr" | "en" | "es";

const WORDS: Record<BreakdownLang, {
  night: [string, string]; tent: [string, string]; adult: [string, string]; child: [string, string]; flat: string;
}> = {
  fr: { night: ["nuit", "nuits"], tent: ["tente", "tentes"], adult: ["adulte", "adultes"], child: ["enfant", "enfants"], flat: "Forfait" },
  en: { night: ["night", "nights"], tent: ["tent", "tents"], adult: ["adult", "adults"], child: ["child", "children"], flat: "Flat rate" },
  es: { night: ["noche", "noches"], tent: ["tienda", "tiendas"], adult: ["adulto", "adultos"], child: ["niño", "niños"], flat: "Precio fijo" },
};

/** "170 € × 3 nuits × 2 tentes" / "4 adultes × 60 € + 1 enfant × 30 € (50 %)". Empty when
 *  there's nothing to explain (a single free line is just its price). */
export function formatBreakdown(b: DevisBreakdown, lang: BreakdownLang, fmt: (amount: number) => string): string {
  const w = WORDS[lang];
  const word = (pair: [string, string], n: number) => (n > 1 ? pair[1] : pair[0]);
  if (b.mode === "total") return w.flat;
  if (b.mode === "custom" && b.parts.length === 1 && b.parts[0].qty === 1) return "";

  const text = b.parts.map((p) => {
    switch (p.kind) {
      case "nights": return `${p.qty} ${word(w.night, p.qty)} × ${fmt(p.rate)}`;
      case "adults": return `${p.qty} ${word(w.adult, p.qty)} × ${fmt(p.rate)}`;
      case "children": return `${p.qty} ${word(w.child, p.qty)} × ${fmt(p.rate)} (${p.percent} %)`;
      case "units": return `${p.qty} × ${fmt(p.rate)}`;
    }
  });
  const joined = text.join(" + ");
  const tents = b.tents ?? 1;
  if (tents > 1) return `${text.length > 1 ? `(${joined})` : joined} × ${tents} ${word(w.tent, tents)}`;
  return joined;
}

/** Parses what the database stored, ignoring anything that isn't a v1 breakdown. */
export function readBreakdown(value: unknown): DevisBreakdown | null {
  if (!value || typeof value !== "object") return null;
  const b = value as Partial<DevisBreakdown>;
  return b.v === 1 && Array.isArray(b.parts) && typeof b.mode === "string" ? (b as DevisBreakdown) : null;
}
