"use client";

import { useState } from "react";
import { RefreshCw, Check, AlertCircle } from "lucide-react";

export function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST",
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        success: false,
        message: err instanceof Error ? err.message : "Sync failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleSync}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171614] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2C2A26] transition-all disabled:opacity-50"
      >
        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        <span>{loading ? "Syncing..." : "Sync Local Articles to Supabase"}</span>
      </button>

      {result && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            result.success
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {result.success ? <Check size={14} /> : <AlertCircle size={14} />}
          <span>{result.message}</span>
        </div>
      )}
    </div>
  );
}
