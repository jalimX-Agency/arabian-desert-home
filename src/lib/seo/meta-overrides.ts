import type { Language } from "@/lib/i18n/context";

interface MetaSnippet {
  title: string;
  description: string;
}

/**
 * Search-snippet rewrites for blog posts that get plenty of impressions but
 * almost no clicks (Search Console, Jul–Sep 2026). Each title is written for
 * the queries the page actually shows up for, and stays under ~60 characters
 * so Google doesn't truncate it.
 *
 * These only change the <title>/<meta description> — the article's own H1,
 * excerpt and card text still come from the database.
 */
const BLOG_META: Record<string, Partial<Record<Language, MetaSnippet>>> = {
  // Queries: agafay desert, agafay activities, activités agafay, things to do in agafay
  "6-activites-inoubliables-a-vivre-au-desert-dagafay-marrakech": {
    fr: {
      title: "Activités désert d'Agafay : les 6 incontournables (2026)",
      description:
        "Dromadaire, quad, dîner sous les étoiles, spa : les 6 activités à ne pas manquer au désert d'Agafay, à 30 min de Marrakech, avec prix, durées et conseils.",
    },
    en: {
      title: "Agafay Desert Activities: 6 Best Things to Do (2026)",
      description:
        "Camel rides, quad biking, sunset dinners and spa: the 6 best things to do in the Agafay desert, 30 min from Marrakech, with prices, durations and tips.",
    },
    es: {
      title: "Desierto de Agafay: 6 actividades imprescindibles (2026)",
      description:
        "Dromedario, quad, cena bajo las estrellas y spa: las 6 mejores actividades en el desierto de Agafay, a 30 min de Marrakech, con precios, duración y consejos.",
    },
    it: {
      title: "Deserto di Agafay: 6 attività da non perdere (2026)",
      description:
        "Cammello, quad, cena sotto le stelle e spa: le 6 migliori attività nel deserto di Agafay, a 30 minuti da Marrakech, con prezzi, durata e consigli pratici.",
    },
  },

  // Queries: agafay prix (141 impressions, 0 clicks), agafay marrakech prix
  "prix-sejour-desert-agafay-guide-complet-budgets": {
    fr: {
      title: "Agafay prix 2026 : Day Pass dès 35 €, nuit dès 170 €",
      description:
        "Combien coûte le désert d'Agafay ? Day Pass dès 35 €, activités, dîner-spectacle et nuit en tente de luxe dès 170 € : tous les prix 2026 et nos conseils budget.",
    },
  },

  // Queries: desert agafay itineraire, agafay itinéraire, marrakech to agafay (desert)
  "comment-aller-desert-agafay-depuis-marrakech": {
    fr: {
      title: "Marrakech – Agafay : itinéraire, temps de trajet et prix",
      description:
        "Itinéraire Marrakech – désert d'Agafay en 30 à 45 min : taxi, transfert privé ou voiture de location, avec les prix 2026, la route à suivre et le retour.",
    },
    en: {
      title: "Marrakech to Agafay Desert: Route, Travel Time & Prices",
      description:
        "How to get from Marrakech to the Agafay desert in 30–45 minutes: taxi, private transfer or rental car, with 2026 prices, the route and tips for the way back.",
    },
    es: {
      title: "Marrakech – Agafay: cómo llegar, tiempo y precios (2026)",
      description:
        "Taxi, traslado privado o coche de alquiler: cómo llegar al desierto de Agafay desde Marrakech en 30 a 45 minutos, con itinerario, precios 2026 y el regreso.",
    },
    it: {
      title: "Marrakech – Agafay: come arrivare, tempi e prezzi (2026)",
      description:
        "Taxi, transfer privato o auto a noleggio: come raggiungere il deserto di Agafay da Marrakech in 30-45 minuti, con itinerario, prezzi 2026 e il ritorno.",
    },
  },

  // Queries: agafay (190 impressions at position 3.6), desert agafay, désert agafay avis
  "desert-agafay-vaut-il-le-detour-avis-honnete": {
    fr: {
      title: "Désert d'Agafay : notre avis honnête (vaut-il le détour ?)",
      description:
        "Agafay vaut-il le détour ? Pas de dunes, mais un désert de pierre face à l'Atlas à 30 min de Marrakech : ce qu'on y fait, les prix et pour qui c'est fait.",
    },
  },

  // Queries: météo agafay, température désert agafay (nuit)
  "meilleure-saison-pour-visiter-desert-agafay": {
    fr: {
      title: "Météo désert d'Agafay : la meilleure saison mois par mois",
      description:
        "Températures de jour et de nuit, pluie et vent mois par mois : quand partir au désert d'Agafay ? Printemps et automne idéaux, nuits fraîches en hiver.",
    },
  },
};

/** The rewritten snippet for this post in this language, if there is one. */
export function blogMetaOverride(slug: string, language: Language): MetaSnippet | undefined {
  return BLOG_META[slug]?.[language];
}
