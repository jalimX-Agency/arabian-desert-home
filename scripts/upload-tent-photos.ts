/**
 * Uploads the prepared tent photos (WebP, one folder per tent type) to the R2 bucket
 * under `suites/tents-<batch>/` and prints their public URLs as JSON.
 *
 *   npx tsx --env-file=.env.local scripts/upload-tent-photos.ts <folder> <batch>
 *
 * Only adds new files: nothing already in the bucket is overwritten or deleted.
 */
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { uploadToR2 } from "../src/lib/r2";

const [folder, batch = "batch"] = process.argv.slice(2);
if (!folder) {
  console.error("usage: upload-tent-photos.ts <folder with one subfolder per tent type> <batch name>");
  process.exit(1);
}

async function main() {
  const result: Record<string, string[]> = {};
  for (const type of readdirSync(folder, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    result[type.name] = [];
    for (const file of readdirSync(join(folder, type.name)).filter((f) => f.endsWith(".webp")).sort()) {
      const key = `suites/tents-${batch}/${file}`;
      const url = await uploadToR2(key, readFileSync(join(folder, type.name, file)), "image/webp");
      result[type.name].push(url);
      console.log("uploaded", key);
    }
  }
  writeFileSync(join(folder, "uploaded-urls.json"), JSON.stringify(result, null, 2));
  console.log("done →", join(folder, "uploaded-urls.json"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
