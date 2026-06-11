import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

for (const line of readFileSync(join(process.cwd(), ".env"), "utf8").split("\n")) {
  const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const db = new PrismaClient();

// IDs from the DB
const TENTE_JUNIOR_ID   = "cmq9fbw5c0002vhgsb0d20pyj"; // Suite Junior → Tente Junior 170 EUR
const TENTE_FAMILLE_ID  = "cmq9fbwdn0003vhgsu5fgfsjs"; // Suite Familiale → Tente Familiale 220 EUR
const SUITE_ID          = "cmq9fbvlw0001vhgsu352ly6o"; // Suite Chorfa → Suite 300 EUR
const DELETE_IDS = [
  "cmq9fbwle0004vhgskcij0eaj", // Chambre Chorfa Double
  "cmq9fbwss0005vhgs01nnncpd", // Chambre Triple
  "cmq9fbx090006vhgsknxydspm", // Chambre Familiale Quadruple
];

// Update Tente Junior
await db.suite.update({
  where: { id: TENTE_JUNIOR_ID },
  data: { name: "Tente Junior", slug: "tente-junior", price: 170, currency: "EUR", order: 1 },
});
console.log("✓ Updated: Tente Junior — 170 EUR");

// Update Tente Familiale
await db.suite.update({
  where: { id: TENTE_FAMILLE_ID },
  data: { name: "Tente Familiale", slug: "tente-familiale", price: 220, currency: "EUR", order: 2 },
});
console.log("✓ Updated: Tente Familiale — 220 EUR");

// Update Suite Chorfa → keep as Suite
await db.suite.update({
  where: { id: SUITE_ID },
  data: { name: "Suite", slug: "suite", price: 300, currency: "EUR", order: 3 },
});
console.log("✓ Updated: Suite — 300 EUR");

// Delete extras
for (const id of DELETE_IDS) {
  await db.suite.delete({ where: { id } });
  console.log("✓ Deleted:", id);
}

const remaining = await db.suite.findMany({ select: { name: true, price: true, currency: true }, orderBy: { order: "asc" } });
console.log("\nRemaining suites:", remaining);

await db.$disconnect();
