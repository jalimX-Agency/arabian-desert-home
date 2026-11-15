"use client";

import { useEffect, useRef, useState } from "react";
import { Banknote, Check, Copy, FileCheck2, Loader2, Upload } from "lucide-react";
import type { Language } from "@/lib/i18n/context";
import { LANG_LOCALE } from "@/lib/reservation-lang";
import { formatMoney } from "@/lib/money";

interface BankDetails {
  holder: string;
  bank: string;
  iban: string;
  rib: string;
  swift: string;
  note: string;
}

interface DepositCopy {
  titleAwaiting: string;
  intro: string;
  amount: string;
  reference: string;
  bankTitle: string;
  holder: string;
  bank: string;
  iban: string;
  rib: string;
  swift: string;
  noBank: string;
  uploadTitle: string;
  uploadHint: string;
  choose: string;
  send: string;
  sending: string;
  titleReview: string;
  reviewBody: (date: string) => string;
  resend: string;
  copied: string;
  errors: Record<string, string>;
}

const COPY: Record<Language, DepositCopy> = {
  fr: {
    titleAwaiting: "Confirmez votre réservation",
    intro: "Votre demande est acceptée ! Pour la confirmer, merci de verser un acompte de 50 % par virement bancaire, puis de nous envoyer le justificatif ci-dessous.",
    amount: "Acompte à verser (50 %)",
    reference: "Référence à indiquer sur le virement",
    bankTitle: "Nos coordonnées bancaires",
    holder: "Titulaire", bank: "Banque", iban: "IBAN", rib: "RIB", swift: "SWIFT / BIC",
    noBank: "Nos coordonnées bancaires vous seront communiquées par email ou WhatsApp. Contactez-nous au +212 667-370-206.",
    uploadTitle: "Justificatif de virement",
    uploadHint: "Capture d'écran ou PDF du virement (JPG, PNG, WebP ou PDF, 4 Mo max).",
    choose: "Choisir un fichier",
    send: "Envoyer le justificatif",
    sending: "Envoi…",
    titleReview: "Paiement en cours de vérification",
    reviewBody: (d) => `Merci ! Nous avons bien reçu votre justificatif le ${d}. Notre équipe vérifie le paiement et vous confirme la réservation par email très vite.`,
    resend: "Envoyer un autre justificatif",
    copied: "Copié",
    errors: { bad_type: "Format non supporté : utilisez une image (JPG, PNG, WebP) ou un PDF.", too_large: "Fichier trop volumineux (4 Mo maximum).", missing_file: "Choisissez un fichier.", generic: "L'envoi a échoué. Réessayez ou contactez-nous." },
  },
  en: {
    titleAwaiting: "Confirm your reservation",
    intro: "Your request is accepted! To confirm it, please send a 50% advance by bank transfer, then upload the proof of transfer below.",
    amount: "Advance to pay (50%)",
    reference: "Reference to write on the transfer",
    bankTitle: "Our bank details",
    holder: "Account holder", bank: "Bank", iban: "IBAN", rib: "RIB", swift: "SWIFT / BIC",
    noBank: "We will send you our bank details by email or WhatsApp. Contact us at +212 667-370-206.",
    uploadTitle: "Proof of transfer",
    uploadHint: "Screenshot or PDF of the transfer (JPG, PNG, WebP or PDF, 4 MB max).",
    choose: "Choose a file",
    send: "Send the proof",
    sending: "Sending…",
    titleReview: "Payment being checked",
    reviewBody: (d) => `Thank you! We received your proof of transfer on ${d}. Our team is checking the payment and will confirm your reservation by email very soon.`,
    resend: "Send another proof",
    copied: "Copied",
    errors: { bad_type: "Unsupported format: use an image (JPG, PNG, WebP) or a PDF.", too_large: "File too large (4 MB max).", missing_file: "Choose a file.", generic: "Upload failed. Please try again or contact us." },
  },
  es: {
    titleAwaiting: "Confirme su reserva",
    intro: "¡Su solicitud ha sido aceptada! Para confirmarla, realice un anticipo del 50 % por transferencia bancaria y envíenos el justificante a continuación.",
    amount: "Anticipo a pagar (50 %)",
    reference: "Referencia a indicar en la transferencia",
    bankTitle: "Nuestros datos bancarios",
    holder: "Titular", bank: "Banco", iban: "IBAN", rib: "RIB", swift: "SWIFT / BIC",
    noBank: "Le enviaremos nuestros datos bancarios por email o WhatsApp. Contáctenos al +212 667-370-206.",
    uploadTitle: "Justificante de transferencia",
    uploadHint: "Captura de pantalla o PDF de la transferencia (JPG, PNG, WebP o PDF, máx. 4 MB).",
    choose: "Elegir un archivo",
    send: "Enviar el justificante",
    sending: "Enviando…",
    titleReview: "Pago en verificación",
    reviewBody: (d) => `¡Gracias! Recibimos su justificante el ${d}. Nuestro equipo está verificando el pago y le confirmará la reserva por email muy pronto.`,
    resend: "Enviar otro justificante",
    copied: "Copiado",
    errors: { bad_type: "Formato no compatible: use una imagen (JPG, PNG, WebP) o un PDF.", too_large: "Archivo demasiado grande (máx. 4 MB).", missing_file: "Elija un archivo.", generic: "El envío ha fallado. Inténtelo de nuevo o contáctenos." },
  },
  it: {
    titleAwaiting: "Confermi la sua prenotazione",
    intro: "La sua richiesta è accettata! Per confermarla, versi un acconto del 50% tramite bonifico bancario e ci invii la ricevuta qui sotto.",
    amount: "Acconto da versare (50%)",
    reference: "Riferimento da indicare nel bonifico",
    bankTitle: "Le nostre coordinate bancarie",
    holder: "Intestatario", bank: "Banca", iban: "IBAN", rib: "RIB", swift: "SWIFT / BIC",
    noBank: "Le invieremo le coordinate bancarie via email o WhatsApp. Ci contatti al +212 667-370-206.",
    uploadTitle: "Ricevuta del bonifico",
    uploadHint: "Screenshot o PDF del bonifico (JPG, PNG, WebP o PDF, max 4 MB).",
    choose: "Scegli un file",
    send: "Invia la ricevuta",
    sending: "Invio…",
    titleReview: "Pagamento in verifica",
    reviewBody: (d) => `Grazie! Abbiamo ricevuto la sua ricevuta il ${d}. Il nostro team sta verificando il pagamento e le confermerà la prenotazione via email al più presto.`,
    resend: "Invia un'altra ricevuta",
    copied: "Copiato",
    errors: { bad_type: "Formato non supportato: usi un'immagine (JPG, PNG, WebP) o un PDF.", too_large: "File troppo grande (max 4 MB).", missing_file: "Scelga un file.", generic: "Invio non riuscito. Riprovi o ci contatti." },
  },
};

