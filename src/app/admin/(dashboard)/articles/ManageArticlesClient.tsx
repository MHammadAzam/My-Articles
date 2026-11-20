"use client";

import { useState } from "react";
import Link from "next/link";
import { Article } from "@/lib/types";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import {
  ExternalLink,
  Edit3,
  Trash2,
  Globe,
  FileEdit,
  Copy,
  Check,
  Search,
} from "lucide-react";

interface ManageArticlesClientProps {
  initialArticles: Article[];
  initialFilter?: string;
}

export function ManageArticlesClient({
  initialArticles,
  initialFilter = "all",
}: ManageArticlesClientProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [filter, setFilter] = useState<string>(initialFilter);
  const [search, setSearch] = useState("");
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Status toggle handler
  const handleToggleStatus = async (article: Article) => {
    const newStatus = article.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();

      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, status: updated.status } : a))
      );
    } catch (err) {
      alert("Error updating article status.");
      console.error(err);
    }
  };

  // Delete handler
  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/articles/${articleToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete article");

      setArticles((prev) => prev.filter((a) => a.id !== articleToDelete.id));
      setArticleToDelete(null);
    } catch (err) {
      alert("Error deleting article.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy link
  const handleCopyLink = (slug: string, id: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/articles/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered list
  const filtered = articles.filter((a) => {
    if (filter === "draft" && a.status !== "draft") return false;
    if (filter === "published" && a.status !== "published") return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        (a.category && a.category.toLowerCase().includes(q)) ||
        a.excerpt.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8]">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EBE6DD] rounded-xl self-start">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === "all"
                ? "bg-white text-[#171614] shadow-xs font-semibold"
                : "text-[#5C574F] hover:text-[#171614]"
            }`}
          >
            All ({articles.length})
          </button>
          <button
            onClick={() => setFilter("published")}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === "published"
                ? "bg-white text-[#171614] shadow-xs font-semibold"
                : "text-[#5C574F] hover:text-[#171614]"
            }`}
          >
            Published ({articles.filter((a) => a.status === "published").length})
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === "draft"
                ? "bg-white text-[#171614] shadow-xs font-semibold"
                : "text-[#5C574F] hover:text-[#171614]"
            }`}
          >
            Drafts ({articles.filter((a) => a.status === "draft").length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A847A]"
          />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white border border-[#DCD5C9] text-[#171614] focus:outline-none focus:border-[#8F5D24]"
          />
        </div>
      </div>

      {/* Articles Table / Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E0D8]">
          <p className="text-sm text-[#6E6960] font-sans">
            No articles match the current filter or search criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E0D8] divide-y divide-[#F0ECE4] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
          {filtered.map((article) => (
            <div
              key={article.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
            >
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`px-2 py-0.5 text-[0.68rem] tracking-wider uppercase font-semibold rounded ${
                      article.status === "published"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {article.status}
                  </span>
                  {article.category && (
                    <span className="text-xs text-[#8A847A]">
                      • {article.category}
                    </span>
                  )}
                  <span className="text-xs text-[#9E998F]">
                    slug: /{article.slug}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-medium text-[#171614]">
                  {article.title}
                </h3>
                <p className="text-xs text-[#6E6960] line-clamp-1 mt-1 font-sans">
                  {article.excerpt}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(article)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    article.status === "published"
                      ? "border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100"
                      : "border-green-300 text-green-800 bg-green-50 hover:bg-green-100"
                  }`}
                  title={
                    article.status === "published"
                      ? "Unpublish to draft"
                      : "Publish article immediately"
                  }
                >
                  {article.status === "published" ? (
                    <span className="flex items-center gap-1.5">
                      <FileEdit size={13} />
                      Unpublish
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Globe size={13} />
                      Publish
                    </span>
                  )}
                </button>

                <Link
                  href={`/admin/edit/${article.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCD5C9] bg-white text-xs font-medium text-[#3D3A34] hover:border-[#171614] transition-all"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </Link>

                {article.status === "published" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(article.slug, article.id)}
                      className="p-1.5 rounded-lg border border-[#DCD5C9] bg-white text-[#6E6960] hover:text-[#171614] hover:border-[#171614] transition-all"
                      title="Copy public link"
                    >
                      {copiedId === article.id ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>

                    <Link
                      href={`/articles/${article.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg border border-[#DCD5C9] bg-white text-[#6E6960] hover:text-[#171614] hover:border-[#171614] transition-all"
                      title="View public page"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setArticleToDelete(article)}
                  className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all"
                  title="Delete article"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(articleToDelete)}
        title={articleToDelete?.title || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setArticleToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
