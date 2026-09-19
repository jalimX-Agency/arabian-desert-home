"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { fr, enUS, es } from "date-fns/locale";
import {
  Tent, Bike, Sun, Sparkles, Users, Baby, CalendarDays, Loader2,
  CheckCircle2, XCircle, Clock, FileDown, AlertTriangle,
} from "lucide-react";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Lang = "fr" | "en" | "es";

interface DevisItem {
  id: string;
  kind: string;
  serviceType: string;
  label: string;
  description?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  date?: string | null;
  quantity: number;
  guests: number;
  children: number;
  totalAmount: number;
  currency: string;
}

interface Devis {
  reference: string;
  status: string;
  firstName: string;
  lastName: string;
  title?: string | null;
  conditions?: string | null;
  lang: string;
  currency: string;
  totalAmount: number;
  validUntil: string;
  createdAt: string;
  answeredAt?: string | null;
  expired: boolean;
  items: DevisItem[];
}

const SERVICE_ICON: Record<string, React.ElementType> = {
  suite: Tent, activity: Bike, daypass: Sun, custom: Sparkles,
};

const DATE_LOCALE = { fr, en: enUS, es } as const;

const T = {
  fr: {
    eyebrow: "Votre devis", hello: (n: string) => `Bonjour ${n}`,
    issued: "Émis le", validUntil: "Valable jusqu'au", total: "Montant total",
    conditions: "Conditions", download: "Télécharger le PDF",
    accept: "Accepter le devis", refuse: "Refuser le devis",
    accepting: "Envoi…", messageLabel: "Un message pour notre équipe (facultatif)",
    messagePlaceholder: "Une précision, une question…",
    confirmAccept: "Confirmer l'acceptation de ce devis ?",
    confirmRefuse: "Confirmer le refus de ce devis ?",
    acceptedTitle: "Devis accepté", acceptedText: "Merci ! Notre équipe vous recontacte très vite pour finaliser votre réservation.",
    refusedTitle: "Devis refusé", refusedText: "Votre réponse a bien été enregistrée. N'hésitez pas à nous contacter si vos projets changent.",
    convertedTitle: "Devis confirmé", convertedText: "Ce devis est devenu une réservation. Vous avez reçu votre fiche par email.",
    expiredTitle: "Devis expiré", expiredText: "La validité de ce devis est dépassée. Contactez-nous pour en recevoir un nouveau.",
    cancelledTitle: "Devis annulé", cancelledText: "Ce devis a été annulé par notre équipe.",
    notFound: "Devis introuvable", notFoundText: "Ce lien n'est plus valide. Vérifiez le lien reçu par email ou contactez-nous.",
    loading: "Chargement de votre devis…",
    questions: "Des questions ? Contactez-nous au +212 667-370-206 ou info@arabiandeserthome.ma",
    nights: (n: number) => `${n} nuit${n > 1 ? "s" : ""}`,
    qty: "Qté",
  },
  en: {
    eyebrow: "Your quotation", hello: (n: string) => `Hello ${n}`,
    issued: "Issued on", validUntil: "Valid until", total: "Total amount",
    conditions: "Terms", download: "Download the PDF",
    accept: "Accept the quotation", refuse: "Decline the quotation",
    accepting: "Sending…", messageLabel: "A message for our team (optional)",
    messagePlaceholder: "A detail, a question…",
    confirmAccept: "Confirm that you accept this quotation?",
    confirmRefuse: "Confirm that you decline this quotation?",
    acceptedTitle: "Quotation accepted", acceptedText: "Thank you! Our team will contact you shortly to finalise your reservation.",
    refusedTitle: "Quotation declined", refusedText: "Your answer has been recorded. Do get in touch if your plans change.",
    convertedTitle: "Quotation confirmed", convertedText: "This quotation is now a reservation. Your confirmation was sent by email.",
    expiredTitle: "Quotation expired", expiredText: "This quotation is past its validity date. Contact us for a new one.",
    cancelledTitle: "Quotation cancelled", cancelledText: "This quotation was cancelled by our team.",
    notFound: "Quotation not found", notFoundText: "This link is no longer valid. Check the link in your email or contact us.",
    loading: "Loading your quotation…",
    questions: "Any questions? Call +212 667-370-206 or email info@arabiandeserthome.ma",
    nights: (n: number) => `${n} night${n > 1 ? "s" : ""}`,
    qty: "Qty",
  },
  es: {
    eyebrow: "Su presupuesto", hello: (n: string) => `Hola ${n}`,
    issued: "Emitido el", validUntil: "Válido hasta", total: "Importe total",
    conditions: "Condiciones", download: "Descargar el PDF",
    accept: "Aceptar el presupuesto", refuse: "Rechazar el presupuesto",
    accepting: "Enviando…", messageLabel: "Un mensaje para nuestro equipo (opcional)",
    messagePlaceholder: "Una precisión, una pregunta…",
    confirmAccept: "¿Confirmar la aceptación de este presupuesto?",
    confirmRefuse: "¿Confirmar el rechazo de este presupuesto?",
    acceptedTitle: "Presupuesto aceptado", acceptedText: "¡Gracias! Nuestro equipo se pondrá en contacto muy pronto para finalizar su reserva.",
    refusedTitle: "Presupuesto rechazado", refusedText: "Su respuesta ha sido registrada. Contáctenos si sus planes cambian.",
    convertedTitle: "Presupuesto confirmado", convertedText: "Este presupuesto es ahora una reserva. Ha recibido su ficha por email.",
    expiredTitle: "Presupuesto caducado", expiredText: "La validez de este presupuesto ha pasado. Contáctenos para recibir uno nuevo.",
    cancelledTitle: "Presupuesto anulado", cancelledText: "Este presupuesto fue anulado por nuestro equipo.",
    notFound: "Presupuesto no encontrado", notFoundText: "Este enlace ya no es válido. Compruebe el enlace de su email o contáctenos.",
    loading: "Cargando su presupuesto…",
    questions: "¿Preguntas? Llame al +212 667-370-206 o escriba a info@arabiandeserthome.ma",
    nights: (n: number) => `${n} noche${n > 1 ? "s" : ""}`,
    qty: "Cant.",
  },
};

