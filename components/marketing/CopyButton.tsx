"use client";
import { useState } from "react";

export default function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); } catch {}
      }}
      className={`rounded-full border border-peach-200 bg-white px-3 py-1 text-xs font-bold text-brand-dark transition hover:bg-peach-50 ${className}`}
    >
      {done ? "Copied ✓" : label}
    </button>
  );
}
