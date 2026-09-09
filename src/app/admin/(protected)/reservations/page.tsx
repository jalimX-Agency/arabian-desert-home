"use client";

import { useEffect, useRef, useState } from "react";
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
import { Trash2, Download, Table2, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  serviceType: string;
  suite?: { name: string } | null;
  activity?: { name: string } | null;
  dayPass?: { name: string } | null;
  checkIn?: string | null;
  checkOut?: string | null;
  date?: string | null;
  quantity: number;
  guests: number;
  children: number;
  experiences?: string | null;
  specialReqs?: string | null;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  reservation?: { id: string; totalAmount: number; currency: string; _count: { items: number } } | null;
}

const statusOptions = ["pending", "confirmed", "cancelled"];
const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20",
  confirmed: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
  cancelled: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
};

const serviceTypeLabel: Record<string, string> = {
  suite: "Tente",
  activity: "Activité",
  daypass: "Day Pass",
};

const serviceTypeBadge: Record<string, string> = {
  suite: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
  activity: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
  daypass: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400",
};

function getServiceName(b: Booking): string {
  const base =
    b.serviceType === "suite" ? b.suite?.name ?? "—" :
    b.serviceType === "activity" ? b.activity?.name ?? "—" :
    b.serviceType === "daypass" ? b.dayPass?.name ?? "—" : "—";
  return b.quantity > 1 ? `${base} × ${b.quantity}` : base;
}

function formatDateCell(b: Booking): React.ReactNode {
  if (b.serviceType === "suite" && b.checkIn && b.checkOut) {
    return (
      <>
        {format(new Date(b.checkIn), "d MMM yyyy", { locale: fr })}
        <br />
        {format(new Date(b.checkOut), "d MMM yyyy", { locale: fr })}
      </>
    );
  }
  if (b.date) return format(new Date(b.date), "d MMM yyyy", { locale: fr });
  return "—";
}

interface ReservationGroup {
  id: string;
  items: Booking[];
}

/** Groups line-item bookings back into one reservation per customer submission. */
function groupBookings(bookings: Booking[]): ReservationGroup[] {
  const map = new Map<string, Booking[]>();
  for (const b of bookings) {
    const key = b.reservation?.id ?? b.id;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(b);
  }
  return Array.from(map.entries()).map(([id, items]) => ({ id, items }));
}

function groupTotalAmount(g: ReservationGroup): number {
  return g.items[0]?.reservation?.totalAmount ?? g.items.reduce((sum, b) => sum + b.totalAmount, 0);
}

interface CalendarEntry {
  booking: Booking;
  date: Date;
  label: string;
}

function bookingCalendarEntries(b: Booking): CalendarEntry[] {
  if (b.serviceType === "suite") {
    const entries: CalendarEntry[] = [];
    if (b.checkIn) entries.push({ booking: b, date: new Date(b.checkIn), label: "Arrivée" });
    if (b.checkOut) entries.push({ booking: b, date: new Date(b.checkOut), label: "Départ" });
    return entries;
  }
  if (b.date) return [{ booking: b, date: new Date(b.date), label: serviceTypeLabel[b.serviceType] ?? b.serviceType }];
  return [];
}

