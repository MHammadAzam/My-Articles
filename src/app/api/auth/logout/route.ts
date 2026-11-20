import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

export async function POST() {
  try {
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // Ignore
    }

    await clearAdminSessionCookie();
    return NextResponse.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Failed to log out." },
      { status: 500 }
    );
  }
}
