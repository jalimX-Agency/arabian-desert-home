const BASE = "https://www.arabiandeserthome.ma";

function enUrl(path: string): string {
  return path === "/" ? `${BASE}/en` : `${BASE}/en${path}`;
}

/** Metadata.alternates for a French page whose English sibling lives at /en{path}. */
export function frAlternates(path: string) {
  const fr = `${BASE}${path}`;
  const en = enUrl(path);
  return { canonical: fr, languages: { fr, en, "x-default": fr } };
}

/** Metadata.alternates for an English page at /en{path}, whose French sibling is at {path}. */
export function enAlternates(path: string) {
  const fr = `${BASE}${path}`;
  const en = enUrl(path);
  return { canonical: en, languages: { fr, en, "x-default": fr } };
}
