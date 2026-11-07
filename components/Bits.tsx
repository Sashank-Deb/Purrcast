/** Small shared cat-themed pieces. */
export function Paw({ size = 24, className = "", style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={style} fill="currentColor" aria-hidden>
      <ellipse cx="16" cy="21" rx="7.5" ry="6.2" />
      <ellipse cx="6" cy="14" rx="2.8" ry="3.6" transform="rotate(-20 6 14)" />
      <ellipse cx="12" cy="8.5" rx="2.9" ry="3.8" transform="rotate(-6 12 8.5)" />
      <ellipse cx="20" cy="8.5" rx="2.9" ry="3.8" transform="rotate(6 20 8.5)" />
      <ellipse cx="26" cy="14" rx="2.8" ry="3.6" transform="rotate(20 26 14)" />
    </svg>
  );
}

const PAWS = [
  { l: "6%", t: "14%", s: 34, r: -20, d: "0s" }, { l: "88%", t: "10%", s: 28, r: 18, d: "1.2s" },
  { l: "14%", t: "62%", s: 26, r: 25, d: "2.4s" }, { l: "92%", t: "55%", s: 38, r: -12, d: "0.6s" },
  { l: "74%", t: "86%", s: 30, r: 10, d: "1.8s" }, { l: "30%", t: "90%", s: 24, r: -28, d: "3s" },
];
export function PawField() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" aria-hidden>
      {PAWS.map((p, i) => (
        <Paw key={i} size={p.s} className="absolute animate-floaty text-brand/[0.13]" style={{ left: p.l, top: p.t, ["--r" as string]: `${p.r}deg`, animationDelay: p.d } as React.CSSProperties} />
      ))}
    </div>
  );
}

export function Yarn({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="animate-spin" style={{ animationDuration: "1.4s" }} aria-hidden>
      <circle cx="16" cy="16" r="13" fill="#FDBA74" stroke="#fff" strokeWidth="2" />
      <path d="M5 12c8 4 14 0 22-3M4 18c9 5 15 1 24-3M8 25c7-2 12-2 18-8M12 5c-2 8 3 14 11 17" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Bars({ active }: { active: boolean }) {
  return (
    <span className="inline-flex h-4 items-end gap-[3px]" aria-hidden>
      {[0, 0.2, 0.4, 0.1].map((d, i) => (
        <span key={i} className={`w-[3px] origin-bottom rounded-full bg-brand ${active ? "animate-bars" : ""}`} style={{ height: "100%", transform: active ? undefined : "scaleY(.3)", animationDelay: `${d}s` }} />
      ))}
    </span>
  );
}
