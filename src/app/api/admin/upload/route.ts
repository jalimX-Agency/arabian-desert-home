import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createHmac, createHash } from "crypto";
import { deleteFromR2 } from "@/lib/r2";

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

async function uploadToR2(key: string, body: Buffer, contentType: string): Promise<void> {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const dateStamp = amzDate.slice(0, 8);
  const region = "auto";
  const service = "s3";

  const host = `${ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const url = `${ENDPOINT}/${BUCKET}/${key}`;
  const payloadHash = sha256hex(body);

  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = `PUT\n/${BUCKET}/${key}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${sha256hex(canonicalRequest)}`;

  const signingKey = getSigningKey(SECRET_KEY, dateStamp, region, service);
  const signature = hmacSha256(signingKey, stringToSign).toString("hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      Authorization: authorization,
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`R2 upload failed ${res.status}: ${text}`);
  }
}

export async function POST(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Type de fichier non supporté" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop grand (max 10MB)" }, { status: 400 });
  }

  const folderParam = formData.get("folder") as string | null;
  const VALID_FOLDERS = ["suites", "activities", "dining", "events", "spa", "gallery", "logo"];
  const folder = VALID_FOLDERS.includes(folderParam ?? "") ? folderParam : "gallery";

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await uploadToR2(key, buffer, file.type);

  return NextResponse.json({ url: `${PUBLIC_URL}/${key}` });
}

export async function DELETE(request: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { url } = await request.json() as { url: string };
  if (!url || !url.startsWith(PUBLIC_URL + "/")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const key = url.slice((PUBLIC_URL + "/").length);
  await deleteFromR2(key);
  return NextResponse.json({ ok: true });
}
