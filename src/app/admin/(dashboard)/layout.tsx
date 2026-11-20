import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthorized = await verifyAdminSession();

  if (!isAuthorized) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#FAF8F5]">
      {/* Sidebar Navigation */}
      <AdminNav />

      {/* Main Administrative Studio */}
      <div className="flex-1 overflow-y-auto">
        <main className="max-w-6xl mx-auto p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