const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

/** A value the guest copies into their banking app, with a one-tap copy button. */
function CopyRow({ label, value, copiedLabel, mono = true }: { label: string; value: string; copiedLabel: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border/40 last:border-0">
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className={`text-sm break-all ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }}
        className="shrink-0 inline-flex items-center gap-1 text-xs text-amber hover:underline cursor-pointer min-h-[44px] px-2"
        aria-label={`${label}: copy`}
      >
        {copied ? <><Check className="w-3.5 h-3.5" />{copiedLabel}</> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

/**
 * Shown while the camp waits for the guest's advance: amount (50 %), transfer reference,
 * bank details, and the proof upload. Once sent, it tells the guest the payment is being checked.
 */
export function DepositSection({ token, language, status, depositAmount, depositProofAt, currency, onSent }: {
  token: string;
  language: Language;
  /** "awaiting_payment" or "payment_review". */
  status: string;
  depositAmount: number | null;
  depositProofAt: string | null;
  currency: string;
  onSent: () => void;
}) {
  const c = COPY[language];
  const locale = LANG_LOCALE[language];
  const [info, setInfo] = useState<{ bank: BankDetails | null; reference: string } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(status !== "payment_review");
  const inputRef = useRef<HTMLInputElement>(null);
  const review = status === "payment_review";

  useEffect(() => {
    fetch(`/api/reservations/${token}/deposit`).then((r) => (r.ok ? r.json() : null)).then(setInfo).catch(() => setInfo(null));
  }, [token]);

  function pick(f: File | null) {
    setError("");
    if (!f) return setFile(null);
    if (!TYPES.includes(f.type)) return setError(c.errors.bad_type);
    if (f.size > MAX_BYTES) return setError(c.errors.too_large);
    setFile(f);
  }

  async function send() {
    if (!file) return setError(c.errors.missing_file);
    setSending(true);
    setError("");
    try {
      const form = new FormData();
      form.append("proof", file);
      const res = await fetch(`/api/reservations/${token}/deposit`, { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError(c.errors[data.code] ?? c.errors.generic);
      setFile(null);
      setShowUpload(false);
      onSent();
    } catch {
      setError(c.errors.generic);
    } finally {
      setSending(false);
    }
  }

  const bank = info?.bank;

  return (
    <div className={`glass-card card-warm p-6 mb-8 border ${review ? "border-blue-500/25" : "border-amber/30"}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${review ? "bg-blue-500/10" : "bg-amber/10"}`}>
          {review ? <FileCheck2 className="w-5 h-5 text-blue-600" /> : <Banknote className="w-5 h-5 text-amber" />}
        </div>
        <div>
          <h2 className="font-serif text-xl mb-1">{review ? c.titleReview : c.titleAwaiting}</h2>
          <p className="text-sm text-muted-foreground body-editorial">
            {review && depositProofAt
              ? c.reviewBody(new Date(depositProofAt).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }))
              : c.intro}
          </p>
        </div>
      </div>

      {!review && (
        <>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl bg-amber/10 border border-amber/20 p-4">
              <p className="luxury-label text-amber/80 text-[10px] mb-1">{c.amount}</p>
              <p className="mono-number text-2xl text-amber">{formatMoney(depositAmount ?? 0, locale)} {currency}</p>
            </div>
            <div className="rounded-xl bg-background/50 border border-border/50 p-4">
              <p className="luxury-label text-amber/80 text-[10px] mb-1">{c.reference}</p>
              <p className="font-mono text-xl tracking-wider">{info?.reference ?? "…"}</p>
            </div>
          </div>

          <div className="mb-5">
            <p className="luxury-label text-xs mb-2">{c.bankTitle}</p>
            {!info ? (
              <div className="h-24 rounded-xl bg-muted/40 animate-pulse" />
            ) : bank ? (
              <div className="rounded-xl border border-border/50 bg-background/50 px-4">
                <CopyRow label={c.holder} value={bank.holder} copiedLabel={c.copied} mono={false} />
                <CopyRow label={c.bank} value={bank.bank} copiedLabel={c.copied} mono={false} />
                <CopyRow label={c.iban} value={bank.iban} copiedLabel={c.copied} />
                <CopyRow label={c.rib} value={bank.rib} copiedLabel={c.copied} />
                <CopyRow label={c.swift} value={bank.swift} copiedLabel={c.copied} />
                <CopyRow label={c.reference} value={info.reference} copiedLabel={c.copied} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{c.noBank}</p>
            )}
            {bank?.note && <p className="text-xs text-muted-foreground mt-2 whitespace-pre-line">{bank.note}</p>}
          </div>
        </>
      )}

      {review && !showUpload ? (
        <button type="button" onClick={() => setShowUpload(true)} className="text-xs text-amber hover:underline cursor-pointer">
          {c.resend}
        </button>
      ) : (
        <div>
          <p className="luxury-label text-xs mb-1">{c.uploadTitle}</p>
          <p className="text-xs text-muted-foreground mb-3">{c.uploadHint}</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0] ?? null)}
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn-outline text-sm cursor-pointer inline-flex items-center justify-center gap-2 min-w-0"
            >
              <Upload className="w-4 h-4 shrink-0" />
              <span className="truncate">{file ? file.name : c.choose}</span>
            </button>
            <button
              type="button"
              onClick={send}
              disabled={!file || sending}
              className="btn-primary text-sm cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {sending && <Loader2 className="w-4 h-4 animate-spin" />}
              {sending ? c.sending : c.send}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}
