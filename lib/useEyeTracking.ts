"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Shared eye-tracking for mascot SVGs. Attach `ref` to the <svg>; `look.x/y` are pupil offsets
 * in SVG user units (about ±3), `look.tilt` is a head tilt in degrees (about ±4).
 * Pass a bigger `reach` for pixel-art styles where the pupil moves in whole "pixels".
 */
export function useEyeTracking<T extends Element = SVGSVGElement>(reach = 1) {
  const ref = useRef<T>(null);
  const [look, setLook] = useState({ x: 0, y: 0, tilt: 0 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width * 0.5), dy = e.clientY - (r.top + r.height * 0.45);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 200);
      setLook({
        x: (dx / d) * 3.2 * k * reach,
        y: (dy / d) * 2.6 * k * reach,
        tilt: Math.max(-1, Math.min(1, dx / 400)) * 4,
      });
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [reach]);

  return { ref, look };
}
