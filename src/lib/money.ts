/**
 * Money helpers. Amounts are stored as plain numbers with at most 2 decimals
 * (Reservation/Booking.totalAmount are double precision), so every value that
 * gets written is rounded here first — sums like 100.10 + 200.20 would
 * otherwise carry floating-point noise (300.29999999999995).
 */

/** Rounds to cents. */
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Sums amounts and rounds the result to cents. */
export function sumMoney(values: number[]): number {
  return roundMoney(values.reduce((total, v) => total + v, 0));
}

const isDigits = (s: string) => /^\d+$/.test(s);

/** "1.250.000" → true: a 1–3 digit head followed only by groups of exactly 3 digits. */
function isGrouped(integerPart: string, groupChar: string): boolean {
  const groups = integerPart.split(groupChar);
  const [head, ...rest] = groups;
  return groups.length > 1 && isDigits(head) && head.length <= 3 && rest.every((g) => g.length === 3 && isDigits(g));
}

/**
 * Reads a price typed by a person. A comma is the decimal separator ("1250,50"),
 * a dot works too ("1250.50"), and spaces / non-breaking spaces group thousands
 * ("1 250,50"). When both appear, the last one is the decimal separator
 * ("1.250,50" and "1,250.50" both mean 1250.50). Returns null when the text is
 * not a valid non-negative amount with at most 2 decimals; a lone "1,250" is
 * refused as ambiguous rather than guessed. An empty string is 0.
 */
export function parseMoney(text: string): number | null {
  const cleaned = text.replace(/[\s  ]/g, "");
  if (cleaned === "") return 0;
  if (!/^[\d.,]+$/.test(cleaned)) return null;

  const finish = (integerDigits: string, fraction: string): number | null => {
    if (fraction.length > 2) return null; // more than cents: refuse rather than silently round
    if (integerDigits !== "" && !isDigits(integerDigits)) return null;
    if (fraction !== "" && !isDigits(fraction)) return null;
    if (integerDigits === "" && fraction === "") return null; // just "." or ","
    return roundMoney(Number(`${integerDigits || "0"}.${fraction || "0"}`));
  };

  const commas = cleaned.split(",").length - 1;
  const dots = cleaned.split(".").length - 1;

  // No separator: plain digits.
  if (commas + dots === 0) return finish(cleaned, "");

  // Both kinds: the LAST separator is the decimal one (and appears once);
  // the other kind groups thousands.
  if (commas > 0 && dots > 0) {
    const decimalChar = cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".") ? "," : ".";
    const groupChar = decimalChar === "," ? "." : ",";
    if ((decimalChar === "," ? commas : dots) !== 1) return null;
    const at = cleaned.lastIndexOf(decimalChar);
    const integerPart = cleaned.slice(0, at);
    return isGrouped(integerPart, groupChar) ? finish(integerPart.split(groupChar).join(""), cleaned.slice(at + 1)) : null;
  }

  // One kind only.
  const sep = commas > 0 ? "," : ".";
  const count = commas > 0 ? commas : dots;
  if (count === 1) {
    // A single separator is the decimal one ("1250,50").
    const at = cleaned.indexOf(sep);
    return finish(cleaned.slice(0, at), cleaned.slice(at + 1));
  }
  // Repeated separator: thousands grouping only ("1.250.000").
  return isGrouped(cleaned, sep) ? finish(cleaned.split(sep).join(""), "") : null;
}

/** "1 250" for whole amounts, "1 250,50" when there are cents. */
export function formatMoney(amount: number, locale = "fr-FR"): string {
  const whole = Number.isInteger(roundMoney(amount));
  return roundMoney(amount).toLocaleString(locale, {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

/** The text shown in an input for an amount: comma decimal, no grouping ("1250,5" → "1250,50"). */
export function moneyToInputText(amount: number): string {
  if (!Number.isFinite(amount)) return "";
  const rounded = roundMoney(amount);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(".", ",");
}
