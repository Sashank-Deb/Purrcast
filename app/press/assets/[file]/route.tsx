import { ImageResponse } from "next/og";
import { CARDS, LogoTile, mascotData, renderCard, type CardKind } from "@/lib/cards";

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (file === "icon-512.png") {
    const src = await mascotData();
    return new ImageResponse(<div style={{ display: "flex" }}><LogoTile size={512} src={src} /></div>, { width: 512, height: 512 });
  }
  const kind = (Object.keys(CARDS) as CardKind[]).find((k) => CARDS[k].file === file);
  if (!kind) return new Response("Not found", { status: 404 });
  return renderCard(kind);
}
