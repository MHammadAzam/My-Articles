import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "./supabase/server";

const SESSION_COOKIE_NAME = "journal_admin_session";
const SESSION_SECRET_TOKEN = "hammad-journal-authorized-admin-session-v1";

export interface AdminUser {
  email: string;
  role: "admin";
}

export async function verifyAdminSession(): Promise<boolean> {
  // 1. Check Supabase Auth if configured
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!error && user) {
        return true;
      }
    }
  } catch (err) {
    console.warn("Supabase auth check skipped/errored:", err);
  }

  // 2. Check admin cookie session
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (sessionCookie && sessionCookie.value === SESSION_SECRET_TOKEN) {
      return true;
    }
  } catch (err) {
    console.warn("Cookie store read error:", err);
  }

  return false;
}

export async function setAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, SESSION_SECRET_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || "hammad@journal.com",
    password: process.env.ADMIN_PASSWORD || "HammadJournal2026!",
  };
}
