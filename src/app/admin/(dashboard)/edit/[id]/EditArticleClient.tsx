"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TipTapEditor } from "@/components/admin/TipTapEditor";
import { Article } from "@/lib/types";
import { slugify } from "@/lib/utils";
import {
  Globe,
  FileEdit,
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Trash2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";

const PRESET_CATEGORIES = [
  "Philosophy",
  "Perspectives",
  "Observations",
  "Technology",
  "Human Behaviour",
  "Religion & Politics",
  "Neuroscience",
  "Reflections",
];

interface EditArticleClientProps {
  initialArticle: Article;
}

export function EditArticleClient({ initialArticle }: EditArticleClientProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialArticle.title);
  const [subtitle, setSubtitle] = useState(initialArticle.subtitle || "");
  const [slug, setSlug] = useState(initialArticle.slug);
  const [category, setCategory] = useState(initialArticle.category || "Philosophy");
  const [coverImage, setCoverImage] = useState(initialArticle.cover_image || "");
  const [content, setContent] = useState(initialArticle.content);
  const [status, setStatus] = useState<"draft" | "published">(initialArticle.status);
  const [customExcerpt, setCustomExcerpt] = useState(initialArticle.excerpt || "");

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (targetStatus?: "draft" | "published") => {
    if (!title.trim()) {
      alert("Please provide an article title.");
      return;
    }

    const finalStatus = targetStatus || status;
    setIsSaving(true);
    setErrorMessage(null);
    setSaveStatus("Saving changes...");

    try {
      const payload = {
        title: title.trim(),
        customSlug: slug.trim() || slugify(title),
        subtitle: subtitle.trim() || null,
        category: category.trim(),
        cover_image: coverImage.trim() || null,
        content,
        excerpt: customExcerpt.trim() || undefined,
        status: finalStatus,
      };

      const res = await fetch(`/api/articles/${initialArticle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const updated = await res.json();

      if (!res.ok) {
        throw new Error(updated.error || "Failed to update article");
      }

      setStatus(updated.status);
      setSlug(updated.slug);
      setSaveStatus("All changes saved!");
      setTimeout(() => setSaveStatus(null), 3000);
      router.refresh();
    } catch (err: unknown) {
      console.error("Save error:", err);
      const msg = err instanceof Error ? err.message : "Error updating article";
      setErrorMessage(msg);
      setSaveStatus(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/articles/${initialArticle.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete article");
      router.push("/admin/articles");
    } catch (err) {
      alert("Could not delete article.");
      console.error(err);
      setIsDeleting(false);
    }
  };

  const handleCopyLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard.writeText(`${origin}/articles/${slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 rounded-lg text-[#6E6960] hover:text-[#171614] hover:bg-[#EBE6DD] transition-colors"
            title="Back to Articles"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 text-[0.68rem] tracking-wider uppercase font-semibold rounded ${
                  status === "published"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {status}
              </span>
              <h1 className="font-heading text-2xl font-medium text-[#171614]">
                Edit Article
              </h1>
            </div>
            <p className="text-xs text-[#7C766D] font-sans mt-0.5">
              Editing: &ldquo;{initialArticle.title}&rdquo;
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {status === "published" ? (
            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-all disabled:opacity-50"
            >
              <FileEdit size={14} />
              <span>Unpublish to Draft</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSave("published")}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-700 text-white text-xs font-semibold hover:bg-green-800 transition-all shadow-xs disabled:opacity-50"
            >
              <Globe size={14} />
              <span>Publish Now</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#171614] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2C2A26] transition-all shadow-xs disabled:opacity-50"
          >
            <span>Save Changes</span>
          </button>

          {status === "published" && (
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-xl border border-[#DCD5C9] bg-white text-[#6E6960] hover:text-[#171614] transition-colors"
              title="Copy shareable link"
            >
              {copiedLink ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          )}

          {status === "published" && (
            <Link
              href={`/articles/${slug}`}
              target="_blank"
              className="p-2 rounded-xl border border-[#DCD5C9] bg-white text-[#6E6960] hover:text-[#171614] transition-colors"
              title="View live publication"
            >
              <ExternalLink size={16} />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            title="Delete article"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Status banner */}
      {saveStatus && (
        <div className="p-3 bg-[#FAF3E8] border border-[#F0E4D0] rounded-xl text-xs text-[#8F5D24] font-medium flex items-center gap-2">
          <Sparkles size={14} />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Error banner */}
      {errorMessage && (
        <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm space-y-2 animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5 font-semibold text-red-900">
              <span className="w-5 h-5 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-xs">!</span>
              <span>Publishing Error</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-red-600 hover:text-red-900 font-medium"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs leading-relaxed text-red-700">{errorMessage}</p>
          {errorMessage.includes("Vercel") && (
            <div className="pt-2">
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 text-xs font-semibold transition-colors"
              >
                <span>Open Database Settings &amp; Setup Guide →</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-6 bg-white rounded-2xl border border-[#E5E0D8] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2">
            Article Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full font-heading text-2xl sm:text-3xl font-medium px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DCD5C9] text-[#171614] focus:outline-none focus:border-[#8F5D24] focus:ring-1 focus:ring-[#8F5D24] transition-all"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2">
            Subtitle (Optional)
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full font-serif text-base px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5C9] text-[#171614] focus:outline-none focus:border-[#8F5D24] transition-all"
          />
        </div>

        {/* Category & Slug Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2">
              Topic / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5C9] text-sm text-[#171614] focus:outline-none focus:border-[#8F5D24]"
            >
              {PRESET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* URL Slug */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2">
              URL Slug
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8A847A] font-mono">
                /articles/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="w-full pl-22 pr-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5C9] text-xs font-mono text-[#171614] focus:outline-none focus:border-[#8F5D24]"
              />
            </div>
          </div>
        </div>

        {/* Cover Image URL */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2">
            Cover Image URL (Optional)
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5C9] text-xs font-mono text-[#171614] focus:outline-none focus:border-[#8F5D24] transition-all"
          />

          {coverImage && (
            <div className="mt-3 relative w-full h-44 rounded-xl overflow-hidden border border-[#E5E0D8] bg-[#F5F2EB]">
              <Image
                src={coverImage}
                alt="Cover preview"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                onError={() => console.warn("Invalid image url preview")}
              />
            </div>
          )}
        </div>

        {/* TipTap Rich Text Editor */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2">
            Article Body *
          </label>
          <TipTapEditor content={content} onChange={setContent} />
        </div>

        {/* Custom Excerpt */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2">
            Custom Summary / Excerpt (Optional)
          </label>
          <textarea
            rows={2}
            value={customExcerpt}
            onChange={(e) => setCustomExcerpt(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5C9] text-sm text-[#171614] focus:outline-none focus:border-[#8F5D24] transition-all"
          />
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title={title}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
