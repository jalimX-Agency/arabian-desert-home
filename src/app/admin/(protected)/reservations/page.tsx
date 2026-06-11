"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  suite: { name: string };
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  totalAmount: number;
  createdAt: string;
}

const statusOptions = ["pending", "confirmed", "cancelled"];
const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function ReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Réservations</h1>
        <div className="flex gap-2">
          {["all", ...statusOptions].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-widest transition-colors ${
                filter === s ? "bg-amber-500 text-black font-semibold" : "bg-white/5 text-white/40 hover:text-white"
              }`}
            >
              {s === "all" ? "Tous" : s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-white/30">Chargement…</p>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-white/40">
                <th className="text-left px-5 py-3.5">Client</th>
                <th className="text-left px-5 py-3.5">Hébergement</th>
                <th className="text-left px-5 py-3.5">Dates</th>
                <th className="text-left px-5 py-3.5">Pers.</th>
                <th className="text-left px-5 py-3.5">Montant</th>
                <th className="text-left px-5 py-3.5">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-white/30">Aucune réservation</td></tr>
              )}
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-white">{b.firstName} {b.lastName}</p>
                    <p className="text-xs text-white/40">{b.email}</p>
                  </td>
                  <td className="px-5 py-4 text-white/70">{b.suite.name}</td>
                  <td className="px-5 py-4 text-white/70 text-xs">
                    {format(new Date(b.checkIn), "d MMM yyyy", { locale: fr })}
                    <br />
                    {format(new Date(b.checkOut), "d MMM yyyy", { locale: fr })}
                  </td>
                  <td className="px-5 py-4 text-white/70">{b.guests}</td>
                  <td className="px-5 py-4 text-amber-400">{b.totalAmount} MAD</td>
                  <td className="px-5 py-4">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${statusColors[b.status] ?? "border-white/20 text-white/60"}`}
                    >
                      {statusOptions.map((s) => <option key={s} value={s} className="bg-[#161616] text-white">{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
