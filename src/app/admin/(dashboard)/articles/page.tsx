import { getAllArticles } from "@/lib/storage/articles";
import { ManageArticlesClient } from "./ManageArticlesClient";
import Link from "next/link";
import { PenSquare } from "lucide-react";

interface ArticlesPageProps {
  searchParams: Promise<{ filter?: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const { filter } = await searchParams;
  const articles = await getAllArticles();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8F5D24] font-semibold">
            Publication Management
          </span>
          <h1 className="font-heading text-3xl font-medium text-[#171614] mt-1">
            All Articles
          </h1>
          <p className="text-sm text-[#6E6960] mt-1 font-sans">
            Manage your drafts, publish new pieces, edit existing works, or copy shareable links.
          </p>
        </div>

        <Link
          href="/admin/write"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171614] text-[#FAF8F5] text-sm font-medium hover:bg-[#2C2A26] transition-all shadow-xs self-start sm:self-auto"
        >
          <PenSquare size={16} />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Interactive Table Client */}
      <ManageArticlesClient
        initialArticles={articles}
        initialFilter={filter || "all"}
      />
    </div>
  );
}
