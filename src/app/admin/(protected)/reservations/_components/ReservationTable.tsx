"use client";

import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ReservationGroup,
  statusOptions,
  statusColors,
  serviceTypeLabel,
  serviceTypeBadge,
  getServiceName,
  formatDateCellText,
  groupTotalAmount,
  groupChannel,
  groupNearestDate,
} from "../_lib/reservation-utils";
import { ChannelBadge } from "./ChannelBadge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function TableSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 dark:border-white/5">
          <td className="px-5 py-4"><div className="h-4 w-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /></td>
          <td className="px-5 py-4">
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-32 mb-1.5" />
            <div className="h-3 bg-gray-100 dark:bg-white/5 rounded animate-pulse w-44" />
          </td>
          <td className="px-5 py-4"><div className="h-3 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-24" /></td>
          <td className="px-5 py-4"><div className="h-3 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-20" /></td>
          <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-12" /></td>
          <td className="px-5 py-4"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-24" /></td>
          <td className="px-5 py-4"><div className="h-8 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse w-28" /></td>
          <td className="px-5 py-4"><div className="h-7 w-7 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" /></td>
        </tr>
      ))}
    </tbody>
  );
}

interface ReservationTableProps {
  groups: ReservationGroup[];
  loading: boolean;
  selectedIds: Set<string>;
  savingIds: Set<string>;
  onToggleOne: (id: string) => void;
  onToggleAll: () => void;
  allSelected: boolean;
  someSelected: boolean;
  onRowClick: (g: ReservationGroup) => void;
  onStatusChange: (g: ReservationGroup, status: string) => void;
  onDelete: (g: ReservationGroup) => void;
}

export function ReservationTable({
  groups,
  loading,
  selectedIds,
  savingIds,
  onToggleOne,
  onToggleAll,
  allSelected,
  someSelected,
  onRowClick,
  onStatusChange,
  onDelete,
}: ReservationTableProps) {
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-transparent text-xs uppercase tracking-widest text-gray-400">
            <th className="px-5 py-3.5 w-10">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allSelected}
                onChange={onToggleAll}
                aria-label="Tout sélectionner"
                className="w-4 h-4 rounded border-gray-300 dark:border-white/20 text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
            </th>
            <th className="text-left px-5 py-3.5">Client</th>
            <th className="text-left px-5 py-3.5">Service</th>
            <th className="text-left px-5 py-3.5">Date</th>
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
              const nearestDate = groupNearestDate(g);
              const extraCount = g.items.length - 1;
              const isSaving = savingIds.has(g.id);
              return (
                <tr
                  key={g.id}
                  onClick={() => onRowClick(g)}
                  className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(g.id)}
                      onChange={() => onToggleOne(g.id)}
                      aria-label={`Sélectionner la réservation de ${primary.firstName} ${primary.lastName}`}
                      className="w-4 h-4 rounded border-gray-300 dark:border-white/20 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-4 max-w-[220px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-gray-900 dark:text-white truncate">{primary.firstName} {primary.lastName}</p>
                      {g.items.length > 1 && (
                        <span
                          title={`Réservation de ${g.items.length} prestations — total ${groupTotalAmount(g).toLocaleString("fr-FR")} ${primary.currency}`}
                          className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium shrink-0"
                        >
                          {g.items.length} prestations
                        </span>
                      )}
                      <ChannelBadge channel={groupChannel(g)} />
                    </div>
                    <p className="text-xs text-gray-400 truncate">{primary.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-1 ${serviceTypeBadge[primary.serviceType] ?? "bg-gray-100 text-gray-600"}`}>
                      {serviceTypeLabel[primary.serviceType] ?? primary.serviceType}
                    </span>
                    <p className="text-gray-600 dark:text-white/70 text-xs truncate max-w-[160px]">
                      {getServiceName(primary)}
                      {extraCount > 0 && <span className="text-gray-400"> +{extraCount} autre{extraCount > 1 ? "s" : ""}</span>}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-white/70 text-xs">
                    {nearestDate ? format(nearestDate, "d MMM yyyy", { locale: fr }) : formatDateCellText(primary)}
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-white/70">
                    <span>{primary.guests} adulte{primary.guests > 1 ? "s" : ""}</span>
                    {primary.children > 0 && (
                      <span className="block text-xs text-gray-400">{primary.children} enfant{primary.children > 1 ? "s" : ""}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-amber-600 dark:text-amber-400">{groupTotalAmount(g).toLocaleString("fr-FR")} {primary.currency ?? "MAD"}</td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={allSameStatus ? primary.status : "mixed"}
                      onValueChange={(v) => onStatusChange(g, v)}
                      disabled={isSaving}
                    >
                      <SelectTrigger
                        size="sm"
                        className={`text-xs w-[120px] border ${statusColors[primary.status] ?? "border-gray-200 dark:border-white/20 text-gray-500 dark:text-white/60"} disabled:opacity-50 disabled:cursor-wait`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {!allSameStatus && <SelectItem value="mixed" disabled>Mixte</SelectItem>}
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isSaving && <p className="text-[10px] text-gray-400 mt-1">Mise à jour…</p>}
                  </td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onDelete(g)}
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
  );
}
