/**
 * Upload all images from public/ to Cloudflare R2.
 * Reads credentials from .env / .env.local — no hardcoded secrets.
 *
 * Usage: node scripts/upload-to-r2.mjs
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { createHmac, createHash } from "crypto";
import { join, extname } from "path";
import { request } from "https";

// ── Load .env files ────────────────────────────────────────────────────────
function loadEnv(filePath) {
  try {
    const lines = readFileSync(filePath, "utf8").split("\n");
    for (const line of lines) {
      const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch { /* file may not exist */ }
}

const ROOT = process.cwd();
loadEnv(join(ROOT, ".env"));
loadEnv(join(ROOT, ".env.local"));

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET     = process.env.R2_BUCKET_NAME;

if (!ACCOUNT_ID || !ACCESS_KEY || !SECRET_KEY || !BUCKET) {
  console.error("Missing R2 credentials. Check your .env file for R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME.");
  process.exit(1);
}

const ENDPOINT_HOST = `${ACCOUNT_ID}.r2.cloudflarestorage.com`;
const REGION = "auto";

const MIME_MAP = {
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg":  "image/svg+xml",
  ".gif":  "image/gif",
};

// ── AWS Signature V4 ───────────────────────────────────────────────────────
const sha256 = (data) => createHash("sha256").update(data).digest("hex");
const hmac   = (key, data, enc) => createHmac("sha256", key).update(data).digest(enc || undefined);

function getSigningKey(dateStamp) {
  const kDate    = hmac("AWS4" + SECRET_KEY, dateStamp);
  const kRegion  = hmac(kDate, REGION);
  const kService = hmac(kRegion, "s3");
  return hmac(kService, "aws4_request");
}

function uploadFile(localPath, r2Key) {
  return new Promise((resolve, reject) => {
    const body = readFileSync(localPath);
    const ext  = extname(localPath).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";

    const now      = new Date();
    const amzDate  = now.toISOString().replace(/[:\-]|\.\d{3}/g, "").slice(0, 15) + "Z";
    const dateStamp = amzDate.slice(0, 8);
    const payloadHash = sha256(body);

    const canonicalHeaders =
      `content-type:${contentType}\n` +
      `host:${ENDPOINT_HOST}\n` +
      `x-amz-content-sha256:${payloadHash}\n` +
      `x-amz-date:${amzDate}\n`;

    const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";

    const canonicalRequest = [
      "PUT",
      `/${BUCKET}/${r2Key}`,
      "",
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join("\n");

    const credentialScope = `${dateStamp}/${REGION}/s3/aws4_request`;
    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      credentialScope,
      sha256(canonicalRequest),
    ].join("\n");

    const signature    = hmac(getSigningKey(dateStamp), stringToSign, "hex");
    const authorization =
      `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const options = {
      hostname: ENDPOINT_HOST,
      path: `/${BUCKET}/${r2Key}`,
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        "Content-Length": body.length,
        "x-amz-date": amzDate,
        "x-amz-content-sha256": payloadHash,
        "Authorization": authorization,
      },
    };

    const req = request(options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () =>
        res.statusCode >= 200 && res.statusCode < 300
          ? resolve()
          : reject(new Error(`HTTP ${res.statusCode}: ${data}`))
      );
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── Collect files ──────────────────────────────────────────────────────────
const files = [];

// public/images/*
const imagesDir = join(ROOT, "public", "images");
for (const f of readdirSync(imagesDir)) {
  const full = join(imagesDir, f);
  if (statSync(full).isFile() && MIME_MAP[extname(f).toLowerCase()]) {
    files.push({ localPath: full, r2Key: `images/${f}` });
  }
}

// public/*.png|svg (logos)
for (const f of readdirSync(join(ROOT, "public"))) {
  const full = join(ROOT, "public", f);
  if (statSync(full).isFile() && MIME_MAP[extname(f).toLowerCase()]) {
    files.push({ localPath: full, r2Key: f });
  }
}

// ── Upload ────────────────────────────────────────────────────────────────
console.log(`\nUploading ${files.length} files to R2 bucket "${BUCKET}"...\n`);

let ok = 0, fail = 0;
for (const { localPath, r2Key } of files) {
  process.stdout.write(`  → ${r2Key} ... `);
  try {
    await uploadFile(localPath, r2Key);
    console.log("✓");
    ok++;
  } catch (err) {
    console.log(`✗  ${err.message}`);
    fail++;
  }
}

console.log(`\n✓ ${ok} uploaded   ✗ ${fail} failed\n`);