function csvField(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function bookingsToCsv(bookings: Booking[]): string {
  const headers = [
    "Prénom", "Nom", "Email", "Téléphone", "Service", "Prestation",
    "Arrivée", "Départ", "Date", "Adultes", "Enfants",
    "Expériences", "Demandes spéciales", "Statut", "Montant", "Devise", "Reçue le",
  ];
  const rows = bookings.map((b) => [
    b.firstName,
    b.lastName,
    b.email,
    b.phone ?? "",
    serviceTypeLabel[b.serviceType] ?? b.serviceType,
    getServiceName(b),
    b.checkIn ? format(new Date(b.checkIn), "yyyy-MM-dd") : "",
    b.checkOut ? format(new Date(b.checkOut), "yyyy-MM-dd") : "",
    b.date ? format(new Date(b.date), "yyyy-MM-dd") : "",
    b.guests,
    b.children,
    b.experiences ?? "",
    b.specialReqs ?? "",
    b.status,
    b.totalAmount,
    b.currency ?? "MAD",
    format(new Date(b.createdAt), "yyyy-MM-dd HH:mm"),
  ]);
  return [headers, ...rows].map((row) => row.map(csvField).join(",")).join("\n");
}

function TableSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 dark:border-white/5">
          <td className="px-5 py-4">
            <div className="h-4 w-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
          </td>
          <td className="px-5 py-4">
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-32 mb-1.5" />
            <div className="h-3 bg-gray-100 dark:bg-white/5 rounded animate-pulse w-44" />
          </td>
          <td className="px-5 py-4">
            <div className="h-5 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse w-16 mb-1.5" />
            <div className="h-3 bg-gray-100 dark:bg-white/5 rounded animate-pulse w-24" />
          </td>
          <td className="px-5 py-4">
            <div className="h-3 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-20 mb-1.5" />
            <div className="h-3 bg-gray-100 dark:bg-white/5 rounded animate-pulse w-20" />
          </td>
          <td className="px-5 py-4">
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-12" />
          </td>
          <td className="px-5 py-4">
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-24" />
          </td>
          <td className="px-5 py-4">
            <div className="h-8 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse w-28" />
          </td>
          <td className="px-5 py-4">
            <div className="h-7 w-7 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default function ReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<ReservationGroup | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const selectAllRef = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<"table" | "calendar">("table");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  async function load() {
    const res = await fetch("/api/admin/bookings");
    if (res.ok) setBookings(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(group: ReservationGroup, status: string) {
    await Promise.all(
      group.items.map((b) =>
        fetch(`/api/admin/bookings/${b.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })
      )
    );
    await load();
    setSelected((prev) =>
      prev && prev.id === group.id
        ? { ...prev, items: prev.items.map((b) => ({ ...b, status })) }
        : prev
    );
  }

  async function handleDelete(group: ReservationGroup) {
    const label = group.items.length > 1 ? `cette réservation (${group.items.length} prestations)` : "cette réservation";
    if (!confirm(`Supprimer ${label} ? Cette action est irréversible.`)) return;
    const ids = new Set(group.items.map((b) => b.id));
    await Promise.all([...ids].map((id) => fetch(`/api/admin/bookings/${id}`, { method: "DELETE" })));
    setBookings((prev) => prev.filter((b) => !ids.has(b.id)));
    setSelected((prev) => (prev && prev.id === group.id ? null : prev));
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const groups = groupBookings(filtered);

  const allFilteredSelected = groups.length > 0 && groups.every((g) => selectedIds.has(g.id));
  const someFilteredSelected = groups.some((g) => selectedIds.has(g.id));

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someFilteredSelected && !allFilteredSelected;
    }
  }, [someFilteredSelected, allFilteredSelected]);

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllFiltered() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        groups.forEach((g) => next.delete(g.id));
      } else {
        groups.forEach((g) => next.add(g.id));
      }
      return next;
    });
  }

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(calendarMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(calendarMonth), { weekStartsOn: 1 }),
  });

  const calendarEntries = filtered.flatMap(bookingCalendarEntries);

  function entriesForDay(day: Date): CalendarEntry[] {
    return calendarEntries.filter((e) => isSameDay(e.date, day));
  }

  function exportSelected() {
    const toExport = bookings.filter((b) => selectedIds.has(b.reservation?.id ?? b.id));
    if (toExport.length === 0) return;
    const csv = bookingsToCsv(toExport);
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservations-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Réservations</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-white/5">
            <button
              onClick={() => setView("table")}
              aria-pressed={view === "table"}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                view === "table"
                  ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              Table
            </button>
            <button
              onClick={() => setView("calendar")}
              aria-pressed={view === "calendar"}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                view === "calendar"
                  ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Calendrier
            </button>
          </div>
          {["all", ...statusOptions].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-widest transition-colors ${
                filter === s
                  ? "bg-amber-500 text-white font-semibold"
                  : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {s === "all" ? "Tous" : s}
            </button>
          ))}
          <button
            onClick={exportSelected}
            disabled={selectedIds.size === 0}
            className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs uppercase tracking-widest bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:hover:bg-amber-500 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Exporter{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
          </button>
        </div>
      </div>

      {view === "calendar" && (
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
                  className={`min-h-[100px] p-1.5 border-b border-r border-gray-100 dark:border-white/5 ${
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
                          const g = groups.find((grp) => grp.items.some((i) => i.id === entry.booking.id));
                          if (g) setSelected(g);
                        }}
                        title={`${entry.booking.firstName} ${entry.booking.lastName} — ${entry.label}`}
                        className={`w-full text-left truncate px-1.5 py-0.5 rounded text-[11px] border cursor-pointer ${statusColors[entry.booking.status] ?? "border-gray-200 dark:border-white/20 text-gray-500 dark:text-white/60"}`}
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
      )}

      {view === "table" && (
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-transparent text-xs uppercase tracking-widest text-gray-400">
              <th className="px-5 py-3.5 w-10">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleAllFiltered}
                  aria-label="Tout sélectionner"
                  className="w-4 h-4 rounded border-gray-300 dark:border-white/20 text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
              </th>
              <th className="text-left px-5 py-3.5">Client</th>
              <th className="text-left px-5 py-3.5">Service</th>
              <th className="text-left px-5 py-3.5">Date(s)</th>
              <th className="text-left px-5 py-3.5">Pers.</th>
              <th className="text-left px-5 py-3.5">Montant</th>
              <th className="text-left px-5 py-3.5">Statut</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          {loading ? (
            <TableSkeleton />
          ) : (
            <tbody>
              {groups.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-gray-400">Aucune réservation</td></tr>
              )}
              {groups.map((g) => {
                const primary = g.items[0];
                const allSameStatus = g.items.every((b) => b.status === primary.status);
                return (
                  <tr
                    key={g.id}
                    onClick={() => setSelected(g)}
                    className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(g.id)}
                        onChange={() => toggleOne(g.id)}
                        aria-label={`Sélectionner la réservation de ${primary.firstName} ${primary.lastName}`}
                        className="w-4 h-4 rounded border-gray-300 dark:border-white/20 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-gray-900 dark:text-white flex items-center gap-1.5">
                        {primary.firstName} {primary.lastName}
                        {g.items.length > 1 && (
                          <span
                            title={`Réservation de ${g.items.length} prestations — total ${groupTotalAmount(g).toLocaleString("fr-FR")} ${primary.currency}`}
                            className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                          >
                            {g.items.length} prestations
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">{primary.email}</p>
                      {primary.phone && <p className="text-xs text-gray-400">{primary.phone}</p>}
                    </td>
                    <td className="px-5 py-4 space-y-1">
                      {g.items.map((b) => (
                        <div key={b.id}>
                          <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-0.5 ${serviceTypeBadge[b.serviceType] ?? "bg-gray-100 text-gray-600"}`}>
                            {serviceTypeLabel[b.serviceType] ?? b.serviceType}
                          </span>
                          <p className="text-gray-600 dark:text-white/70 text-xs">{getServiceName(b)}</p>
                        </div>
                      ))}
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-white/70 text-xs space-y-1.5">
                      {g.items.map((b) => <div key={b.id}>{formatDateCell(b)}</div>)}
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-white/70">
                      <span>{primary.guests} adulte{primary.guests > 1 ? "s" : ""}</span>
                      {primary.children > 0 && (
                        <span className="block text-xs text-gray-400">{primary.children} enfant{primary.children > 1 ? "s" : ""}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-amber-600 dark:text-amber-400">{groupTotalAmount(g).toLocaleString("fr-FR")} {primary.currency ?? "MAD"}</td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={allSameStatus ? primary.status : ""}
                        onChange={(e) => updateStatus(g, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${statusColors[primary.status] ?? "border-gray-200 dark:border-white/20 text-gray-500 dark:text-white/60"}`}
                      >
                        {!allSameStatus && <option value="">Mixte</option>}
                        {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(g)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-300 dark:text-white/20 hover:text-red-500 transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
      )}

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-xl">
          {selected && (() => {
            const primary = selected.items[0];
            const allSameStatus = selected.items.every((b) => b.status === primary.status);
            return (
              <>
                <DialogHeader>
                  <DialogTitle>{primary.firstName} {primary.lastName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Email</p>
                      <p className="text-gray-900 dark:text-white break-all">{primary.email}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Téléphone</p>
                      <p className="text-gray-900 dark:text-white">{primary.phone || "—"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                      Prestations{selected.items.length > 1 ? ` (${selected.items.length})` : ""}
                    </p>
                    <div className="space-y-2">
                      {selected.items.map((b) => (
                        <div key={b.id} className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2.5 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-1 ${serviceTypeBadge[b.serviceType] ?? "bg-gray-100 text-gray-600"}`}>
                              {serviceTypeLabel[b.serviceType] ?? b.serviceType}
                            </span>
                            <p className="text-gray-900 dark:text-white text-xs truncate">{getServiceName(b)}</p>
                            <p className="text-gray-500 dark:text-white/50 text-xs">{formatDateCell(b)}</p>
                            <p className="text-gray-500 dark:text-white/50 text-xs">
                              {b.guests} adulte{b.guests > 1 ? "s" : ""}
                              {b.children > 0 && `, ${b.children} enfant${b.children > 1 ? "s" : ""}`}
                            </p>
                          </div>
                          <span className="text-amber-600 dark:text-amber-400 text-xs shrink-0">{b.totalAmount.toLocaleString("fr-FR")} {b.currency ?? "MAD"}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Montant total</p>
                      <p className="text-amber-600 dark:text-amber-400 font-medium">{groupTotalAmount(selected).toLocaleString("fr-FR")} {primary.currency ?? "MAD"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Reçue le</p>
                      <p className="text-gray-900 dark:text-white text-xs">{format(new Date(primary.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}</p>
                    </div>
                  </div>

                  {primary.experiences && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Expériences</p>
                      <p className="text-gray-900 dark:text-white">{primary.experiences}</p>
                    </div>
                  )}

                  {primary.specialReqs && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Demandes spéciales</p>
                      <p className="text-gray-900 dark:text-white">{primary.specialReqs}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Statut</p>
                    <select
                      value={allSameStatus ? primary.status : ""}
                      onChange={(e) => updateStatus(selected, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${statusColors[primary.status] ?? "border-gray-200 dark:border-white/20 text-gray-500 dark:text-white/60"}`}
                    >
                      {!allSameStatus && <option value="">Mixte</option>}
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
