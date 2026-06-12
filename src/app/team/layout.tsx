import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute role="team">{children}</ProtectedRoute>;
}
