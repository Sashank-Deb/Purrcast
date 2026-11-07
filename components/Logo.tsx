import { BRAND } from "@/lib/brand";

/** The PurrCast headphone-cat mascot mark. */
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <img src="/mascots/happy.svg" width={size} height={size} className={className} alt={`${BRAND.name} logo`} />
  );
}

/** Mark + two-tone name, e.g. Purr|Cast. */
export function Wordmark({ size = 32, name = BRAND.name }: { size?: number; name?: string }) {
  const i = name.search(/cast$/i);
  const [a, b] = i > 0 ? [name.slice(0, i), name.slice(i)] : [name, ""];
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="font-display font-extrabold tracking-tight text-ink" style={{ fontSize: size * 0.72 }}>
        {a}<span className="text-brand">{b}</span>
      </span>
    </span>
  );
}
