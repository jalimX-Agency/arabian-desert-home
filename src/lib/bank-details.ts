import { db } from "@/lib/db";

/** The camp's bank account, shown to guests who must send an advance by transfer. */
export interface BankDetails {
  holder: string;
  bank: string;
  iban: string;
  rib: string;
  swift: string;
  /** Free text under the details (e.g. "Indiquez la référence de réservation dans le motif"). */
  note: string;
}

const KEY = "bank";
const FIELDS = ["holder", "bank", "iban", "rib", "swift", "note"] as const;

export const EMPTY_BANK_DETAILS: BankDetails = { holder: "", bank: "", iban: "", rib: "", swift: "", note: "" };

/** Keeps only the known fields, trimmed and length-capped. */
export function cleanBankDetails(input: unknown): BankDetails {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const out = { ...EMPTY_BANK_DETAILS };
  for (const f of FIELDS) out[f] = String(src[f] ?? "").trim().slice(0, f === "note" ? 500 : 120);
  return out;
}

/** True once at least an IBAN or a RIB is filled in. */
export function hasBankDetails(b: BankDetails | null): b is BankDetails {
  return !!b && (!!b.iban || !!b.rib);
}

export async function getBankDetails(): Promise<BankDetails | null> {
  const row = await db.siteSetting.findUnique({ where: { key: KEY } });
  if (!row) return null;
  try {
    return cleanBankDetails(JSON.parse(row.value));
  } catch {
    return null;
  }
}

export async function saveBankDetails(details: BankDetails): Promise<BankDetails> {
  const value = JSON.stringify(cleanBankDetails(details));
  await db.siteSetting.upsert({ where: { key: KEY }, create: { key: KEY, value }, update: { value } });
  return cleanBankDetails(details);
}
