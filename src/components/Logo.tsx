export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: 36, md: 48, lg: 64 };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <svg width={s} height={s} viewBox="0 0 64 64" fill="none" aria-label="Bennett University">
        <rect width="64" height="64" rx="12" fill="#054D9F" />
        <path d="M32 8L52 18V38C52 48 32 56 32 56C32 56 12 48 12 38V18L32 8Z" fill="white" />
        <path d="M32 14L46 22V36C46 43 32 50 32 50C32 50 18 43 18 36V22L32 14Z" fill="#054D9F" />
        <text x="32" y="38" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">
          BU
        </text>
        <rect x="8" y="52" width="48" height="4" rx="2" fill="#E31837" />
      </svg>
      <div className="hidden sm:block">
        <p className="text-sm font-bold text-bu-blue leading-tight">Bennett University</p>
        <p className="text-xs text-bu-red font-medium leading-tight">Laundry Tracker</p>
      </div>
    </div>
  );
}
