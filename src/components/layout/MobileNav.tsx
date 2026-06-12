"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, MessageSquareWarning, FilePlus, User, Shirt } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const studentLinks = [
  { href: "/student", icon: LayoutDashboard, label: "Home" },
  { href: "/student/track", icon: Package, label: "Track" },
  { href: "/student/complaints", icon: MessageSquareWarning, label: "Issues" },
  { href: "/student/reapply", icon: FilePlus, label: "Reapply" },
  { href: "/student/profile", icon: User, label: "Profile" },
];

const teamLinks = [
  { href: "/team", icon: LayoutDashboard, label: "Home" },
  { href: "/team/bags", icon: Shirt, label: "Bags" },
  { href: "/team/complaints", icon: MessageSquareWarning, label: "Issues" },
  { href: "/team/reapply", icon: FilePlus, label: "Reapply" },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const links = user?.role === "team" ? teamLinks : studentLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 lg:hidden">
      <div className="flex justify-around items-center py-2">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/student" && href !== "/team" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs font-medium transition ${
                active ? "text-bu-blue" : "text-slate-500"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "text-bu-blue" : ""}`} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
