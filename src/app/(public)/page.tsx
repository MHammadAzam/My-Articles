import Link from "next/link";
import { getPublishedArticles } from "@/lib/storage/articles";
import { ArticleCard } from "@/components/public/ArticleCard";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Dynamic data

export default async function HomePage() {
  const articles = await getPublishedArticles();

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const recentArticles = articles.length > 1 ? articles.slice(1, 5) : [];

  return (
    <div className="space-y-24 sm:space-y-32 pb-16">
      {/* 1. Main Hero Introduction */}
      <section className="pt-16 sm:pt-24 max-w-4xl mx-auto px-6 sm:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF3E8] border border-[#F0E4D0] text-[#8F5D24] text-xs font-medium tracking-wide uppercase mb-8">
          <Sparkles size={13} />
          <span>Independent Digital Publication</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-[#171614] leading-[1.12]">
          Thoughts, Ideas &amp; Perspectives.
        </h1>

        <p className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl font-serif text-[#5C574F] max-w-2xl mx-auto leading-relaxed font-light">
          A personal space for exploring ideas, questioning perspectives, and
          sharing observations about the world around us.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#171614] text-[#FAF8F5] text-sm font-medium hover:bg-[#2C2A26] transition-all duration-200 shadow-sm hover:shadow"
          >
            <span>Read Articles</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[#DCD5C9] bg-white text-[#3D3A34] text-sm font-medium hover:bg-[#F7F4EE] hover:border-[#CBC4B7] transition-all duration-200"
          >
            <span>About Hammad</span>
          </Link>
        </div>
      </section>

      {/* 2. Content Section (Articles or Graceful Empty State) */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {articles.length === 0 ? (
          /* Editorial Empty State */
          <div className="text-center py-20 px-8 max-w-lg mx-auto bg-white rounded-2xl border border-[#EBE6DD] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF3E8] flex items-center justify-center text-[#8F5D24] mb-4">
              <BookOpen size={22} />
            </div>
            <h3 className="font-heading text-2xl font-medium text-[#171614]">
              The Journal is Opening Soon
            </h3>
            <p className="mt-3 text-[#6E6960] text-sm leading-relaxed font-sans">
              New essays, observations, and philosophical perspectives are
              currently being written. Visit again soon to explore the initial
              writings.
            </p>
            <div className="mt-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#8F5D24] hover:underline"
              >
                <span>Read the publication preface</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-20">
            {/* Featured Article */}
            {featuredArticle && (
              <section>
                <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#EBE6DD]">
                  <h2 className="font-heading text-2xl sm:text-3xl font-medium text-[#171614]">
                    Featured Writing
                  </h2>
                  <span className="text-xs uppercase tracking-widest text-[#8A847A] font-semibold">
                    Curated Perspective
                  </span>
                </div>
                <div className="grid grid-cols-1">
                  <ArticleCard article={featuredArticle} featured={true} />
                </div>
              </section>
            )}

            {/* Latest Articles */}
            {recentArticles.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-[#EBE6DD]">
                  <h2 className="font-heading text-2xl sm:text-3xl font-medium text-[#171614]">
                    Recent Essays
                  </h2>
                  <Link
                    href="/articles"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8F5D24] hover:text-[#6D4417] transition-colors"
                  >
                    <span>View all</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {recentArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* Explore All Articles Link */}
            <div className="text-center pt-8">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-[#DCD5C9] bg-white text-[#171614] text-sm font-medium hover:bg-[#F7F4EE] hover:border-[#CBC4B7] shadow-sm transition-all duration-200"
              >
                <span>Explore the Complete Archive</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 3. About Section Preview */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="bg-white rounded-2xl border border-[#EBE6DD] p-8 sm:p-12 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-[#8F5D24] font-semibold">
              The Author
            </span>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-medium text-[#171614]">
              A Little About Me
            </h2>
            <p className="mt-4 font-serif text-lg text-[#4A463F] leading-relaxed">
              I&apos;m an undergraduate Computer Science student, but my
              curiosity has never really stayed within the boundaries of one
              subject. I&apos;ve always enjoyed exploring different ideas,
              asking questions, and trying to understand things from
              perspectives I might not have considered before.
            </p>
            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#171614] hover:text-[#8F5D24] transition-colors"
              >
                <span className="underline underline-offset-4 decoration-[#CBC4B7]">
                  Read the full introduction
                </span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
