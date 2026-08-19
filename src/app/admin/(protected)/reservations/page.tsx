"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2 } from "lucide-react";
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
  guests: number;
  children: number;
  experiences?: string | null;
  specialReqs?: string | null;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
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
  if (b.serviceType === "suite") return b.suite?.name ?? "—";
  if (b.serviceType === "activity") return b.activity?.name ?? "—";
  if (b.serviceType === "daypass") return b.dayPass?.name ?? "—";
  return "—";
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

function TableSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 dark:border-white/5">
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
  const [selected, setSelected] = useState<Booking | null>(null);

  async function load() {
    const res = await fetch("/api/admin/bookings");
    if (res.ok) setBookings(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette réservation ? Cette action est irréversible.")) return;
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setSelected((prev) => (prev && prev.id === id ? null : prev));
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Réservations</h1>
        <div className="flex gap-2">
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
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-transparent text-xs uppercase tracking-widest text-gray-400">
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
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">Aucune réservation</td></tr>
              )}
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => setSelected(b)}
                  className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <p className="text-gray-900 dark:text-white">{b.firstName} {b.lastName}</p>
                    <p className="text-xs text-gray-400">{b.email}</p>
                    {b.phone && <p className="text-xs text-gray-400">{b.phone}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-1 ${serviceTypeBadge[b.serviceType] ?? "bg-gray-100 text-gray-600"}`}>
                      {serviceTypeLabel[b.serviceType] ?? b.serviceType}
                    </span>
                    <p className="text-gray-600 dark:text-white/70 text-xs">{getServiceName(b)}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-white/70 text-xs">
                    {formatDateCell(b)}
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-white/70">
                    <span>{b.guests} adulte{b.guests > 1 ? "s" : ""}</span>
                    {b.children > 0 && (
                      <span className="block text-xs text-gray-400">{b.children} enfant{b.children > 1 ? "s" : ""}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-amber-600 dark:text-amber-400">{b.totalAmount.toLocaleString("fr-FR")} {b.currency ?? "MAD"}</td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${statusColors[b.status] ?? "border-gray-200 dark:border-white/20 text-gray-500 dark:text-white/60"}`}
                    >
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-300 dark:text-white/20 hover:text-red-500 transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.firstName} {selected.lastName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Email</p>
                    <p className="text-gray-900 dark:text-white break-all">{selected.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Téléphone</p>
                    <p className="text-gray-900 dark:text-white">{selected.phone || "—"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Service</p>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${serviceTypeBadge[selected.serviceType] ?? "bg-gray-100 text-gray-600"}`}>
                      {serviceTypeLabel[selected.serviceType] ?? selected.serviceType}
                    </span>
                    <p className="text-gray-600 dark:text-white/70 text-xs mt-1">{getServiceName(selected)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Date(s)</p>
                    <p className="text-gray-900 dark:text-white text-xs">{formatDateCell(selected)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Personnes</p>
                    <p className="text-gray-900 dark:text-white">
                      {selected.guests} adulte{selected.guests > 1 ? "s" : ""}
                      {selected.children > 0 && `, ${selected.children} enfant${selected.children > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Montant</p>
                    <p className="text-amber-600 dark:text-amber-400">{selected.totalAmount.toLocaleString("fr-FR")} {selected.currency ?? "MAD"}</p>
                  </div>
                </div>

                {selected.experiences && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Expériences</p>
                    <p className="text-gray-900 dark:text-white">{selected.experiences}</p>
                  </div>
                )}

                {selected.specialReqs && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Demandes spéciales</p>
                    <p className="text-gray-900 dark:text-white">{selected.specialReqs}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Statut</p>
                    <select
                      value={selected.status}
                      onChange={(e) => updateStatus(selected.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${statusColors[selected.status] ?? "border-gray-200 dark:border-white/20 text-gray-500 dark:text-white/60"}`}
                    >
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Reçue le</p>
                    <p className="text-gray-900 dark:text-white text-xs">{format(new Date(selected.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
