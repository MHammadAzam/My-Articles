import { Metadata } from "next";
import { getPublishedArticles } from "@/lib/storage/articles";
import { ArticlesListClient } from "./ArticlesListClient";

export const metadata: Metadata = {
  title: "My Articles",
  description:
    "The complete collection of essays, reflections, and perspectives published by Hammad Azam.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16 pb-24">
      {/* Page Header */}
      <div className="max-w-3xl mb-12">
        <span className="text-xs uppercase tracking-widest text-[#8F5D24] font-semibold">
          Archive
        </span>
        <h1 className="mt-2 font-heading text-4xl sm:text-5xl font-medium tracking-tight text-[#171614]">
          My Articles
        </h1>
        <p className="mt-4 font-serif text-lg text-[#5C574F] leading-relaxed">
          Observations on philosophy, technology, human behavior, and the
          unexamined questions that shape our thinking.
        </p>
      </div>

      {/* Interactive List & Filter Component */}
      <ArticlesListClient initialArticles={articles} />
    </div>
  );
}
