"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Tent, Bike, Sun, Users, Baby, CalendarDays, Loader2, CheckCircle2, XCircle, Clock, Info } from "lucide-react";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { rangeOverlapsClosure } from "@/lib/availability";

interface ClosureWindow {
  startDate: string;
  endDate: string;
}

interface ReservationItem {
  id: string;
  serviceType: string;
  suite?: { name: string; closures?: ClosureWindow[] } | null;
  activity?: { name: string } | null;
  dayPass?: { name: string } | null;
  checkIn?: string | null;
  checkOut?: string | null;
  date?: string | null;
  guests: number;
  children: number;
  status: string;
  totalAmount: number;
  currency: string;
}

interface Reservation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialReqs: string | null;
  totalAmount: number;
  currency: string;
  createdAt: string;
  items: ReservationItem[];
}

const SERVICE_ICON: Record<string, React.ElementType> = { suite: Tent, activity: Bike, daypass: Sun };
const SERVICE_LABEL: Record<string, string> = { suite: "Tente & Suite", activity: "Activité", daypass: "Day Pass" };

const STATUS_STYLE: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  pending: { label: "En attente de confirmation", className: "bg-amber/10 text-amber border-amber/20", icon: Clock },
  confirmed: { label: "Confirmée", className: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle2 },
  cancelled: { label: "Annulée", className: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
};

function itemName(item: ReservationItem): string {
  return item.suite?.name ?? item.activity?.name ?? item.dayPass?.name ?? "—";
}

