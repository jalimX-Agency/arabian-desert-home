"use client";

import { useEffect, useMemo, useState } from "react";
import { formatMoney, sumMoney } from "@/lib/money";
import { format } from "date-fns";
import { fr, enUS, es } from "date-fns/locale";
import {
  Plus, Loader2, Send, FileText, ArrowRightLeft, Copy, Check, ExternalLink, KeyRound, Trash2,
  MessageCircle, CopyPlus, ChevronDown, Percent,
} from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CHANNELS, channelLabel } from "../../reservations/_lib/reservation-utils";
import {
  fetchCatalog, type Catalog, type CatalogSuite, type CatalogActivity, type CatalogDayPass, type ServiceType,
} from "../../reservations/_lib/item-types";
import {
  applyDevisItemPatch, computeDevisLineTotal, devisItemToEditable, normaliseDevisItem, devisItemToPayload, emptyDevisItem,
  isDevisItemValid, type EditableDevisItem,
} from "../_lib/devis-item-types";
import {
  DEVIS_LANGS, devisLangLabel, devisStatusColors, devisStatusLabel, devisStatusOptions,
  effectiveStatus, type Devis, type DevisItem,
} from "../_lib/devis-utils";
import { DevisItemCard } from "./DevisItemCard";
import { DevisPreview } from "./DevisPreview";
import { ConfirmDialog } from "../../reservations/_components/ConfirmDialog";

const SITE_URL = "https://www.arabiandeserthome.ma";

/** What a new quote starts from: the last quote's language, currency and conditions. */
export interface DevisDefaults {
  lang: string;
  currency: string;
  channel: string;
  conditions: string;
}

interface DevisSheetProps {
  devis: Devis | null;
  creating: boolean;
  /** Quote being duplicated: a new quote opens pre-filled from it. */
  template?: Devis | null;
  defaults: DevisDefaults;
  onOpenChange: (open: boolean) => void;
  /** `openId`: a quote just created, to keep open so it can be sent right away. */
  onSaved: (openId?: string) => void;
  onDuplicate: (devis: Devis) => void;
}

const WA_COPY = {
  fr: (n: string, ref: string, total: string, until: string, link: string) =>
    `Bonjour ${n},\nVoici votre devis ${ref} d'Arabian Desert Home : ${total}, valable jusqu'au ${until}.\nVous pouvez le consulter et l'accepter ici : ${link}`,
  en: (n: string, ref: string, total: string, until: string, link: string) =>
    `Hello ${n},\nHere is your quotation ${ref} from Arabian Desert Home: ${total}, valid until ${until}.\nYou can view and accept it here: ${link}`,
  es: (n: string, ref: string, total: string, until: string, link: string) =>
    `Hola ${n},\nAquí está su presupuesto ${ref} de Arabian Desert Home: ${total}, válido hasta el ${until}.\nPuede consultarlo y aceptarlo aquí: ${link}`,
} as const;

/** Digits only, international form. A Moroccan 0X… number becomes 212X… */
function whatsappNumber(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 10) digits = `212${digits.slice(1)}`;
  return digits;
}

function toDateInput(iso: string): string {
  return format(new Date(iso), "yyyy-MM-dd");
}

function defaultValidUntil(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return format(d, "yyyy-MM-dd");
}

/** A line of the quote being duplicated: re-priced like a new line, keeping a typed price. */
function duplicateItem(item: DevisItem): EditableDevisItem {
  const e = devisItemToEditable(item);
  const stored = e.storedBreakdown?.mode;
  const priceMode = e.kind === "custom" ? "catalog" : stored === "unit" || stored === "total" ? stored : "catalog";
  return {
    ...e,
    key: `dup-${item.id}-${Math.random()}`,
    id: undefined,
    priceMode,
    customPrice: priceMode !== "catalog",
    lockedFromSave: false,
    storedBreakdown: null,
  };
}

const EMPTY_FORM = {
  firstName: "", lastName: "", email: "", phone: "", company: "",
  channel: "email", title: "", conditions: "", notes: "",
  lang: "fr", currency: "EUR", validUntil: defaultValidUntil(),
};

