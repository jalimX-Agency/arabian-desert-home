/**
 * Turns the three tent records into the Booking.com-style lineup:
 *   tente-junior   → Tente Double     (price kept)
 *   suite          → Tente Triple     (190 €, rewritten: it used to be the king-size suite)
 *   tente-familiale→ Tente Familiale  (price kept)
 * and puts the new photos on each. Slugs never change (SEO links stay).
 *
 *   npx tsx --env-file=.env.local scripts/apply-tents-catalog.ts <uploaded-urls.json>          # dry run
 *   npx tsx --env-file=.env.local scripts/apply-tents-catalog.ts <uploaded-urls.json> --apply  # write
 */
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";

const [urlsFile, flag] = process.argv.slice(2);
if (!urlsFile) {
  console.error("usage: apply-tents-catalog.ts <uploaded-urls.json> [--apply]");
  process.exit(1);
}
const APPLY = flag === "--apply";
const urls = JSON.parse(readFileSync(urlsFile, "utf-8")) as Record<"double" | "triple" | "family", string[]>;
const db = new PrismaClient();

/** Wording changes for the records that keep their identity, per language of the field. */
const RENAMES: Record<"fr" | "en" | "es" | "it", [RegExp, string][]> = {
  fr: [[/Suite Junior/g, "Tente Double"], [/Suite junior/g, "Tente double"], [/Suite Familiale/g, "Tente Familiale"], [/Suite familiale/g, "Tente familiale"]],
  en: [[/Junior Suite/g, "Double Tent"], [/Junior suite/g, "Double tent"], [/Family Suite/g, "Family Tent"], [/Family suite/g, "Family tent"]],
  es: [[/Suite Junior/g, "Tienda Doble"], [/Suite junior/g, "Tienda doble"], [/Suite Familiar/g, "Tienda Familiar"], [/Suite familiar/g, "Tienda familiar"]],
  it: [[/Suite Junior/g, "Tenda Doppia"], [/Suite junior/g, "Tenda doppia"], [/Suite Familiare/g, "Tenda Familiare"], [/Suite familiare/g, "Tenda familiare"]],
};
const TEXT_FIELDS = [
  "tagline", "taglineEn", "taglineEs", "taglineIt",
  "description", "descriptionEn", "descriptionEs", "descriptionIt",
  "longDescription", "longDescriptionEn", "longDescriptionEs", "longDescriptionIt",
] as const;

function fieldLang(field: string): "fr" | "en" | "es" | "it" {
  if (field.endsWith("En")) return "en";
  if (field.endsWith("Es")) return "es";
  if (field.endsWith("It")) return "it";
  return "fr";
}

function renamed(row: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const field of TEXT_FIELDS) {
    const value = row[field];
    if (typeof value !== "string") continue;
    let next = value;
    for (const [from, to] of RENAMES[fieldLang(field)]) next = next.replace(from, to);
    if (next !== value) out[field] = next;
  }
  return out;
}

const TRIPLE = {
  name: "Tente Triple",
  nameEn: "Triple Tent",
  nameEs: "Tienda Triple",
  nameIt: "Tenda Tripla",
  tagline: "Le confort à trois, au cœur du désert",
  taglineEn: "Comfort for three in the heart of the desert",
  taglineEs: "Confort para tres en el corazón del desierto",
  taglineIt: "Comfort per tre nel cuore del deserto",
  description: "Tente triple avec couchages pour trois personnes, salle de bain privative et petit-déjeuner inclus.",
  descriptionEn: "A triple tent with beds for three guests, a private bathroom and breakfast included.",
  descriptionEs: "Tienda triple con camas para tres personas, baño privado y desayuno incluido.",
  descriptionIt: "Tenda tripla con letti per tre persone, bagno privato e colazione inclusa.",
  longDescription:
    "La Tente Triple accueille trois personnes dans un confort absolu : entre amis, en famille ou à trois générations. Les lits sont installés sous la toile ornée de motifs berbères, avec climatisation, salle de bain privative et douche chaude. Le petit-déjeuner est inclus et notre conciergerie est disponible 24h/24 pour organiser votre séjour.",
  longDescriptionEn:
    "The Triple Tent welcomes three guests in complete comfort — friends, family or three generations. The beds sit under the canvas decorated with Berber patterns, with air conditioning, a private bathroom and a hot shower. Breakfast is included and our concierge is available around the clock to organise your stay.",
  longDescriptionEs:
    "La Tienda Triple acoge a tres personas con todo el confort: amigos, familia o tres generaciones. Las camas se encuentran bajo la lona decorada con motivos bereberes, con aire acondicionado, baño privado y ducha caliente. El desayuno está incluido y nuestro conserje está disponible las 24 horas para organizar su estancia.",
  longDescriptionIt:
    "La Tenda Tripla accoglie tre persone con ogni comfort: amici, famiglia o tre generazioni. I letti sono sistemati sotto il telo decorato con motivi berberi, con aria condizionata, bagno privato e doccia calda. La colazione è inclusa e il nostro concierge è a disposizione 24 ore su 24 per organizzare il vostro soggiorno.",
  bedType: "Couchages pour 3 personnes",
  features: "Couchages pour 3 personnes,Salle de Bain Privative,Climatisation,Petit Déjeuner Inclus",
  featuresEn: "Beds for 3 guests,Private Bathroom,Air Conditioning,Breakfast Included",
  featuresEs: "Camas para 3 personas,Baño privado,Aire acondicionado,Desayuno incluido",
  featuresIt: "Letti per 3 persone,Bagno privato,Aria condizionata,Colazione inclusa",
  price: 190,
  maxGuests: 3,
  maxChildren: 1,
  hasAC: true,
  order: 2,
};

async function main() {
  const rows = await db.suite.findMany({ orderBy: { order: "asc" } });
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const junior = bySlug.get("tente-junior");
  const suite = bySlug.get("suite");
  const family = bySlug.get("tente-familiale");
  if (!junior || !suite || !family) throw new Error("Expected the three tents: tente-junior, suite, tente-familiale");

  const photos = (list: string[]) => ({ image: list[0], images: list.slice(1).join(",") });

  const plans = [
    {
      slug: junior.slug,
      label: "Double",
      data: {
        name: "Tente Double", nameEn: "Double Tent", nameEs: "Tienda Doble", nameIt: "Tenda Doppia",
        order: 1,
        ...renamed(junior),
        ...photos(urls.double),
      },
    },
    { slug: suite.slug, label: "Triple", data: { ...TRIPLE, ...photos(urls.triple) } },
    {
      slug: family.slug,
      label: "Familiale",
      data: {
        order: 3,
        ...renamed(family),
        ...photos(urls.family),
      },
    },
  ];

  for (const p of plans) {
    const row = bySlug.get(p.slug)!;
    console.log(`\n=== ${p.label} (${p.slug}) — ${APPLY ? "WRITING" : "dry run"}`);
    for (const [k, v] of Object.entries(p.data)) {
      const before = String((row as Record<string, unknown>)[k] ?? "");
      const after = String(v);
      if (before === after) continue;
      console.log(`  ${k}:`);
      console.log(`    - ${before.slice(0, 110)}${before.length > 110 ? "…" : ""}`);
      console.log(`    + ${after.slice(0, 110)}${after.length > 110 ? "…" : ""}`);
    }
    if (APPLY) await db.suite.update({ where: { id: row.id }, data: p.data });
  }
  console.log(APPLY ? "\nApplied." : "\nDry run only — add --apply to write.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