function itemDates(item: ReservationItem): string {
  if (item.serviceType === "suite" && item.checkIn && item.checkOut) {
    return `${format(new Date(item.checkIn), "d MMM yyyy", { locale: fr })} → ${format(new Date(item.checkOut), "d MMM yyyy", { locale: fr })}`;
  }
  if (item.date) return format(new Date(item.date), "d MMM yyyy", { locale: fr });
  return "—";
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function itemHasStarted(item: ReservationItem): boolean {
  const start = item.checkIn ?? item.date;
  return start ? new Date(start) < startOfToday() : false;
}

function ModifyDatesPanel({
  item,
  saving,
  error,
  onSubmit,
  onClose,
}: {
  item: ReservationItem;
  saving: boolean;
  error: string | null;
  onSubmit: (dates: { checkIn?: string; checkOut?: string; date?: string }) => void;
  onClose: () => void;
}) {
  const isSuite = item.serviceType === "suite";
  const closures = (item.suite?.closures ?? []).map((c) => ({
    startDate: new Date(c.startDate),
    endDate: new Date(c.endDate),
  }));
  const [range, setRange] = useState<DateRange | undefined>(
    isSuite && item.checkIn && item.checkOut
      ? { from: new Date(item.checkIn), to: new Date(item.checkOut) }
      : undefined
  );
  const [single, setSingle] = useState<Date | undefined>(item.date ? new Date(item.date) : undefined);
  const [localError, setLocalError] = useState<string | null>(null);

  const today = startOfToday();
  const isClosed = (d: Date) => closures.some((w) => d >= w.startDate && d <= w.endDate);

  function submit() {
    setLocalError(null);
    if (isSuite) {
      if (!range?.from || !range?.to || range.to <= range.from) {
        setLocalError("Choisissez une date d'arrivée puis une date de départ.");
        return;
      }
      if (rangeOverlapsClosure(range.from, range.to, closures)) {
        setLocalError("Cette tente n'est pas disponible sur une partie de ces dates.");
        return;
      }
      onSubmit({ checkIn: range.from.toISOString(), checkOut: range.to.toISOString() });
    } else {
      if (!single) {
        setLocalError("Choisissez une nouvelle date.");
        return;
      }
      onSubmit({ date: single.toISOString() });
    }
  }

  const nights = range?.from && range?.to
    ? Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000)
    : 0;
  const summary = isSuite
    ? range?.from && range?.to
      ? `${format(range.from, "d MMM yyyy", { locale: fr })} → ${format(range.to, "d MMM yyyy", { locale: fr })} · ${nights} nuit${nights > 1 ? "s" : ""}`
      : range?.from
        ? `Arrivée le ${format(range.from, "d MMM yyyy", { locale: fr })} — choisissez le départ`
        : "Choisissez vos nouvelles dates"
    : single
      ? format(single, "EEEE d MMMM yyyy", { locale: fr })
      : "Choisissez une nouvelle date";

  const shownError = localError ?? error;

  return (
    <div className="mt-5 pt-5 border-t border-amber/10">
      <p className="luxury-label text-amber/80 text-[10px] mb-3">Modifier les dates</p>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="rounded-2xl border border-border/50 bg-background/60 self-start">
          {isSuite ? (
            <Calendar
              mode="range"
              locale={fr}
              selected={range}
              onSelect={setRange}
              startMonth={today}
              defaultMonth={range?.from && range.from >= today ? range.from : today}
              disabled={(d) => d < today || isClosed(d)}
              className="rounded-2xl"
            />
          ) : (
            <Calendar
              mode="single"
              locale={fr}
              selected={single}
              onSelect={setSingle}
              startMonth={today}
              defaultMonth={single && single >= today ? single : today}
              disabled={(d) => d < today}
              className="rounded-2xl"
            />
          )}
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Nouvelles dates</p>
            <p className="font-serif text-base">{summary}</p>
          </div>
          <div className="flex gap-2 rounded-2xl bg-amber/5 border border-amber/15 p-3 text-xs text-muted-foreground leading-relaxed">
            <Info className="w-4 h-4 text-amber shrink-0 mt-0.5" />
            <span>
              Après modification, votre réservation repasse <strong>en attente de confirmation</strong> : notre équipe
              vérifie la disponibilité puis vous confirme par email. Le tarif peut varier selon la période choisie.
            </span>
          </div>
          {isSuite && closures.length > 0 && (
            <p className="text-xs text-muted-foreground">Les jours grisés ne sont pas disponibles pour cette tente.</p>
          )}
          {shownError && <p className="text-sm text-red-500">{shownError}</p>}
          <div className="flex flex-wrap items-center gap-4 mt-auto">
            <button
              onClick={submit}
              disabled={saving}
              className="btn-primary text-sm disabled:opacity-50 cursor-pointer inline-flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saving ? "Enregistrement…" : "Confirmer la modification"}
            </button>
            <button
              onClick={onClose}
              disabled={saving}
              className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyReservationPage() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [specialReqs, setSpecialReqs] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [cancellingAll, setCancellingAll] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [modifying, setModifying] = useState(false);
  const [modifyError, setModifyError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/reservations/${token}`);
    if (res.ok) {
      const data = await res.json();
      setReservation(data);
      setSpecialReqs(data.specialReqs ?? "");
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function patch(body: Record<string, unknown>) {
    const res = await fetch(`/api/reservations/${token}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setReservation(await res.json());
      return true;
    }
    return false;
  }

  async function handleCancelItem(itemId: string) {
    if (!confirm("Annuler cette prestation ? Cette action est irréversible.")) return;
    setBusyItemId(itemId);
    const ok = await patch({ action: "cancelItem", itemId });
    toast(ok
      ? { title: "Prestation annulée" }
      : { title: "Une erreur est survenue", variant: "destructive" });
    setBusyItemId(null);
  }

  async function handleModifyItem(itemId: string, dates: { checkIn?: string; checkOut?: string; date?: string }) {
    setModifying(true);
    setModifyError(null);
    const res = await fetch(`/api/reservations/${token}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "modifyItem", itemId, ...dates }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setReservation(data);
      setEditingItemId(null);
      toast({
        title: "Modification envoyée",
        description: "Votre réservation est en attente de confirmation. Vous recevrez un email dès qu'elle sera validée.",
      });
    } else {
      setModifyError(data.error ?? "Une erreur est survenue");
    }
    setModifying(false);
  }

  async function handleCancelAll() {
    if (!confirm("Annuler toute votre réservation ? Cette action est irréversible.")) return;
    setCancellingAll(true);
    const ok = await patch({ action: "cancelAll" });
    toast(ok
      ? { title: "Réservation annulée" }
      : { title: "Une erreur est survenue", variant: "destructive" });
    setCancellingAll(false);
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    const ok = await patch({ action: "updateSpecialReqs", specialReqs });
    toast(ok
      ? { title: "Demandes spéciales mises à jour" }
      : { title: "Une erreur est survenue", variant: "destructive" });
    setSavingNotes(false);
  }

  const allCancelled = reservation?.items.every((i) => i.status === "cancelled") ?? false;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mb-3" />
              Chargement de votre réservation…
            </div>
          )}

          {!loading && notFound && (
            <div className="glass-card card-warm p-10 text-center">
              <h1 className="heading-editorial text-2xl mb-3">Réservation introuvable</h1>
              <p className="text-muted-foreground body-editorial">
                Ce lien de gestion n&apos;est plus valide. Vérifiez le lien reçu dans votre email de confirmation,
                ou contactez-nous directement au +212 667-370-206.
              </p>
            </div>
          )}

          {!loading && reservation && (
            <>
              <div className="mb-10">
                <p className="luxury-label text-amber/80 mb-2">Ma réservation</p>
                <h1 className="heading-display text-3xl md:text-4xl mb-2">
                  Bonjour {reservation.firstName}
                </h1>
                <p className="text-sm text-muted-foreground body-editorial">
                  Réservation reçue le {format(new Date(reservation.createdAt), "d MMMM yyyy", { locale: fr })}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {reservation.items.map((item) => {
                  const Icon = SERVICE_ICON[item.serviceType] ?? Tent;
                  const status = STATUS_STYLE[item.status] ?? STATUS_STYLE.pending;
                  const StatusIcon = status.icon;
                  const canModify = item.status !== "cancelled" && !itemHasStarted(item);
                  const isEditing = editingItemId === item.id;
                  return (
                    <div key={item.id} className="glass-card card-warm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-amber" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="luxury-label text-amber/70 text-[10px] mb-1">{SERVICE_LABEL[item.serviceType] ?? item.serviceType}</p>
                        <p className="font-serif text-lg mb-1">{itemName(item)}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{itemDates(item)}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{item.guests}</span>
                          {item.children > 0 && <span className="flex items-center gap-1"><Baby className="w-3 h-3" />{item.children}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                        <span className="mono-number text-amber text-base">{item.totalAmount.toLocaleString("fr-FR")} {item.currency}</span>
                        <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${status.className}`}>
                          <StatusIcon className="w-3 h-3" />{status.label}
                        </span>
                        <div className="flex items-center gap-4">
                          {canModify && !isEditing && (
                            <button
                              onClick={() => { setEditingItemId(item.id); setModifyError(null); }}
                              className="text-xs text-amber hover:underline cursor-pointer"
                            >
                              Modifier les dates
                            </button>
                          )}
                          {item.status !== "cancelled" && (
                            <button
                              onClick={() => handleCancelItem(item.id)}
                              disabled={busyItemId === item.id}
                              className="text-xs text-red-500 hover:underline disabled:opacity-40 cursor-pointer"
                            >
                              {busyItemId === item.id ? "Annulation…" : "Annuler"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {isEditing && (
                      <ModifyDatesPanel
                        key={item.id}
                        item={item}
                        saving={modifying}
                        error={modifyError}
                        onSubmit={(dates) => handleModifyItem(item.id, dates)}
                        onClose={() => { setEditingItemId(null); setModifyError(null); }}
                      />
                    )}
                    </div>
                  );
                })}
              </div>

              <div className="glass-card card-warm p-6 mb-8">
                <div className="flex items-center justify-between mb-1">
                  <span className="luxury-label text-amber/70">Total de la réservation</span>
                  <span className="mono-number text-2xl text-amber">
                    {reservation.totalAmount.toLocaleString("fr-FR")} {reservation.currency}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Vous pouvez modifier les dates de chaque prestation ci-dessus. Pour changer le nombre de voyageurs,
                  contactez-nous directement.
                </p>
              </div>

              <div className="glass-card card-warm p-6 mb-8">
                <label className="luxury-label text-xs block mb-2">Demandes spéciales</label>
                <Textarea
                  value={specialReqs}
                  onChange={(e) => setSpecialReqs(e.target.value)}
                  rows={3}
                  className="rounded-2xl border-border/50 focus:border-amber/50 bg-background/50 resize-none mb-3"
                  placeholder="Régime alimentaire, occasion spéciale…"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="btn-outline text-sm disabled:opacity-40 cursor-pointer"
                >
                  {savingNotes ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>

              {!allCancelled && (
                <div className="text-center">
                  <button
                    onClick={handleCancelAll}
                    disabled={cancellingAll}
                    className="text-sm text-red-500 hover:underline disabled:opacity-40 cursor-pointer"
                  >
                    {cancellingAll ? "Annulation…" : "Annuler toute la réservation"}
                  </button>
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground mt-10 body-editorial">
                Des questions ? Contactez-nous au +212 667-370-206 ou info@arabiandeserthome.ma
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
