"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Shirt, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { DEMO_PASSWORD } from "@/lib/seed";

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"student" | "team">("student");

  useEffect(() => {
    if (user) router.replace(user.role === "team" ? "/team" : "/student");
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const u = login(email, password);
    if (!u) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }
    router.push(u.role === "team" ? "/team" : "/student");
  };

  const fillDemo = (type: "student" | "team") => {
    setRole(type);
    if (type === "student") {
      setEmail("student@bennett.edu.in");
    } else {
      setEmail("laundry@bennett.edu.in");
    }
    setPassword(DEMO_PASSWORD);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-bu-blue via-bu-blue to-bu-blue-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-bu-red rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Logo size="lg" />
          <h1 className="text-4xl font-bold mt-8 leading-tight">
            Bennett University<br />Laundry Tracker
          </h1>
          <p className="text-blue-100 mt-4 text-lg max-w-md">
            Track your laundry bag in real-time, file complaints with photos, and never miss your pickup slot again.
          </p>
          <div className="mt-10 space-y-4">
            {[
              "Real-time bag status tracking",
              "Photo-based complaint system",
              "Lost slip / bag reapplication",
              "Direct chat with laundry team",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-bu-red" />
                <span className="text-blue-50">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-slate-500 mt-1">Sign in to your BU Laundry account</p>

          <div className="flex gap-2 mt-6 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => fillDemo("student")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
                role === "student" ? "bg-white text-bu-blue shadow-sm" : "text-slate-500"
              }`}
            >
              <User className="w-4 h-4" /> Student
            </button>
            <button
              type="button"
              onClick={() => fillDemo("team")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${
                role === "team" ? "bg-white text-bu-blue shadow-sm" : "text-slate-500"
              }`}
            >
              <Shirt className="w-4 h-4" /> Laundry Team
            </button>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@bennett.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
            )}
            <Button type="submit" loading={loading} className="w-full">
              Sign In <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Demo Accounts</p>
            <div className="space-y-2 text-sm">
              <button
                type="button"
                onClick={() => fillDemo("student")}
                className="w-full text-left flex items-center gap-2 text-slate-600 hover:text-bu-blue transition"
              >
                <Mail className="w-4 h-4" />
                student@bennett.edu.in
              </button>
              <button
                type="button"
                onClick={() => fillDemo("team")}
                className="w-full text-left flex items-center gap-2 text-slate-600 hover:text-bu-blue transition"
              >
                <Mail className="w-4 h-4" />
                laundry@bennett.edu.in
              </button>
              <p className="flex items-center gap-2 text-slate-500">
                <Lock className="w-4 h-4" /> Password: {DEMO_PASSWORD}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
