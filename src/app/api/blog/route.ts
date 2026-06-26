import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { uploadToR2 } from "@/lib/r2";

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (true) {
    const existing = await db.blogPost.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${base}-${i++}`;
  }
}

export async function GET() {
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const key = req.headers.get("authorization")?.replace("Bearer ", "").trim();
  if (!key || key !== process.env.BLOG_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ct = req.headers.get("content-type") ?? "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: Record<string, any> = {};

  if (ct.includes("multipart/form-data")) {
    const form = await req.formData();
    for (const [k, v] of form.entries()) {
      if (typeof v === "string") data[k] = v;
    }
    const file = form.get("image");
    if (file && typeof file !== "string") {
      const f = file as File;
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const r2Key = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await f.arrayBuffer());
      data.image = await uploadToR2(r2Key, buffer, f.type);
    }
  } else {
    data = await req.json();
  }

  if (!data.title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  data.slug = await uniqueSlug(toSlug(data.title));

  // coerce boolean/number fields sent as strings via multipart
  if (typeof data.featured === "string") data.featured = data.featured === "true";
  if (typeof data.order === "string") data.order = parseInt(data.order, 10) || 0;

  const post = await db.blogPost.create({ data });
  return NextResponse.json(post, { status: 201 });
}
