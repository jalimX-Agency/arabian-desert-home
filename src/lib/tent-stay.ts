/**
 * Small helpers shared by the tents page, the tent detail page and the booking form,
 * so a stay chosen on one page (dates, guests, tents) arrives intact on the next.
 * Dates travel as plain `YYYY-MM-DD` strings in the URL.
 */

export interface StayDraft {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

export const DAY_MS = 86_400_000;

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Local calendar date as `YYYY-MM-DD` (never shifted by the time zone). */
export function toISODay(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayISO(): string {
  return toISODay(new Date());
}

/** `YYYY-MM-DD` → Date at local midnight, or null when it isn't a valid date. */
export function parseISODay(value: string | null | undefined): Date | null {
  if (!value || !ISO_DAY.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
}

export function addDaysISO(value: string, days: number): string {
  const d = parseISODay(value) ?? new Date();
  d.setDate(d.getDate() + days);
  return toISODay(d);
}

/** Whole nights between two ISO days (0 when either is missing or the range is empty). */
export function nightsBetweenISO(checkIn: string, checkOut: string): number {
  const a = parseISODay(checkIn);
  const b = parseISODay(checkOut);
  if (!a || !b) return 0;
  return Math.max(0, Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / DAY_MS));
}

/** The last day a stay can be cancelled for free: `days` days before arrival. */
export function freeCancellationUntil(checkIn: string, days: number): string {
  return addDaysISO(checkIn, -Math.max(0, days));
}

/** Reads a stay out of the URL's query string; unknown or invalid values fall back to defaults. */
export function readStayFromQuery(query: URLSearchParams): StayDraft {
  const checkIn = parseISODay(query.get("checkin")) ? query.get("checkin")! : "";
  let checkOut = parseISODay(query.get("checkout")) ? query.get("checkout")! : "";
  if (checkIn && checkOut && nightsBetweenISO(checkIn, checkOut) < 1) checkOut = "";
  const adults = Math.min(20, Math.max(1, Number(query.get("adults")) || 2));
  const children = Math.min(20, Math.max(0, Number(query.get("children")) || 0));
  return { checkIn, checkOut: checkIn ? checkOut : "", adults, children };
}

/** "slug:2,other-slug:1" → [{ slug, qty }]. */
export function parseTentPicks(value: string | null | undefined): { slug: string; qty: number }[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => {
      const [slug, q] = part.split(":");
      return { slug: (slug ?? "").trim(), qty: Math.floor(Number(q)) };
    })
    .filter((p) => p.slug && Number.isFinite(p.qty) && p.qty > 0 && p.qty <= 20);
}

/** The booking form URL carrying the chosen stay and tents. */
export function bookingQuery(stay: StayDraft, picks: { slug: string; qty: number }[]): string {
  const q = new URLSearchParams();
  if (stay.checkIn) q.set("checkin", stay.checkIn);
  if (stay.checkOut) q.set("checkout", stay.checkOut);
  q.set("adults", String(stay.adults));
  q.set("children", String(stay.children));
  const tents = picks.filter((p) => p.qty > 0).map((p) => `${p.slug}:${p.qty}`).join(",");
  if (tents) q.set("tents", tents);
  return q.toString();
}
