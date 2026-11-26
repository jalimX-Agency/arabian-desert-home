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
export const SOIREE_PRICE_EUR = 84;
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
/** Indicative MAD amount, rounded to the hundred like the printed offer (84 € → 900 MAD). */
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

/**
 * The night of 31 Dec is sold only from the New Year's Eve page. A stay "touches" it when it
 * includes that night (check-in on or before the 31st, check-out after it); checking out on the
 * 31st is fine. Anything dated the 31st (activity, day pass, transfer) touches it too.
 * Days are calendar days as "YYYY-MM-DD", so plain string comparison is enough.
 */
export function stayTouchesReveillon(checkIn?: string | null, checkOut?: string | null): boolean {
  if (!checkIn || !checkOut || !isReveillonOpen()) return false;
  return checkIn.slice(0, 10) <= REVEILLON_DATE && checkOut.slice(0, 10) > REVEILLON_DATE;
}

export function dayIsReveillon(date?: string | null): boolean {
  return !!date && isReveillonOpen() && date.slice(0, 10) === REVEILLON_DATE;
}

/** The New Year's Eve page in the visitor's language. */
export function reveillonHref(lang: string): string {
  return lang === "fr" ? REVEILLON_PATH : `/${lang}${REVEILLON_PATH}`;
}

type Lang4 = "fr" | "en" | "es" | "it";
type DayLike = string | Date | null | undefined;
const dayOf = (d: DayLike) => (!d ? null : typeof d === "string" ? d.slice(0, 10) : d.toISOString().slice(0, 10));

/** A stay that includes the night of 31 Dec 2026, its price covering the soirée. Unlike
 *  stayTouchesReveillon, this stays true after the event: documents must keep saying it. */
export function stayIncludesReveillonNight(checkIn: DayLike, checkOut: DayLike): boolean {
  const a = dayOf(checkIn), b = dayOf(checkOut);
  return !!a && !!b && a <= REVEILLON_DATE && b > REVEILLON_DATE;
}

const LINE_COPY: Record<Lang4, {
  soiree: string;
  oneNight: (tent: string) => string;
  longStay: (tent: string) => string;
  includesSoiree: string;
  includesNight: string;
}> = {
  fr: {
    soiree: "Réveillon du 31 décembre · Soirée",
    oneNight: (t) => `Réveillon du 31 décembre · Soirée + nuit en ${t}`,
    longStay: (t) => `${t} · Réveillon du 31 décembre inclus`,
    includesSoiree: "Dîner 4 services servi à table, animation (troupe folklorique, gnawa, danseuses, DJ, cracheurs de feu), boissons sans alcool et bûche du réveillon",
    includesNight: "Soirée du réveillon incluse (dîner 4 services, animation, boissons sans alcool, bûche) + petit-déjeuner du 1er janvier",
  },
  en: {
    soiree: "New Year's Eve, 31 December · Evening",
    oneNight: (t) => `New Year's Eve, 31 December · Evening + night in a ${t}`,
    longStay: (t) => `${t} · New Year's Eve (31 December) included`,
    includesSoiree: "Four-course dinner served at the table, entertainment (folk troupe, gnawa, dancers, DJ, fire-breathers), soft drinks and Yule log",
    includesNight: "New Year's Eve evening included (four-course dinner, entertainment, soft drinks, Yule log) + breakfast on 1 January",
  },
  es: {
    soiree: "Nochevieja, 31 de diciembre · Velada",
    oneNight: (t) => `Nochevieja, 31 de diciembre · Velada + noche en ${t}`,
    longStay: (t) => `${t} · Nochevieja (31 de diciembre) incluida`,
    includesSoiree: "Cena de 4 platos servida en la mesa, animación (grupo folclórico, gnawa, bailarinas, DJ, escupefuegos), bebidas sin alcohol y tronco de Navidad",
    includesNight: "Velada de Nochevieja incluida (cena de 4 platos, animación, bebidas sin alcohol, tronco) + desayuno del 1 de enero",
  },
  it: {
    soiree: "Capodanno, 31 dicembre · Serata",
    oneNight: (t) => `Capodanno, 31 dicembre · Serata + notte in ${t}`,
    longStay: (t) => `${t} · Capodanno (31 dicembre) incluso`,
    includesSoiree: "Cena di 4 portate servita al tavolo, intrattenimento (gruppo folkloristico, gnawa, ballerine, DJ, mangiafuoco), bevande analcoliche e tronchetto",
    includesNight: "Serata di Capodanno inclusa (cena di 4 portate, intrattenimento, bevande analcoliche, tronchetto) + colazione del 1° gennaio",
  },
};

/**
 * How a reservation line reads when it is part of New Year's Eve: the soirée line and any
 * tent stay over the night of 31 Dec get an explicit name and what is included, in the
 * guest's language. Returns null for every other line, which keeps its usual name.
 */
export function reveillonLine(
  item: { serviceType: string; label?: string | null; checkIn?: DayLike; checkOut?: DayLike },
  tentName: string,
  lang: string,
): { name: string; includes: string } | null {
  const t = LINE_COPY[(lang in LINE_COPY ? lang : "fr") as Lang4];
  if (item.serviceType === "custom" && item.label === SOIREE_LABEL) return { name: t.soiree, includes: t.includesSoiree };
  if (item.serviceType === "suite" && stayIncludesReveillonNight(item.checkIn, item.checkOut)) {
    const nights = Math.round((Date.parse(dayOf(item.checkOut)!) - Date.parse(dayOf(item.checkIn)!)) / 86_400_000);
    return { name: nights <= 1 ? t.oneNight(tentName) : t.longStay(tentName), includes: t.includesNight };
  }
  return null;
}
