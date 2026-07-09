const BASE = "https://www.arabiandeserthome.ma";

export type Locale = "fr" | "en" | "es" | "it";
const LOCALES: Locale[] = ["fr", "en", "es", "it"];

function urlFor(locale: Locale, path: string): string {
  if (locale === "fr") return `${BASE}${path}`;
  return path === "/" ? `${BASE}/${locale}` : `${BASE}/${locale}${path}`;
}

/** Metadata.alternates for a page at `path`, currently rendered in `currentLocale`. */
export function alternatesFor(currentLocale: Locale, path: string) {
  const languages: Record<string, string> = { "x-default": urlFor("fr", path) };
  for (const l of LOCALES) languages[l] = urlFor(l, path);
  return { canonical: urlFor(currentLocale, path), languages };
}

/** Metadata.alternates for a French page whose translated siblings live at /en|es|it{path}. */
export function frAlternates(path: string) {
  return alternatesFor("fr", path);
}

/** Metadata.alternates for an English page at /en{path}. */
export function enAlternates(path: string) {
  return alternatesFor("en", path);
}

/** Metadata.alternates for a Spanish page at /es{path}. */
export function esAlternates(path: string) {
  return alternatesFor("es", path);
}

/** Metadata.alternates for an Italian page at /it{path}. */
export function itAlternates(path: string) {
  return alternatesFor("it", path);
}
