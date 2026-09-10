"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Booking,
  ReservationGroup,
  statusColors,
  bookingCalendarEntries,
} from "../_lib/reservation-utils";

interface ReservationCalendarProps {
  bookings: Booking[];
  groups: ReservationGroup[];
  onSelect: (g: ReservationGroup) => void;
}

export function ReservationCalendar({ bookings, groups, onSelect }: ReservationCalendarProps) {
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(calendarMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(calendarMonth), { weekStartsOn: 1 }),
  });

  const calendarEntries = bookings.flatMap(bookingCalendarEntries);

  function entriesForDay(day: Date) {
    return calendarEntries.filter((e) => isSameDay(e.date, day));
  }

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCalendarMonth((m) => subMonths(m, 1))}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-white/60 cursor-pointer"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white capitalize w-36 text-center">
            {format(calendarMonth, "MMMM yyyy", { locale: fr })}
          </h2>
          <button
            onClick={() => setCalendarMonth((m) => addMonths(m, 1))}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-white/60 cursor-pointer"
            aria-label="Mois suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => setCalendarMonth(new Date())}
          className="px-3 py-1.5 rounded-lg text-xs uppercase tracking-widest bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          Aujourd&apos;hui
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-white/10 text-xs uppercase tracking-widest text-gray-400">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d} className="px-2 py-2 text-center">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((day) => {
          const entries = entriesForDay(day);
          const inMonth = isSameMonth(day, calendarMonth);
          return (
            <div
              key={day.toISOString()}
              className={`min-h-[104px] p-1.5 border-b border-r border-gray-100 dark:border-white/5 ${
                inMonth ? "" : "bg-gray-50/50 dark:bg-white/[0.01]"
              }`}
            >
              <p
                className={`text-xs mb-1 ${
                  isToday(day)
                    ? "inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white font-semibold"
                    : inMonth
                    ? "text-gray-500 dark:text-white/60"
                    : "text-gray-300 dark:text-white/20"
                }`}
              >
                {format(day, "d")}
              </p>
              <div className="space-y-1">
                {entries.slice(0, 3).map((entry, i) => (
                  <button
                    key={`${entry.booking.id}-${i}`}
                    onClick={() => {
                      const g = groups.find((grp) => grp.items.some((it) => it.id === entry.booking.id));
                      if (g) onSelect(g);
                    }}
                    title={`${entry.booking.firstName} ${entry.booking.lastName} — ${entry.label}`}
                    className={`w-full text-left truncate px-1.5 py-0.5 rounded text-[11px] border cursor-pointer transition-colors hover:opacity-80 ${statusColors[entry.booking.status] ?? "border-gray-200 dark:border-white/20 text-gray-500 dark:text-white/60"}`}
                  >
                    {entry.label === "Arrivée" ? "→ " : entry.label === "Départ" ? "← " : ""}
                    {entry.booking.firstName} {entry.booking.lastName}
                  </button>
                ))}
                {entries.length > 3 && (
                  <p className="text-[11px] text-gray-400 px-1.5">+{entries.length - 3} de plus</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
