import { getAdminStats } from "@/lib/storage/articles";
import { Database, ShieldCheck, Key, Globe, Terminal } from "lucide-react";

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
            : "The journal is currently operating using the local persistent data repository (data/articles.json). You can create, save drafts, edit, and publish articles seamlessly in this mode. When you are ready to connect to Supabase for production, follow the step-by-step instructions below."}
        </p>
      </div>

      {/* Step-by-Step Supabase Setup Guide */}
      <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF3E8] text-[#8F5D24] flex items-center justify-center">
            <Key size={20} />
          </div>
          <div>
            <h2 className="font-heading text-xl font-medium text-[#171614]">
              Supabase Configuration Guide
            </h2>
            <p className="text-xs text-[#7C766D] font-sans mt-0.5">
              100% Free Tier — Zero paid dependencies
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
              In Supabase Dashboard, go to <strong>Project Settings → API</strong>. Copy the <strong>Project URL</strong> and <strong>anon / public key</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD]">
            <h3 className="font-semibold text-[#171614] mb-1">
              Step 4: Configure Environment Variables
            </h3>
            <p className="text-xs leading-relaxed text-[#6E6960] mb-3">
              Add the following to your <code>.env.local</code> file (or Vercel Environment Variables in production):
            </p>
            <pre className="p-3 rounded-lg bg-[#1F1E1B] text-[#FAF8F5] font-mono text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
ADMIN_EMAIL=hammad@journal.com
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app`}
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
              Security Architecture
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

      {/* Vercel Deployment Notice */}
      <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Globe size={20} />
          </div>
          <div>
            <h2 className="font-heading text-xl font-medium text-[#171614]">
              Vercel Free Tier Deployment
            </h2>
            <p className="text-xs text-[#7C766D] font-sans mt-0.5">
              Continuous deployment with HTTPS and custom domain support
            </p>
          </div>
        </div>

        <p className="text-xs text-[#5C574F] font-sans leading-relaxed">
          Push this repository to GitHub and import it into Vercel. In the Vercel project settings, add the environment variables listed above. Deployment is completely free and automatically provisions HTTPS and edge caching.
        </p>
      </div>
    </div>
  );
}
