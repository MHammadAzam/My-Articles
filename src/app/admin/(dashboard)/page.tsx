import Link from "next/link";
import { getAdminStats } from "@/lib/storage/articles";
import {
  PenSquare,
  FileText,
  FileEdit,
  Globe,
  ArrowRight,
  Database,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-10">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8F5D24] font-semibold">
            Publication Management
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-medium text-[#171614] mt-1">
            Studio Overview
          </h1>
          <p className="text-sm text-[#6E6960] mt-1 font-sans">
            Welcome back, Hammad. Here is the current state of your publication.
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#6E6960] font-semibold">
              Published Articles
            </span>
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
              <Globe size={18} />
            </div>
          </div>
          <div className="mt-4 font-heading text-4xl font-medium text-[#171614]">
            {stats.publishedCount}
          </div>
          <p className="mt-2 text-xs text-[#8A847A]">
            Publicly accessible on the web
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#6E6960] font-semibold">
              Active Drafts
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileEdit size={18} />
            </div>
          </div>
          <div className="mt-4 font-heading text-4xl font-medium text-[#171614]">
            {stats.draftsCount}
          </div>
          <p className="mt-2 text-xs text-[#8A847A]">
            Private and strictly hidden from readers
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#6E6960] font-semibold">
              Total Works
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF3E8] text-[#8F5D24] flex items-center justify-center">
              <FileText size={18} />
            </div>
          </div>
          <div className="mt-4 font-heading text-4xl font-medium text-[#171614]">
            {stats.totalCount}
          </div>
          <p className="mt-2 text-xs text-[#8A847A]">
            All essays written in the journal
          </p>
        </div>
      </div>

      {/* Database Status Alert */}
      <div className="rounded-xl border border-[#E0D9CD] bg-[#F7F4EE] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-[#DCD5C9] flex items-center justify-center text-[#8F5D24]">
            <Database size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#171614]">
              Storage Engine:{" "}
              {stats.isSupabaseConnected ? "Supabase PostgreSQL" : "Local Persistent Storage"}
            </h4>
            <p className="text-xs text-[#6E6960] mt-0.5">
              {stats.isSupabaseConnected
                ? "Connected directly to Supabase cloud database with Row-Level Security enabled."
                : "Currently running on local persistent store. Connect your Supabase credentials in Settings for cloud deployment."}
            </p>
          </div>
        </div>

        <Link
          href="/admin/settings"
          className="text-xs font-semibold text-[#8F5D24] hover:underline self-start sm:self-auto"
        >
          View Database Settings →
        </Link>
      </div>

      {/* Recently Edited Articles */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-2xl font-medium text-[#171614]">
            Recently Modified
          </h2>
          <Link
            href="/admin/articles"
            className="text-xs font-semibold text-[#8F5D24] hover:underline flex items-center gap-1"
          >
            <span>View all articles</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {stats.recentArticles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E0D8] p-10 text-center">
            <FileText size={32} className="mx-auto text-[#8A847A] mb-3" />
            <h3 className="font-heading text-xl font-medium text-[#171614]">
              No articles yet
            </h3>
            <p className="mt-2 text-sm text-[#6E6960]">
              Start writing your very first article to begin your publication.
            </p>
            <div className="mt-5">
              <Link
                href="/admin/write"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#171614] text-[#FAF8F5] text-xs font-medium"
              >
                <PenSquare size={14} />
                <span>Write an article</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E5E0D8] divide-y divide-[#F0ECE4] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
            {stats.recentArticles.map((article) => (
              <div
                key={article.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="max-w-xl">
                  <div className="flex items-center gap-2.5 mb-1.5">
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
                      <span className="text-xs text-[#8A847A] font-sans">
                        • {article.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-lg font-medium text-[#171614]">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#6E6960] line-clamp-1 mt-1 font-sans">
                    {article.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/edit/${article.id}`}
                    className="px-3 py-1.5 rounded-lg border border-[#DCD5C9] text-xs font-medium text-[#3D3A34] hover:bg-white hover:border-[#171614] transition-all"
                  >
                    Edit
                  </Link>
                  {article.status === "published" && (
                    <Link
                      href={`/articles/${article.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-[#6E6960] hover:text-[#171614] hover:bg-[#F0ECE4] transition-colors"
                      title="Open Live Article"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
