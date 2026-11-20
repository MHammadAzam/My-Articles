"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  FileEdit,
  Globe,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "All Articles", href: "/admin/articles", icon: FileText },
    { label: "Write Article", href: "/admin/write", icon: PenSquare },
    { label: "Drafts", href: "/admin/articles?filter=draft", icon: FileEdit },
    { label: "Published", href: "/admin/articles?filter=published", icon: Globe },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#F5F2EC] border-r border-[#E5E0D8] min-h-screen flex flex-col justify-between p-4 shrink-0">
      <div>
        {/* Brand */}
        <div className="px-3 py-4 border-b border-[#E5E0D8] mb-6">
          <span className="font-heading text-xl font-medium text-[#171614] block">
            Hammad&apos;s Journal
          </span>
          <span className="text-[0.68rem] uppercase tracking-widest text-[#8F5D24] font-semibold">
            Admin Studio
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href.split("?")[0];

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white text-[#171614] shadow-xs font-semibold"
                    : "text-[#5C574F] hover:bg-[#EBE6DD] hover:text-[#171614]"
                }`}
              >
                <Icon size={17} className={isActive ? "text-[#8F5D24]" : "text-[#7C766D]"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-[#E5E0D8] space-y-1.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#6E6960] hover:text-[#171614] hover:bg-[#EBE6DD] transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink size={13} />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors text-left"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
