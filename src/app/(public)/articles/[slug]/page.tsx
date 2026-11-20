import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getArticleBySlug } from "@/lib/storage/articles";
import { ReadingProgressBar } from "@/components/public/ReadingProgressBar";
import { ShareButton } from "@/components/public/ShareButton";
import { ArrowLeft } from "lucide-react";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hammadsjournal.com";
  const canonicalUrl = `${siteUrl}/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt || article.subtitle || "An essay from Hammad's Journal.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt || article.subtitle || "",
      url: canonicalUrl,
      type: "article",
      siteName: "Hammad's Journal",
      images: article.cover_image
        ? [
            {
              url: article.cover_image,
              alt: article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || article.subtitle || "",
      images: article.cover_image ? [article.cover_image] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "published") {
    notFound();
  }

  return (
    <>
      <ReadingProgressBar />

      <article className="pt-10 sm:pt-16 pb-24 px-6">
        {/* Centered Narrow Reading Column: max-w-[720px] */}
        <div className="max-w-[720px] mx-auto">
          {/* Top Navigation Row: Back Link & Share */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#F0ECE4]">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#6E6960] hover:text-[#171614] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to My Articles</span>
            </Link>

            <ShareButton title={article.title} />
          </div>

          {/* Category Tag if present */}
          {article.category && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs tracking-wider uppercase font-semibold text-[#8F5D24] bg-[#FAF3E8] rounded-md border border-[#F0E4D0]">
                {article.category}
              </span>
            </div>
          )}

          {/* Large Title: 44-52px on desktop */}
          <h1 className="font-heading text-3xl sm:text-5xl md:text-[3.25rem] font-medium tracking-tight text-[#171614] leading-[1.18] sm:leading-[1.16]">
            {article.title}
          </h1>

          {/* Optional Subtitle */}
          {article.subtitle && (
            <p className="mt-4 font-serif text-lg sm:text-2xl text-[#5C574F] font-light leading-snug italic">
              {article.subtitle}
            </p>
          )}

          {/* Author Byline (Strictly NO dates, times, or reading time) */}
          <div className="mt-8 mb-10 pt-4 pb-2 border-t border-[#F2ECE1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#171614] text-[#FAF8F5] flex items-center justify-center font-heading text-lg font-medium">
                HA
              </div>
              <div>
                <p className="text-sm font-medium text-[#171614]">
                  Hammad Azam
                </p>
                <p className="text-xs text-[#7C766D] font-sans">
                  Independent Essayist
                </p>
              </div>
            </div>
          </div>

          {/* Optional Cover Image */}
          {article.cover_image && (
            <div className="relative w-full h-[280px] sm:h-[420px] mb-12 rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] bg-[#F5F2EB]">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
              />
            </div>
          )}

          {/* Article Body: Rendered with editorial typography */}
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags if present */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-14 pt-6 border-t border-[#EBE6DD] flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs text-[#6E6960] bg-[#F5F2EB] rounded-md font-sans"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer Signature Section */}
          <div className="mt-16 pt-10 border-t border-[#EBE6DD] bg-white rounded-2xl p-8 border shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="font-heading text-xl font-medium text-[#171614]">
                  Written by Hammad Azam
                </p>
                <p className="mt-1 text-sm text-[#6E6960] font-sans leading-relaxed">
                  Published in Hammad&apos;s Journal. An independent space for
                  observing, questioning, and sharing perspectives.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <ShareButton title={article.title} />
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#171614] text-[#FAF8F5] hover:bg-[#2C2A26] transition-colors"
                >
                  <span>More Articles</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
