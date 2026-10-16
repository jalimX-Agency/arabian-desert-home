/**
 * Stay dates are calendar days, but they travel as JavaScript Dates: the browser picks
 * them at LOCAL midnight (Paris = 22:00/23:00 UTC the day before), while the database,
 * the admin and the seasonal windows use UTC midnight. Compared or formatted as raw
 * timestamps, the same day can read as the day before (or after) depending on where the
 * code runs. Every stay date goes through these helpers instead.
 */
export const DAY_MS = 86_400_000;

/** The calendar day a date stands for, as UTC midnight. Rounds to the nearest UTC midnight,
 *  so a local midnight anywhere from UTC−11 to UTC+11 and a UTC midnight give the same day.
 *  Also repairs dates stored before this fix (e.g. 2026-10-20T22:00Z → 2026-10-21). */
export function calendarDay(d: Date | string | number): Date {
  return new Date(Math.round(new Date(d).getTime() / DAY_MS) * DAY_MS);
}

/** That same day at LOCAL midnight — what browser-side formatting (date-fns) expects. */
export function localDay(d: Date | string | number): Date {
  const u = calendarDay(d);
  return new Date(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate());
}

/** `YYYY-MM-DD` of the calendar day. */
export function dayKey(d: Date | string | number): string {
  return calendarDay(d).toISOString().slice(0, 10);
}

/** Whole nights between two calendar days (0 when the range is empty). */
export function nightsBetweenDays(checkIn: Date | string | number, checkOut: Date | string | number): number {
  return Math.max(0, Math.round((calendarDay(checkOut).getTime() - calendarDay(checkIn).getTime()) / DAY_MS));
}
