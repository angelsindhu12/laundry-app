"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/lib/types";
import { AppShell } from "./layout/AppShell";

export function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: UserRole;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/");
    if (!loading && user && role && user.role !== role) {
      router.replace(user.role === "team" ? "/team" : "/student");
    }
  }, [user, loading, role, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-bu-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (role && user.role !== role)) return null;

  return <AppShell>{children}</AppShell>;
}
