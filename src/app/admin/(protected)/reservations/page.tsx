"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Booking,
  ReservationGroup,
  groupBookings,
  earliestDate,
  bookingsToCsv,
} from "./_lib/reservation-utils";
import { ReservationToolbar } from "./_components/ReservationToolbar";
import { ReservationTable } from "./_components/ReservationTable";
import { ReservationCalendar } from "./_components/ReservationCalendar";
import { ReservationDetailSheet } from "./_components/ReservationDetailSheet";
import { NewReservationDialog } from "./_components/NewReservationDialog";
import { ConfirmDialog } from "./_components/ConfirmDialog";

export default function ReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [view, setView] = useState<"table" | "calendar">("table");

  const [selected, setSelected] = useState<ReservationGroup | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ReservationGroup | null>(null);

  async function load() {
    const res = await fetch("/api/admin/bookings");
    if (res.ok) setBookings(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(group: ReservationGroup, status: string) {
    setSavingIds((prev) => new Set(prev).add(group.id));
    try {
      await fetch(`/api/admin/reservations/${group.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await load();
      setSelected((prev) =>
        prev && prev.id === group.id
          ? { ...prev, items: prev.items.map((b) => ({ ...b, status })) }
          : prev
      );
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(group.id);
        return next;
      });
    }
  }

  async function confirmDelete(group: ReservationGroup) {
    const ids = new Set(group.items.map((b) => b.id));
    await Promise.all([...ids].map((id) => fetch(`/api/admin/bookings/${id}`, { method: "DELETE" })));
    setBookings((prev) => prev.filter((b) => !ids.has(b.id)));
    setSelected((prev) => (prev && prev.id === group.id ? null : prev));
  }

  // ── Filtering ──────────────────────────────────────────────────────────
  const searchLower = search.trim().toLowerCase();
  const filtered = bookings.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (serviceFilter !== "all" && b.serviceType !== serviceFilter) return false;
    if (channelFilter !== "all" && (b.reservation?.channel ?? "website") !== channelFilter) return false;
    if (searchLower) {
      const haystack = `${b.firstName} ${b.lastName} ${b.email} ${b.phone ?? ""}`.toLowerCase();
      if (!haystack.includes(searchLower)) return false;
    }
    if (dateFrom || dateTo) {
      const d = earliestDate(b);
      if (!d) return false;
      if (dateFrom && d < new Date(dateFrom)) return false;
      if (dateTo && d > new Date(dateTo + "T23:59:59")) return false;
    }
    return true;
  });

  const groups = groupBookings(filtered);

  const allFilteredSelected = groups.length > 0 && groups.every((g) => selectedIds.has(g.id));
  const someFilteredSelected = groups.some((g) => selectedIds.has(g.id));

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
      if (allFilteredSelected) groups.forEach((g) => next.delete(g.id));
      else groups.forEach((g) => next.add(g.id));
      return next;
    });
  }

  function downloadCsv(rows: Booking[]) {
    if (rows.length === 0) return;
    const csv = bookingsToCsv(rows);
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
      <ReservationToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        serviceFilter={serviceFilter}
        onServiceFilterChange={setServiceFilter}
        channelFilter={channelFilter}
        onChannelFilterChange={setChannelFilter}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        view={view}
        onViewChange={setView}
        selectedCount={selectedIds.size}
        onExportSelected={() => downloadCsv(bookings.filter((b) => selectedIds.has(b.reservation?.id ?? b.id)))}
        onExportAllFiltered={() => downloadCsv(filtered)}
        onNewReservation={() => setNewDialogOpen(true)}
      />

      {view === "calendar" ? (
        <ReservationCalendar bookings={filtered} groups={groups} onSelect={setSelected} />
      ) : (
        <ReservationTable
          groups={groups}
          loading={loading}
          selectedIds={selectedIds}
          savingIds={savingIds}
          onToggleOne={toggleOne}
          onToggleAll={toggleAllFiltered}
          allSelected={allFilteredSelected}
          someSelected={someFilteredSelected}
          onRowClick={setSelected}
          onStatusChange={updateStatus}
          onDelete={setDeleteTarget}
        />
      )}

      <ReservationDetailSheet
        group={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onStatusChange={updateStatus}
        onSaved={load}
        statusSaving={selected ? savingIds.has(selected.id) : false}
      />

      <NewReservationDialog
        open={newDialogOpen}
        onOpenChange={setNewDialogOpen}
        onCreated={load}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Supprimer cette réservation ?"
        description={
          deleteTarget && deleteTarget.items.length > 1
            ? `Cette réservation contient ${deleteTarget.items.length} prestations. Cette action est irréversible.`
            : "Cette action est irréversible."
        }
        confirmLabel="Supprimer"
        destructive
        onConfirm={() => {
          if (deleteTarget) confirmDelete(deleteTarget);
        }}
      />
    </div>
  );
}
