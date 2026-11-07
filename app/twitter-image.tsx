import { renderCard } from "@/lib/cards";
export const alt = "PurrCast — turn any article into audio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() { return renderCard("og"); }
