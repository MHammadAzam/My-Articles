"use client";

import { useState, useMemo } from "react";
import { Article } from "@/lib/types";
import { ArticleCard } from "@/components/public/ArticleCard";
import { Search, SlidersHorizontal, BookOpen } from "lucide-react";

interface ArticlesListClientProps {
  initialArticles: Article[];
}

export function ArticlesListClient({ initialArticles }: ArticlesListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialArticles.forEach((a) => {
      if (a.category && a.category.trim()) {
        set.add(a.category.trim());
      }
    });
    return ["All", ...Array.from(set)];
  }, [initialArticles]);

  // Filter articles based on query and category
  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" ||
        article.category?.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        (article.subtitle && article.subtitle.toLowerCase().includes(q)) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.content.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [initialArticles, searchQuery, selectedCategory]);

  return (
    <div className="space-y-10">
      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DD]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A847A]"
          />
          <input
            type="text"
            placeholder="Search essays by title or concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#DCD5C9] text-sm text-[#171614] placeholder-[#8A847A] focus:outline-none focus:border-[#8F5D24] focus:ring-1 focus:ring-[#8F5D24] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A847A] hover:text-[#171614]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        {categories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs uppercase tracking-wider text-[#8A847A] font-medium mr-1 flex items-center gap-1">
              <SlidersHorizontal size={12} />
              Filter:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                    active
                      ? "bg-[#171614] text-[#FAF8F5] shadow-xs"
                      : "bg-white text-[#5C574F] border border-[#E0D9CD] hover:border-[#CBC4B7] hover:text-[#171614]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid of Articles */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white rounded-2xl border border-[#EBE6DD]">
          <BookOpen size={28} className="mx-auto text-[#8A847A] mb-3" />
          <h3 className="font-heading text-xl font-medium text-[#171614]">
            No matching articles found
          </h3>
          <p className="mt-2 text-sm text-[#6E6960] max-w-sm mx-auto">
            {searchQuery
              ? `No articles match the search term "${searchQuery}". Try a different keyword.`
              : "No articles are available in this category yet."}
          </p>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-4 py-2 text-xs font-medium text-[#8F5D24] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
