/**
 * New Year's Eve 2026 ("Réveillon sous les étoiles", 31 Dec): shared constants, safe for the
 * browser. The tent packages are priced by the one-night seasonal window on 31 Dec (admin
 * calendar), the soirée-only seats here. Prices are in EUR (shown first), MAD is indicative.
 */
export const REVEILLON_DATE = "2026-12-31";
export const REVEILLON_CHECKOUT = "2027-01-01";
export const REVEILLON_PATH = "/reveillon-31-decembre";

/** Seats for the soirée alone (guests who do not sleep at the camp). */
export const SOIREE_SEATS = 40;
export const SOIREE_PRICE_EUR = 130;
/** Children pay half; any age, but under-12s must come with an adult. */
export const SOIREE_CHILD_PERCENT = 50;

/** Label of the soirée line on the reservation, fiche and emails; also how seats are counted. */
export const SOIREE_LABEL = "Réveillon 31 décembre — Soirée (dîner, animation, bûche)";
/** Label of the one-night seasonal window that prices the tents on 31 Dec. */
export const REVEILLON_SEASON_LABEL = "Réveillon 31 déc (soirée incluse)";

/** The promotion (floating badge, page CTA) stops once the night has started in Marrakech. */
export const REVEILLON_END_MS = Date.UTC(2026, 11, 31, 16, 0); // 17h00 Marrakech (UTC+1)

/** Ready-to-send WhatsApp message about the night, per site language. */
export const REVEILLON_WHATSAPP_MESSAGE: Record<"fr" | "en" | "es" | "it", string> = {
  fr: "Bonjour, je souhaite réserver le Réveillon du 31 décembre à Arabian Desert Home.",
  en: "Hello, I would like to book New Year's Eve (31 December) at Arabian Desert Home.",
  es: "Hola, me gustaría reservar la Nochevieja (31 de diciembre) en Arabian Desert Home.",
  it: "Buongiorno, vorrei prenotare il Capodanno (31 dicembre) ad Arabian Desert Home.",
};

const MAD_PER_EUR = 10.77;
/** Indicative MAD amount, rounded to the hundred like the printed offer (130 € → 1 400 MAD). */
export function eurToMad(eur: number): number {
  return Math.round((eur * MAD_PER_EUR) / 100) * 100;
}

export function isReveillonOpen(now = Date.now()): boolean {
  return now < REVEILLON_END_MS;
}

export interface ReveillonTent {
  suiteId: string;
  slug: string;
  name: string;
  nameEn: string;
  nameEs: string;
  nameIt: string;
  image: string;
  maxGuests: number;
  /** Price of the night of 31 Dec for the tent, soirée included, in EUR. */
  priceEur: number;
  /** Tents of this type still free that night. */
  left: number;
}

export interface ReveillonOffer {
  soiree: { priceEur: number; childPercent: number; seats: number; seatsLeft: number };
  tents: ReveillonTent[];
  transport: { id: string; name: string; priceEur: number } | null;
  open: boolean;
}
