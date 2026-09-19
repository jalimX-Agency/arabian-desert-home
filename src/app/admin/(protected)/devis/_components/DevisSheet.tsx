"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Plus, Loader2, Send, FileText, ArrowRightLeft, Copy, Check, ExternalLink, KeyRound, Trash2,
} from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
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
  fetchCatalog, type Catalog, type CatalogSuite, type CatalogActivity, type CatalogDayPass,
} from "../../reservations/_lib/item-types";
import {
  computeDevisLineTotal, devisItemToEditable, devisItemToPayload, emptyDevisItem,
  isDevisItemValid, type EditableDevisItem,
} from "../_lib/devis-item-types";
import {
  DEVIS_LANGS, devisLangLabel, devisStatusColors, devisStatusLabel, devisStatusOptions,
  effectiveStatus, type Devis,
} from "../_lib/devis-utils";
import { DevisItemCard } from "./DevisItemCard";
import { ConfirmDialog } from "../../reservations/_components/ConfirmDialog";

const SITE_URL = "https://www.arabiandeserthome.ma";

interface DevisSheetProps {
  devis: Devis | null;
  creating: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

function toDateInput(iso: string): string {
  return format(new Date(iso), "yyyy-MM-dd");
}

function defaultValidUntil(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return format(d, "yyyy-MM-dd");
}

export function DevisSheet({ devis, creating, onOpenChange, onSaved }: DevisSheetProps) {
  const open = creating || devis !== null;

  const [suites, setSuites] = useState<CatalogSuite[]>([]);
  const [activities, setActivities] = useState<CatalogActivity[]>([]);
  const [dayPasses, setDayPasses] = useState<CatalogDayPass[]>([]);
  const catalog: Catalog = useMemo(() => ({ suites, activities, dayPasses }), [suites, activities, dayPasses]);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", company: "",
    channel: "email", title: "", conditions: "", notes: "",
    lang: "fr", currency: "EUR", validUntil: defaultValidUntil(),
  });
  const [items, setItems] = useState<EditableDevisItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<null | "send" | "convert" | "status" | "delete">(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [notifyOnConvert, setNotifyOnConvert] = useState(false);
  const [confirm, setConfirm] = useState<null | "send" | "convert" | "delete">(null);

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
    } else if (creating) {
      setForm({
        firstName: "", lastName: "", email: "", phone: "", company: "",
        channel: "email", title: "", conditions: "", notes: "",
        lang: "fr", currency: "EUR", validUntil: defaultValidUntil(),
      });
      setItems([emptyDevisItem("EUR")]);
    }
  }, [devis, creating]);

  // Catalogue lines re-price as the admin edits them, unless the price was overridden.
  useEffect(() => {
    setItems((prev) => prev.map((it) => (it.customPrice ? it : { ...it, totalAmount: computeDevisLineTotal(it, catalog) })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suites, activities, dayPasses, JSON.stringify(items.map((i) => [i.kind, i.serviceType, i.suiteId, i.activityId, i.dayPassId, i.checkIn, i.checkOut, i.date, i.guests, i.children, i.quantity, i.unitPrice]))]);

  useEffect(() => {
    setItems((prev) => prev.map((it) => (it.currency === form.currency ? it : { ...it, currency: form.currency })));
  }, [form.currency]);

  const grandTotal = items.reduce((sum, it) => sum + it.totalAmount, 0);
  const isValid =
    form.firstName.trim() !== "" && form.lastName.trim() !== "" &&
    form.email.trim() !== "" && form.phone.trim() !== "" &&
    items.length > 0 && items.every(isDevisItemValid);

  const status = devis ? effectiveStatus(devis) : "draft";
  const locked = devis?.status === "converted";

  function updateItem(key: string, patch: Partial<EditableDevisItem>) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  }

  async function handleSave() {
    if (!isValid || locked) return;
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
    if (res.ok) {
      onSaved();
      onOpenChange(false);
    } else {
      setError(data.error ?? "Une erreur est survenue");
    }
    setSaving(false);
  }

  async function runAction(kind: "send" | "convert" | "delete") {
    if (!devis) return;
    setBusy(kind);
    setError(null);
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between gap-3 pr-8">
            <SheetTitle>{devis ? devis.reference : "Nouveau devis"}</SheetTitle>
            {devis && (
              <span className={`text-[11px] px-2.5 py-1 rounded-full border uppercase tracking-widest ${devisStatusColors[status]}`}>
                {devisStatusLabel[status]}
              </span>
            )}
          </div>
        </SheetHeader>

        <div className="px-4 space-y-6 pb-4">
          {locked && (
            <p className="text-xs rounded-lg border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 p-3">
              Ce devis est converti en réservation — il n&apos;est plus modifiable.
            </p>
          )}

          {/* Client */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-gray-400">Client</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Prénom *</Label>
                <Input value={form.firstName} disabled={locked} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Nom *</Label>
                <Input value={form.lastName} disabled={locked} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Email *</Label>
                <Input type="email" value={form.email} disabled={locked} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Téléphone *</Label>
                <Input value={form.phone} disabled={locked} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Société</Label>
                <Input value={form.company} disabled={locked} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Canal</Label>
                <Select value={form.channel} onValueChange={(v) => setForm((f) => ({ ...f, channel: v }))} disabled={locked}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CHANNELS.map((c) => <SelectItem key={c} value={c}>{channelLabel[c]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Devis settings */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-gray-400">Devis</p>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Objet</Label>
              <Input
                value={form.title}
                disabled={locked}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Mariage 12 personnes — Agafay"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Valable jusqu&apos;au</Label>
                <Input type="date" value={form.validUntil} disabled={locked} onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Langue</Label>
                <Select value={form.lang} onValueChange={(v) => setForm((f) => ({ ...f, lang: v }))} disabled={locked}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DEVIS_LANGS.map((l) => <SelectItem key={l} value={l}>{devisLangLabel[l]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Devise</Label>
                <Select value={form.currency} onValueChange={(v) => setForm((f) => ({ ...f, currency: v }))} disabled={locked}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR — Euro</SelectItem>
                    <SelectItem value="MAD">MAD — Dirham marocain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Lines */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-gray-400">Lignes ({items.length})</p>
              {!locked && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="cursor-pointer text-xs" onClick={() => setItems((p) => [...p, emptyDevisItem(form.currency)])}>
                    <Plus className="w-3.5 h-3.5" /> Catalogue
                  </Button>
                  <Button variant="outline" size="sm" className="cursor-pointer text-xs" onClick={() => setItems((p) => [...p, emptyDevisItem(form.currency, "custom")])}>
                    <Plus className="w-3.5 h-3.5" /> Ligne libre
                  </Button>
                </div>
              )}
            </div>

            {items.map((item) => (
              <DevisItemCard
                key={item.key}
                item={item}
                catalog={catalog}
                computedPrice={(it) => computeDevisLineTotal(it, catalog)}
                onChange={(patch) => updateItem(item.key, patch)}
                onRemove={() => setItems((prev) => prev.filter((it) => it.key !== item.key))}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-500 dark:text-white/60">Montant total</span>
            <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">
              {grandTotal.toLocaleString("fr-FR")} {form.currency}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Conditions (imprimées sur le devis)</Label>
              <Textarea value={form.conditions} disabled={locked} rows={3} onChange={(e) => setForm((f) => ({ ...f, conditions: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Notes internes (jamais envoyées au client)</Label>
              <Textarea value={form.notes} disabled={locked} rows={2} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
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

              <div className="grid grid-cols-2 gap-3">
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

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" asChild className="cursor-pointer text-xs">
                  <a href={`/api/admin/devis/${devis.id}/pdf`} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-3.5 h-3.5" /> Voir le PDF
                  </a>
                </Button>
                <Button variant="outline" size="sm" disabled={locked || busy !== null} onClick={() => setConfirm("send")} className="cursor-pointer text-xs">
                  {busy === "send" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {devis.sentAt ? "Renvoyer au client" : "Envoyer au client"}
                </Button>
                {devis.status === "accepted" && (
                  <Button size="sm" disabled={busy !== null} onClick={() => setConfirm("convert")} className="cursor-pointer text-xs">
                    {busy === "convert" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRightLeft className="w-3.5 h-3.5" />}
                    Convertir en réservation
                  </Button>
                )}
                {!locked && (
                  <Button variant="outline" size="sm" disabled={busy !== null} onClick={() => setConfirm("delete")} className="cursor-pointer text-xs text-red-600">
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer
                  </Button>
                )}
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

        <SheetFooter>
          {!locked && (
            <Button onClick={handleSave} disabled={!isValid || saving} className="cursor-pointer">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {devis ? "Enregistrer les modifications" : "Créer le devis"}
            </Button>
          )}
          <p className="text-[11px] text-gray-400 text-center">
            Le devis n&apos;est visible par le client qu&apos;une fois envoyé.
          </p>
        </SheetFooter>
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
