import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg viewBox="0 0 64 64" className={compact ? "h-9 w-9" : "h-14 w-14"} aria-hidden>
        <defs>
          <linearGradient id="odg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.88 0.13 88)" />
            <stop offset="100%" stopColor="oklch(0.66 0.15 60)" />
          </linearGradient>
          <linearGradient id="odb" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.14 215)" />
            <stop offset="100%" stopColor="oklch(0.42 0.12 240)" />
          </linearGradient>
        </defs>
        <path d="M32 3 58 13v20c0 15-11 25-26 28C17 58 6 48 6 33V13z" fill="url(#odb)" opacity="0.9" />
        <path d="M32 3 58 13v20c0 15-11 25-26 28C17 58 6 48 6 33V13z" fill="none" stroke="url(#odg)" strokeWidth="2.5" />
        <path d="M13 40c5 3 8-3 13 0s8-3 13 0 8-3 12 0" fill="none" stroke="oklch(0.95 0.02 220)" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
        <path d="M32 14v16M24 30h16l-8 8z" fill="url(#odg)" stroke="url(#odg)" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="32" cy="12" r="3" fill="url(#odg)" />
      </svg>
      <div className="leading-none">
        <p
          className={cn(
            "font-black uppercase tracking-[0.18em] text-gradient-gold",
            compact ? "text-base" : "text-2xl sm:text-4xl",
          )}
        >
          Ocean
        </p>
        <p
          className={cn(
            "font-black uppercase tracking-[0.32em] text-foreground/90",
            compact ? "text-[10px]" : "text-lg sm:text-2xl",
          )}
        >
          Dominion
        </p>
      </div>
    </div>
  );
}
