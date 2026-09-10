"use client";

import { Search, Table2, CalendarDays, Download, Plus, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  statusOptions,
  serviceTypeOptions,
  serviceTypeLabel,
  CHANNELS,
  channelLabel,
} from "../_lib/reservation-utils";

interface ReservationToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (v: string) => void;
  channelFilter: string;
  onChannelFilterChange: (v: string) => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  view: "table" | "calendar";
  onViewChange: (v: "table" | "calendar") => void;
  selectedCount: number;
  onExportSelected: () => void;
  onExportAllFiltered: () => void;
  onNewReservation: () => void;
}

export function ReservationToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  serviceFilter,
  onServiceFilterChange,
  channelFilter,
  onChannelFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  view,
  onViewChange,
  selectedCount,
  onExportSelected,
  onExportAllFiltered,
  onNewReservation,
}: ReservationToolbarProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Réservations</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-white/5">
            <button
              onClick={() => onViewChange("table")}
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
              onClick={() => onViewChange("calendar")}
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs uppercase tracking-widest cursor-pointer">
                <Download className="w-3.5 h-3.5" />
                Exporter
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExportAllFiltered} className="cursor-pointer">
                Exporter tout (filtré)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onExportSelected}
                disabled={selectedCount === 0}
                className="cursor-pointer"
              >
                Exporter la sélection{selectedCount > 0 ? ` (${selectedCount})` : ""}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={onNewReservation} size="sm" className="text-xs uppercase tracking-widest cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            Nouvelle réservation
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
            placeholder="Rechercher (nom, email, téléphone)"
            className="pl-8 pr-3 py-1.5 rounded-lg text-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 w-64"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger size="sm" className="text-xs w-36 bg-white dark:bg-white/5">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={serviceFilter} onValueChange={onServiceFilterChange}>
          <SelectTrigger size="sm" className="text-xs w-36 bg-white dark:bg-white/5">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les services</SelectItem>
            {serviceTypeOptions.map((s) => (
              <SelectItem key={s} value={s}>{serviceTypeLabel[s] ?? s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={channelFilter} onValueChange={onChannelFilterChange}>
          <SelectTrigger size="sm" className="text-xs w-36 bg-white dark:bg-white/5">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les canaux</SelectItem>
            {CHANNELS.map((c) => (
              <SelectItem key={c} value={c}>{channelLabel[c]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="px-2 py-1.5 rounded-lg text-xs bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
          <span>→</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="px-2 py-1.5 rounded-lg text-xs bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
        </div>
      </div>
    </div>
  );
}
