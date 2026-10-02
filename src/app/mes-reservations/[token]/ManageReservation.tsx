"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { enGB, es as esLocale, fr, it as itLocale, type Locale } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Tent, Bike, Sun, Users, Baby, CalendarDays, Loader2, CheckCircle2, XCircle, Clock, Info } from "lucide-react";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { rangeOverlapsClosure } from "@/lib/availability";
import { useLanguage, type Language } from "@/lib/i18n/context";
import { LANG_LOCALE } from "@/lib/reservation-lang";
import { formatMoney } from "@/lib/money";

/** A catalogue name with the camp's own translations. */
interface LocalizedName {
  name: string;
  nameEn?: string | null;
  nameEs?: string | null;
  nameIt?: string | null;
}

interface ClosureWindow {
  startDate: string;
  endDate: string;
}

interface ReservationItem {
  id: string;
  serviceType: string;
  suite?: (LocalizedName & { closures?: ClosureWindow[] }) | null;
  activity?: LocalizedName | null;
  dayPass?: LocalizedName | null;
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

const DATE_LOCALES: Record<Language, Locale> = { fr, en: enGB, es: esLocale, it: itLocale };

interface Copy {
  service: Record<"suite" | "activity" | "daypass", string>;
  status: Record<"pending" | "confirmed" | "cancelled", string>;
  loading: string;
  notFoundTitle: string;
  notFoundBody: string;
  myReservation: string;
  hello: (name: string) => string;
  receivedOn: (date: string) => string;
  modifyDates: string;
  cancel: string;
  cancelling: string;
  total: string;
  totalNote: string;
  specialReqs: string;
  specialReqsPlaceholder: string;
  save: string;
  saving: string;
  cancelAll: string;
  contactLine: string;
  confirmCancelItem: string;
  confirmCancelAll: string;
  toast: {
    itemCancelled: string; error: string; modificationSent: string; modificationSentDesc: string;
    reservationCancelled: string; notesSaved: string;
  };
  panel: {
    title: string; newDates: string; infoBefore: string; infoStrong: string; infoAfter: string; closedNote: string;
    confirm: string; close: string; errChooseRange: string; errClosure: string; errChooseDate: string;
    chooseDates: string; chooseDate: string; arrivalOn: (date: string) => string; nights: (n: number) => string;
  };
  errors: Record<string, string>;
}

const COPY: Record<Language, Copy> = {
  fr: {
    service: { suite: "Tente & Suite", activity: "Activité", daypass: "Day Pass" },
    status: { pending: "En attente de confirmation", confirmed: "Confirmée", cancelled: "Annulée" },
    loading: "Chargement de votre réservation…",
    notFoundTitle: "Réservation introuvable",
    notFoundBody: "Ce lien de gestion n'est plus valide. Vérifiez le lien reçu dans votre email de confirmation, ou contactez-nous directement au +212 667-370-206.",
    myReservation: "Ma réservation",
    hello: (n) => `Bonjour ${n}`,
    receivedOn: (d) => `Réservation reçue le ${d}`,
    modifyDates: "Modifier les dates",
    cancel: "Annuler",
    cancelling: "Annulation…",
    total: "Total de la réservation",
    totalNote: "Vous pouvez modifier les dates de chaque prestation ci-dessus. Pour changer le nombre de voyageurs, contactez-nous directement.",
    specialReqs: "Demandes spéciales",
    specialReqsPlaceholder: "Régime alimentaire, occasion spéciale…",
    save: "Enregistrer",
    saving: "Enregistrement…",
    cancelAll: "Annuler toute la réservation",
    contactLine: "Des questions ? Contactez-nous au +212 667-370-206 ou info@arabiandeserthome.ma",
    confirmCancelItem: "Annuler cette prestation ? Cette action est irréversible.",
    confirmCancelAll: "Annuler toute votre réservation ? Cette action est irréversible.",
    toast: {
      itemCancelled: "Prestation annulée",
      error: "Une erreur est survenue",
      modificationSent: "Modification envoyée",
      modificationSentDesc: "Votre réservation est en attente de confirmation. Vous recevrez un email dès qu'elle sera validée.",
      reservationCancelled: "Réservation annulée",
      notesSaved: "Demandes spéciales mises à jour",
    },
    panel: {
      title: "Modifier les dates",
      newDates: "Nouvelles dates",
      infoBefore: "Après modification, votre réservation repasse ",
      infoStrong: "en attente de confirmation",
      infoAfter: " : notre équipe vérifie la disponibilité puis vous confirme par email. Le tarif peut varier selon la période choisie.",
      closedNote: "Les jours grisés ne sont pas disponibles pour cette tente.",
      confirm: "Confirmer la modification",
      close: "Fermer",
      errChooseRange: "Choisissez une date d'arrivée puis une date de départ.",
      errClosure: "Cette tente n'est pas disponible sur une partie de ces dates.",
      errChooseDate: "Choisissez une nouvelle date.",
      chooseDates: "Choisissez vos nouvelles dates",
      chooseDate: "Choisissez une nouvelle date",
      arrivalOn: (d) => `Arrivée le ${d} — choisissez le départ`,
      nights: (n) => `${n} nuit${n > 1 ? "s" : ""}`,
    },
    errors: {
      item_not_found: "Prestation introuvable.",
      item_cancelled: "Cette prestation est annulée et ne peut plus être modifiée.",
      item_started: "Cette prestation a déjà commencé et ne peut plus être modifiée.",
      dates_required: "Dates d'arrivée et de départ requises.",
      date_required: "Date requise.",
      invalid_date: "Date invalide.",
      checkout_before_checkin: "La date de départ doit être après la date d'arrivée.",
      date_in_past: "La date ne peut pas être dans le passé.",
      same_dates: "Les nouvelles dates sont identiques aux dates actuelles.",
      unavailable: "Ces dates ne sont pas disponibles.",
      generic: "Une erreur est survenue.",
    },
  },
  en: {
    service: { suite: "Tent & Suite", activity: "Activity", daypass: "Day Pass" },
    status: { pending: "Awaiting confirmation", confirmed: "Confirmed", cancelled: "Cancelled" },
    loading: "Loading your reservation…",
    notFoundTitle: "Reservation not found",
    notFoundBody: "This management link is no longer valid. Check the link in your confirmation email, or contact us directly on +212 667-370-206.",
    myReservation: "My reservation",
    hello: (n) => `Hello ${n}`,
    receivedOn: (d) => `Reservation received on ${d}`,
    modifyDates: "Change dates",
    cancel: "Cancel",
    cancelling: "Cancelling…",
    total: "Reservation total",
    totalNote: "You can change the dates of each service above. To change the number of guests, please contact us directly.",
    specialReqs: "Special requests",
    specialReqsPlaceholder: "Dietary requirements, special occasion…",
    save: "Save",
    saving: "Saving…",
    cancelAll: "Cancel the whole reservation",
    contactLine: "Any questions? Call +212 667-370-206 or email info@arabiandeserthome.ma",
    confirmCancelItem: "Cancel this service? This cannot be undone.",
    confirmCancelAll: "Cancel your whole reservation? This cannot be undone.",
    toast: {
      itemCancelled: "Service cancelled",
      error: "Something went wrong",
      modificationSent: "Change sent",
      modificationSentDesc: "Your reservation is awaiting confirmation. You will receive an email as soon as it is validated.",
      reservationCancelled: "Reservation cancelled",
      notesSaved: "Special requests updated",
    },
    panel: {
      title: "Change dates",
      newDates: "New dates",
      infoBefore: "After the change, your reservation goes back to ",
      infoStrong: "awaiting confirmation",
      infoAfter: ": our team checks availability and confirms by email. The price may vary depending on the period chosen.",
      closedNote: "Greyed-out days are not available for this tent.",
      confirm: "Confirm the change",
      close: "Close",
      errChooseRange: "Choose an arrival date, then a departure date.",
      errClosure: "This tent is not available for part of these dates.",
      errChooseDate: "Choose a new date.",
      chooseDates: "Choose your new dates",
      chooseDate: "Choose a new date",
      arrivalOn: (d) => `Arrival on ${d} — choose the departure date`,
      nights: (n) => `${n} night${n > 1 ? "s" : ""}`,
    },
    errors: {
      item_not_found: "Service not found.",
      item_cancelled: "This service is cancelled and can no longer be changed.",
      item_started: "This service has already started and can no longer be changed.",
      dates_required: "Arrival and departure dates are required.",
      date_required: "A date is required.",
      invalid_date: "Invalid date.",
      checkout_before_checkin: "The departure date must be after the arrival date.",
      date_in_past: "The date cannot be in the past.",
      same_dates: "The new dates are the same as the current ones.",
      unavailable: "These dates are not available.",
      generic: "Something went wrong.",
    },
  },
  es: {
    service: { suite: "Tienda y Suite", activity: "Actividad", daypass: "Day Pass" },
    status: { pending: "Pendiente de confirmación", confirmed: "Confirmada", cancelled: "Cancelada" },
    loading: "Cargando su reserva…",
    notFoundTitle: "Reserva no encontrada",
    notFoundBody: "Este enlace de gestión ya no es válido. Compruebe el enlace de su correo de confirmación o contáctenos directamente en el +212 667-370-206.",
    myReservation: "Mi reserva",
    hello: (n) => `Hola ${n}`,
    receivedOn: (d) => `Reserva recibida el ${d}`,
    modifyDates: "Modificar las fechas",
    cancel: "Cancelar",
    cancelling: "Cancelando…",
    total: "Total de la reserva",
    totalNote: "Puede modificar las fechas de cada servicio indicado arriba. Para cambiar el número de viajeros, contáctenos directamente.",
    specialReqs: "Peticiones especiales",
    specialReqsPlaceholder: "Régimen alimentario, ocasión especial…",
    save: "Guardar",
    saving: "Guardando…",
    cancelAll: "Cancelar toda la reserva",
    contactLine: "¿Alguna pregunta? Llámenos al +212 667-370-206 o escríbanos a info@arabiandeserthome.ma",
    confirmCancelItem: "¿Cancelar este servicio? Esta acción es irreversible.",
    confirmCancelAll: "¿Cancelar toda su reserva? Esta acción es irreversible.",
    toast: {
      itemCancelled: "Servicio cancelado",
      error: "Ha ocurrido un error",
      modificationSent: "Modificación enviada",
      modificationSentDesc: "Su reserva está pendiente de confirmación. Recibirá un correo en cuanto se valide.",
      reservationCancelled: "Reserva cancelada",
      notesSaved: "Peticiones especiales actualizadas",
    },
    panel: {
      title: "Modificar las fechas",
      newDates: "Nuevas fechas",
      infoBefore: "Tras la modificación, su reserva vuelve a estar ",
      infoStrong: "pendiente de confirmación",
      infoAfter: ": nuestro equipo comprueba la disponibilidad y se la confirma por correo. El precio puede variar según el periodo elegido.",
      closedNote: "Los días en gris no están disponibles para esta tienda.",
      confirm: "Confirmar la modificación",
      close: "Cerrar",
      errChooseRange: "Elija una fecha de llegada y después una fecha de salida.",
      errClosure: "Esta tienda no está disponible en una parte de estas fechas.",
      errChooseDate: "Elija una nueva fecha.",
      chooseDates: "Elija sus nuevas fechas",
      chooseDate: "Elija una nueva fecha",
      arrivalOn: (d) => `Llegada el ${d} — elija la salida`,
      nights: (n) => `${n} noche${n > 1 ? "s" : ""}`,
    },
    errors: {
      item_not_found: "Servicio no encontrado.",
      item_cancelled: "Este servicio está cancelado y ya no se puede modificar.",
      item_started: "Este servicio ya ha comenzado y ya no se puede modificar.",
      dates_required: "Se requieren las fechas de llegada y de salida.",
      date_required: "Se requiere una fecha.",
      invalid_date: "Fecha no válida.",
      checkout_before_checkin: "La fecha de salida debe ser posterior a la de llegada.",
      date_in_past: "La fecha no puede estar en el pasado.",
      same_dates: "Las nuevas fechas son idénticas a las actuales.",
      unavailable: "Estas fechas no están disponibles.",
      generic: "Ha ocurrido un error.",
    },
  },
  it: {
    service: { suite: "Tenda e Suite", activity: "Attività", daypass: "Day Pass" },
    status: { pending: "In attesa di conferma", confirmed: "Confermata", cancelled: "Annullata" },
    loading: "Caricamento della vostra prenotazione…",
    notFoundTitle: "Prenotazione non trovata",
    notFoundBody: "Questo link di gestione non è più valido. Controllate il link ricevuto nell'email di conferma oppure contattateci direttamente al +212 667-370-206.",
    myReservation: "La mia prenotazione",
    hello: (n) => `Buongiorno ${n}`,
    receivedOn: (d) => `Prenotazione ricevuta il ${d}`,
    modifyDates: "Modifica le date",
    cancel: "Annulla",
    cancelling: "Annullamento…",
    total: "Totale della prenotazione",
    totalNote: "Potete modificare le date di ciascun servizio qui sopra. Per cambiare il numero di viaggiatori, contattateci direttamente.",
    specialReqs: "Richieste particolari",
    specialReqsPlaceholder: "Regime alimentare, occasione speciale…",
    save: "Salva",
    saving: "Salvataggio…",
    cancelAll: "Annulla tutta la prenotazione",
    contactLine: "Domande? Chiamateci al +212 667-370-206 o scriveteci a info@arabiandeserthome.ma",
    confirmCancelItem: "Annullare questo servizio? L'azione è irreversibile.",
    confirmCancelAll: "Annullare tutta la prenotazione? L'azione è irreversibile.",
    toast: {
      itemCancelled: "Servizio annullato",
      error: "Si è verificato un errore",
      modificationSent: "Modifica inviata",
      modificationSentDesc: "La vostra prenotazione è in attesa di conferma. Riceverete un'email non appena sarà convalidata.",
      reservationCancelled: "Prenotazione annullata",
      notesSaved: "Richieste particolari aggiornate",
    },
    panel: {
      title: "Modifica le date",
      newDates: "Nuove date",
      infoBefore: "Dopo la modifica, la vostra prenotazione torna ",
      infoStrong: "in attesa di conferma",
      infoAfter: ": il nostro team verifica la disponibilità e vi conferma via email. Il prezzo può variare in base al periodo scelto.",
      closedNote: "I giorni in grigio non sono disponibili per questa tenda.",
      confirm: "Conferma la modifica",
      close: "Chiudi",
      errChooseRange: "Scegliete una data di arrivo e poi una data di partenza.",
      errClosure: "Questa tenda non è disponibile per una parte di queste date.",
      errChooseDate: "Scegliete una nuova data.",
      chooseDates: "Scegliete le nuove date",
      chooseDate: "Scegliete una nuova data",
      arrivalOn: (d) => `Arrivo il ${d} — scegliete la partenza`,
      nights: (n) => `${n} nott${n > 1 ? "i" : "e"}`,
    },
    errors: {
      item_not_found: "Servizio non trovato.",
      item_cancelled: "Questo servizio è annullato e non può più essere modificato.",
      item_started: "Questo servizio è già iniziato e non può più essere modificato.",
      dates_required: "Sono richieste le date di arrivo e di partenza.",
      date_required: "È richiesta una data.",
      invalid_date: "Data non valida.",
      checkout_before_checkin: "La data di partenza deve essere successiva a quella di arrivo.",
      date_in_past: "La data non può essere nel passato.",
      same_dates: "Le nuove date coincidono con quelle attuali.",
      unavailable: "Queste date non sono disponibili.",
      generic: "Si è verificato un errore.",
    },
  },
};

const SERVICE_ICON: Record<string, React.ElementType> = { suite: Tent, activity: Bike, daypass: Sun };

const STATUS_STYLE: Record<string, { className: string; icon: React.ElementType }> = {
  pending: { className: "bg-amber/10 text-amber border-amber/20", icon: Clock },
  confirmed: { className: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle2 },
  cancelled: { className: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
};

/** The guest-facing text for an API error, translated by its code. */
function errorText(c: Copy, data: { code?: string; error?: string }): string {
  return (data.code && c.errors[data.code]) || c.errors.generic;
}

function itemName(item: ReservationItem, language: Language): string {
  const row = item.suite ?? item.activity ?? item.dayPass;
  if (!row) return "—";
  const translated = { fr: row.name, en: row.nameEn, es: row.nameEs, it: row.nameIt }[language];
  return translated || row.name;
}

function itemDates(item: ReservationItem, locale: Locale): string {
  if (item.serviceType === "suite" && item.checkIn && item.checkOut) {
    return `${format(new Date(item.checkIn), "d MMM yyyy", { locale })} → ${format(new Date(item.checkOut), "d MMM yyyy", { locale })}`;
  }
  if (item.date) return format(new Date(item.date), "d MMM yyyy", { locale });
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
  const { language } = useLanguage();
  const c = COPY[language].panel;
  const locale = DATE_LOCALES[language];
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
        setLocalError(c.errChooseRange);
        return;
      }
      if (rangeOverlapsClosure(range.from, range.to, closures)) {
        setLocalError(c.errClosure);
        return;
      }
      onSubmit({ checkIn: range.from.toISOString(), checkOut: range.to.toISOString() });
    } else {
      if (!single) {
        setLocalError(c.errChooseDate);
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
      ? `${format(range.from, "d MMM yyyy", { locale })} → ${format(range.to, "d MMM yyyy", { locale })} · ${c.nights(nights)}`
      : range?.from
        ? c.arrivalOn(format(range.from, "d MMM yyyy", { locale }))
        : c.chooseDates
    : single
      ? format(single, "EEEE d MMMM yyyy", { locale })
      : c.chooseDate;

  const shownError = localError ?? error;

  return (
    <div className="mt-5 pt-5 border-t border-amber/10">
      <p className="luxury-label text-amber/80 text-[10px] mb-3">{c.title}</p>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="rounded-2xl border border-border/50 bg-background/60 self-start">
          {isSuite ? (
            <Calendar
              mode="range"
              locale={locale}
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
              locale={locale}
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
            <p className="text-xs text-muted-foreground mb-1">{c.newDates}</p>
            <p className="font-serif text-base">{summary}</p>
          </div>
          <div className="flex gap-2 rounded-2xl bg-amber/5 border border-amber/15 p-3 text-xs text-muted-foreground leading-relaxed">
            <Info className="w-4 h-4 text-amber shrink-0 mt-0.5" />
            <span>
              {c.infoBefore}<strong>{c.infoStrong}</strong>{c.infoAfter}
            </span>
          </div>
          {isSuite && closures.length > 0 && (
            <p className="text-xs text-muted-foreground">{c.closedNote}</p>
          )}
          {shownError && <p className="text-sm text-red-500">{shownError}</p>}
          <div className="flex flex-wrap items-center gap-4 mt-auto">
            <button
              onClick={submit}
              disabled={saving}
              className="btn-primary text-sm disabled:opacity-50 cursor-pointer inline-flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saving ? COPY[language].saving : c.confirm}
            </button>
            <button
              onClick={onClose}
              disabled={saving}
              className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {c.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ManageReservation() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const { language } = useLanguage();
  const c = COPY[language];
  const locale = DATE_LOCALES[language];
  const numberLocale = LANG_LOCALE[language];
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
    if (!confirm(c.confirmCancelItem)) return;
    setBusyItemId(itemId);
    const ok = await patch({ action: "cancelItem", itemId });
    toast(ok
      ? { title: c.toast.itemCancelled }
      : { title: c.toast.error, variant: "destructive" });
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
        title: c.toast.modificationSent,
        description: c.toast.modificationSentDesc,
      });
    } else {
      setModifyError(errorText(c, data));
    }
    setModifying(false);
  }

  async function handleCancelAll() {
    if (!confirm(c.confirmCancelAll)) return;
    setCancellingAll(true);
    const ok = await patch({ action: "cancelAll" });
    toast(ok
      ? { title: c.toast.reservationCancelled }
      : { title: c.toast.error, variant: "destructive" });
    setCancellingAll(false);
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    const ok = await patch({ action: "updateSpecialReqs", specialReqs });
    toast(ok
      ? { title: c.toast.notesSaved }
      : { title: c.toast.error, variant: "destructive" });
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
              {c.loading}
            </div>
          )}

          {!loading && notFound && (
            <div className="glass-card card-warm p-10 text-center">
              <h1 className="heading-editorial text-2xl mb-3">{c.notFoundTitle}</h1>
              <p className="text-muted-foreground body-editorial">
                {c.notFoundBody}
              </p>
            </div>
          )}

          {!loading && reservation && (
            <>
              <div className="mb-10">
                <p className="luxury-label text-amber/80 mb-2">{c.myReservation}</p>
                <h1 className="heading-display text-3xl md:text-4xl mb-2">
                  {c.hello(reservation.firstName)}
                </h1>
                <p className="text-sm text-muted-foreground body-editorial">
                  {c.receivedOn(format(new Date(reservation.createdAt), "d MMMM yyyy", { locale }))}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {reservation.items.map((item) => {
                  const Icon = SERVICE_ICON[item.serviceType] ?? Tent;
                  const statusKey = (item.status in STATUS_STYLE ? item.status : "pending") as keyof typeof STATUS_STYLE;
                  const status = STATUS_STYLE[statusKey];
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
                        <p className="luxury-label text-amber/70 text-[10px] mb-1">{c.service[item.serviceType as keyof Copy["service"]] ?? item.serviceType}</p>
                        <p className="font-serif text-lg mb-1">{itemName(item, language)}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{itemDates(item, locale)}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{item.guests}</span>
                          {item.children > 0 && <span className="flex items-center gap-1"><Baby className="w-3 h-3" />{item.children}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                        <span className="mono-number text-amber text-base">{formatMoney(item.totalAmount, numberLocale)} {item.currency}</span>
                        <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${status.className}`}>
                          <StatusIcon className="w-3 h-3" />{c.status[statusKey]}
                        </span>
                        <div className="flex items-center gap-4">
                          {canModify && !isEditing && (
                            <button
                              onClick={() => { setEditingItemId(item.id); setModifyError(null); }}
                              className="text-xs text-amber hover:underline cursor-pointer"
                            >
                              {c.modifyDates}
                            </button>
                          )}
                          {item.status !== "cancelled" && (
                            <button
                              onClick={() => handleCancelItem(item.id)}
                              disabled={busyItemId === item.id}
                              className="text-xs text-red-500 hover:underline disabled:opacity-40 cursor-pointer"
                            >
                              {busyItemId === item.id ? c.cancelling : c.cancel}
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
                  <span className="luxury-label text-amber/70">{c.total}</span>
                  <span className="mono-number text-2xl text-amber">
                    {formatMoney(reservation.totalAmount, numberLocale)} {reservation.currency}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {c.totalNote}
                </p>
              </div>

              <div className="glass-card card-warm p-6 mb-8">
                <label className="luxury-label text-xs block mb-2">{c.specialReqs}</label>
                <Textarea
                  value={specialReqs}
                  onChange={(e) => setSpecialReqs(e.target.value)}
                  rows={3}
                  className="rounded-2xl border-border/50 focus:border-amber/50 bg-background/50 resize-none mb-3"
                  placeholder={c.specialReqsPlaceholder}
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="btn-outline text-sm disabled:opacity-40 cursor-pointer"
                >
                  {savingNotes ? c.saving : c.save}
                </button>
              </div>

              {!allCancelled && (
                <div className="text-center">
                  <button
                    onClick={handleCancelAll}
                    disabled={cancellingAll}
                    className="text-sm text-red-500 hover:underline disabled:opacity-40 cursor-pointer"
                  >
                    {cancellingAll ? c.cancelling : c.cancelAll}
                  </button>
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground mt-10 body-editorial">
                {c.contactLine}
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
