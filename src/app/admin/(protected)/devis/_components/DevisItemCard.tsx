"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2, ChevronDown } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoneyInput } from "@/components/admin/MoneyInput";
import { formatMoney } from "@/lib/money";
import { childUnitPrice, nightsBetween } from "@/lib/devis-pricing";
import { serviceTypeOptions, serviceTypeLabel } from "../../reservations/_lib/reservation-utils";
import type { Catalog, ServiceType } from "../../reservations/_lib/item-types";
import {
  catalogEntryFor, catalogUnitPrice, hasCurrencyMismatch, type DevisPriceMode, type EditableDevisItem,
} from "../_lib/devis-item-types";

interface DevisItemCardProps {
  item: EditableDevisItem;
  catalog: Catalog;
  computedPrice: (item: EditableDevisItem) => number;
  onChange: (patch: Partial<EditableDevisItem>) => void;
  onRemove: () => void;
  /** New lines open ready to fill in; saved ones start folded to keep the list short. */
  defaultOpen?: boolean;
}

/** One-line recap shown while the card is collapsed. */
function summarise(item: EditableDevisItem, catalog: Catalog): { title: string; detail: string } {
  const fmt = (d: string) => format(new Date(d), "d MMM yyyy", { locale: fr });
  const people = `${item.guests} ad.${item.children > 0 ? ` + ${item.children} enf.` : ""}`;

  if (item.kind === "custom") {
    const parts = [
      item.date ? (item.checkOut ? `${fmt(item.date)} → ${fmt(item.checkOut)}` : fmt(item.date)) : "",
      item.guests > 0 || item.children > 0 ? people : "",
      item.quantity > 1 ? `${item.quantity} × ${formatMoney(item.unitPrice)}` : "",
    ];
    return { title: item.label.trim() || "Ligne libre", detail: parts.filter(Boolean).join(" · ") };
  }
  const name =
    item.serviceType === "suite" ? catalog.suites.find((s) => s.id === item.suiteId)?.name
    : item.serviceType === "activity" ? catalog.activities.find((a) => a.id === item.activityId)?.name
    : catalog.dayPasses.find((p) => p.id === item.dayPassId)?.name;

  const dates =
    item.serviceType === "suite"
      ? item.checkIn && item.checkOut ? `${fmt(item.checkIn)} → ${fmt(item.checkOut)}` : "dates à choisir"
      : item.date ? fmt(item.date) : "date à choisir";

  return {
    title: name ?? `${serviceTypeLabel[item.serviceType]} à choisir`,
    detail: `${dates} · ${people}${item.quantity > 1 ? ` · ×${item.quantity}` : ""}`,
  };
}

const plural = (n: number, word: string) => `${n} ${word}${n > 1 ? "s" : ""}`;

/** How the line total is built ("4 adultes × 950 + 1 enfant × 475"), so the admin can check it. */
function priceBreakdown(item: EditableDevisItem, catalog: Catalog): string | null {
  if (item.priceMode === "total") return null;
  const unit = item.priceMode === "unit" ? item.unitPrice : catalogUnitPrice(item, catalog);
  if (unit === null || unit <= 0) return null;
  const cur = item.currency;
  if (item.serviceType === "suite") {
    const nights = nightsBetween(item.checkIn, item.checkOut);
    if (nights === 0) return null;
    // Catalogue tents may mix seasonal rates across nights: only spell out a typed price.
    if (item.priceMode !== "unit") return plural(nights, "nuit");
    const tents = item.quantity > 1 ? ` × ${plural(item.quantity, "tente")}` : "";
    return `${plural(nights, "nuit")} × ${formatMoney(unit)} ${cur}${tents}`;
  }
  const entry = catalogEntryFor(item, catalog);
  const pct = entry && "childPricePercent" in entry ? entry.childPricePercent : 50;
  const parts = [`${plural(item.guests, "adulte")} × ${formatMoney(unit)}`];
  if (item.children > 0) parts.push(`${plural(item.children, "enfant")} × ${formatMoney(childUnitPrice(unit, pct))} (${pct} %)`);
  return `${parts.join(" + ")} ${cur}`;
}