export function DevisSheet({ devis, creating, template, defaults, onOpenChange, onSaved, onDuplicate }: DevisSheetProps) {
  const open = creating || devis !== null;

  const [suites, setSuites] = useState<CatalogSuite[]>([]);
  const [activities, setActivities] = useState<CatalogActivity[]>([]);
  const [dayPasses, setDayPasses] = useState<CatalogDayPass[]>([]);
  const catalog: Catalog = useMemo(() => ({ suites, activities, dayPasses }), [suites, activities, dayPasses]);

  const [form, setForm] = useState(EMPTY_FORM);
  const [items, setItems] = useState<EditableDevisItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<null | "send" | "convert" | "status" | "delete" | "pdf" | "whatsapp">(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [notifyOnConvert, setNotifyOnConvert] = useState(false);
  const [confirm, setConfirm] = useState<null | "send" | "convert" | "delete">(null);
  const [showMore, setShowMore] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => { fetchCatalog(setSuites, setActivities, setDayPasses); }, []);

  useEffect(() => {
    setError(null);
    if (devis) {
      setForm({
        firstName: devis.firstName, lastName: devis.lastName, email: devis.email, phone: devis.phone,
        company: devis.company ?? "", channel: devis.channel, title: devis.title ?? "",
        conditions: devis.conditions ?? "", notes: devis.notes ?? "",
        lang: devis.lang, currency: devis.currency, validUntil: toDateInput(devis.validUntil),
      });
      setItems(devis.items.map(devisItemToEditable));
      setShowMore(Boolean(devis.company || devis.conditions || devis.notes));
    } else if (creating) {
      if (template) {
        setForm({
          firstName: template.firstName, lastName: template.lastName, email: template.email, phone: template.phone,
          company: template.company ?? "", channel: template.channel, title: template.title ?? "",
          conditions: template.conditions ?? "", notes: "",
          lang: template.lang, currency: template.currency, validUntil: defaultValidUntil(),
        });
        setItems(template.items.map(duplicateItem));
      } else {
        setForm({
          ...EMPTY_FORM,
          channel: defaults.channel,
          conditions: defaults.conditions,
          lang: defaults.lang,
          currency: defaults.currency,
          validUntil: defaultValidUntil(),
        });
        setItems([]);
      }
      setShowMore(false);
    }
    // `defaults` only seeds a brand-new quote; changing it must not wipe an edit in progress.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devis, creating, template]);

  // Lines re-price as the admin edits them, except a fixed total («Forfait»). A catalogue line
  // whose rates are in another currency than the quote switches to a price per person / night.
  useEffect(() => {
    setItems((prev) => prev.map((raw) => {
      const it = normaliseDevisItem(raw, catalog);
      if (it.kind === "catalog" && it.priceMode === "total") return it;
      const totalAmount = computeDevisLineTotal(it, catalog);
      return it === raw && totalAmount === raw.totalAmount ? raw : { ...it, totalAmount };
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suites, activities, dayPasses, JSON.stringify(items.map((i) => [i.kind, i.priceMode, i.currency, i.serviceType, i.suiteId, i.activityId, i.dayPassId, i.checkIn, i.checkOut, i.date, i.guests, i.children, i.quantity, i.unitPrice]))]);

  useEffect(() => {
    setItems((prev) => prev.map((it) => (it.currency === form.currency ? it : { ...it, currency: form.currency })));
  }, [form.currency]);

  const grandTotal = sumMoney(items.map((it) => it.totalAmount));
  const discountsTotal = sumMoney(items.filter((it) => it.totalAmount < 0).map((it) => it.totalAmount));
  const subtotalAmount = sumMoney(items.filter((it) => it.totalAmount >= 0).map((it) => it.totalAmount));
  // A quick quote only needs a first name and one way to reach the client.
  const isValid =
    form.firstName.trim() !== "" &&
    (form.phone.trim() !== "" || form.email.trim() !== "") &&
    items.length > 0 && items.every(isDevisItemValid);

  const status = devis ? effectiveStatus(devis) : "draft";
  const locked = devis?.status === "converted";
  const missing = !isValid && !locked
    ? form.firstName.trim() === "" ? "Indiquez le prénom du client."
      : form.phone.trim() === "" && form.email.trim() === "" ? "Indiquez un téléphone ou un email."
      : items.length === 0 ? "Ajoutez au moins une ligne."
      : "Complétez les lignes (tente, dates, prix…)."
    : null;

  function updateItem(key: string, patch: Partial<EditableDevisItem>) {
    setItems((prev) => prev.map((it) => (it.key === key ? applyDevisItemPatch(it, patch) : it)));
  }

  function addItem(kind: "catalog" | "custom", serviceType: ServiceType = "suite", label = "") {
    setItems((p) => [...p, { ...emptyDevisItem(form.currency, kind, serviceType), label }]);
  }

  /** Saves the editor. Returns the saved quote's id, or null when it failed. */
  async function save(close: boolean): Promise<string | null> {
    if (!isValid || locked) return devis?.id ?? null;
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      company: form.company || undefined,
      title: form.title || undefined,
      conditions: form.conditions || undefined,
      notes: form.notes || undefined,
      items: items.map(devisItemToPayload),
    };
    const res = await fetch(devis ? `/api/admin/devis/${devis.id}` : "/api/admin/devis", {
      method: devis ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Une erreur est survenue");
      return null;
    }
    const id: string = devis ? devis.id : data.devis?.id;
    if (close && devis) {
      onSaved();
      onOpenChange(false);
    } else {
      // A new quote stays open on its own record so it can be sent straight away.
      onSaved(id);
    }
    return id;
  }

  async function runAction(kind: "send" | "convert" | "delete") {
    if (!devis) return;
    setBusy(kind);
    setError(null);
    // Make sure what is sent is what is on screen.
    if (kind === "send" && !locked && isValid) {
      const id = await save(false);
      if (!id) { setBusy(null); return; }
    }
    const url =
      kind === "send" ? `/api/admin/devis/${devis.id}/send`
      : kind === "convert" ? `/api/admin/devis/${devis.id}/convert`
      : `/api/admin/devis/${devis.id}`;
    const res = await fetch(url, {
      method: kind === "delete" ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: kind === "convert" ? JSON.stringify({ notifyClient: notifyOnConvert }) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      onSaved();
      if (kind === "convert" && Array.isArray(data.priceDrift) && data.priceDrift.length > 0) {
        setError(
          `Réservation créée avec les montants du devis. Le tarif actuel a changé depuis : ${data.priceDrift
            .map((d: { label: string; quoted: number; current: number }) => `${d.label} (devis ${d.quoted}, actuel ${d.current})`)
            .join(", ")}`
        );
      } else {
        onOpenChange(false);
      }
    } else {
      setError(data.error ?? "Une erreur est survenue");
    }
    setBusy(null);
  }

  /** PDF of what is on screen: saves first, so the file never shows an older version. */
  async function openPdf() {
    if (!devis) return;
    const tab = window.open("", "_blank");
    setBusy("pdf");
    setError(null);
    if (!locked && isValid) {
      const id = await save(false);
      if (!id) { tab?.close(); setBusy(null); return; }
    }
    try {
      const res = await fetch(`/api/admin/devis/${devis.id}/pdf`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        tab?.close();
        setError(data.error ?? `Le PDF n'a pas pu être généré (erreur ${res.status}).`);
      } else {
        const url = URL.createObjectURL(await res.blob());
        if (tab) tab.location.href = url;
        else window.open(url, "_blank");
      }
    } catch {
      tab?.close();
      setError("Le PDF n'a pas pu être généré. Vérifiez votre connexion et réessayez.");
    }
    setBusy(null);
  }

  /** Opens WhatsApp with the quote's private link; marks the quote as sent. */
  async function shareWhatsApp() {
    if (!devis) return;
    const tab = window.open("", "_blank");
    setBusy("whatsapp");
    setError(null);
    if (!locked && isValid) {
      const id = await save(false);
      if (!id) { tab?.close(); setBusy(null); return; }
    }
    if (devis.status === "draft") {
      const res = await fetch(`/api/admin/devis/${devis.id}/send?via=whatsapp`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        tab?.close();
        setError(data.error ?? "Une erreur est survenue");
        setBusy(null);
        return;
      }
      onSaved();
    }
    const lang = (["fr", "en", "es"].includes(form.lang) ? form.lang : "fr") as keyof typeof WA_COPY;
    const locale = { fr, en: enUS, es }[lang];
    const text = WA_COPY[lang](
      form.firstName.trim(),
      devis.reference,
      `${formatMoney(grandTotal)} ${form.currency}`,
      format(new Date(form.validUntil), "d MMMM yyyy", { locale }),
      `${SITE_URL}/devis/${devis.accessToken}`,
    );
    const url = `https://wa.me/${whatsappNumber(form.phone)}?text=${encodeURIComponent(text)}`;
    if (tab) tab.location.href = url;
    else window.open(url, "_blank");
    setBusy(null);
  }

  async function changeStatus(next: string) {
    if (!devis) return;
    setBusy("status");
    const res = await fetch(`/api/admin/devis/${devis.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) onSaved();
    else setError((await res.json().catch(() => ({}))).error ?? "Une erreur est survenue");
    setBusy(null);
  }

  async function copyLink() {
    if (!devis) return;
    await navigator.clipboard.writeText(`${SITE_URL}/devis/${devis.accessToken}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between gap-3 pr-8">
            <SheetTitle>{devis ? devis.reference : template ? "Nouveau devis (copie)" : "Nouveau devis"}</SheetTitle>
            {devis && (
              <span className={`text-[11px] px-2.5 py-1 rounded-full border uppercase tracking-widest ${devisStatusColors[status]}`}>
                {devisStatusLabel[status]}
              </span>
            )}
          </div>
        </SheetHeader>

        {/* Actions stay pinned under the header so they're reachable without scrolling
            past a long list of lines. */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-gray-200 dark:border-white/10 px-4 py-3 flex flex-wrap items-center gap-2">
          {!locked && (
            <Button onClick={() => save(true)} disabled={!isValid || saving || busy !== null} size="sm" className="cursor-pointer text-xs">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {devis ? "Enregistrer" : "Créer le devis"}
            </Button>
          )}
          {devis && (
            <>
              <Button variant="outline" size="sm" disabled={busy !== null || (!locked && !isValid)} onClick={openPdf} className="cursor-pointer text-xs">
                {busy === "pdf" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                PDF
              </Button>
              <Button
                variant="outline" size="sm"
                disabled={locked || busy !== null || !isValid || !form.email.trim()}
                title={!form.email.trim() ? "Ajoutez l'email du client pour envoyer le devis par email" : undefined}
                onClick={() => setConfirm("send")}
                className="cursor-pointer text-xs"
              >
                {busy === "send" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {devis.sentAt ? "Renvoyer par email" : "Envoyer par email"}
              </Button>
              <Button variant="outline" size="sm" disabled={locked || busy !== null || !isValid} onClick={shareWhatsApp} className="cursor-pointer text-xs">
                {busy === "whatsapp" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageCircle className="w-3.5 h-3.5" />}
                WhatsApp
              </Button>
              <Button variant="outline" size="sm" disabled={busy !== null} onClick={() => onDuplicate(devis)} className="cursor-pointer text-xs">
                <CopyPlus className="w-3.5 h-3.5" /> Dupliquer
              </Button>
              {devis.status === "accepted" && (
                <Button size="sm" disabled={busy !== null} onClick={() => setConfirm("convert")} className="cursor-pointer text-xs">
                  {busy === "convert" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRightLeft className="w-3.5 h-3.5" />}
                  Convertir
                </Button>
              )}
              {!locked && (
                <Button variant="outline" size="sm" disabled={busy !== null} onClick={() => setConfirm("delete")} className="cursor-pointer text-xs text-red-600 ml-auto">
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </Button>
              )}
            </>
          )}
          {missing && <span className="text-xs text-amber-600 dark:text-amber-400 basis-full">{missing}</span>}
        </div>

        <div className="px-4 space-y-6 pb-8 pt-4">
          {locked && (
            <p className="text-xs rounded-lg border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 p-3">
              Ce devis est converti en réservation — il n&apos;est plus modifiable.
            </p>
          )}

          {/* Client */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-gray-400">Client</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Prénom *</Label>
                <Input value={form.firstName} disabled={locked} onChange={(e) => set({ firstName: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Nom</Label>
                <Input value={form.lastName} disabled={locked} onChange={(e) => set({ lastName: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Téléphone / WhatsApp</Label>
                <Input value={form.phone} disabled={locked} onChange={(e) => set({ phone: e.target.value })} placeholder="+212 6…" />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Email</Label>
                <Input type="email" value={form.email} disabled={locked} onChange={(e) => set({ email: e.target.value })} />
              </div>
            </div>
            <p className="text-[11px] text-gray-400">Un téléphone <em>ou</em> un email suffit.</p>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Objet du devis</Label>
              <Input
                value={form.title}
                disabled={locked}
                onChange={(e) => set({ title: e.target.value })}
                placeholder="Mariage 12 personnes — Agafay"
              />
            </div>
          </div>

          {/* Lines */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-gray-400">Lignes ({items.length})</p>

            {items.map((item) => (
              <DevisItemCard
                key={item.key}
                item={item}
                catalog={catalog}
                computedPrice={(it) => computeDevisLineTotal(it, catalog)}
                onChange={(patch) => updateItem(item.key, patch)}
                onRemove={() => setItems((prev) => prev.filter((it) => it.key !== item.key))}
                baseAmount={subtotalAmount}
                defaultOpen={!item.id}
              />
            ))}

            {items.length === 0 && (
              <p className="text-sm text-gray-400 border border-dashed border-gray-200 dark:border-white/10 rounded-xl p-4 text-center">
                Ajoutez la première ligne du devis ci-dessous.
              </p>
            )}

            {!locked && (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="cursor-pointer text-xs" onClick={() => addItem("catalog", "suite")}>
                  <Plus className="w-3.5 h-3.5" /> Tente
                </Button>
                <Button variant="outline" size="sm" className="cursor-pointer text-xs" onClick={() => addItem("catalog", "activity")}>
                  <Plus className="w-3.5 h-3.5" /> Activité
                </Button>
                <Button variant="outline" size="sm" className="cursor-pointer text-xs" onClick={() => addItem("catalog", "daypass")}>
                  <Plus className="w-3.5 h-3.5" /> Day pass
                </Button>
                <Button variant="outline" size="sm" className="cursor-pointer text-xs" onClick={() => addItem("custom")}>
                  <Plus className="w-3.5 h-3.5" /> Ligne libre
                </Button>
                <Button variant="outline" size="sm" className="cursor-pointer text-xs" onClick={() => addItem("custom", "suite", "Remise")}>
                  <Percent className="w-3.5 h-3.5" /> Remise
                </Button>
              </div>
            )}
          </div>

          {discountsTotal < 0 && (
            <div className="space-y-1 text-sm text-gray-500 dark:text-white/60">
              <div className="flex items-center justify-between"><span>Sous-total</span><span>{formatMoney(subtotalAmount)} {form.currency}</span></div>
              <div className="flex items-center justify-between"><span>Remises</span><span className="text-red-500">{formatMoney(discountsTotal)} {form.currency}</span></div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-white/60">Montant total</span>
            <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">
              {formatMoney(grandTotal)} {form.currency}
            </span>
          </div>

          {/* Quote settings that rarely change: language, currency, validity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Valable jusqu&apos;au</Label>
              <Input type="date" value={form.validUntil} disabled={locked} onChange={(e) => set({ validUntil: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Langue du devis</Label>
              <Select value={form.lang} onValueChange={(v) => set({ lang: v })} disabled={locked}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEVIS_LANGS.map((l) => <SelectItem key={l} value={l}>{devisLangLabel[l]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Devise</Label>
              <Select value={form.currency} onValueChange={(v) => set({ currency: v })} disabled={locked}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR — Euro</SelectItem>
                  <SelectItem value="MAD">MAD — Dirham marocain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Live preview of what the client will read */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              aria-expanded={showPreview}
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPreview ? "" : "-rotate-90"}`} />
              Aperçu pour le client
            </button>
            {showPreview && (
              <DevisPreview
                lang={form.lang}
                currency={form.currency}
                clientName={`${form.firstName} ${form.lastName}`}
                title={form.title}
                validUntil={form.validUntil}
                conditions={form.conditions}
                items={items}
                catalog={catalog}
              />
            )}
          </div>

          {/* Less common fields */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              aria-expanded={showMore}
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMore ? "" : "-rotate-90"}`} />
              Conditions, société, notes
            </button>
            {showMore && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-400 mb-1 block">Conditions (imprimées sur le devis)</Label>
                  <Textarea value={form.conditions} disabled={locked} rows={3} onChange={(e) => set({ conditions: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-400 mb-1 block">Société</Label>
                    <Input value={form.company} disabled={locked} onChange={(e) => set({ company: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400 mb-1 block">Canal</Label>
                    <Select value={form.channel} onValueChange={(v) => set({ channel: v })} disabled={locked}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CHANNELS.map((c) => <SelectItem key={c} value={c}>{channelLabel[c]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-400 mb-1 block">Notes internes (jamais envoyées au client)</Label>
                  <Textarea value={form.notes} disabled={locked} rows={2} onChange={(e) => set({ notes: e.target.value })} />
                </div>
              </div>
            )}
          </div>

          {devis && (
            <>
              <div>
                <Label className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3 h-3" /> Lien client (privé)
                </Label>
                <div className="flex items-center gap-2">
                  <Input value={`${SITE_URL}/devis/${devis.accessToken}`} readOnly onFocus={(e) => e.currentTarget.select()} className="font-mono text-xs" />
                  <Button type="button" variant="outline" size="icon" onClick={copyLink} className="cursor-pointer shrink-0" aria-label="Copier le lien">
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button type="button" variant="outline" size="icon" asChild className="shrink-0">
                    <a href={`${SITE_URL}/devis/${devis.accessToken}`} target="_blank" rel="noopener noreferrer" aria-label="Ouvrir la page client">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {devis.clientMessage && (
                <div className="rounded-lg border border-gray-200 dark:border-white/10 p-3">
                  <p className="text-xs text-gray-400 mb-1">Message du client</p>
                  <p className="text-sm whitespace-pre-wrap">{devis.clientMessage}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-400 mb-1 block">Statut (réponse par téléphone)</Label>
                  <Select value={devis.status} onValueChange={changeStatus} disabled={locked || busy !== null}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {devisStatusOptions.filter((s) => s !== "converted").map((s) => (
                        <SelectItem key={s} value={s}>{devisStatusLabel[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-xs text-gray-400 self-end pb-2">
                  {devis.sentAt && <div>Envoyé le {format(new Date(devis.sentAt), "d MMM yyyy", { locale: fr })}</div>}
                  {devis.answeredAt && (
                    <div>Réponse le {format(new Date(devis.answeredAt), "d MMM yyyy", { locale: fr })} ({devis.answeredBy === "client" ? "client" : "admin"})</div>
                  )}
                </div>
              </div>

              {devis.status === "accepted" && (
                <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/60 cursor-pointer">
                  <Checkbox checked={notifyOnConvert} onCheckedChange={(v) => setNotifyOnConvert(v === true)} />
                  Envoyer la fiche de réservation au client après conversion
                </label>
              )}
            </>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <p className="px-4 pb-6 text-[11px] text-gray-400 text-center">
          Le devis n&apos;est visible par le client qu&apos;une fois envoyé (email ou WhatsApp).
        </p>
      </SheetContent>

      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={
          confirm === "send" ? "Envoyer ce devis au client ?"
          : confirm === "convert" ? "Convertir ce devis en réservation ?"
          : "Supprimer ce devis ?"
        }
        description={
          confirm === "send" ? "Le client recevra un email avec le PDF et son lien privé pour accepter ou refuser."
          : confirm === "convert" ? "Une réservation confirmée sera créée avec les montants du devis. Le devis ne sera plus modifiable."
          : "Cette action est irréversible."
        }
        confirmLabel={confirm === "send" ? "Envoyer" : confirm === "convert" ? "Convertir" : "Supprimer"}
        destructive={confirm === "delete"}
        onConfirm={() => confirm && runAction(confirm)}
      />
    </Sheet>
  );
}