export default function DevisPage() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [devis, setDevis] = useState<Devis | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<"accept" | "refuse" | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/devis/${token}`);
    if (res.ok) setDevis(await res.json());
    else setNotFound(true);
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const lang: Lang = (["fr", "en", "es"].includes(devis?.lang ?? "") ? devis!.lang : "fr") as Lang;
  const t = T[lang];
  const locale = DATE_LOCALE[lang];

  async function answer(action: "accept" | "refuse") {
    if (!confirm(action === "accept" ? t.confirmAccept : t.confirmRefuse)) return;
    setBusy(action);
    const res = await fetch(`/api/devis/${token}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, message }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setDevis(data);
      toast({ title: action === "accept" ? t.acceptedTitle : t.refusedTitle });
    } else {
      toast({ title: data.error ?? "Error", variant: "destructive" });
      load();
    }
    setBusy(null);
  }

  function itemDates(item: DevisItem): string | null {
    if (item.checkIn && item.checkOut) {
      const nights = Math.max(1, Math.round((new Date(item.checkOut).getTime() - new Date(item.checkIn).getTime()) / 86_400_000));
      return `${format(new Date(item.checkIn), "d MMM yyyy", { locale })} → ${format(new Date(item.checkOut), "d MMM yyyy", { locale })} · ${t.nights(nights)}`;
    }
    if (item.date) return format(new Date(item.date), "d MMM yyyy", { locale });
    return null;
  }

  const canAnswer = devis?.status === "sent" && !devis.expired && !devis.answeredAt;

  const banner = !devis ? null
    : devis.status === "accepted" ? { icon: CheckCircle2, title: t.acceptedTitle, text: t.acceptedText, cls: "border-green-500/30 bg-green-500/10 text-green-600" }
    : devis.status === "refused" ? { icon: XCircle, title: t.refusedTitle, text: t.refusedText, cls: "border-red-500/30 bg-red-500/10 text-red-500" }
    : devis.status === "converted" ? { icon: CheckCircle2, title: t.convertedTitle, text: t.convertedText, cls: "border-green-500/30 bg-green-500/10 text-green-600" }
    : devis.status === "cancelled" ? { icon: XCircle, title: t.cancelledTitle, text: t.cancelledText, cls: "border-red-500/30 bg-red-500/10 text-red-500" }
    : devis.expired || devis.status === "expired" ? { icon: AlertTriangle, title: t.expiredTitle, text: t.expiredText, cls: "border-amber/30 bg-amber/10 text-amber" }
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mb-3" />
              {T.fr.loading}
            </div>
          )}

          {!loading && notFound && (
            <div className="glass-card card-warm p-10 text-center">
              <h1 className="heading-editorial text-2xl mb-3">{T.fr.notFound}</h1>
              <p className="text-muted-foreground body-editorial">{T.fr.notFoundText}</p>
            </div>
          )}

          {!loading && devis && (
            <>
              <div className="mb-10">
                <p className="mono-meta text-amber mb-3">{t.eyebrow} · {devis.reference}</p>
                <h1 className="heading-display text-3xl md:text-4xl mb-3">{t.hello(devis.firstName)}</h1>
                {devis.title && <p className="font-serif text-lg text-muted-foreground mb-2">{devis.title}</p>}
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground body-editorial">
                  <span>{t.issued} {format(new Date(devis.createdAt), "d MMMM yyyy", { locale })}</span>
                  <span className={devis.expired ? "text-red-500" : ""}>
                    <Clock className="w-3 h-3 inline mr-1" />
                    {t.validUntil} {format(new Date(devis.validUntil), "d MMMM yyyy", { locale })}
                  </span>
                </div>
              </div>

              {banner && (
                <div className={`flex items-start gap-3 rounded-2xl border p-5 mb-8 ${banner.cls}`}>
                  <banner.icon className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-serif text-lg mb-1">{banner.title}</p>
                    <p className="text-sm opacity-90 body-editorial">{banner.text}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-8">
                {devis.items.map((item) => {
                  const Icon = SERVICE_ICON[item.kind === "custom" ? "custom" : item.serviceType] ?? Sparkles;
                  const dates = itemDates(item);
                  return (
                    <div key={item.id} className="glass-card card-warm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-amber" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-lg mb-1">{item.label}</p>
                        {item.description && <p className="text-sm text-muted-foreground mb-1 body-editorial">{item.description}</p>}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          {dates && <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{dates}</span>}
                          {item.kind !== "custom" && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{item.guests}</span>}
                          {item.kind !== "custom" && item.children > 0 && <span className="flex items-center gap-1"><Baby className="w-3 h-3" />{item.children}</span>}
                          {item.quantity > 1 && <span>{t.qty} {item.quantity}</span>}
                        </div>
                      </div>
                      <span className={`mono-number text-base shrink-0 ${item.totalAmount < 0 ? "text-red-500" : "text-amber"}`}>
                        {item.totalAmount.toLocaleString("fr-FR")} {item.currency}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="glass-card card-warm p-6 mb-8">
                <div className="flex items-center justify-between">
                  <span className="luxury-label text-amber/70">{t.total}</span>
                  <span className="mono-number text-2xl text-amber">
                    {devis.totalAmount.toLocaleString("fr-FR")} {devis.currency}
                  </span>
                </div>
              </div>

              {devis.conditions && (
                <div className="glass-card card-warm p-6 mb-8">
                  <p className="luxury-label text-amber/70 mb-2">{t.conditions}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap body-editorial">{devis.conditions}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <a href={`/api/devis/${token}/pdf`} target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex items-center gap-2 text-sm cursor-pointer">
                  <FileDown className="w-4 h-4" />
                  {t.download}
                </a>
              </div>

              {canAnswer && (
                <div className="glass-card card-warm p-6">
                  <label className="luxury-label text-xs block mb-2">{t.messageLabel}</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder={t.messagePlaceholder}
                    className="rounded-2xl border-border/50 focus:border-amber/50 bg-background/50 resize-none mb-4"
                  />
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => answer("accept")}
                      disabled={busy !== null}
                      className="btn-primary inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {busy === "accept" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {busy === "accept" ? t.accepting : t.accept}
                    </button>
                    <button
                      onClick={() => answer("refuse")}
                      disabled={busy !== null}
                      className="text-sm text-red-500 hover:underline cursor-pointer disabled:opacity-40"
                    >
                      {busy === "refuse" ? t.accepting : t.refuse}
                    </button>
                  </div>
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground mt-10 body-editorial">{t.questions}</p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
