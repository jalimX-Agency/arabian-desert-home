import type { Language } from "@/lib/i18n/context";

/**
 * Internal linking for blog posts (Sep 2026 audit: ~55 pages received at most
 * one in-content link — activity and day-pass pages were only reachable from
 * their own listing, and older posts never appeared in "related articles").
 */

interface RelatableFields {
  id: string;
  category: string;
  createdAt: Date;
}

/**
 * Related posts as a ring: within the post's category (oldest → newest), take
 * the next `count` posts, wrapping around. Every post is then linked from the
 * posts before it, so none is starved — the old "most recent first" rule only
 * ever linked the newest posts of each category. Tops up from the whole blog,
 * with the same ring order, when the category is too small.
 */
export function pickRelatedPosts<T extends RelatableFields>(all: T[], current: RelatableFields, count = 3): T[] {
  const byDate = [...all].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const ringAfter = (list: T[]) => {
    const i = list.findIndex((p) => p.id === current.id);
    const rotated = i === -1 ? list : [...list.slice(i + 1), ...list.slice(0, i)];
    return rotated.filter((p) => p.id !== current.id);
  };

  const sameCategory = ringAfter(byDate.filter((p) => p.category === current.category)).slice(0, count);
  if (sameCategory.length >= count) return sameCategory;

  const taken = new Set(sameCategory.map((p) => p.id));
  const fill = ringAfter(byDate).filter((p) => !taken.has(p.id)).slice(0, count - sameCategory.length);
  return [...sameCategory, ...fill];
}

/** Placeholder href: resolved to one of DAY_PASSES per post (see serviceLinksFor). */
const DAY_PASS_ROTATION = "@day-pass";

const DAY_PASSES: { href: string; label: Record<Language, string> }[] = [
  { href: "/day-pass/daypass-piscine-dejeuner", label: { fr: "Day Pass piscine & déjeuner", en: "Pool & lunch Day Pass", es: "Day Pass piscina y almuerzo", it: "Day Pass piscina e pranzo" } },
  { href: "/day-pass/daypass-piscine-diner", label: { fr: "Day Pass piscine & dîner", en: "Pool & dinner Day Pass", es: "Day Pass piscina y cena", it: "Day Pass piscina e cena" } },
  { href: "/day-pass/daypass-complet", label: { fr: "Pass journée complète", en: "Full Day Pass", es: "Pase de día completo", it: "Pass giornata completa" } },
];

interface ServiceLink {
  href: string;
  label: Record<Language, string>;
  /** Matched against the article's French title + body. */
  match: RegExp;
}

const SERVICE_LINKS: ServiceLink[] = [
  {
    href: "/les-activites/promenade-dromadaire",
    label: { fr: "Promenade en dromadaire", en: "Camel ride", es: "Paseo en dromedario", it: "Passeggiata in dromedario" },
    match: /dromadaire|chameau/i,
  },
  {
    href: "/les-activites/raid-quad",
    label: { fr: "Raid en quad", en: "Quad raid", es: "Raid en quad", it: "Raid in quad" },
    match: /\bquads?\b|buggy/i,
  },
  {
    href: "/les-activites/randonnee-equestre",
    label: { fr: "Randonnée équestre", en: "Horse riding trek", es: "Ruta a caballo", it: "Escursione equestre" },
    match: /cheval|chevaux|équestre|equestre/i,
  },
  {
    href: DAY_PASS_ROTATION,
    label: { fr: "", en: "", es: "", it: "" },
    match: /day ?pass|piscine|à la journée/i,
  },
  {
    href: "/restaurant",
    label: { fr: "Notre restaurant", en: "Our restaurant", es: "Nuestro restaurante", it: "Il nostro ristorante" },
    match: /dîner|diner|déjeuner|gastronom|tajine|cuisine/i,
  },
  {
    href: "/les-evenements",
    label: { fr: "Événements privés", en: "Private events", es: "Eventos privados", it: "Eventi privati" },
    match: /mariage|événement|evenement|anniversaire|séminaire|seminaire|evg|evjf/i,
  },
  {
    href: "/les-experiences",
    label: { fr: "Expériences tout compris", en: "All-inclusive experiences", es: "Experiencias todo incluido", it: "Esperienze tutto incluso" },
    match: /formule|tout compris|excursion|coucher du soleil|sunset/i,
  },
];

/**
 * Up to `max` links to the camp's own pages for the services an article talks
 * about. Matching runs on the French text, which every post has, so all four
 * language versions get the same links. Articles that mention the day pass get
 * ONE day-pass link, rotated by `seed` (e.g. the slug) so all three day-pass
 * pages receive links without crowding out the restaurant or events links.
 */
export function serviceLinksFor(frText: string, language: Language, seed: string, max = 6): { href: string; label: string }[] {
  const rotation = [...seed].reduce((n, ch) => n + ch.charCodeAt(0), 0) % DAY_PASSES.length;
  return SERVICE_LINKS.filter((s) => s.match.test(frText))
    .slice(0, max)
    .map((s) => {
      if (s.href !== DAY_PASS_ROTATION) return { href: s.href, label: s.label[language] };
      const pass = DAY_PASSES[rotation];
      return { href: pass.href, label: pass.label[language] };
    });
}
