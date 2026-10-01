/**
 * The language a guest booked in. It decides the language of every email and of
 * the fiche PDF sent to them (Reservation.lang in the database).
 */
export type ReservationLang = "fr" | "en" | "es" | "it";

export const RESERVATION_LANGS: ReservationLang[] = ["fr", "en", "es", "it"];

/** Display names, in their own language (used by the admin pickers). */
export const RESERVATION_LANG_LABEL: Record<ReservationLang, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  it: "Italiano",
};

/** Anything that isn't one of the four supported languages falls back to French. */
export function parseReservationLang(value: unknown): ReservationLang {
  return RESERVATION_LANGS.includes(value as ReservationLang) ? (value as ReservationLang) : "fr";
}

/** BCP-47 locale for dates/numbers in a given reservation language. */
export const LANG_LOCALE: Record<ReservationLang, string> = {
  fr: "fr-FR",
  en: "en-GB",
  es: "es-ES",
  it: "it-IT",
};
