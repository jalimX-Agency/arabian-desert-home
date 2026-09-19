"use client";

import { Search, Download, Plus } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { devisStatusLabel, devisStatusOptions } from "../_lib/devis-utils";

interface DevisToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  onExportCsv: () => void;
  onNewDevis: () => void;
}

export function DevisToolbar({
  search, onSearchChange,
  statusFilter, onStatusFilterChange,
  dateFrom, onDateFromChange,
  dateTo, onDateToChange,
  onExportCsv, onNewDevis,
}: DevisToolbarProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Devis</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={onExportCsv} className="text-xs uppercase tracking-widest cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Exporter CSV
          </Button>
          <Button onClick={onNewDevis} size="sm" className="text-xs uppercase tracking-widest cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            Nouveau devis
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher (réf., nom, email, objet)"
            className="pl-8 pr-3 py-1.5 rounded-lg text-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 w-72"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger size="sm" className="text-xs w-40 bg-white dark:bg-white/5">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {devisStatusOptions.map((s) => (
              <SelectItem key={s} value={s}>{devisStatusLabel[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 uppercase tracking-widest">Créé du</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="px-2 py-1.5 rounded-lg text-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
          <span className="text-xs text-gray-400">au</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="px-2 py-1.5 rounded-lg text-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
        </div>
      </div>
    </div>
  );
}
