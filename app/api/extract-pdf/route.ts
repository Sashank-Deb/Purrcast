import { NextResponse } from "next/server";
import { extractText, getDocumentProxy, getMeta } from "unpdf";

export const runtime = "nodejs";

const MAX_BYTES = 25 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No PDF received." }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "That PDF is over 25 MB." }, { status: 413 });
    const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
    const { text: pages } = await extractText(pdf, { mergePages: false });
    const text = pages
      .map((p) => p.replace(/-\n(?=[a-z])/g, "").replace(/\s*\n\s*/g, " ").replace(/[ \t]+/g, " ").trim())
      .filter(Boolean)
      .join("\n");
    if (!text) return NextResponse.json({ error: "No readable text in this PDF. It may be a scanned image." }, { status: 422 });
    let title = "";
    try { title = String(((await getMeta(pdf)).info as Record<string, unknown>)?.Title ?? "").trim(); } catch {}
    return NextResponse.json({ title: title || file.name.replace(/\.pdf$/i, ""), text });
  } catch (e) {
    return NextResponse.json({ error: "Couldn't read that PDF: " + (e as Error).message }, { status: 422 });
  }
}
