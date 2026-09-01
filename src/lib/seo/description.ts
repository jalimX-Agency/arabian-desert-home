import type { Language } from "@/lib/i18n/context";

const SUFFIX: Record<Language, string> = {
  fr: " À 30 minutes de Marrakech, réservez votre expérience avec Arabian Desert Home.",
  en: " Just 30 minutes from Marrakech — book your experience with Arabian Desert Home.",
  es: " A 30 minutos de Marrakech, reserve su experiencia con Arabian Desert Home.",
  it: " A soli 30 minuti da Marrakech, prenotate la vostra esperienza con Arabian Desert Home.",
};

/**
 * Admin-entered descriptions are often short marketing taglines, which makes
 * for a thin <meta description>. Pads anything under ~120 chars with an
 * evergreen, accurate brand line instead of leaving it bare.
 */
export function padDescription(base: string, language: Language): string {
  const trimmed = (base ?? "").trim();
  if (trimmed.length >= 120) return trimmed;
  const withPeriod = /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
  return `${withPeriod}${SUFFIX[language]}`;
}
