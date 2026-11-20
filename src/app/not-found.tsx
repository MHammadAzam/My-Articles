import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-[#FAF3E8] border border-[#F0E4D0] flex items-center justify-center text-[#8F5D24] mb-6">
        <Compass size={22} />
      </div>

      <span className="text-xs uppercase tracking-widest text-[#8F5D24] font-semibold">
        404 — Page Not Found
      </span>

      <h1 className="mt-3 font-heading text-4xl sm:text-5xl font-medium text-[#171614] tracking-tight">
        An Uncharted Path
      </h1>

      <p className="mt-4 font-serif text-lg text-[#5C574F] max-w-md mx-auto leading-relaxed">
        The essay or page you are looking for does not exist, has been moved, or remains in unpublished drafts.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171614] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2C2A26] transition-all"
        >
          <ArrowLeft size={14} />
          <span>Return Home</span>
        </Link>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#DCD5C9] bg-white text-[#3D3A34] text-xs font-semibold hover:bg-[#F7F4EE] transition-all"
        >
          <span>Explore Articles</span>
        </Link>
      </div>
    </div>
  );
}
