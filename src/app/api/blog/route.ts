import { NextRequest, NextResponse, after } from "next/server";
import { db } from "@/lib/db";
import { uploadToR2 } from "@/lib/r2";
import { notifyIndexNow, localizedUrls } from "@/lib/indexnow";

function toSlug(title: string): string {
  return title
    .toLowerCase()
    // Ligatures don't decompose under NFD, so "cœur" used to become "cur".
    .replace(/œ/g, "oe").replace(/æ/g, "ae")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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

  // A title that slugs to an existing post is a duplicate (usually a retried
  // publish), not a new article. This used to mint "-1", "-2", "-3" copies that
  // competed with each other in Google and later 404'd when cleaned up, so the
  // publisher now gets a 409 with the existing post instead.
  data.slug = toSlug(data.title);
  const existing = await db.blogPost.findUnique({ where: { slug: data.slug }, select: { id: true, slug: true } });
  if (existing) {
    return NextResponse.json({ error: "A post with this slug already exists", post: existing }, { status: 409 });
  }

  // coerce boolean/number fields sent as strings via multipart
  if (typeof data.featured === "string") data.featured = data.featured === "true";
  if (typeof data.order === "string") data.order = parseInt(data.order, 10) || 0;

  const post = await db.blogPost.create({ data });
  // The weekly publisher posts here, not through the admin routes, so it has to
  // ping IndexNow itself — otherwise Bing only finds new posts on its own crawl.
  after(() => notifyIndexNow([...localizedUrls(`/blog/${post.slug}`), ...localizedUrls("/blog")]));
  return NextResponse.json(post, { status: 201 });
}
