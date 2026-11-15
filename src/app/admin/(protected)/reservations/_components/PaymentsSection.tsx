"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Banknote, CheckCircle2, Loader2, Mail, Paperclip, Pencil, Percent, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import { ConfirmDialog } from "./ConfirmDialog";

interface PaymentRow {
  id: string;
  amount: number;
  method: string;
  paidAt: string;
  note: string | null;
  proofUrl: string | null;
  emailSentAt: string | null;
}

interface PaymentsData {
  payments: PaymentRow[];
  total: number | null;
  currency?: string;
  paid: number;
  balance: number | null;
  /** Discount granted on the reservation; total is already net of it. */
  discount: number;
  discountNote: string | null;
  legacy: boolean;
}

const METHOD_LABEL: Record<string, string> = {
  bank_transfer: "Virement bancaire",
  cash: "Espèces",
  card: "Carte bancaire",
  other: "Autre",
};

const MAX_PROOF_MB = 4;

/**
 * Advance payments on a reservation: what was received, the proof (transfer receipt) and what is
 * left to pay. Recording a payment emails the guest a receipt, and the fiche PDF shows the advance.
 */
export function PaymentsSection({ reservationId, hasReservation, onChanged }: { reservationId: string; hasReservation: boolean; onChanged?: () => void }) {
  const [data, setData] = useState<PaymentsData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [discountOpen, setDiscountOpen] = useState(false);

  const load = useCallback(async () => {
    if (!hasReservation) return;
    try {
      const res = await fetch(`/api/admin/reservations/${reservationId}/payments`);
      if (!res.ok) throw new Error();
      setData(await res.json());
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, [reservationId, hasReservation]);

  useEffect(() => {
    setData(null);
    void load();
  }, [load]);

  async function remove(id: string) {
    const res = await fetch(`/api/admin/reservations/${reservationId}/payments/${id}`, { method: "DELETE" });
    if (res.ok) {
      void load();
      onChanged?.();
    }
  }

  const currency = data?.currency ?? "EUR";

  return (
    <div className="space-y-3 rounded-xl border border-gray-200 dark:border-white/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
          <Banknote className="w-3.5 h-3.5" /> Paiements / acompte
        </p>
        {hasReservation && !loadError && (
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDiscountOpen(true)} disabled={!data} className="cursor-pointer text-xs">
              <Percent className="w-3.5 h-3.5" /> {data && data.discount > 0 ? "Modifier la réduction" : "Réduction"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)} disabled={!data || (data.balance ?? 0) <= 0} className="cursor-pointer text-xs">
              <Plus className="w-3.5 h-3.5" /> Ajouter un paiement
            </Button>
          </div>
        )}
      </div>

      {!hasReservation ? (
        <p className="text-xs text-gray-400">Ancienne réservation sans dossier de paiement : l&apos;acompte ne peut pas y être enregistré.</p>
      ) : loadError ? (
        <p className="text-xs text-red-500">Impossible de charger les paiements.</p>
      ) : !data ? (
        <div className="h-16 rounded-lg bg-gray-100 dark:bg-white/5 animate-pulse" />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-gray-50 dark:bg-white/5 py-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Total</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatMoney(data.total ?? 0)} {currency}</p>
            </div>
            <div className="rounded-lg bg-green-50 dark:bg-green-500/10 py-2">
              <p className="text-[10px] uppercase tracking-widest text-green-700 dark:text-green-400">Reçu</p>
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">{formatMoney(data.paid)} {currency}</p>
            </div>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 py-2">
              <p className="text-[10px] uppercase tracking-widest text-amber-700 dark:text-amber-400">Reste</p>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">{formatMoney(data.balance ?? 0)} {currency}</p>
            </div>
          </div>

          {data.discount > 0 && (
            <p className="text-xs text-green-700 dark:text-green-400">
              Réduction accordée : − {formatMoney(data.discount)} {currency}
              {data.discountNote ? ` (${data.discountNote})` : ""}
              <span className="text-gray-400"> · total des prestations {formatMoney((data.total ?? 0) + data.discount)} {currency}</span>
            </p>
          )}

          {data.payments.length === 0 ? (
            <p className="text-xs text-gray-400">Aucun paiement enregistré.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-white/10">
              {data.payments.map((p) => (
                <li key={p.id} className="py-2.5 flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-semibold">{formatMoney(p.amount)} {currency}</span>
                      <span className="text-gray-400"> · {METHOD_LABEL[p.method] ?? p.method}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(p.paidAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}
                      {p.note ? ` · ${p.note}` : ""}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {p.proofUrl ? (
                        <a href={p.proofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline">
                          <Paperclip className="w-3 h-3" /> Justificatif
                        </a>
                      ) : (
                        <span className="text-gray-400">Sans justificatif</span>
                      )}
                      {p.emailSentAt ? (
                        <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-400">
                          <CheckCircle2 className="w-3 h-3" /> Email envoyé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400">
                          <Mail className="w-3 h-3" /> Email non envoyé
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditing(p)}
                      className="cursor-pointer text-gray-400 hover:text-amber-600"
                      aria-label="Modifier ce paiement"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(p.id)}
                      className="cursor-pointer text-gray-400 hover:text-red-500"
                      aria-label="Supprimer ce paiement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {data && (
        <PaymentDialog
          open={open}
          onOpenChange={setOpen}
          reservationId={reservationId}
          currency={currency}
          balance={data.balance ?? 0}
          payment={null}
          onSaved={() => { setOpen(false); void load(); onChanged?.(); }}
        />
      )}
      {data && (
        <PaymentDialog
          open={editing !== null}
          onOpenChange={(o) => { if (!o) setEditing(null); }}
          reservationId={reservationId}
          currency={currency}
          balance={data.balance ?? 0}
          payment={editing}
          onSaved={() => { setEditing(null); void load(); onChanged?.(); }}
        />
      )}

      {data && discountOpen && (
        <DiscountDialog
          open={discountOpen}
          onOpenChange={setDiscountOpen}
          reservationId={reservationId}
          currency={currency}
          subtotal={(data.total ?? 0) + data.discount}
          paid={data.paid}
          current={data.discount}
          currentNote={data.discountNote}
          onSaved={() => { setDiscountOpen(false); void load(); onChanged?.(); }}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(o) => { if (!o) setDeleteId(null); }}
        title="Supprimer ce paiement ?"
        description="Le paiement et son justificatif seront supprimés. Le client ne sera pas prévenu."
        confirmLabel="Supprimer"
        destructive
        onConfirm={() => { if (deleteId) void remove(deleteId); }}
      />
    </div>
  );
}

/**
 * Adds a payment, or corrects one when `payment` is given. A correction never emails the guest:
 * the fiche and the guest page read the payments live, so they show the new figures next time.
 */
function PaymentDialog({
  open, onOpenChange, reservationId, currency, balance, payment, onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservationId: string;
  currency: string;
  /** What the reservation still owes before this dialog's payment (if any) is counted. */
  balance: number;
  payment: PaymentRow | null;
  onSaved: () => void;
}) {
  const editing = payment !== null;
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");
  const [paidAt, setPaidAt] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [removeProof, setRemoveProof] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // A fresh form each time the dialog opens: empty to add, filled with the payment to correct it.
  useEffect(() => {
    if (!open) return;
    setAmount(payment ? String(payment.amount) : "");
    setMethod(payment?.method ?? "bank_transfer");
    setPaidAt(payment ? payment.paidAt.slice(0, 10) : format(new Date(), "yyyy-MM-dd"));
    setNote(payment?.note ?? "");
    setFile(null);
    setRemoveProof(false);
    setSendEmail(true);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }, [open, payment]);

  function pickFile(f: File | null) {
    setError("");
    if (f && f.size > MAX_PROOF_MB * 1024 * 1024) {
      setError(`Justificatif trop volumineux (${MAX_PROOF_MB} Mo maximum).`);
      if (fileRef.current) fileRef.current.value = "";
      setFile(null);
      return;
    }
    setFile(f);
  }

  async function submit() {
    setError("");
    if (!amount.trim()) return setError("Indiquez le montant reçu.");
    setBusy(true);
    try {
      const body = new FormData();
      body.set("amount", amount);
      body.set("method", method);
      body.set("paidAt", paidAt);
      body.set("note", note);
      if (file) body.set("proof", file);
      let res: Response;
      if (payment) {
        if (removeProof && !file) body.set("removeProof", "true");
        res = await fetch(`/api/admin/reservations/${reservationId}/payments/${payment.id}`, { method: "PATCH", body });
      } else {
        body.set("sendEmail", String(sendEmail));
        res = await fetch(`/api/admin/reservations/${reservationId}/payments`, { method: "POST", body });
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "L'enregistrement a échoué.");
        return;
      }
      onSaved();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier le paiement" : "Ajouter un paiement"}</DialogTitle>
          <DialogDescription>
            {editing
              ? `Montant maximum pour ce paiement : ${formatMoney(balance + payment.amount)} ${currency}. Le client n’est pas prévenu.`
              : `Reste à payer : ${formatMoney(balance)} ${currency}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="pay-amount" className="text-xs text-gray-400 mb-1 block">Montant reçu ({currency})</Label>
              <Input id="pay-amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="150" autoComplete="off" />
            </div>
            <div>
              <Label htmlFor="pay-date" className="text-xs text-gray-400 mb-1 block">Date du paiement</Label>
              <Input id="pay-date" type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-400 mb-1 block">Mode de paiement</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(METHOD_LABEL).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="pay-proof" className="text-xs text-gray-400 mb-1 block">
              {payment?.proofUrl ? "Remplacer le justificatif" : "Justificatif"} (image ou PDF, {MAX_PROOF_MB} Mo max)
            </Label>
            {payment?.proofUrl && (
              <div className="mb-2 flex flex-wrap items-center gap-3 text-xs">
                <a href={payment.proofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline">
                  <Paperclip className="w-3 h-3" /> Justificatif actuel
                </a>
                <label className="inline-flex items-center gap-1.5 text-gray-600 dark:text-white/70 cursor-pointer">
                  <input type="checkbox" checked={removeProof} onChange={(e) => setRemoveProof(e.target.checked)} className="cursor-pointer" />
                  Retirer le justificatif
                </label>
              </div>
            )}
            <Input
              id="pay-proof"
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              className="cursor-pointer"
            />
          </div>

          <div>
            <Label htmlFor="pay-note" className="text-xs text-gray-400 mb-1 block">Note (facultatif)</Label>
            <Textarea id="pay-note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Référence du virement, remarque…" />
          </div>

          {!editing && (
            <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-white/80 cursor-pointer">
              <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="mt-1 cursor-pointer" />
              <span>
                Envoyer l&apos;email de confirmation de paiement au client
                <span className="block text-[11px] text-gray-400">Dans la langue de la réservation, avec le reste à payer.</span>
              </span>
            </label>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy} className="cursor-pointer">Annuler</Button>
          <Button onClick={submit} disabled={busy} className="cursor-pointer">
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {editing ? "Enregistrer les modifications" : "Enregistrer le paiement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Sets, changes or removes (0) the reservation's discount, and optionally emails the guest the new price. */
function DiscountDialog({
  open, onOpenChange, reservationId, currency, subtotal, paid, current, currentNote, onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservationId: string;
  currency: string;
  subtotal: number;
  paid: number;
  current: number;
  currentNote: string | null;
  onSaved: () => void;
}) {
  const [amount, setAmount] = useState(current > 0 ? String(current) : "");
  const [note, setNote] = useState(currentNote ?? "");
  const [sendEmail, setSendEmail] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const max = Math.max(0, Math.round((subtotal - paid) * 100) / 100);
  const preview = Number(amount.replace(/\s/g, "").replace(",", "."));
  const newTotal = Number.isFinite(preview) && preview >= 0 ? Math.max(0, Math.round((subtotal - preview) * 100) / 100) : null;

  async function save(value: string) {
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/reservations/${reservationId}/discount`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: value, note, sendEmail }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "L'enregistrement a échoué.");
        return;
      }
      onSaved();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{current > 0 ? "Modifier la réduction" : "Ajouter une réduction"}</DialogTitle>
          <DialogDescription>
            Total des prestations : {formatMoney(subtotal)} {currency}
            {paid > 0 ? ` · déjà reçu ${formatMoney(paid)} ${currency} (réduction max. ${formatMoney(max)} ${currency})` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="disc-amount" className="text-xs text-gray-400 mb-1 block">Montant de la réduction ({currency})</Label>
            <Input id="disc-amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="50" autoComplete="off" />
            {newTotal !== null && amount.trim() !== "" && (
              <p className="mt-1 text-[11px] text-gray-500">Nouveau total : {formatMoney(newTotal)} {currency}</p>
            )}
          </div>

          <div>
            <Label htmlFor="disc-note" className="text-xs text-gray-400 mb-1 block">Motif (facultatif, visible par le client)</Label>
            <Input id="disc-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} placeholder="Geste commercial, fidélité…" />
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-white/80 cursor-pointer">
            <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="mt-1 cursor-pointer" />
            <span>
              Envoyer un email au client avec le nouveau tarif
              <span className="block text-[11px] text-gray-400">Dans la langue de la réservation, avec la fiche PDF si la réservation est confirmée.</span>
            </span>
          </label>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {current > 0 && (
            <Button variant="outline" onClick={() => save("0")} disabled={busy} className="cursor-pointer sm:mr-auto text-red-600">
              Retirer la réduction
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy} className="cursor-pointer">Annuler</Button>
          <Button onClick={() => (amount.trim() ? save(amount) : setError("Indiquez le montant de la réduction."))} disabled={busy} className="cursor-pointer">
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
