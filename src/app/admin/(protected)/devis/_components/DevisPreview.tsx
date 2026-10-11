"use client";

import { format } from "date-fns";
import { fr, enUS, es } from "date-fns/locale";
import { formatMoney, sumMoney } from "@/lib/money";
import { formatBreakdown, type BreakdownLang } from "@/lib/devis-breakdown";
import type { Catalog } from "../../reservations/_lib/item-types";
import { lineBreakdown, type EditableDevisItem } from "../_lib/devis-item-types";

const DATE_LOCALE = { fr, en: enUS, es } as const;

const COPY: Record<BreakdownLang, {
  title: string; client: string; validUntil: string; subtotal: string; discounts: string; total: string;
  conditions: string; empty: string; adults: string; children: string; nights: (n: number) => string;
}> = {
  fr: { title: "Devis", client: "Client", validUntil: "Valable jusqu'au", subtotal: "Sous-total", discounts: "Remises", total: "Total", conditions: "Conditions", empty: "Ajoutez une première ligne pour voir le devis.", adults: "adultes", children: "enfants", nights: (n) => `${n} nuit${n > 1 ? "s" : ""}` },
  en: { title: "Quotation", client: "Client", validUntil: "Valid until", subtotal: "Subtotal", discounts: "Discounts", total: "Total", conditions: "Terms", empty: "Add a first line to see the quote.", adults: "adults", children: "children", nights: (n) => `${n} night${n > 1 ? "s" : ""}` },
  es: { title: "Presupuesto", client: "Cliente", validUntil: "Válido hasta", subtotal: "Subtotal", discounts: "Descuentos", total: "Total", conditions: "Condiciones", empty: "Añada una primera línea para ver el presupuesto.", adults: "adultos", children: "niños", nights: (n) => `${n} noche${n > 1 ? "s" : ""}` },
};

interface DevisPreviewProps {
  lang: string;
  currency: string;
  clientName: string;
  title: string;
  validUntil: string;
  conditions: string;
  items: EditableDevisItem[];
  catalog: Catalog;
}

/** What the client will read — same wording and calculations as the PDF and the client page,
 *  rebuilt live from the editor so a mistake shows before anything is sent. */
export function DevisPreview({ lang, currency, clientName, title, validUntil, conditions, items, catalog }: DevisPreviewProps) {
  const l: BreakdownLang = lang === "en" || lang === "es" ? lang : "fr";
  const t = COPY[l];
  const locale = DATE_LOCALE[l];
  const money = (n: number) => `${formatMoney(n)} ${currency}`;
  const day = (d: string) => format(new Date(d), "d MMM yyyy", { locale });

  const total = sumMoney(items.map((i) => i.totalAmount));
  const discounts = sumMoney(items.filter((i) => i.totalAmount < 0).map((i) => i.totalAmount));
  const subtotal = sumMoney(items.filter((i) => i.totalAmount >= 0).map((i) => i.totalAmount));

  function rowTitle(item: EditableDevisItem): string {
    if (item.label.trim()) return item.label;
    if (item.kind === "custom") return "…";
    const entry =
      item.serviceType === "suite" ? catalog.suites.find((s) => s.id === item.suiteId)
      : item.serviceType === "activity" ? catalog.activities.find((a) => a.id === item.activityId)
      : catalog.dayPasses.find((p) => p.id === item.dayPassId);
    return entry?.name ?? "…";
  }

  function rowMeta(item: EditableDevisItem): string {
    const parts: string[] = [];
    if (item.kind === "catalog" && item.serviceType === "suite" && item.checkIn && item.checkOut) {
      const nights = Math.max(1, Math.round((new Date(item.checkOut).getTime() - new Date(item.checkIn).getTime()) / 86_400_000));
      parts.push(`${day(item.checkIn)} → ${day(item.checkOut)} · ${t.nights(nights)}`);
    } else if (item.date) {
      parts.push(item.checkOut && item.kind === "custom" ? `${day(item.date)} → ${day(item.checkOut)}` : day(item.date));
    }
    if (item.kind === "catalog" || item.guests > 0) parts.push(`${item.guests} ${t.adults}`);
    if (item.children > 0) parts.push(`${item.children} ${t.children}`);
    return parts.join(" · ");
  }

  return (
    <div className="rounded-xl border border-[#e3d6b2] bg-[#fbf7ee] text-[#221c14] p-5 text-sm space-y-4">
      <div className="flex items-start justify-between gap-4 border-b border-[#b07f2c] pb-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#9c8e72]">{t.client}</p>
          <p className="font-semibold">{clientName.trim() || "—"}</p>
          {title && <p className="text-xs text-[#5c5344] mt-0.5">{title}</p>}
        </div>
        <div className="text-right">
          <p className="font-serif text-lg tracking-wider uppercase">{t.title}</p>
          {validUntil && <p className="text-xs text-[#5c5344]">{t.validUntil} {day(validUntil)}</p>}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-[#5c5344]">{t.empty}</p>
      ) : (
        <ul className="divide-y divide-[#f0e9d8]">
          {items.map((item) => {
            const b = lineBreakdown(item, catalog);
            const calc = b ? formatBreakdown(b, l, money) : "";
            const meta = rowMeta(item);
            return (
              <li key={item.key} className="py-2.5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold">{rowTitle(item)}</p>
                  {item.description && <p className="text-xs text-[#5c5344]">{item.description}</p>}
                  {meta && <p className="text-xs text-[#5c5344]">{meta}</p>}
                  {calc && <p className="text-xs font-semibold text-[#b07f2c] mt-0.5">{calc}</p>}
                </div>
                <p className={`font-semibold whitespace-nowrap ${item.totalAmount < 0 ? "text-[#a3423a]" : ""}`}>{money(item.totalAmount)}</p>
              </li>
            );
          })}
        </ul>
      )}

      <div className="border-t border-[#b07f2c] pt-3 space-y-1">
        {discounts < 0 && (
          <>
            <div className="flex justify-between text-xs text-[#5c5344]"><span>{t.subtotal}</span><span>{money(subtotal)}</span></div>
            <div className="flex justify-between text-xs text-[#5c5344]"><span>{t.discounts}</span><span>{money(discounts)}</span></div>
          </>
        )}
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#9c8e72]">{t.total}</span>
          <span className="font-serif text-xl text-[#b07f2c]">{money(total)}</span>
        </div>
      </div>

      {conditions.trim() && (
        <div className="rounded-lg border border-[#e3d6b2] p-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#9c8e72] mb-1">{t.conditions}</p>
          <p className="text-xs whitespace-pre-wrap text-[#5c5344]">{conditions}</p>
        </div>
      )}
    </div>
  );
}
