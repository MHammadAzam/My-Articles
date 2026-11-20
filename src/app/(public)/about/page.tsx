import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "A Little About Me — Hammad Azam's personal digital publication and intellectual manifesto.",
};

export default function AboutPage() {
  return (
    <div className="pt-12 sm:pt-20 pb-24 px-6">
      <div className="max-w-[720px] mx-auto">
        {/* Section Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF3E8] border border-[#F0E4D0] text-[#8F5D24] text-xs font-semibold uppercase tracking-wider mb-6">
          <Compass size={13} />
          <span>About The Journal</span>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#171614] leading-[1.15]">
          A Little About Me
        </h1>

        {/* Author Monogram & Identification */}
        <div className="mt-8 mb-12 pb-6 border-b border-[#EBE6DD] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#171614] text-[#FAF8F5] flex items-center justify-center font-heading text-xl font-medium shadow-xs">
            HA
          </div>
          <div>
            <h2 className="text-base font-medium text-[#171614]">Hammad Azam</h2>
            <p className="text-xs text-[#7C766D] font-sans">
              Author &amp; Editor, Hammad&apos;s Journal
            </p>
          </div>
        </div>

        {/* Editorial Text Content (Exact Preserved Phrasing) */}
        <div className="font-editorial text-lg sm:text-[1.28rem] leading-[1.85] text-[#292621] space-y-8">
          <p>
            I&apos;m an undergraduate Computer Science student, but my curiosity
            has never really stayed within the boundaries of one subject.
            I&apos;ve always enjoyed exploring different ideas, asking questions,
            and trying to understand things from perspectives I might not have
            considered before.
          </p>

          <p>
            My interests range from religion, politics, history, philosophy, and
            neuroscience to technology, human behaviour, and the many questions
            surrounding the world we live in. I often find myself going down
            unexpected rabbit holes, reading about subjects simply because
            something caught my attention and made me want to know more.
          </p>

          <p>
            I believe there&apos;s always something worth learning, even in
            subjects we don&apos;t necessarily agree with or fully understand. I
            enjoy looking at different viewpoints, questioning my own
            assumptions, and forming opinions through whatever I learn along the
            way.
          </p>

          <p>
            This website is simply a place for all of that. A space where I can
            put my thoughts into words, share my perspectives, and write about
            whatever happens to occupy my curiosity. Some articles might be
            based on research, others on personal reflections or observations.
            Not everything here is meant to be a conclusion; sometimes, it&apos;s
            just a thought worth exploring.
          </p>

          {/* Refined Typographic Treatment for Final Sentence */}
          <div className="pt-6 pb-2">
            <blockquote className="my-0 py-4 px-6 rounded-xl bg-white border border-[#EBE6DD] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <p className="font-heading italic text-xl sm:text-2xl text-[#171614] leading-relaxed">
                &ldquo;I&apos;m here to learn, question, explore, and
                occasionally put those thoughts into writing.&rdquo;
              </p>
              <footer className="mt-3 text-xs uppercase tracking-widest text-[#8F5D24] font-sans font-semibold">
                — Hammad Azam
              </footer>
            </blockquote>
          </div>
        </div>

        {/* Action Link to Articles */}
        <div className="mt-14 pt-8 border-t border-[#EBE6DD] flex items-center justify-between">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#8F5D24] hover:text-[#6D4417] transition-colors"
          >
            <span>Explore my articles</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/"
            className="text-xs text-[#8A847A] hover:text-[#171614] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
