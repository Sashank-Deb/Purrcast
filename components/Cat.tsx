"use client";

import { useEffect, useState } from "react";
import type { CatMood } from "@/components/CatShapes";

const ART: Record<CatMood, string> = {
  happy: "happy", laugh: "excited", curious: "thinking", surprised: "surprised",
  sleepy: "sleepy", listening: "relaxed", cool: "cool", love: "love",
  sparkle: "idea", wink: "speaking", dizzy: "on-air",
};
const REACTIONS: CatMood[] = ["laugh", "curious", "sparkle", "listening", "cool", "love", "sleepy", "surprised", "wink", "dizzy"];

/** The production PurrCast mascot, drawn from the approved headphone-cat artwork. */
export default function Cat({ className = "", mood = "happy", interactive = false }: { className?: string; mood?: CatMood; interactive?: boolean }) {
  const [reaction, setReaction] = useState<CatMood | null>(null);
  const activeMood = mood === "happy" ? reaction ?? mood : mood;
  const art = ART[activeMood];

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const react = () => {
      setReaction(REACTIONS[Math.floor(Math.random() * REACTIONS.length)]);
      clearTimeout(timeout);
      timeout = setTimeout(() => setReaction(null), 1200);
    };
    window.addEventListener("pointerdown", react, { passive: true });
    window.addEventListener("keydown", react);
    window.addEventListener("input", react);
    window.addEventListener("change", react);
    window.addEventListener("submit", react);
    return () => {
      window.removeEventListener("pointerdown", react);
      window.removeEventListener("keydown", react);
      window.removeEventListener("input", react);
      window.removeEventListener("change", react);
      window.removeEventListener("submit", react);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <img
      key={art}
      src={`/mascots/${art}.svg`}
      alt=""
      className={`${className} block transition-opacity duration-200 ${interactive ? "cursor-pointer" : ""}`}
      aria-hidden
      data-mood={activeMood}
    />
  );
}
