"use client";

import { addDaysISO, toISODay } from "@/lib/tent-stay";
import { localDay } from "@/lib/calendar-day";
import type { Booking } from "../_lib/reservation-utils";

export interface QuickRange {
  key: string;
  from: string;
  to: string;
}

/** One-tap shortcuts above the list: the next days (by arrival / activity date) and the
 *  requests still waiting for an answer, each with how many reservations it holds. */
export function QuickFilters({
  bookings,
  rangeFrom,
  rangeTo,
  pendingActive,
  onRange,
  onPending,
  onClear,
}: {
  bookings: Booking[];
  /** The list's current date range (empty when it is not filtered by dates). */
  rangeFrom: string;
  rangeTo: string;
  pendingActive: boolean;
  onRange: (r: QuickRange) => void;
  onPending: () => void;
  onClear: () => void;
}) {
  const today = toISODay(new Date());
  const monthEnd = toISODay(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
  const ranges: (QuickRange & { label: string })[] = [
    { key: "today", label: "Aujourd'hui", from: today, to: today },
    { key: "tomorrow", label: "Demain", from: addDaysISO(today, 1), to: addDaysISO(today, 1) },
    { key: "week", label: "7 prochains jours", from: today, to: addDaysISO(today, 6) },
    { key: "month", label: "Ce mois-ci", from: today, to: monthEnd },
  ];

  const active = ranges.find((r) => r.from === rangeFrom && r.to === rangeTo)?.key ?? null;

  const live = bookings.filter((b) => b.status !== "cancelled");
  const countIn = (from: string, to: string) =>
    new Set(
      live
        .filter((b) => {
          const d = b.checkIn ?? b.date;
          if (!d) return false;
          const key = toISODay(localDay(d));
          return key >= from && key <= to;
        })
        .map((b) => b.reservation?.id ?? b.id),
    ).size;
  const pending = new Set(live.filter((b) => b.status === "pending").map((b) => b.reservation?.id ?? b.id)).size;

  const chip = (on: boolean) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
      on ? "bg-amber-500 text-white" : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:border-amber-400"
    }`;
  const badge = (n: number, on: boolean) => (
    <span className={`min-w-[18px] px-1 rounded-full text-[10px] ${on ? "bg-white/25" : "bg-gray-100 dark:bg-white/10"}`}>{n}</span>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {ranges.map((r) => {
        const on = active === r.key;
        return (
          <button key={r.key} onClick={() => (on ? onClear() : onRange(r))} className={chip(on)}>
            {r.label} {badge(countIn(r.from, r.to), on)}
          </button>
        );
      })}
      <button onClick={pendingActive ? onClear : onPending} className={chip(pendingActive)}>
        En attente de confirmation {badge(pending, pendingActive)}
      </button>
      {(active || rangeFrom || rangeTo || pendingActive) && (
        <button onClick={onClear} className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 cursor-pointer">
          Effacer
        </button>
      )}
    </div>
  );
}
