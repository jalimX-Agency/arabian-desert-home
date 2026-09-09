"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tent, Bike, Sun, Users, Baby, CalendarDays, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ReservationItem {
  id: string;
  serviceType: string;
  suite?: { name: string } | null;
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
                  return (
                    <div key={item.id} className="glass-card card-warm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
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
                  Pour modifier des dates ou le nombre de voyageurs, contactez-nous directement — vous pouvez annuler
                  une prestation ci-dessus et effectuer une nouvelle réservation si besoin.
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
