"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/types";
import { getCurrentUser, login as storeLogin, logout as storeLogout } from "@/lib/store";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => setUser(getCurrentUser());

  useEffect(() => {
    refresh();
    setLoading(false);
    const onSession = () => refresh();
    const onData = () => refresh();
    window.addEventListener("laundry-session-change", onSession);
    window.addEventListener("laundry-data-change", onData);
    return () => {
      window.removeEventListener("laundry-session-change", onSession);
      window.removeEventListener("laundry-data-change", onData);
    };
  }, []);

  const login = (email: string, password: string) => {
    const u = storeLogin(email, password);
    setUser(u);
    return u;
  };

  const logout = () => {
    storeLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
