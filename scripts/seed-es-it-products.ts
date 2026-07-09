import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const db = new PrismaClient();

function load(name: string) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), name), "utf-8"));
}

async function main() {
  const suites = load("scratch-suites-translated.json");
  const activities = load("scratch-activities-translated.json");
  const dayPasses = load("scratch-daypasses-translated.json");

  for (const s of suites) {
    const { id, slug, ...data } = s;
    await db.suite.update({ where: { id }, data });
    console.log("suite:", slug);
  }
  for (const a of activities) {
    const { id, slug, ...data } = a;
    await db.activity.update({ where: { id }, data });
    console.log("activity:", slug);
  }
  for (const d of dayPasses) {
    const { id, slug, ...data } = d;
    await db.dayPass.update({ where: { id }, data });
    console.log("daypass:", slug);
  }

  console.log(`\nDone: ${suites.length} suites, ${activities.length} activities, ${dayPasses.length} day passes.`);
}

main().catch(console.error).finally(() => db.$disconnect());
