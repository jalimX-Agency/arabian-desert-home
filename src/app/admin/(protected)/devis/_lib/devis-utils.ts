import { format } from "date-fns";

export interface DevisItem {
  id: string;
  kind: string;
  serviceType: string;
  suiteId?: string | null;
  activityId?: string | null;
  dayPassId?: string | null;
  label: string;
  description?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  date?: string | null;
  quantity: number;
  guests: number;
  children: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  order: number;
}

export interface Devis {
  id: string;
  reference: string;
  accessToken: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string | null;
  channel: string;
  title?: string | null;
  notes?: string | null;
  conditions?: string | null;
  lang: string;
  validUntil: string;
  totalAmount: number;
  currency: string;
  sentAt?: string | null;
  answeredAt?: string | null;
  answeredBy?: string | null;
  clientMessage?: string | null;
  reservationId?: string | null;
  convertedAt?: string | null;
  createdAt: string;
  items: DevisItem[];
}

export const devisStatusOptions = [
  "draft", "sent", "accepted", "refused", "expired", "converted", "cancelled",
] as const;

export const devisStatusLabel: Record<string, string> = {
  draft: "Brouillon",
  sent: "Envoyé",
  accepted: "Accepté",
  refused: "Refusé",
  expired: "Expiré",
  converted: "Converti",
  cancelled: "Annulé",
};

export const devisStatusColors: Record<string, string> = {
  draft: "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-white/50 border-gray-200 dark:border-white/10",
  sent: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
  accepted: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
  refused: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
  expired: "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20",
  converted: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  cancelled: "bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/40 border-gray-200 dark:border-white/10",
};

export const DEVIS_LANGS = ["fr", "en", "es"] as const;
export const devisLangLabel: Record<string, string> = { fr: "Français", en: "English", es: "Español" };

/** A quote past its validity date that nobody has answered yet. */
export function isExpired(d: Devis): boolean {
  return d.status === "expired" || (d.status === "sent" && new Date(d.validUntil).getTime() < Date.now());
}

/** What the admin should see in the status column — expiry is derived, not stored eagerly. */
export function effectiveStatus(d: Devis): string {
  return isExpired(d) ? "expired" : d.status;
}

export function devisClientName(d: Devis): string {
  return `${d.firstName} ${d.lastName}`;
}

export interface DevisSummary {
  /** Quotes waiting on the client: sent and still within their validity date. */
  pending: number;
  accepted: number;
  refused: number;
  /** Share of answered quotes that were accepted, 0–100. */
  acceptanceRate: number;
  /** Value of accepted quotes, kept per currency — EUR and MAD must never be summed together. */
  acceptedAmounts: Record<string, number>;
}

/** Feeds the counters at the top of the devis page — the question the admin could never
 *  answer from Excel: how many quotes are still open, and how many turned into business. */
export function summarizeDevis(rows: Devis[]): DevisSummary {
  const acceptedAmounts: Record<string, number> = {};
  let pending = 0;
  let accepted = 0;
  let refused = 0;

  for (const d of rows) {
    const status = effectiveStatus(d);
    // A converted quote is an accepted one that already became a reservation —
    // the best outcome there is, so it must not drop out of the counts.
    if (status === "accepted" || status === "converted") {
      accepted++;
      acceptedAmounts[d.currency] = (acceptedAmounts[d.currency] ?? 0) + d.totalAmount;
    } else if (status === "refused") {
      refused++;
    } else if (status === "sent") {
      pending++;
    }
  }

  // Rate over answered quotes only: drafts and quotes still waiting are not a loss yet.
  const answered = accepted + refused;
  const acceptanceRate = answered === 0 ? 0 : Math.round((accepted / answered) * 100);

  return { pending, accepted, refused, acceptanceRate, acceptedAmounts };
}

function csvField(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function devisToCsv(rows: Devis[]): string {
  const headers = [
    "Référence", "Statut", "Client", "Société", "Email", "Téléphone", "Objet",
    "Créé le", "Envoyé le", "Valable jusqu'au", "Répondu le", "Par", "Lignes", "Montant", "Devise",
  ];
  const body = rows.map((d) => [
    d.reference,
    devisStatusLabel[effectiveStatus(d)] ?? d.status,
    devisClientName(d),
    d.company ?? "",
    d.email,
    d.phone,
    d.title ?? "",
    format(new Date(d.createdAt), "yyyy-MM-dd"),
    d.sentAt ? format(new Date(d.sentAt), "yyyy-MM-dd") : "",
    format(new Date(d.validUntil), "yyyy-MM-dd"),
    d.answeredAt ? format(new Date(d.answeredAt), "yyyy-MM-dd") : "",
    d.answeredBy ?? "",
    d.items.length,
    d.totalAmount,
    d.currency,
  ]);
  return [headers, ...body].map((row) => row.map(csvField).join(",")).join("\n");
}
