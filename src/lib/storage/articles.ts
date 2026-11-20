import fs from "fs/promises";
import path from "path";
import { Article, ArticleInput } from "../types";
import { getAdminSupabaseClient } from "../supabase/admin";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "articles.json");

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    url &&
    key &&
    !url.includes("your-project-id") &&
    !url.includes("your-project-url")
  );
}

export function isServerlessEnvironment(): boolean {
  return Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME
  );
}

// Fallback file-based operations
export async function readLocalFile(): Promise<Article[]> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(raw) as Article[];
  } catch (error) {
    console.warn("Could not read local data file, returning empty array:", error);
    return [];
  }
}

export async function writeLocalFile(articles: Article[]): Promise<void> {
  if (isServerlessEnvironment()) {
    throw new Error(
      "Read-only serverless environment: On Vercel, articles cannot be saved to the local file system. A persistent database (Supabase) must be configured in your Vercel Project Settings."
    );
  }

  try {
    const dir = path.dirname(DATA_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(articles, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to local data file:", error);
    throw error;
  }
}

// Auto-seed Supabase with local articles if table is empty
let isSeedingAttempted = false;
async function autoSeedSupabaseIfEmpty(supabase: ReturnType<typeof getAdminSupabaseClient>) {
  if (!supabase || isSeedingAttempted) return;
  isSeedingAttempted = true;

  try {
    const { count, error } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true });

    if (!error && (count === 0 || count === null)) {
      const localArticles = await readLocalFile();
      if (localArticles.length > 0) {
        console.log(`[Auto-Seed] Seeding ${localArticles.length} initial articles into Supabase...`);
        await supabase.from("articles").upsert(localArticles);
      }
    }
  } catch (err) {
    console.warn("[Auto-Seed] Skipped or errored:", err);
  }
}

// ==========================================
// PUBLIC METHODS (Strictly Published Only)
// ==========================================

export async function getPublishedArticles(): Promise<Article[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getAdminSupabaseClient();
      if (supabase) {
        await autoSeedSupabaseIfEmpty(supabase);

        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false });

        if (!error && data) {
          return data as Article[];
        }
        if (error) {
          console.warn("Supabase getPublishedArticles error:", error.message);
        }
      }
    } catch (err) {
      console.warn("Supabase client query error:", err);
    }
  }

  // In production serverless, never depend on stale local JSON
  if (isServerlessEnvironment()) {
    return [];
  }

  // Local development fallback
  const all = await readLocalFile();
  return all
    .filter((a) => a.status === "published")
    .sort((a, b) => {
      const dateA = a.published_at || a.created_at;
      const dateB = b.published_at || b.created_at;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
}

export async function getArticleBySlug(
  slug: string,
  allowDrafts: boolean = false
): Promise<Article | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getAdminSupabaseClient();
      if (supabase) {
        let query = supabase.from("articles").select("*").eq("slug", slug);
        if (!allowDrafts) {
          query = query.eq("status", "published");
        }
        const { data, error } = await query.maybeSingle();
        if (!error) {
          return (data as Article) || null;
        }
        console.warn("Supabase getArticleBySlug error:", error.message);
      }
    } catch (err) {
      console.warn("Supabase getArticleBySlug error:", err);
    }
  }

  // In production serverless, never depend on stale local JSON
  if (isServerlessEnvironment()) {
    return null;
  }

  // Local development fallback
  const all = await readLocalFile();
  const found = all.find((a) => a.slug === slug);
  if (!found) return null;
  if (!allowDrafts && found.status !== "published") return null;
  return found;
}

// ==========================================
// ADMIN METHODS (Full CRUD & Access)
// ==========================================

