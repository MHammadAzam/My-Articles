import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#EBE6DD] bg-[#FAF8F5] mt-24 py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-8 pb-12 border-b border-[#EBE6DD]">
          <div className="max-w-md">
            <h3 className="font-heading text-2xl font-medium text-[#171614] tracking-tight">
              Hammad&apos;s Journal
            </h3>
            <p className="mt-2 text-sm text-[#6E6960] font-sans leading-relaxed">
              A personal space for exploring ideas, questioning perspectives, and sharing observations about the world around us.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-sm font-medium text-[#6E6960]">
            <Link
              href="/"
              className="hover:text-[#171614] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/articles"
              className="hover:text-[#171614] transition-colors"
            >
              My Articles
            </Link>
            <Link
              href="/about"
              className="hover:text-[#171614] transition-colors"
            >
              About
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A847A] font-sans gap-4">
          <p>© Hammad Azam. All rights reserved.</p>
          <p className="italic font-serif text-[0.85rem] text-[#7C766D]">
            Written with curiosity and purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}
