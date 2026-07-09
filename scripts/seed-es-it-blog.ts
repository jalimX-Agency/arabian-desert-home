import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const db = new PrismaClient();

function load(name: string) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), name), "utf-8"));
}

async function main() {
  const es = load("scratch-blog-es.json");
  const it = load("scratch-blog-it.json");

  for (const p of es) {
    const { id, slug, ...data } = p;
    await db.blogPost.update({ where: { id }, data });
    console.log("es:", slug);
  }
  for (const p of it) {
    const { id, slug, ...data } = p;
    await db.blogPost.update({ where: { id }, data });
    console.log("it:", slug);
  }

  console.log(`\nDone: ${es.length} ES articles, ${it.length} IT articles.`);
}

main().catch(console.error).finally(() => db.$disconnect());
