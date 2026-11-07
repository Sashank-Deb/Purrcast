import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { url } = await req.json().catch(() => ({}));
  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "Enter a valid http(s) URL." }, { status: 400 });
  }
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; ListenBot/1.0)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const article = new Readability(dom.window.document).parse();
    if (!article?.textContent?.trim()) throw new Error("Couldn't find readable text on that page.");
    const text = article.textContent.replace(/\[\d+\]/g, "").replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
    return NextResponse.json({ title: article.title || url, byline: article.byline, text });
  } catch (e) {
    const err = e as Error;
    const slow = err.name === "TimeoutError" || err.name === "AbortError";
    return NextResponse.json(
      { error: slow ? "That site took too long to respond. Check the link, try again in a bit, or paste the text instead." : err.message },
      { status: 422 }
    );
  }
}
