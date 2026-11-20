import { getAdminStats } from "@/lib/storage/articles";
import { Database, ShieldCheck, Key, Globe, AlertTriangle } from "lucide-react";
import { SyncButton } from "./SyncButton";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="pb-6 border-b border-[#E5E0D8]">
        <span className="text-xs uppercase tracking-widest text-[#8F5D24] font-semibold">
          System &amp; Configuration
        </span>
        <h1 className="font-heading text-3xl font-medium text-[#171614] mt-1">
          Settings &amp; Architecture
        </h1>
        <p className="text-sm text-[#6E6960] mt-1 font-sans">
          Manage your cloud database credentials, security policies, and production deployment parameters.
        </p>
      </div>

      {/* Production Persistence Warning if on Vercel without Supabase */}
      {!stats.isSupabaseConnected && (
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-medium text-amber-950">
                Action Required: Cloud Database Not Connected on Vercel
              </h3>
              <p className="text-xs text-amber-800 font-sans mt-0.5">
                Vercel runs on read-only serverless lambdas. Local files cannot persist new articles in production.
              </p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-amber-900 font-sans">
            To publish articles that persist across deployments and devices, connect your free Supabase PostgreSQL database by adding the environment variables below to your Vercel Project Settings.
          </p>
        </div>
      )}

      {/* Storage Engine Status Card */}
      <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                stats.isSupabaseConnected
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              <Database size={20} />
            </div>
            <div>
              <h2 className="font-heading text-xl font-medium text-[#171614]">
                Database Connection Status
              </h2>
              <p className="text-xs text-[#7C766D] font-sans mt-0.5">
                PostgreSQL persistence layer with Row-Level Security
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              stats.isSupabaseConnected
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {stats.isSupabaseConnected ? "Connected to Supabase" : "Local Engine Active"}
          </span>
        </div>

        <p className="text-sm text-[#5C574F] font-sans leading-relaxed">
          {stats.isSupabaseConnected
            ? "Your journal is connected directly to Supabase cloud PostgreSQL. All published articles are protected by database-level Row Level Security policies, ensuring only public records are readable by unauthenticated visitors."
            : "The journal is currently operating using the local data repository. In local development on your computer, this saves to data/articles.json. On Vercel, however, serverless functions are read-only and ephemeral, so connecting Supabase is required for articles to persist."}
        </p>

        {stats.isSupabaseConnected && (
          <div className="pt-4 border-t border-[#F0ECE4]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5C574F] mb-2">
              Sync Local Articles to Cloud
            </h4>
            <p className="text-xs text-[#7C766D] mb-3">
              Migrate all articles from local storage into your Supabase database in one click.
            </p>
            <SyncButton />
          </div>
        )}
      </div>

      {/* Step-by-Step Supabase Setup Guide */}
      <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF3E8] text-[#8F5D24] flex items-center justify-center">
            <Key size={20} />
          </div>
          <div>
            <h2 className="font-heading text-xl font-medium text-[#171614]">
              Supabase Configuration Guide (100% Free)
            </h2>
            <p className="text-xs text-[#7C766D] font-sans mt-0.5">
              5 minutes setup — Free tier with zero subscription
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-[#5C574F] font-sans">
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD]">
            <h3 className="font-semibold text-[#171614] mb-1">
              Step 1: Create a free project at Supabase
            </h3>
            <p className="text-xs leading-relaxed text-[#6E6960]">
              Go to{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#8F5D24] underline underline-offset-2"
              >
                supabase.com
              </a>
              , click &ldquo;Start your project&rdquo;, choose the free tier, and name your project (e.g., <code>hammads-journal</code>).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD]">
            <h3 className="font-semibold text-[#171614] mb-1">
              Step 2: Run the Schema in the SQL Editor
            </h3>
            <p className="text-xs leading-relaxed text-[#6E6960]">
              In your Supabase Dashboard, open <strong>SQL Editor</strong> → click <strong>New Query</strong> → copy &amp; paste the contents of <code>schema.sql</code> (provided in the root of this project) and click <strong>Run</strong>. This creates the articles table, indexes, and Row Level Security rules.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD]">
            <h3 className="font-semibold text-[#171614] mb-1">
              Step 3: Copy your API credentials
            </h3>
            <p className="text-xs leading-relaxed text-[#6E6960]">
              In Supabase Dashboard, go to <strong>Project Settings → API</strong>:
            </p>
            <ul className="list-disc list-inside text-xs text-[#6E6960] mt-1 space-y-0.5">
              <li><strong>Project URL</strong></li>
              <li><strong>anon / public key</strong></li>
              <li><strong>service_role secret key</strong> (under Project API keys, click reveal)</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD]">
            <h3 className="font-semibold text-[#171614] mb-1">
              Step 4: Add Variables in Vercel Dashboard
            </h3>
            <p className="text-xs leading-relaxed text-[#6E6960] mb-3">
              In your Vercel Dashboard, open your project (<code>My-Articles</code>) → <strong>Settings</strong> → <strong>Environment Variables</strong> → add:
            </p>
            <pre className="p-3 rounded-lg bg-[#1F1E1B] text-[#FAF8F5] font-mono text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ADMIN_EMAIL=hammad@journal.com
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_SITE_URL=https://my-articles29-chi.vercel.app`}
            </pre>
          </div>
        </div>
      </div>

      {/* Security & RLS Overview */}
      <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="font-heading text-xl font-medium text-[#171614]">
              Security &amp; Persistence Architecture
            </h2>
            <p className="text-xs text-[#7C766D] font-sans mt-0.5">
              Strict isolation between public readers and admin studio
            </p>
          </div>
        </div>

        <ul className="space-y-2 text-xs text-[#5C574F] font-sans list-disc list-inside leading-relaxed">
          <li>
            <strong>Public Visitors:</strong> Read-only access strictly restricted to articles with <code>status = &apos;published&apos;</code>. Cannot read drafts, create, update, or delete.
          </li>
          <li>
            <strong>Instant Edge Revalidation:</strong> Whenever an article is published, edited, or unpublished, Next.js instantly purges the edge cache via <code>revalidatePath</code>.
          </li>
          <li>
            <strong>Draft Privacy:</strong> Drafts remain invisible to public readers and are never indexed by search engines.
          </li>
          <li>
            <strong>Server-Side Protection:</strong> All mutations and administrative routes require verified server-side session authentication.
          </li>
          <li>
            <strong>Zero Secrets in Frontend:</strong> Database service-role keys and master credentials are never bundled into client code.
          </li>
        </ul>
      </div>
    </div>
  );
}
