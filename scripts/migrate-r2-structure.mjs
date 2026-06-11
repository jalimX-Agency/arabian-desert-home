import { createHmac, createHash } from "crypto";
import https from "https";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

// Load env
for (const line of readFileSync(join(process.cwd(), ".env"), "utf8").split("\n")) {
  const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_URL;
const HOST = `${ACCOUNT_ID}.r2.cloudflarestorage.com`;

const KEY_MAP = {
  "images/about.png":               "suites/about.png",
  "images/suite-oasis.png":         "suites/suite-oasis.png",
  "images/suite-royal.png":         "suites/suite-royal.png",
  "images/suite-sultan.png":        "suites/suite-sultan.png",
  "images/suite-detail1.png":       "suites/suite-detail1.png",
  "images/suite-detail2.png":       "suites/suite-detail2.png",
  "images/suite-interior.png":      "suites/suite-interior.png",
  "images/activity-camel.png":      "activities/activity-camel.png",
  "images/activity-cooking.png":    "activities/activity-cooking.png",
  "images/activity-horse.png":      "activities/activity-horse.png",
  "images/activity-quad.png":       "activities/activity-quad.png",
  "images/exp-balloon.png":         "activities/exp-balloon.png",
  "images/exp-camel.png":           "activities/exp-camel.png",
  "images/exp-spa.png":             "spa/exp-spa.png",
  "images/spa-treatment.png":       "spa/spa-treatment.png",
  "images/bar-desert-rose.png":     "dining/bar-desert-rose.png",
  "images/dar-agafay.png":          "dining/dar-agafay.png",
  "images/daypass-pool.png":        "dining/daypass-pool.png",
  "images/dining.png":              "dining/dining.png",
  "images/el-kheyma.png":           "dining/el-kheyma.png",
  "images/restaurant-interior.png": "dining/restaurant-interior.png",
  "images/restaurant-outdoor.png":  "dining/restaurant-outdoor.png",
  "images/events-gala.png":         "events/events-gala.png",
  "images/events.png":              "events/events.png",
  "images/gallery-camp.png":        "gallery/gallery-camp.png",
  "images/gallery-desert.png":      "gallery/gallery-desert.png",
  "images/hero-alt.png":            "gallery/hero-alt.png",
  "images/hero.png":                "gallery/hero.png",
  "images/night.png":               "gallery/night.png",
  "logoWithBg.png":                 "logo/logoWithBg.png",
  "logoWithNoBg.png":               "logo/logoWithNoBg.png",
};

// Build all path → new URL mappings
const PATH_TO_URL = {};
for (const [oldKey, newKey] of Object.entries(KEY_MAP)) {
  const newUrl = `${PUBLIC_URL}/${newKey}`;
  const filename = oldKey.replace(/^images\//, "");
  PATH_TO_URL[`/images/${filename}`] = newUrl;
  PATH_TO_URL[`${PUBLIC_URL}/${oldKey}`] = newUrl;
  PATH_TO_URL[oldKey] = newUrl;
}
// already-correct new URLs map to themselves
for (const newKey of Object.values(KEY_MAP)) {
  PATH_TO_URL[`${PUBLIC_URL}/${newKey}`] = `${PUBLIC_URL}/${newKey}`;
}

function sha256hex(d) { return createHash("sha256").update(d).digest("hex"); }
function hmacBuf(key, d) { return createHmac("sha256", key).update(d).digest(); }

function buildHeaders(method, key, extra = {}) {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256hex("");
  const all = { host: HOST, "x-amz-content-sha256": payloadHash, "x-amz-date": amzDate, ...extra };
  const sortedKeys = Object.keys(all).sort();
  const canonicalHeaders = sortedKeys.map(k => `${k}:${all[k]}`).join("\n") + "\n";
  const signedHeaders = sortedKeys.join(";");
  const canonicalRequest = `${method}\n/${BUCKET}/${key}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const credScope = `${dateStamp}/auto/s3/aws4_request`;
  const sts = `AWS4-HMAC-SHA256\n${amzDate}\n${credScope}\n${sha256hex(canonicalRequest)}`;
  const sigKey = hmacBuf(hmacBuf(hmacBuf(hmacBuf(`AWS4${SECRET_KEY}`, dateStamp), "auto"), "s3"), "aws4_request");
  const signature = hmacBuf(sigKey, sts).toString("hex");
  return {
    ...all,
    Authorization: `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${credScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

function s3req(method, key, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const headers = buildHeaders(method, key, extraHeaders);
    const r = https.request({ hostname: HOST, path: `/${BUCKET}/${key}`, method, headers }, (res) => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => resolve({ status: res.statusCode, body: d }));
    });
    r.on("error", reject);
    r.end();
  });
}

const db = new PrismaClient();
let copied = 0, deleted = 0, dbUpdated = 0, errors = 0;

console.log("▶ Step 1: Copy R2 objects to new paths...\n");
for (const [oldKey, newKey] of Object.entries(KEY_MAP)) {
  if (oldKey === newKey) continue;
  const res = await s3req("PUT", newKey, { "x-amz-copy-source": `/${BUCKET}/${oldKey}` });
  if (res.status === 200) {
    process.stdout.write(`  ✓ ${oldKey} → ${newKey}\n`);
    copied++;
  } else {
    process.stdout.write(`  ✗ FAILED ${oldKey} (${res.status}): ${res.body.slice(0, 150)}\n`);
    errors++;
  }
}

console.log(`\n▶ Step 2: Delete old keys...\n`);
for (const [oldKey, newKey] of Object.entries(KEY_MAP)) {
  if (oldKey === newKey) continue;
  const res = await s3req("DELETE", oldKey);
  if (res.status === 204 || res.status === 200) {
    process.stdout.write(`  ✓ deleted ${oldKey}\n`);
    deleted++;
  } else {
    process.stdout.write(`  ✗ FAILED delete ${oldKey} (${res.status})\n`);
    errors++;
  }
}

console.log(`\n▶ Step 3: Update database records...\n`);

function mapPaths(p) {
  if (!p) return p;
  return p.split(",").map(u => PATH_TO_URL[u.trim()] ?? u.trim()).join(",");
}

const suites = await db.suite.findMany({ select: { id: true, name: true, image: true, images: true } });
for (const s of suites) {
  const image = mapPaths(s.image);
  const images = mapPaths(s.images);
  if (image !== s.image || images !== s.images) {
    await db.suite.update({ where: { id: s.id }, data: { image, images } });
    process.stdout.write(`  ✓ Suite "${s.name}"\n    image: ${image}\n`);
    dbUpdated++;
  }
}

const activities = await db.activity.findMany({ select: { id: true, name: true, image: true } });
for (const a of activities) {
  const image = mapPaths(a.image);
  if (image !== a.image) {
    await db.activity.update({ where: { id: a.id }, data: { image } });
    process.stdout.write(`  ✓ Activity "${a.name}"\n    image: ${image}\n`);
    dbUpdated++;
  }
}

const dining = await db.diningVenue.findMany({ select: { id: true, name: true, image: true } });
for (const d of dining) {
  const image = mapPaths(d.image);
  if (image !== d.image) {
    await db.diningVenue.update({ where: { id: d.id }, data: { image } });
    process.stdout.write(`  ✓ Dining "${d.name}"\n    image: ${image}\n`);
    dbUpdated++;
  }
}

await db.$disconnect();

console.log(`
✅ Migration complete
   Copied  : ${copied} files
   Deleted : ${deleted} old keys
   DB rows : ${dbUpdated} updated
   Errors  : ${errors}
`);
