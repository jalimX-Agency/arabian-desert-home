import { createHmac, createHash } from "crypto";

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID!;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const BUCKET = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_URL!;
const ENDPOINT = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`;

function sha256hex(data: Buffer | string): string {
  return createHash("sha256").update(data).digest("hex");
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data).digest();
}

function getSigningKey(secret: string, date: string, region: string, service: string): Buffer {
  const kDate = hmacSha256(`AWS4${secret}`, date);
  const kRegion = hmacSha256(kDate, region);
  const kService = hmacSha256(kRegion, service);
  return hmacSha256(kService, "aws4_request");
}

export async function deleteFromR2(key: string): Promise<void> {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const dateStamp = amzDate.slice(0, 8);
  const region = "auto";
  const service = "s3";

  const host = `${ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const url = `${ENDPOINT}/${BUCKET}/${key}`;
  const payloadHash = sha256hex("");

  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = `DELETE\n/${BUCKET}/${key}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${sha256hex(canonicalRequest)}`;

  const signingKey = getSigningKey(SECRET_KEY, dateStamp, region, service);
  const signature = hmacSha256(signingKey, stringToSign).toString("hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  await fetch(url, {
    method: "DELETE",
    headers: {
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      Authorization: authorization,
    },
  });
}

export function deleteR2Urls(urls: string): Promise<void[]> {
  return Promise.all(
    urls.split(",")
      .map((u) => u.trim())
      .filter((u) => u.startsWith(PUBLIC_URL + "/"))
      .map((u) => deleteFromR2(u.slice((PUBLIC_URL + "/").length)))
  );
}
