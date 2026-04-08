"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, DoorOpen, BarChart3, Bug, Eye, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/rooms", label: "Rooms", icon: DoorOpen },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/pageviews", label: "Page Views", icon: Eye },
  { href: "/admin/crashes", label: "Crashes", icon: Bug },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <aside className="flex w-56 flex-col bg-surface-low">
      <div className="p-5">
        <Link href="/admin" className="text-lg font-display font-bold amber-gradient-text">
          YallaSawa
        </Link>
        <p className="text-xs text-outline mt-0.5">Admin</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-cta-amber-deep/10 text-cta-amber-light"
                  : "text-outline hover:bg-surface-container hover:text-text-primary"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-outline transition-colors hover:bg-surface-container hover:text-red-400"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
