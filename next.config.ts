import type { NextConfig } from "next";

/**
 * Blog posts merged into a stronger post on the same topic (Sep 2026 audit).
 * The auto-publisher had produced near-duplicates that split Google's signals
 * between them — e.g. three separate "Marrakech → Agafay" transport guides.
 * Each old slug now 301s to the post that had the most search impressions.
 * The removed rows are archived in prisma/archive/blog-merged-2026-09.json.
 */
const MERGED_BLOG_POSTS: Record<string, string> = {
  // Transport
  "aller-au-desert-dagafay-depuis-marrakech-guide-transport": "comment-aller-desert-agafay-depuis-marrakech",
  "comment-aller-au-desert-dagafay-depuis-marrakech": "comment-aller-desert-agafay-depuis-marrakech",
  // Activities
  "guide-des-meilleures-activites-a-vivre-dans-le-desert-dagafay": "6-activites-inoubliables-a-vivre-au-desert-dagafay-marrakech",
  "guide-des-meilleures-activites-a-vivre-dans-le-desert-dagafay-1": "6-activites-inoubliables-a-vivre-au-desert-dagafay-marrakech",
  "activites-a-agafay-le-guide-complet-pour-votre-sejour-glamping": "6-activites-inoubliables-a-vivre-au-desert-dagafay-marrakech",
  "5-experiences-inoubliables-en-glamping-de-luxe-a-agafay": "6-activites-inoubliables-a-vivre-au-desert-dagafay-marrakech",
  // Dinner
  "diner-sous-les-etoiles-a-agafay-la-gastronomie-du-glamping-de-luxe": "diner-sous-les-etoiles-la-gastronomie-du-desert-dagafay",
  // Wellness (incl. the "-1/-2/-3" copies Google still crawls)
  "une-retraite-bien-etre-au-cur-du-desert-dagafay-marrakech": "cure-de-bien-etre-dans-le-desert-dagafay-pres-de-marrakech",
  "une-retraite-bien-etre-au-cur-du-desert-dagafay-marrakech-1": "cure-de-bien-etre-dans-le-desert-dagafay-pres-de-marrakech",
  "une-retraite-bien-etre-au-cur-du-desert-dagafay-marrakech-2": "cure-de-bien-etre-dans-le-desert-dagafay-pres-de-marrakech",
  "une-retraite-bien-etre-au-cur-du-desert-dagafay-marrakech-3": "cure-de-bien-etre-dans-le-desert-dagafay-pres-de-marrakech",
  "bien-etre-dans-le-desert-dagafay-rituels-de-serenite-au-camp": "cure-de-bien-etre-dans-le-desert-dagafay-pres-de-marrakech",
  // Glamping tips
  "7-conseils-essentiels-pour-un-sejour-glamping-reussi-a-agafay": "desert-dagafay-7-conseils-pour-un-sejour-glamping-reussi",
  // Events
  "evenements-prives-a-agafay-celebrer-dans-le-desert-marocain": "organiser-un-evenement-prive-au-desert-dagafay-pres-de-marrakech",
  // Budget
  "desert-dagafay-budget-et-conseils-pour-preparer-son-sejour": "prix-sejour-desert-agafay-guide-complet-budgets",
};

/** Test posts the publisher created and deleted; Google still requests them. */
const DELETED_TEST_POSTS = ["test", "probe"];

const LOCALE_PREFIXES = ["", "/en", "/es", "/it"];

function blogRedirects() {
  return LOCALE_PREFIXES.flatMap((prefix) => [
    ...Object.entries(MERGED_BLOG_POSTS).map(([from, to]) => ({
      source: `${prefix}/blog/${from}`,
      destination: `${prefix}/blog/${to}`,
      permanent: true,
    })),
    ...DELETED_TEST_POSTS.map((slug) => ({
      source: `${prefix}/blog/${slug}`,
      destination: `${prefix}/blog`,
      permanent: true,
    })),
  ]);
}

const nextConfig: NextConfig = {
  output: "standalone",
  // Let Next.js install these as plain node_modules for the serverless
  // function instead of bundling them with webpack — @sparticuz/chromium
  // ships a compressed Chromium binary it resolves at runtime relative to
  // its own package path, which webpack bundling breaks.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  // Vercel's own file tracer doesn't detect @sparticuz/chromium's brotli
  // binaries under bin/ since they're only referenced dynamically at
  // runtime, not via static import — force them into the function bundle.
  outputFileTracingIncludes: {
    "/api/admin/reservations/[id]": ["./node_modules/@sparticuz/chromium/bin/**"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    ".space-z.ai",
    "127.0.0.1",
    "localhost",
  ],
  async redirects() {
    // Legacy static suite pages — the suites they referenced (slugs
    // "suite-chorfa"/"suite-familiale"/"suite-junior") don't exist in the
    // database (real slugs are "suite"/"tente-familiale"/"tente-junior"),
    // so these routes rendered a "not found" empty state while returning
    // 200 OK — a soft-404 that actively hurts SEO. Redirect permanently to
    // the real, fully-optimized dynamic detail pages instead.
    return [
      { source: "/suite-chorfa", destination: "/les-tentes/suite", permanent: true },
      { source: "/suite-familiale", destination: "/les-tentes/tente-familiale", permanent: true },
      { source: "/suite-junior", destination: "/les-tentes/tente-junior", permanent: true },
      ...blogRedirects(),
    ];
  },
};

export default nextConfig;
