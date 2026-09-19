"use client";

import { Trash2 } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { serviceTypeOptions, serviceTypeLabel } from "../../reservations/_lib/reservation-utils";
import type { Catalog, ServiceType } from "../../reservations/_lib/item-types";
import type { EditableDevisItem } from "../_lib/devis-item-types";

interface DevisItemCardProps {
  item: EditableDevisItem;
  catalog: Catalog;
  computedPrice: (item: EditableDevisItem) => number;
  onChange: (patch: Partial<EditableDevisItem>) => void;
  onRemove: () => void;
}

export function DevisItemCard({ item, catalog, computedPrice, onChange, onRemove }: DevisItemCardProps) {
  const isCustom = item.kind === "custom";

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
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
              <Input type="number" value={item.unitPrice} onChange={(e) => onChange({ unitPrice: Number(e.target.value) })} />
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
              <div className="grid grid-cols-3 gap-2">
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

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
        {isCustom ? (
          <span className="text-xs text-gray-400">Total de la ligne</span>
        ) : (
          <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/60 cursor-pointer">
            <Checkbox
              checked={item.customPrice}
              onCheckedChange={(v) => onChange({ customPrice: v === true, totalAmount: v === true ? item.totalAmount : computedPrice(item) })}
            />
            Prix personnalisé
          </label>
        )}
        <div className="flex items-center gap-2">
          {item.customPrice && !isCustom ? (
            <Input
              type="number"
              value={item.totalAmount}
              onChange={(e) => onChange({ totalAmount: Number(e.target.value) })}
              className="w-28 text-right"
            />
          ) : (
            <span className={`font-medium ${item.totalAmount < 0 ? "text-red-500" : "text-amber-600 dark:text-amber-400"}`}>
              {item.totalAmount.toLocaleString("fr-FR")}
            </span>
          )}
          <span className="text-xs text-gray-400">{item.currency}</span>
        </div>
      </div>
    </div>
  );
}
