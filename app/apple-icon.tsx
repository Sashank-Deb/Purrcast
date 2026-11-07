import { ImageResponse } from "next/og";
import { LogoTile, mascotData } from "@/lib/cards";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default async function AppleIcon() {
  const src = await mascotData();
  return new ImageResponse(<div style={{ display: "flex" }}><LogoTile size={180} src={src} rounded={false} /></div>, size);
}
