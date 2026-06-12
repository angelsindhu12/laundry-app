"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MessageSquareWarning,
  FilePlus,
  User,
  LogOut,
  Shirt,
  ClipboardList,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

const studentLinks = [
  { href: "/student", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/student/track", icon: Package, label: "Track Bag" },
  { href: "/student/complaints", icon: MessageSquareWarning, label: "Complaints" },
  { href: "/student/reapply", icon: FilePlus, label: "Lost Slip / Bag" },
  { href: "/student/profile", icon: User, label: "Profile" },
];

const teamLinks = [
  { href: "/team", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/team/bags", icon: Shirt, label: "Manage Bags" },
  { href: "/team/complaints", icon: MessageSquareWarning, label: "Complaints" },
  { href: "/team/reapply", icon: ClipboardList, label: "Reapply Requests" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const links = user?.role === "team" ? teamLinks : studentLinks;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-40 hidden lg:flex">
      <div className="p-5 border-b border-slate-100">
        <Logo />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/student" && href !== "/team" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-bu-blue text-white shadow-md shadow-bu-blue/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-bu-blue"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="px-4 py-3 mb-2">
          <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role === "team" ? "Laundry Team" : "Student"}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-bu-red hover:bg-red-50 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