export function DevisItemCard({ item, catalog, computedPrice, onChange, onRemove, defaultOpen = false }: DevisItemCardProps) {
  const isCustom = item.kind === "custom";
  const [open, setOpen] = useState(defaultOpen);
  const summary = summarise(item, catalog);
  const breakdown = isCustom ? null : priceBreakdown(item, catalog);
  const mismatch = !isCustom && hasCurrencyMismatch(item, catalog);
  const entry = catalogEntryFor(item, catalog);
  const catalogUnit = catalogUnitPrice(item, catalog);
  const unitWord = item.serviceType === "suite" ? "nuit" : "personne";
  const modes: { value: DevisPriceMode; label: string }[] = [
    { value: "catalog", label: "Catalogue" },
    { value: "unit", label: item.serviceType === "suite" ? "Par nuit" : "Par personne" },
    { value: "total", label: "Forfait" },
  ];

  function chooseMode(mode: DevisPriceMode) {
    if (mode === item.priceMode) return;
    if (mode === "unit") {
      // Start from the catalogue rate when it is in the quote's currency, else from what was typed.
      const start = item.unitPrice > 0 ? item.unitPrice : !mismatch && catalogUnit ? catalogUnit : 0;
      onChange({ priceMode: "unit", unitPrice: start });
    } else if (mode === "total") {
      onChange({ priceMode: "total", totalAmount: item.totalAmount });
    } else {
      onChange({ priceMode: "catalog", totalAmount: computedPrice({ ...item, priceMode: "catalog" }) });
    }
  }

  if (!open) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-3 px-3 py-2.5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex-1 min-w-0 flex items-center gap-3 text-left cursor-pointer"
          aria-expanded={false}
        >
          <ChevronDown className="w-4 h-4 shrink-0 text-gray-400 -rotate-90" />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-gray-900 dark:text-white truncate">{summary.title}</span>
            <span className="block text-xs text-gray-400 truncate">
              {isCustom ? "Ligne libre" : serviceTypeLabel[item.serviceType]}{summary.detail ? ` · ${summary.detail}` : ""}
            </span>
          </span>
        </button>
        <span className={`text-sm font-medium shrink-0 ${item.totalAmount < 0 ? "text-red-500" : "text-amber-600 dark:text-amber-400"}`}>
          {formatMoney(item.totalAmount)} {item.currency}
        </span>
        <button
          onClick={onRemove}
          title="Supprimer la ligne"
          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-300 dark:text-white/20 hover:text-red-500 transition-colors cursor-pointer shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-expanded
            aria-label="Replier la ligne"
            className="p-1 -ml-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-white/5">
            {(["catalog", "custom"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onChange({ kind: k, customPrice: k === "custom" ? false : item.customPrice })}
                aria-pressed={item.kind === k}
                className={`px-3 py-1 rounded-md text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                  item.kind === k
                    ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {k === "catalog" ? "Catalogue" : "Libre"}
              </button>
            ))}
          </div>
          {!isCustom && (
            <Select
              value={item.serviceType}
              onValueChange={(v) => onChange({ serviceType: v as ServiceType, suiteId: "", activityId: "", dayPassId: "" })}
            >
              <SelectTrigger size="sm" className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                {serviceTypeOptions.map((s) => <SelectItem key={s} value={s}>{serviceTypeLabel[s]}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
        <button
          onClick={onRemove}
          title="Supprimer la ligne"
          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-300 dark:text-white/20 hover:text-red-500 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {isCustom ? (
        <>
          <div>
            <Label className="text-xs text-gray-400 mb-1 block">Désignation *</Label>
            <Input
              value={item.label}
              onChange={(e) => onChange({ label: e.target.value })}
              placeholder="Transport privé, décoration, remise…"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400 mb-1 block">Description (facultatif)</Label>
            <Input
              value={item.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Détail affiché sous la désignation"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Quantité</Label>
              <Input type="number" min={1} value={item.quantity} onChange={(e) => onChange({ quantity: Math.max(1, Number(e.target.value)) })} />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Prix unitaire (négatif = remise)</Label>
              <MoneyInput allowNegative value={item.unitPrice} onChange={(v) => onChange({ unitPrice: v })} aria-label="Prix unitaire" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Date / du (facultatif)</Label>
              <Input type="date" value={item.date} onChange={(e) => onChange({ date: e.target.value, checkOut: e.target.value ? item.checkOut : "" })} />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Au (facultatif)</Label>
              <Input
                type="date"
                value={item.checkOut}
                min={item.date || undefined}
                disabled={!item.date}
                onChange={(e) => onChange({ checkOut: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Adultes (facultatif)</Label>
              <Input type="number" min={0} value={item.guests} onChange={(e) => onChange({ guests: Math.max(0, Number(e.target.value)) })} />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Enfants (facultatif)</Label>
              <Input type="number" min={0} value={item.children} onChange={(e) => onChange({ children: Math.max(0, Number(e.target.value)) })} />
            </div>
          </div>
        </>
      ) : (
        <>
          {item.serviceType === "suite" && (
            <>
              <Select value={item.suiteId} onValueChange={(v) => onChange({ suiteId: v })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Choisir une tente" /></SelectTrigger>
                <SelectContent>
                  {catalog.suites.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs text-gray-400 mb-1 block">Arrivée</Label>
                  <Input type="date" value={item.checkIn} onChange={(e) => onChange({ checkIn: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs text-gray-400 mb-1 block">Départ</Label>
                  <Input type="date" value={item.checkOut} onChange={(e) => onChange({ checkOut: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs text-gray-400 mb-1 block">Quantité</Label>
                  <Input type="number" min={1} value={item.quantity} onChange={(e) => onChange({ quantity: Math.max(1, Number(e.target.value)) })} />
                </div>
              </div>
            </>
          )}
          {item.serviceType === "activity" && (
            <>
              <Select value={item.activityId} onValueChange={(v) => onChange({ activityId: v })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Choisir une activité" /></SelectTrigger>
                <SelectContent>
                  {catalog.activities.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Date</Label>
                <Input type="date" value={item.date} onChange={(e) => onChange({ date: e.target.value })} />
              </div>
            </>
          )}
          {item.serviceType === "daypass" && (
            <>
              <Select value={item.dayPassId} onValueChange={(v) => onChange({ dayPassId: v })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Choisir un day pass" /></SelectTrigger>
                <SelectContent>
                  {catalog.dayPasses.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Date</Label>
                <Input type="date" value={item.date} onChange={(e) => onChange({ date: e.target.value })} />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Adultes</Label>
              <Input type="number" min={1} value={item.guests} onChange={(e) => onChange({ guests: Math.max(1, Number(e.target.value)) })} />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Enfants</Label>
              <Input type="number" min={0} value={item.children} onChange={(e) => onChange({ children: Math.max(0, Number(e.target.value)) })} />
            </div>
          </div>
        </>
      )}

      {isCustom ? (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
          <span className="text-xs text-gray-400">Total de la ligne</span>
          <span className="flex items-center gap-2">
            <span className={`font-medium ${item.totalAmount < 0 ? "text-red-500" : "text-amber-600 dark:text-amber-400"}`}>
              {formatMoney(item.totalAmount)}
            </span>
            <span className="text-xs text-gray-400">{item.currency}</span>
          </span>
        </div>
      ) : (
        <div className="pt-3 border-t border-gray-100 dark:border-white/5 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs text-gray-400">Prix</span>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-white/5" role="group" aria-label="Mode de prix">
              {modes.map((m) => {
                const disabled = m.value === "catalog" && mismatch;
                return (
                  <button
                    key={m.value}
                    type="button"
                    disabled={disabled}
                    onClick={() => chooseMode(m.value)}
                    aria-pressed={item.priceMode === m.value}
                    title={disabled ? `Le catalogue est en ${entry?.currency} : choisissez un prix en ${item.currency}` : undefined}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                      disabled ? "text-gray-300 dark:text-white/15 cursor-not-allowed"
                      : item.priceMode === m.value ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm cursor-pointer"
                      : "text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {mismatch && entry && (
            <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-lg px-2.5 py-1.5">
              Tarif catalogue en {entry.currency}
              {catalogUnit !== null ? ` (${formatMoney(catalogUnit)} ${entry.currency} / ${unitWord})` : ""} :
              saisissez le prix en {item.currency}.
            </p>
          )}

          {item.priceMode === "unit" && (
            <div className="flex items-center justify-between gap-2">
              <Label className="text-xs text-gray-500 dark:text-white/60">
                Prix par {unitWord}{item.serviceType !== "suite" ? " (adulte)" : ""} *
              </Label>
              <div className="flex items-center gap-2">
                <MoneyInput value={item.unitPrice} onChange={(v) => onChange({ unitPrice: v })} className="w-28 text-right" aria-label={`Prix par ${unitWord}`} />
                <span className="text-xs text-gray-400">{item.currency}</span>
              </div>
            </div>
          )}

          {breakdown && <p className="text-xs text-gray-400">{breakdown}</p>}

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-400">
              {item.priceMode === "total" ? "Montant du forfait *" : "Total de la ligne"}
            </span>
            <div className="flex items-center gap-2">
              {item.priceMode === "total" ? (
                <MoneyInput value={item.totalAmount} onChange={(v) => onChange({ totalAmount: v })} className="w-28 text-right" aria-label="Montant du forfait" />
              ) : (
                <span className="font-medium text-amber-600 dark:text-amber-400">{formatMoney(item.totalAmount)}</span>
              )}
              <span className="text-xs text-gray-400">{item.currency}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
