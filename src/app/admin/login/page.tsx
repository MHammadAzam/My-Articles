"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#EBE6DD] p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF3E8] border border-[#F0E4D0] flex items-center justify-center text-[#8F5D24] mb-4">
            <Lock size={20} />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-medium text-[#171614]">
            Hammad&apos;s Journal
          </h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-[#7C766D] font-sans font-medium">
            Private Editorial Studio
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2"
            >
              Author Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hammad@journal.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5C9] text-sm text-[#171614] placeholder-[#9E998F] focus:outline-none focus:border-[#8F5D24] focus:ring-1 focus:ring-[#8F5D24] transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#DCD5C9] text-sm text-[#171614] placeholder-[#9E998F] focus:outline-none focus:border-[#8F5D24] focus:ring-1 focus:ring-[#8F5D24] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#171614] text-[#FAF8F5] text-sm font-medium hover:bg-[#2C2A26] transition-all duration-150 flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <span>Enter Studio</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#F0ECE4] text-center text-xs text-[#8A847A]">
          <p>Restricted area. Strictly for Hammad Azam.</p>
        </div>
      </div>
    </div>
  );
}
