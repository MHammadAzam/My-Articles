"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E0D9CD] bg-white text-[#5C574F] hover:text-[#171614] hover:border-[#CBC4B7] transition-all"
      aria-label="Share this article"
    >
      {copied ? (
        <>
          <Check size={14} className="text-[#8F5D24]" />
          <span className="text-[#8F5D24]">Link Copied</span>
        </>
      ) : (
        <>
          <Share2 size={14} />
          <span>Share</span>
        </>
      )}
    </button>
  );
}
