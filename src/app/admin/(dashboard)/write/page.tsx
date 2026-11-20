"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TipTapEditor } from "@/components/admin/TipTapEditor";
import { slugify } from "@/lib/utils";
import {
  Globe,
  FileEdit,
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

export default function WriteArticlePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Philosophy");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [customExcerpt, setCustomExcerpt] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-slug generation from title if user hasn't explicitly customized it
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!title.trim()) {
      alert("Please provide an article title.");
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      alert("Please write some content for the article.");
      return;
    }

    setIsSaving(true);
    setSaveStatus(status === "published" ? "Publishing..." : "Saving draft...");

    try {
      const payload = {
        title: title.trim(),
        customSlug: slug.trim() || slugify(title),
        subtitle: subtitle.trim() || null,
        category: category.trim(),
        cover_image: coverImage.trim() || null,
        content,
        excerpt: customExcerpt.trim() || undefined,
        status,
      };

      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save article");
      }

      setSaveStatus(status === "published" ? "Published!" : "Draft saved!");

      if (status === "published") {
        setPublishedSlug(data.slug);
      } else {
        setTimeout(() => {
          router.push(`/admin/edit/${data.id}`);
        }, 1200);
      }
    } catch (err: unknown) {
      console.error("Save error:", err);
      alert(err instanceof Error ? err.message : "Error saving article");
      setSaveStatus(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyPublishedLink = () => {
    if (!publishedSlug) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard.writeText(`${origin}/articles/${publishedSlug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-lg text-[#6E6960] hover:text-[#171614] hover:bg-[#EBE6DD] transition-colors"
            title="Back to Overview"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-medium text-[#171614]">
              Write New Article
            </h1>
            <p className="text-xs text-[#7C766D] font-sans">
              Craft your thoughts directly or paste from Word / ChatGPT.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DCD5C9] bg-white text-xs font-semibold text-[#3D3A34] hover:bg-[#F7F4EE] hover:border-[#CBC4B7] shadow-2xs transition-all disabled:opacity-50"
          >
            <FileEdit size={14} />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171614] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2C2A26] shadow-xs transition-all disabled:opacity-50"
          >
            <Globe size={14} />
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner for Published Article */}
      {publishedSlug && (
        <div className="p-6 rounded-2xl bg-green-50 border border-green-200 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-heading text-lg font-medium text-green-900">
                  Article Published Successfully!
                </h3>
                <p className="text-xs text-green-700 font-sans mt-0.5">
                  Your piece is now live on the public publication.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPublishedLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-green-300 text-xs font-semibold text-green-800 hover:bg-green-100 transition-colors"
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
              </button>

              <Link
                href={`/articles/${publishedSlug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-800 text-white text-xs font-semibold hover:bg-green-900 transition-colors"
              >
                <span>View Live</span>
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Status toast */}
      {saveStatus && !publishedSlug && (
        <div className="p-3 bg-[#FAF3E8] border border-[#F0E4D0] rounded-xl text-xs text-[#8F5D24] font-medium flex items-center gap-2">
          <Sparkles size={14} />
          <span>{saveStatus}</span>
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
            placeholder="e.g. Even When I Lose My Enthusiasm"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full font-heading text-2xl sm:text-3xl font-medium px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DCD5C9] text-[#171614] placeholder-[#9E998F] focus:outline-none focus:border-[#8F5D24] focus:ring-1 focus:ring-[#8F5D24] transition-all"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2">
            Subtitle (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. On the quiet necessity of showing up when the initial spark fades."
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full font-serif text-base px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5C9] text-[#171614] placeholder-[#9E998F] focus:outline-none focus:border-[#8F5D24] transition-all"
          />
        </div>

        {/* Category & Slug Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2">
              Topic / Category
            </label>
            <div className="space-y-2">
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
                placeholder="slug-of-the-article"
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
            placeholder="https://images.unsplash.com/photo-..."
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5C9] text-xs font-mono text-[#171614] placeholder-[#9E998F] focus:outline-none focus:border-[#8F5D24] transition-all"
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
          <TipTapEditor
            content={content}
            onChange={setContent}
            placeholder="Type your essay here, or paste directly from ChatGPT or Word..."
          />
        </div>

        {/* Optional Custom Excerpt */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2">
            Custom Summary / Excerpt (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Leave blank to automatically generate from the first paragraph..."
            value={customExcerpt}
            onChange={(e) => setCustomExcerpt(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5C9] text-sm text-[#171614] placeholder-[#9E998F] focus:outline-none focus:border-[#8F5D24] transition-all"
          />
        </div>
      </div>
    </div>
  );
}
