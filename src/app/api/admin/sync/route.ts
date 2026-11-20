import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";
import { syncLocalArticlesToSupabase } from "@/lib/storage/articles";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 401 }
      );
    }

    const result = await syncLocalArticlesToSupabase();

    if (result.success) {
      revalidatePath("/", "layout");
      revalidatePath("/articles", "page");
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("POST /api/admin/sync error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to sync articles.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
