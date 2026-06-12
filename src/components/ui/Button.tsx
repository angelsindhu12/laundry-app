import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";

const variants: Record<Variant, string> = {
  primary: "bg-bu-blue text-white hover:bg-bu-blue-dark shadow-sm",
  secondary: "bg-bu-red text-white hover:bg-bu-red-dark shadow-sm",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-slate-600 hover:bg-slate-100",
  outline: "border-2 border-bu-blue text-bu-blue hover:bg-bu-blue/5",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
