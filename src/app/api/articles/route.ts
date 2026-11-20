import { NextRequest, NextResponse } from "next/server";
import {
  getPublishedArticles,
  getAllArticles,
  createArticle,
} from "@/lib/storage/articles";
import { verifyAdminSession } from "@/lib/auth";
import { slugify, generateExcerpt } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope");

    if (scope === "all") {
      const isAdmin = await verifyAdminSession();
      if (!isAdmin) {
        return NextResponse.json(
          { error: "Unauthorized access to administrative data." },
          { status: 401 }
        );
      }
      const all = await getAllArticles();
      return NextResponse.json(all);
    }

    const published = await getPublishedArticles();
    return NextResponse.json(published);
  } catch (error: unknown) {
    console.error("GET /api/articles error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch articles.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, subtitle, content, cover_image, category, tags, status, customSlug } =
      body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Article title is required." },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Article content is required." },
        { status: 400 }
      );
    }

    const slug = customSlug && customSlug.trim()
      ? slugify(customSlug)
      : slugify(title);

    const excerpt = body.excerpt && body.excerpt.trim()
      ? body.excerpt.trim()
      : generateExcerpt(content, 180);

    const article = await createArticle({
      title: title.trim(),
      slug: slug || `article-${Date.now().toString().slice(-6)}`,
      subtitle: subtitle ? subtitle.trim() : null,
      content,
      excerpt,
      cover_image: cover_image ? cover_image.trim() : null,
      category: category ? category.trim() : "Perspectives",
      tags: Array.isArray(tags) ? tags : [],
      status: status === "published" ? "published" : "draft",
    });

    // Revalidate pages immediately across edge and Next.js router cache
    try {
      revalidatePath("/", "layout");
      revalidatePath("/articles", "page");
      if (article.status === "published") {
        revalidatePath(`/articles/${article.slug}`, "page");
      }
    } catch (revalErr) {
      console.warn("Revalidation warning:", revalErr);
    }

    return NextResponse.json(article, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/articles error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create article.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
