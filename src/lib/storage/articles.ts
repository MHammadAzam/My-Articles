import fs from "fs/promises";
import path from "path";
import { Article, ArticleInput } from "../types";
import { createClient as createServerSupabase } from "../supabase/server";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "articles.json");

// Helper to check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-url")
  );
}

// Fallback file-based operations
async function readLocalFile(): Promise<Article[]> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(raw) as Article[];
  } catch (error) {
    console.warn("Could not read local data file, initializing empty:", error);
    return [];
  }
}

async function writeLocalFile(articles: Article[]): Promise<void> {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(articles, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to local data file:", error);
    throw error;
  }
}

// ==========================================
// PUBLIC METHODS (Strictly Published Only)
// ==========================================

export async function getPublishedArticles(): Promise<Article[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false });

        if (!error && data) {
          return data as Article[];
        }
        console.warn("Supabase query error, falling back to local store:", error);
      }
    } catch (err) {
      console.warn("Supabase client error, falling back:", err);
    }
  }

  // Local fallback
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
      const supabase = await createServerSupabase();
      if (supabase) {
        let query = supabase.from("articles").select("*").eq("slug", slug);
        if (!allowDrafts) {
          query = query.eq("status", "published");
        }
        const { data, error } = await query.single();
        if (!error && data) {
          return data as Article;
        }
      }
    } catch (err) {
      console.warn("Supabase query error on slug lookup, using fallback:", err);
    }
  }

  // Local fallback
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
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .order("updated_at", { ascending: false });

        if (!error && data) {
          return data as Article[];
        }
      }
    } catch (err) {
      console.warn("Supabase query error on getAllArticles:", err);
    }
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
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data) {
          return data as Article;
        }
      }
    } catch (err) {
      console.warn("Supabase query error on getArticleById:", err);
    }
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
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("articles")
          .insert(newArticle)
          .select()
          .single();

        if (!error && data) {
          return data as Article;
        }
        console.warn("Supabase insert error, saving locally:", error);
      }
    } catch (err) {
      console.warn("Supabase client insert error:", err);
    }
  }

  // Local fallback
  const all = await readLocalFile();
  // Ensure unique slug
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
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
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

        if (!error && data) {
          return data as Article;
        }
        console.warn("Supabase update error, applying locally:", error);
      }
    } catch (err) {
      console.warn("Supabase update client error:", err);
    }
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
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { error } = await supabase.from("articles").delete().eq("id", id);
        if (!error) return true;
        console.warn("Supabase delete error:", error);
      }
    } catch (err) {
      console.warn("Supabase delete client error:", err);
    }
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
  };
}
