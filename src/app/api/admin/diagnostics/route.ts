import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  // Parse hostname only for safe reporting
  let host = "";
  try {
    if (url) {
      host = new URL(url).hostname;
    }
  } catch {
    host = "invalid-url";
  }

  const checkKeyFormat = (k: string) => {
    if (!k) return { configured: false };
    const parts = k.split("_");
    return {
      configured: true,
      length: k.length,
      isJWT: k.startsWith("eyJ"),
      dotCount: (k.match(/\./g) || []).length,
      hasBearer: k.toLowerCase().startsWith("bearer "),
      keyPrefix: parts.length > 1 ? `${parts[0]}_${parts[1] || ""}` : "raw",
    };
  };

  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: {
      configured: Boolean(url && !url.includes("your-project-id")),
      host,
    },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: checkKeyFormat(anonKey),
    SUPABASE_SERVICE_ROLE_KEY: {
      ...checkKeyFormat(serviceKey),
      sameAsAnonKey: serviceKey === anonKey,
    },
    ADMIN_EMAIL: {
      configured: Boolean(process.env.ADMIN_EMAIL),
    },
    ADMIN_PASSWORD: {
      configured: Boolean(process.env.ADMIN_PASSWORD),
    },
    NEXT_PUBLIC_SITE_URL: {
      configured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    },
    isServerless: Boolean(
      process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
    ),
  };

  // Test Supabase connectivity with Service Role Key
  let serviceRoleTest: { success: boolean; count?: number | null; error?: string } = {
    success: false,
  };

  if (url && serviceKey) {
    try {
      const client = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const res = await client
        .from("articles")
        .select("*", { count: "exact" })
        .limit(1);

      serviceRoleTest = {
        success: !res.error,
        count: res.count,
        error: res.error
          ? `[${res.status} ${res.statusText}] ${res.error.message || ""} (code: ${res.error.code}, details: ${res.error.details})`
          : undefined,
      };
    } catch (err: unknown) {
      serviceRoleTest = {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  } else {
    serviceRoleTest = { success: false, error: "Missing URL or SUPABASE_SERVICE_ROLE_KEY" };
  }

  // Test Supabase connectivity with Anon Key
  let anonRoleTest: { success: boolean; count?: number | null; error?: string } = {
    success: false,
  };

  if (url && anonKey) {
    try {
      const client = createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const res = await client
        .from("articles")
        .select("*", { count: "exact" })
        .eq("status", "published")
        .limit(1);

      anonRoleTest = {
        success: !res.error,
        count: res.count,
        error: res.error
          ? `[${res.status} ${res.statusText}] ${res.error.message || ""} (code: ${res.error.code}, details: ${res.error.details})`
          : undefined,
      };
    } catch (err: unknown) {
      anonRoleTest = {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  return NextResponse.json({
    status: "ok",
    env: envStatus,
    database: {
      serviceRoleClient: serviceRoleTest,
      anonRoleClient: anonRoleTest,
    },
  });
}
