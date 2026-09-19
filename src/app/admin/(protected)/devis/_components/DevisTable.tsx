"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, FileText } from "lucide-react";
import { ChannelBadge } from "../../reservations/_components/ChannelBadge";
import {
  devisClientName, devisStatusColors, devisStatusLabel, effectiveStatus, isExpired, type Devis,
} from "../_lib/devis-utils";

interface DevisTableProps {
  rows: Devis[];
  loading: boolean;
  onRowClick: (devis: Devis) => void;
}

export function DevisTable({ rows, loading, onRowClick }: DevisTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
        <FileText className="w-6 h-6" />
        <p className="text-sm">Aucun devis</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-white/[0.02]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-[11px] uppercase tracking-widest text-gray-400">
              <th className="text-left font-medium px-4 py-3">Référence</th>
              <th className="text-left font-medium px-4 py-3">Client</th>
              <th className="text-left font-medium px-4 py-3">Objet</th>
              <th className="text-left font-medium px-4 py-3">Créé le</th>
              <th className="text-left font-medium px-4 py-3">Valable jusqu&apos;au</th>
              <th className="text-center font-medium px-4 py-3">Lignes</th>
              <th className="text-right font-medium px-4 py-3">Montant</th>
              <th className="text-left font-medium px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => {
              const status = effectiveStatus(d);
              const expired = isExpired(d);
              return (
                <tr
                  key={d.id}
                  onClick={() => onRowClick(d)}
                  className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.03] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-amber-600 dark:text-amber-400 whitespace-nowrap">{d.reference}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">{devisClientName(d)}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      {d.company ? `${d.company} · ` : ""}{d.email}
                      <ChannelBadge channel={d.channel} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-white/60 max-w-[220px] truncate">{d.title ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-white/60 whitespace-nowrap">
                    {format(new Date(d.createdAt), "d MMM yyyy", { locale: fr })}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap ${expired ? "text-red-500" : "text-gray-500 dark:text-white/60"}`}>
                    {format(new Date(d.validUntil), "d MMM yyyy", { locale: fr })}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500 dark:text-white/60">{d.items.length}</td>
                  <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
                    {d.totalAmount.toLocaleString("fr-FR")} {d.currency}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full border uppercase tracking-widest ${devisStatusColors[status]}`}>
                      {devisStatusLabel[status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
