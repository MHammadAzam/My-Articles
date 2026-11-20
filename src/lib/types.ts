export type ArticleStatus = "draft" | "published";

export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  content: string;
  excerpt: string;
  cover_image?: string | null;
  category?: string | null;
  tags?: string[] | null;
  status: ArticleStatus;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
}

export type ArticleInput = Omit<
  Article,
  "id" | "created_at" | "updated_at" | "published_at"
> & {
  id?: string;
  published_at?: string | null;
};
