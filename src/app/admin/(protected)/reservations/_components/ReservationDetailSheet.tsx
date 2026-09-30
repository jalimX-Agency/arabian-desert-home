"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Loader2, FileText, ChevronDown, Copy, Check, ExternalLink, KeyRound, Star, Send, CheckCircle2, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ReservationGroup,
  statusOptions,
  statusColors,
  CHANNELS,
  channelLabel,
  groupChannel,
} from "../_lib/reservation-utils";
import {
  Catalog, CatalogSuite, CatalogActivity, CatalogDayPass,
  EditableItem, bookingToEditable, emptyItem, computeItemPrice,
  fetchCatalog, isItemValid, itemToPayload,
} from "../_lib/item-types";
import { ItemCard } from "./ItemCard";
import { ConfirmDialog } from "./ConfirmDialog";

// Public site origin — the link is meant to be sent to the guest, so never the admin's localhost.
const SITE_URL = "https://www.arabiandeserthome.ma";

function ClientLinkRow({ accessToken }: { accessToken: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/mes-reservations/${accessToken}`;

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div>
      <Label className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
        <KeyRound className="w-3 h-3" /> Lien client (privé)
      </Label>
      <div className="flex items-center gap-2">
        <Input value={url} readOnly onFocus={(e) => e.currentTarget.select()} className="font-mono text-xs" />
        <Button type="button" variant="outline" size="icon" onClick={copy} className="cursor-pointer shrink-0" aria-label="Copier le lien">
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </Button>
        <Button type="button" variant="outline" size="icon" asChild className="shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Ouvrir la page client">
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
      <p className="text-[11px] text-gray-400 mt-1">Permet au client de modifier ses dates ou d&apos;annuler. Ne le partagez qu&apos;avec lui.</p>
    </div>
  );
}

const REVIEW_LANGS = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "it", label: "Italiano" },
] as const;
const OTA_CHANNELS = ["booking.com", "expedia", "trip.com"];

type EmailCheck = { ok: boolean; message: string };

/** Manual post-stay thank-you + Google review request, in a language the admin picks.
 *  Sending goes through a verify step: the admin sees (and can fix) the exact
 *  address, and the server checks it before the send button unlocks. */
function ReviewRequestRow({ group, onSent }: { group: ReservationGroup; onSent: () => void }) {
  const primary = group.items[0];
  const [lang, setLang] = useState<string>("fr");
  const [sentAt, setSentAt] = useState<string | null>(primary.reservation?.reviewRequestSentAt ?? null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [to, setTo] = useState(primary.email);
  const [check, setCheck] = useState<{ for: string; result: EmailCheck } | null>(null);
  const [checking, setChecking] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSentAt(primary.reservation?.reviewRequestSentAt ?? null);
    setTo(primary.email);
    setCheck(null);
    setError(null);
  }, [group.id, primary.email, primary.reservation?.reviewRequestSentAt]);

  // Verify the address whenever the dialog is open and the address settles.
  useEffect(() => {
    if (!dialogOpen) return;
    const address = to.trim();
    if (!address) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await fetch(`/api/admin/reservations/${group.id}/review-request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang, to: address, checkOnly: true }),
        });
        const data = await res.json().catch(() => ({}));
        if (!cancelled) {
          setCheck({ for: address, result: data.check ?? { ok: false, message: data.error ?? "Vérification impossible." } });
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    }, 500);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [dialogOpen, to, group.id, lang]);

  // The stay is over once its last item is (checkout, or the activity/day-pass date).
  const active = group.items.filter((b) => b.status !== "cancelled");
  const lastDay = active.reduce<Date | null>((max, b) => {
    const d = b.checkOut ?? b.date ?? b.checkIn;
    if (!d) return max;
    const t = new Date(d);
    return !max || t > max ? t : max;
  }, null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const stayOver = lastDay !== null && lastDay < today;
  const channel = groupChannel(group);
  const langLabel = REVIEW_LANGS.find((l) => l.value === lang)?.label ?? lang;
  const pending = checking || !check || check.for !== to.trim();
  const verified = !pending && check!.result.ok;

  async function send() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reservations/${group.id}/review-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, to: to.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "L'envoi a échoué.");
        return;
      }
      setSentAt(data.sentAt);
      setDialogOpen(false);
      onSent();
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-xl border border-amber-200/60 dark:border-amber-500/20 bg-amber-50/40 dark:bg-amber-500/5 p-3 space-y-2">
      <Label className="text-xs text-gray-500 dark:text-white/60 flex items-center gap-1.5">
        <Star className="w-3 h-3 text-amber-500" /> Remerciement &amp; avis Google
      </Label>
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={lang} onValueChange={setLang}>
          <SelectTrigger className="w-full sm:w-36" aria-label="Langue de l'email"><SelectValue /></SelectTrigger>
          <SelectContent>
            {REVIEW_LANGS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button type="button" onClick={() => { setError(null); setDialogOpen(true); }} className="cursor-pointer flex-1 sm:flex-none">
          <Send className="w-4 h-4" />
          {sentAt ? "Renvoyer" : "Envoyer au client"}
        </Button>
      </div>
      {sentAt ? (
        <p className="text-[11px] text-green-700 dark:text-green-400">
          Envoyé le {format(new Date(sentAt), "d MMM yyyy 'à' HH:mm", { locale: fr })}
        </p>
      ) : !stayOver && lastDay ? (
        <p className="text-[11px] text-amber-700 dark:text-amber-400">
          Le séjour n&apos;est pas encore terminé (fin le {format(lastDay, "d MMM yyyy", { locale: fr })}).
        </p>
      ) : (
        <p className="text-[11px] text-gray-400">Email de remerciement avec un bouton vers votre fiche Google.</p>
      )}
      {OTA_CHANNELS.includes(channel) && (
        <p className="text-[11px] text-amber-700 dark:text-amber-400">
          Réservation {channelLabel[channel] ?? channel} : l&apos;email est souvent une adresse relais de la plateforme, qui interdit de rediriger ses clients vers d&apos;autres avis.
        </p>
      )}

      <Dialog open={dialogOpen} onOpenChange={(o) => !sending && setDialogOpen(o)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Vérifier avant l&apos;envoi</DialogTitle>
            <DialogDescription>
              Remerciement et demande d&apos;avis Google à {primary.firstName} {primary.lastName}, en {langLabel}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label htmlFor="review-to" className="text-xs text-gray-400 mb-1 block">Destinataire</Label>
              <Input id="review-to" type="email" value={to} onChange={(e) => setTo(e.target.value)} autoComplete="off" />
              {to.trim() !== primary.email && (
                <p className="text-[11px] text-gray-400 mt-1">Adresse de la réservation : {primary.email} (non modifiée).</p>
              )}
            </div>

            <div
              role="status"
              aria-live="polite"
              className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${
                pending
                  ? "bg-gray-50 dark:bg-white/5 text-gray-500"
                  : verified
                  ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {pending ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 mt-0.5" /> Vérification de l&apos;adresse…</>
              ) : verified ? (
                <><CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {check!.result.message}</>
              ) : (
                <><XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {check!.result.message}</>
              )}
            </div>

            {sentAt && (
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Déjà envoyé le {format(new Date(sentAt), "d MMM yyyy 'à' HH:mm", { locale: fr })} — un renvoi peut sembler insistant.
              </p>
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={sending} className="cursor-pointer">
              Annuler
            </Button>
            <Button onClick={send} disabled={!verified || sending} className="cursor-pointer">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ReservationDetailSheetProps {
  group: ReservationGroup | null;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (group: ReservationGroup, status: string) => void;
  onSaved: () => void;
  statusSaving: boolean;
}

export function ReservationDetailSheet({
  group,
  onOpenChange,
  onStatusChange,
  onSaved,
  statusSaving,
}: ReservationDetailSheetProps) {
  const [suites, setSuites] = useState<CatalogSuite[]>([]);
  const [activities, setActivities] = useState<CatalogActivity[]>([]);
  const [dayPasses, setDayPasses] = useState<CatalogDayPass[]>([]);
  const catalog: Catalog = { suites, activities, dayPasses };

  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "", specialReqs: "", channel: "website" });
  const [currency, setCurrency] = useState("EUR");
  const [items, setItems] = useState<EditableItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);

  useEffect(() => { fetchCatalog(setSuites, setActivities, setDayPasses); }, []);

  useEffect(() => {
    if (!group) return;
    const primary = group.items[0];
    setContact({
      firstName: primary.firstName,
      lastName: primary.lastName,
      email: primary.email,
      phone: primary.phone ?? "",
      specialReqs: primary.specialReqs ?? "",
      channel: groupChannel(group),
    });
    setCurrency(primary.currency ?? "EUR");
    setItems(group.items.map(bookingToEditable));
  }, [group]);

  // Keep auto-priced items (not manually overridden) in sync with date/service/guest changes.
  useEffect(() => {
    setItems((prev) =>
      prev.map((it) => (it.customPrice ? it : { ...it, totalAmount: computeItemPrice(it, catalog) }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suites, activities, dayPasses, JSON.stringify(items.map((i) => [i.serviceType, i.suiteId, i.activityId, i.dayPassId, i.checkIn, i.checkOut, i.date, i.guests, i.children, i.quantity]))]);

  // Keep every item's displayed currency in sync with the chosen reservation currency.
  useEffect(() => {
    setItems((prev) => prev.map((it) => (it.currency === currency ? it : { ...it, currency })));
  }, [currency]);

  const grandTotal = useMemo(() => items.reduce((sum, it) => sum + it.totalAmount, 0), [items]);

  function updateItem(key: string, patch: Partial<EditableItem>) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  }

  const isValid =
    contact.firstName.trim() !== "" &&
    contact.lastName.trim() !== "" &&
    contact.email.trim() !== "" &&
    contact.phone.trim() !== "" &&
    items.length > 0 &&
    items.every(isItemValid);

  async function handleSave() {
    if (!group || !isValid) return;
    setSaving(true);
    try {
      const originalIds = new Set(group.items.map((b) => b.id));
      const keptIds = new Set(items.filter((it) => it.id).map((it) => it.id!));
      const deletedItems = [...originalIds]
        .filter((id) => !keptIds.has(id))
        .map((id) => ({ id, _delete: true, serviceType: "suite" as const, guests: 0, children: 0, totalAmount: 0 }));

      const payload = {
        contact: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          specialReqs: contact.specialReqs || undefined,
          channel: contact.channel,
        },
        items: [...items.map(itemToPayload), ...deletedItems],
      };

      await fetch(`/api/admin/reservations/${group.id}/details`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onSaved();
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  if (!group) return null;
  const primary = group.items[0];

  return (
    <Sheet open={group !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between gap-3 pr-8">
            <SheetTitle>{primary.firstName} {primary.lastName}</SheetTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs cursor-pointer shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                  Voir la fiche PDF
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => window.open(`/api/admin/reservations/${group.id}/fiche?lang=fr`, "_blank")}
                >
                  🇫🇷 Français
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => window.open(`/api/admin/reservations/${group.id}/fiche?lang=en`, "_blank")}
                >
                  🇬🇧 English
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => window.open(`/api/admin/reservations/${group.id}/fiche?lang=es`, "_blank")}
                >
                  🇪🇸 Español
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SheetHeader>

        <div className="px-4 space-y-6 pb-4">
          {/* Status quick actions */}
          <div className="flex items-center gap-2">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(group, s)}
                disabled={statusSaving}
                className={`flex-1 px-3 py-2 rounded-lg text-xs uppercase tracking-widest font-medium border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait ${
                  primary.status === s
                    ? statusColors[s]
                    : "border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-gray-400">Client</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Prénom</Label>
                <Input value={contact.firstName} onChange={(e) => setContact((c) => ({ ...c, firstName: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Nom</Label>
                <Input value={contact.lastName} onChange={(e) => setContact((c) => ({ ...c, lastName: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Email</Label>
                <Input type="email" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Téléphone</Label>
                <Input value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Canal</Label>
                <Select value={contact.channel} onValueChange={(v) => setContact((c) => ({ ...c, channel: v }))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CHANNELS.map((c) => <SelectItem key={c} value={c}>{channelLabel[c]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Devise</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAD">MAD — Dirham marocain</SelectItem>
                    <SelectItem value="EUR">EUR — Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">Reçue le</Label>
                <p className="text-sm text-gray-900 dark:text-white py-2">{format(new Date(primary.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}</p>
              </div>
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Demandes spéciales</Label>
              <Textarea value={contact.specialReqs} onChange={(e) => setContact((c) => ({ ...c, specialReqs: e.target.value }))} rows={2} />
            </div>
            {primary.reservation?.accessToken && <ClientLinkRow accessToken={primary.reservation.accessToken} />}
            <ReviewRequestRow group={group} onSent={onSaved} />
          </div>

          {/* Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-gray-400">Prestations ({items.length})</p>
              <Button variant="outline" size="sm" onClick={() => setItems((prev) => [...prev, emptyItem(currency)])} className="cursor-pointer text-xs">
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </Button>
            </div>

            {items.map((item) => (
              <ItemCard
                key={item.key}
                item={item}
                catalog={catalog}
                computedPrice={(it) => computeItemPrice(it, catalog)}
                onChange={(patch) => updateItem(item.key, patch)}
                onRemove={() => setConfirmDeleteKey(item.key)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-500 dark:text-white/60">Montant total</span>
            <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">{grandTotal.toLocaleString("fr-FR")} {currency}</span>
          </div>
        </div>

        <SheetFooter>
          <Button onClick={handleSave} disabled={!isValid || saving} className="cursor-pointer">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Enregistrer les modifications
          </Button>
          <p className="text-[11px] text-gray-400 text-center">La réservation sera confirmée et le client recevra sa fiche par email.</p>
        </SheetFooter>
      </SheetContent>

      <ConfirmDialog
        open={confirmDeleteKey !== null}
        onOpenChange={(open) => !open && setConfirmDeleteKey(null)}
        title="Supprimer cette prestation ?"
        description="Cette prestation sera retirée de la réservation une fois les modifications enregistrées."
        confirmLabel="Supprimer"
        destructive
        onConfirm={() => {
          if (confirmDeleteKey) setItems((prev) => prev.filter((it) => it.key !== confirmDeleteKey));
        }}
      />
    </Sheet>
  );
}
