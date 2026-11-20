import { NextRequest, NextResponse } from "next/server";
import {
  getArticleById,
  updateArticle,
  deleteArticle,
} from "@/lib/storage/articles";
import { verifyAdminSession } from "@/lib/auth";
import { slugify, generateExcerpt } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params;
    const article = await getArticleById(id);

    if (!article) {
      return NextResponse.json(
        { error: "Article not found." },
        { status: 404 }
      );
    }

    if (article.status !== "published") {
      const isAdmin = await verifyAdminSession();
      if (!isAdmin) {
        return NextResponse.json(
          { error: "Article not found." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("GET /api/articles/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve article." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const existing = await getArticleById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Article not found." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) {
      updates.title = body.title.trim();
    }
    if (body.customSlug !== undefined && body.customSlug.trim()) {
      updates.slug = slugify(body.customSlug.trim());
    } else if (body.slug !== undefined && body.slug.trim()) {
      updates.slug = slugify(body.slug.trim());
    }
    if (body.subtitle !== undefined) {
      updates.subtitle = body.subtitle ? body.subtitle.trim() : null;
    }
    if (body.content !== undefined) {
      updates.content = body.content;
      updates.excerpt = body.excerpt
        ? body.excerpt.trim()
        : generateExcerpt(body.content, 180);
    }
    if (body.cover_image !== undefined) {
      updates.cover_image = body.cover_image ? body.cover_image.trim() : null;
    }
    if (body.category !== undefined) {
      updates.category = body.category ? body.category.trim() : "Perspectives";
    }
    if (body.tags !== undefined) {
      updates.tags = Array.isArray(body.tags) ? body.tags : [];
    }
    if (body.status !== undefined) {
      updates.status = body.status === "published" ? "published" : "draft";
    }

    const updated = await updateArticle(id, updates);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/articles/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update article." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const success = await deleteArticle(id);

    if (!success) {
      return NextResponse.json(
        { error: "Article not found or could not be deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Article deleted successfully." });
  } catch (error) {
    console.error("DELETE /api/articles/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete article." },
      { status: 500 }
    );
  }
}
