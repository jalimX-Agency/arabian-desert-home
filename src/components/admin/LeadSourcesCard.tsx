"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone, FileText } from "lucide-react";

interface Stats {
  days: number;
  counts: Record<string, Record<string, number>>;
  requests: Record<string, number>;
}

const SOURCES: { key: string; label: string }[] = [
  { key: "ads", label: "Google Ads" },
  { key: "organic", label: "Recherche Google (gratuit)" },
  { key: "ai", label: "ChatGPT / assistants IA" },
  { key: "social", label: "Réseaux sociaux" },
  { key: "direct", label: "Direct" },
  { key: "other", label: "Autres sites" },
];

const PERIODS = [7, 30, 90];

/**
 * Requests by where the visitor came from. Counted by the site itself, with no cookie, so
 * it includes visitors who refused or ignored the cookie banner (Google Analytics and
 * Google Ads cannot see them).
 */
export function LeadSourcesCard() {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let live = true;
    fetch(`/api/admin/lead-stats?days=${days}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live) setStats(d); })
      .catch(() => {});
    return () => { live = false; };
  }, [days]);

  const rows = SOURCES.map((s) => {
    const c = stats?.counts[s.key] ?? {};
    const whatsapp = c.whatsapp ?? 0, phone = c.phone ?? 0, form = c.form ?? 0;
    return { ...s, whatsapp, phone, form, total: whatsapp + phone + form };
  });
  const total = rows.reduce((n, r) => n + r.total, 0);

  return (
    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Demandes par source</h2>
          <p className="text-xs text-gray-400">Clics WhatsApp, appels et demandes de réservation, comptés sans cookie</p>
        </div>
        <div className="flex gap-1.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setDays(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                days === p ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/15"
              }`}
            >
              {p} j
            </button>
          ))}
        </div>
      </div>

      {!stats ? (
        <div className="p-5"><div className="h-24 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse" /></div>
      ) : total === 0 ? (
        <p className="px-5 py-8 text-sm text-gray-400 text-center">
          Aucune demande comptée sur {days} jours. Le comptage a démarré avec cette mise à jour : les premières demandes apparaîtront ici.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-white/10">
                <th className="text-left font-medium px-5 py-2.5">Source</th>
                <th className="font-medium px-3 py-2.5"><span className="inline-flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />WhatsApp</span></th>
                <th className="font-medium px-3 py-2.5"><span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" />Appels</span></th>
                <th className="font-medium px-3 py-2.5"><span className="inline-flex items-center gap-1"><FileText className="w-3.5 h-3.5" />Formulaire</span></th>
                <th className="font-medium px-5 py-2.5">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {rows.map((r) => (
                <tr key={r.key} className={r.key === "ads" ? "bg-amber-50/60 dark:bg-amber-500/5" : ""}>
                  <td className="px-5 py-2.5 text-gray-900 dark:text-white">{r.label}</td>
                  <td className="px-3 py-2.5 text-center tabular-nums">{r.whatsapp}</td>
                  <td className="px-3 py-2.5 text-center tabular-nums">{r.phone}</td>
                  <td className="px-3 py-2.5 text-center tabular-nums">{r.form}</td>
                  <td className="px-5 py-2.5 text-center font-semibold tabular-nums text-amber-600 dark:text-amber-400">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
