import { NextRequest, NextResponse } from "next/server";
import { setAdminSessionCookie, getAdminCredentials } from "@/lib/auth";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Try Supabase Auth first if configured
    let supabaseAuthSuccess = false;
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!error && data.user) {
          supabaseAuthSuccess = true;
        }
      }
    } catch {
      // Supabase not configured or failed, check fallback
    }

    const adminCreds = getAdminCredentials();
    const isLocalAdmin =
      email.trim().toLowerCase() === adminCreds.email.toLowerCase() &&
      password === adminCreds.password;

    if (supabaseAuthSuccess || isLocalAdmin) {
      await setAdminSessionCookie();
      return NextResponse.json({ success: true, message: "Authenticated successfully." });
    }

    return NextResponse.json(
      { error: "Invalid email or password. Access denied." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
