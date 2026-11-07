import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { THEME } from "@/lib/theme";

const G = THEME.primary, INK = "#171717";

/** Static cat used in generated images (same approved SVG as the live hero). */
export function CatArt({ width, src }: { width: number; src: string }) {
  return (
    <img src={src} width={width} height={(width * 2) / 3} />
  );
}

export function LogoTile({ size, src = "/mascots/happy.svg", rounded = true }: { size: number; src?: string; rounded?: boolean }) {
  return (
    <div style={{ width: size, height: size, borderRadius: rounded ? 16 : 0, background: G, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <img src={src} width={size} height={size} style={{ objectFit: "contain" }} />
    </div>
  );
}

export const CARDS = {
  og: { w: 1200, h: 630, label: "Open Graph / link preview", file: "og.png" },
  "x-banner": { w: 1500, h: 500, label: "X / Twitter header", file: "x-banner.png" },
  square: { w: 1080, h: 1080, label: "Square post", file: "square.png" },
  story: { w: 1080, h: 1920, label: "Story / vertical", file: "story.png" },
} as const;
export type CardKind = keyof typeof CARDS;

export async function mascotData() {
  const png = await readFile(join(process.cwd(), "public/mascots/mascot.png"));
  return `data:image/png;base64,${png.toString("base64")}`;
}

async function fonts() {
  const [b8, b7] = await Promise.all([
    readFile(join(process.cwd(), "lib/fonts/Nunito-800.woff")),
    readFile(join(process.cwd(), "lib/fonts/Nunito-700.woff")),
  ]);
  return [
    { name: "Nunito", data: b8.buffer.slice(b8.byteOffset, b8.byteOffset + b8.byteLength) as ArrayBuffer, weight: 800 as const, style: "normal" as const },
    { name: "Nunito", data: b7.buffer.slice(b7.byteOffset, b7.byteOffset + b7.byteLength) as ArrayBuffer, weight: 700 as const, style: "normal" as const },
  ];
}

export async function renderCard(kind: CardKind) {
  const { w, h } = CARDS[kind];
  const mascotSrc = await mascotData();
  const tall = h > w, wide = w / h > 2;
  const unit = tall ? 1.3 : wide ? 0.82 : w === h ? 1.15 : 1;
  const catW = tall ? 1040 : wide ? 560 : w === h ? 760 : 560;
  const headline = tall ? 118 : w === h ? 104 : wide ? 72 : 78;

  const text = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: tall || w === h ? "center" : "flex-start", textAlign: tall || w === h ? "center" : "left", maxWidth: tall || w === h ? w - 140 : wide ? 800 : 640 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 * unit }}>
        <LogoTile size={64 * unit} src={mascotSrc} />
        <div style={{ display: "flex", fontSize: 46 * unit, fontWeight: 800, color: INK, letterSpacing: -1 }}>
          Purr<span style={{ color: G }}>Cast</span>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: tall || w === h ? "center" : "flex-start", fontSize: headline, fontWeight: 800, color: INK, lineHeight: 1.04, letterSpacing: -2, marginTop: 28 * unit }}>
        Read with your&nbsp;<span style={{ color: G }}>ears.</span>
      </div>
      <div style={{ display: "flex", fontSize: 30 * unit, fontWeight: 700, color: "#7A6252", marginTop: 20 * unit, lineHeight: 1.35 }}>
        {wide ? "Turn any article into audio with natural neural voices." : "Turn any article or document into audio, narrated by natural neural voices."}
      </div>
      <div style={{ display: "flex", marginTop: 28 * unit, padding: "10px 22px", borderRadius: 999, background: "#fff", border: "2px solid #FED7AA", color: "#9A3412", fontSize: 24 * unit, fontWeight: 700 }}>
        Free · No sign-up · Chrome extension
      </div>
    </div>
  );

  return new ImageResponse(
    (
      <div style={{ fontFamily: "Nunito", width: "100%", height: "100%", display: "flex", flexDirection: tall || w === h ? "column" : "row", alignItems: "center", justifyContent: tall || w === h ? "space-between" : "space-between", padding: tall ? "120px 40px 0" : w === h ? "90px 40px 0" : "0 0 0 72px", background: "linear-gradient(135deg,#FFE3CC 0%,#FFF7ED 55%,#FFEFD0 100%)" }}>
        {text}
        <div style={{ display: "flex", alignSelf: tall || w === h ? "center" : "flex-end", marginBottom: tall || w === h ? -6 : -24, marginRight: tall || w === h ? 0 : 30 }}>
          <CatArt width={catW} src={mascotSrc} />
        </div>
      </div>
    ),
    { width: w, height: h, fonts: await fonts() }
  );
}
