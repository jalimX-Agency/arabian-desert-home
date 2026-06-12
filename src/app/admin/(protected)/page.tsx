"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Mail, BedDouble, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  unreadMessages: number;
  totalMessages: number;
  totalSuites: number;
  totalActivities: number;
  recentBookings: {
    id: string; firstName: string; lastName: string;
    suite: { name: string }; checkIn: string; status: string; totalAmount: number;
  }[];
  recentMessages: {
    id: string; name: string; email: string; subject: string; createdAt: string; read: boolean;
  }[];
  error?: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  confirmed: "bg-green-500/10 text-green-600 dark:text-green-400",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) return (
    <div className="p-8 space-y-8">
      <div>
        <div className="h-7 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-52 mb-2" />
        <div className="h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse w-72" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-24" />
              <div className="h-4 w-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
            </div>
            <div className="h-9 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-16 mb-1" />
            <div className="h-3 bg-gray-100 dark:bg-white/5 rounded animate-pulse w-32" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10">
              <div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-40" />
            </div>
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-32 mb-1.5" />
                    <div className="h-3 bg-gray-100 dark:bg-white/5 rounded animate-pulse w-48" />
                  </div>
                  <div className="h-5 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse w-16 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const cards = [
    { label: "Réservations", value: stats.totalBookings, icon: CalendarCheck, sub: `${stats.pendingBookings} en attente` },
    { label: "Confirmées", value: stats.confirmedBookings, icon: CheckCircle, sub: "réservations confirmées" },
    { label: "Messages", value: stats.totalMessages, icon: Mail, sub: `${stats.unreadMessages} non lus` },
    { label: "Hébergements", value: stats.totalSuites, icon: BedDouble, sub: `${stats.totalActivities} activités` },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Tableau de bord</h1>
        <p className="text-sm text-gray-400">Bienvenue dans l&apos;espace administration</p>
      </div>

      {stats.error && (
        <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-sm px-4 py-3 rounded-xl">
          ⚠ {stats.error} — les données affichées peuvent être incomplètes.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 uppercase tracking-widest">{card.label}</span>
              <card.icon className="w-4 h-4 text-amber-500 dark:text-amber-400/60" />
            </div>
            <div className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">{card.value}</div>
            <div className="text-xs text-gray-400">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Dernières réservations</h2>
          </div>
          {stats.recentBookings.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">Aucune réservation</p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {stats.recentBookings.map((b) => (
                <div key={b.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white truncate">{b.firstName} {b.lastName}</p>
                    <p className="text-xs text-gray-400 truncate">{b.suite?.name ?? "—"} · {format(new Date(b.checkIn), "d MMM yyyy", { locale: fr })}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm text-amber-600 dark:text-amber-400">{b.totalAmount} MAD</span>
                    <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-widest ${statusColors[b.status] ?? "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/60"}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent messages */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Derniers messages</h2>
          </div>
          {stats.recentMessages.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">Aucun message</p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {stats.recentMessages.map((m) => (
                <div key={m.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex items-center gap-3">
                    {!m.read && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${m.read ? "text-gray-400 dark:text-white/60" : "text-gray-900 dark:text-white"}`}>{m.name}</p>
                      <p className="text-xs text-gray-400 truncate">{m.subject}</p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {m.read
                      ? <XCircle className="w-3.5 h-3.5 text-gray-300 dark:text-white/20" />
                      : <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400/60" />}
                    <span className="text-xs text-gray-400">{format(new Date(m.createdAt), "d MMM", { locale: fr })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
