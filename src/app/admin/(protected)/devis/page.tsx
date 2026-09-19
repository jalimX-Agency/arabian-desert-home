"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { DevisToolbar } from "./_components/DevisToolbar";
import { DevisTable } from "./_components/DevisTable";
import { DevisSheet } from "./_components/DevisSheet";
import {
  devisToCsv, effectiveStatus, summarizeDevis, type Devis,
} from "./_lib/devis-utils";

export default function DevisPage() {
  const [rows, setRows] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<Devis | null>(null);
  const [creating, setCreating] = useState(false);

  async function load(): Promise<Devis[]> {
    const res = await fetch("/api/admin/devis");
    const data: Devis[] = res.ok ? await res.json() : [];
    if (res.ok) setRows(data);
    setLoading(false);
    return data;
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((d) => {
      if (q) {
        const haystack = [d.reference, d.firstName, d.lastName, d.email, d.phone, d.company ?? "", d.title ?? ""]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (statusFilter !== "all" && effectiveStatus(d) !== statusFilter) return false;
      const created = new Date(d.createdAt);
      if (dateFrom && created < new Date(dateFrom)) return false;
      if (dateTo && created > new Date(`${dateTo}T23:59:59`)) return false;
      return true;
    });
  }, [rows, search, statusFilter, dateFrom, dateTo]);

  const summary = useMemo(() => summarizeDevis(filtered), [filtered]);

  function exportCsv() {
    if (filtered.length === 0) return;
    const blob = new Blob(["﻿" + devisToCsv(filtered)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devis-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleSaved() {
    // Use the rows just returned, not `rows` — that state hasn't re-rendered yet here.
    const fresh = await load();
    setSelected((current) => (current ? fresh.find((r) => r.id === current.id) ?? null : null));
  }

  const cards = [
    { label: "En attente de réponse", value: String(summary.pending) },
    { label: "Acceptés", value: String(summary.accepted) },
    { label: "Refusés", value: String(summary.refused) },
    { label: "Taux d'acceptation", value: `${summary.acceptanceRate}%` },
    {
      label: "Montant accepté",
      value: Object.keys(summary.acceptedAmounts).length
        ? Object.entries(summary.acceptedAmounts)
            .map(([cur, amount]) => `${amount.toLocaleString("fr-FR")} ${cur}`)
            .join(" · ")
        : "—",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <DevisToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onExportCsv={exportCsv}
        onNewDevis={() => setCreating(true)}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-4">
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">{c.label}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <DevisTable rows={filtered} loading={loading} onRowClick={setSelected} />

      <DevisSheet
        devis={selected}
        creating={creating}
        onOpenChange={(open) => {
          if (!open) { setSelected(null); setCreating(false); }
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}
