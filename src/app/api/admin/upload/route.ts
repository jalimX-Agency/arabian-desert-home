import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";

const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_URL!; // used for DELETE key extraction

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
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop grand (max 2MB)" }, { status: 400 });
  }

  const folderParam = formData.get("folder") as string | null;
  const VALID_FOLDERS = ["suites", "activities", "dining", "events", "spa", "gallery", "logo", "blog"];
  const folder = VALID_FOLDERS.includes(folderParam ?? "") ? folderParam : "gallery";

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const url = await uploadToR2(key, buffer, file.type);

  return NextResponse.json({ url });
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