export async function getAllArticles(): Promise<Article[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getAdminSupabaseClient();
      if (supabase) {
        await autoSeedSupabaseIfEmpty(supabase);

        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .order("updated_at", { ascending: false });

        if (!error && data) {
          return data as Article[];
        }
        if (error) {
          console.warn("Supabase getAllArticles error:", error.message);
        }
      }
    } catch (err) {
      console.warn("Supabase getAllArticles client error:", err);
    }
  }

  // In production serverless, never depend on stale local JSON
  if (isServerlessEnvironment()) {
    return [];
  }

  // Local fallback
  const all = await readLocalFile();
  return all.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export async function getArticleById(id: string): Promise<Article | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getAdminSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (!error && data) {
          return data as Article;
        }
      }
    } catch (err) {
      console.warn("Supabase getArticleById client error:", err);
    }
  }

  // In production serverless, never depend on stale local JSON
  if (isServerlessEnvironment()) {
    return null;
  }

  // Local fallback
  const all = await readLocalFile();
  return all.find((a) => a.id === id) || null;
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  const now = new Date().toISOString();
  const id = input.id || crypto.randomUUID();
  const publishedAt =
    input.status === "published" ? input.published_at || now : null;

  const newArticle: Article = {
    id,
    title: input.title,
    slug: input.slug,
    subtitle: input.subtitle || null,
    content: input.content,
    excerpt: input.excerpt,
    cover_image: input.cover_image || null,
    category: input.category || "Perspectives",
    tags: input.tags || [],
    status: input.status,
    created_at: now,
    updated_at: now,
    published_at: publishedAt,
  };

  if (isSupabaseConfigured()) {
    const supabase = getAdminSupabaseClient();
    if (!supabase) {
      throw new Error("Supabase client initialization failed.");
    }

    const { data, error } = await supabase
      .from("articles")
      .insert(newArticle)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error details:", error);
      throw new Error(`Database error saving article: ${error.message}`);
    }

    if (data) {
      return data as Article;
    }
  }

  // If Supabase is not configured and we are in production serverless
  if (isServerlessEnvironment()) {
    throw new Error(
      "Cloud database connection required in production: On Vercel, articles cannot be saved to the serverless disk. Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your Vercel Project Settings."
    );
  }

  // Local development fallback
  const all = await readLocalFile();
  const existingSlugIndex = all.findIndex((a) => a.slug === newArticle.slug);
  if (existingSlugIndex >= 0) {
    newArticle.slug = `${newArticle.slug}-${Date.now().toString().slice(-4)}`;
  }
  all.unshift(newArticle);
  await writeLocalFile(all);
  return newArticle;
}

export async function updateArticle(
  id: string,
  input: Partial<ArticleInput>
): Promise<Article> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getAdminSupabaseClient();
    if (!supabase) {
      throw new Error("Supabase client initialization failed.");
    }

    const updates: Record<string, unknown> = {
      ...input,
      updated_at: now,
    };
    if (input.status === "published" && !input.published_at) {
      updates.published_at = now;
    }

    const { data, error } = await supabase
      .from("articles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error details:", error);
      throw new Error(`Database error updating article: ${error.message}`);
    }

    if (data) {
      return data as Article;
    }
  }

  // If Supabase is not configured and in production serverless
  if (isServerlessEnvironment()) {
    throw new Error(
      "Cloud database connection required in production: On Vercel, article updates cannot be saved to the serverless disk. Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your Vercel Project Settings."
    );
  }

  // Local fallback
  const all = await readLocalFile();
  const index = all.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error(`Article with id ${id} not found.`);
  }

  const existing = all[index];
  const updated: Article = {
    ...existing,
    ...input,
    updated_at: now,
    published_at:
      input.status === "published"
        ? existing.published_at || now
        : input.status === "draft"
        ? null
        : existing.published_at,
  };

  all[index] = updated;
  await writeLocalFile(all);
  return updated;
}

export async function deleteArticle(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getAdminSupabaseClient();
    if (!supabase) {
      throw new Error("Supabase client initialization failed.");
    }

    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete error details:", error);
      throw new Error(`Database error deleting article: ${error.message}`);
    }
    return true;
  }

  if (isServerlessEnvironment()) {
    throw new Error(
      "Cloud database connection required in production: On Vercel, article deletions cannot be saved to the serverless disk. Please configure Supabase in your Vercel Project Settings."
    );
  }

  // Local fallback
  const all = await readLocalFile();
  const filtered = all.filter((a) => a.id !== id);
  if (filtered.length === all.length) {
    return false;
  }
  await writeLocalFile(filtered);
  return true;
}

export async function syncLocalArticlesToSupabase(): Promise<{
  success: boolean;
  count: number;
  message: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      count: 0,
      message: "Supabase credentials are not configured.",
    };
  }

  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      count: 0,
      message: "Could not initialize Supabase admin client.",
    };
  }

  const localArticles = await readLocalFile();
  if (localArticles.length === 0) {
    return {
      success: true,
      count: 0,
      message: "No local articles to sync.",
    };
  }

  const { error } = await supabase.from("articles").upsert(localArticles);
  if (error) {
    return {
      success: false,
      count: 0,
      message: `Failed to sync articles: ${error.message}`,
    };
  }

  return {
    success: true,
    count: localArticles.length,
    message: `Successfully synced ${localArticles.length} articles to Supabase!`,
  };
}

export async function getAdminStats() {
  const all = await getAllArticles();
  const publishedCount = all.filter((a) => a.status === "published").length;
  const draftsCount = all.filter((a) => a.status === "draft").length;
  const totalCount = all.length;
  const recentArticles = all.slice(0, 5);

  return {
    publishedCount,
    draftsCount,
    totalCount,
    recentArticles,
    isSupabaseConnected: isSupabaseConfigured(),
    isServerless: isServerlessEnvironment(),
  };
}
