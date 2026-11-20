"use client";

import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block h-full card-perspective"
    >
      <article
        className={`card-3d relative flex flex-col justify-between h-full bg-white rounded-xl border border-[#EBE6DD] overflow-hidden p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#D1C9BC] transition-all duration-300 ${
          featured ? "sm:p-8" : ""
        }`}
      >
        <div>
          {/* Optional Cover Image */}
          {article.cover_image && (
            <div className="relative w-full h-48 sm:h-56 mb-5 overflow-hidden rounded-lg bg-[#F5F2EB]">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          )}

          {/* Optional Category Badge */}
          {article.category && (
            <div className="mb-3.5">
              <span className="inline-block px-2.5 py-0.5 text-[0.72rem] tracking-wider uppercase font-semibold text-[#8F5D24] bg-[#FAF3E8] rounded-md border border-[#F0E4D0]">
                {article.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h3
            className={`font-heading font-medium text-[#171614] tracking-tight group-hover:text-[#8F5D24] transition-colors duration-200 ${
              featured
                ? "text-2xl sm:text-3xl leading-snug"
                : "text-xl sm:text-2xl leading-snug"
            }`}
          >
            {article.title}
          </h3>

          {/* Optional Subtitle if present, or Excerpt */}
          {article.subtitle && (
            <p className="mt-2 text-sm font-serif italic text-[#6E6960] line-clamp-2">
              {article.subtitle}
            </p>
          )}

          {/* Excerpt */}
          <p className="mt-3 text-sm text-[#5C574F] font-sans leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>

        {/* Card Footer: Subtle Read Prompt (Strictly NO dates, times, or reading duration) */}
        <div className="mt-6 pt-4 border-t border-[#F5F2EC] flex items-center justify-between text-xs font-medium text-[#7C766D] group-hover:text-[#171614] transition-colors">
          <span className="tracking-wide">Read Essay</span>
          <ArrowUpRight
            size={16}
            className="transform transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#945B1C]"
          />
        </div>
      </article>
    </Link>
  );
}
