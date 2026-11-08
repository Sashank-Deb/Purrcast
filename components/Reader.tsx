"use client";
import { useRef, useState } from "react";
import Player from "@/components/Player";
import Cat from "@/components/Cat";
import { Paw, PawField, Yarn } from "@/components/Bits";
import { Wordmark } from "@/components/Logo";
import { BRAND } from "@/lib/brand";
import { SITE } from "@/lib/site";

type Doc = { title: string; byline?: string | null; text: string; source?: string };
type Tab = "url" | "file" | "paste";
const EXAMPLE = "https://nadh.in/blog/code-is-cheap/";

export default function Reader({ children }: { children?: React.ReactNode }) {
  const [tab, setTab] = useState<Tab>("url");
  const [url, setUrl] = useState("");
  const [paste, setPaste] = useState("");
  const [doc, setDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function fromUrl(e?: React.FormEvent, override?: string) {
    e?.preventDefault();
    const target = override ?? url;
    setLoading(true); setError("");
    try {
      const r = await fetch("/api/extract", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: target }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setDoc({ ...j, source: new URL(target).hostname.replace(/^www\./, "") });
    } catch (err) { setError((err as Error).message); }
    setLoading(false);
  }

  async function fromFile(f: File) {
    setError("");
    if (/\.pdf$/i.test(f.name) || f.type === "application/pdf") {
      setLoading(true);
      try {
        const fd = new FormData(); fd.append("file", f);
        const r = await fetch("/api/extract-pdf", { method: "POST", body: fd });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error);
        setDoc({ title: j.title, text: j.text, source: f.name });
      } catch (err) { setError((err as Error).message); }
      setLoading(false);
      return;
    }
    if (!/\.(txt|md|markdown|html?)$/i.test(f.name)) return setError("Supported files: .pdf, .txt, .md, .html");
    let text = await f.text();
    if (/\.html?$/i.test(f.name)) text = new DOMParser().parseFromString(text, "text/html").body.innerText;
    setDoc({ title: f.name.replace(/\.[^.]+$/, ""), text: text.replace(/[#*_`>]/g, ""), source: f.name });
  }

  if (doc)
    return (
      <>
        <PawField />
        <main className="relative mx-auto max-w-2xl px-5 py-8">
          <div className="mb-10 flex items-center justify-between">
            <a href="/" aria-label="Home"><Wordmark size={28} /></a>
            <button onClick={() => setDoc(null)} className="rounded-full border border-peach-200 bg-white px-4 py-1.5 text-sm font-semibold text-brand-dark transition hover:bg-peach-50">+ New article</button>
          </div>
          <Player key={doc.title + doc.text.length} {...doc} />
        </main>
      </>
    );

  const tabs: [Tab, string][] = [["url", "🔗 Link"], ["file", "📄 Document"], ["paste", "✍️ Paste"]];
  const btn = "inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3 font-display font-bold text-white shadow-md shadow-peach-500/30 transition hover:-translate-y-0.5 hover:bg-brand-dark active:translate-y-0 disabled:opacity-50";
  return (
    <div id="top" className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-48 left-1/2 h-[30rem] w-[64rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-peach-200/70 via-amber-200/50 to-rose-200/60 blur-3xl" />
      <PawField />
      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-5 pt-6">
        <a href="/" aria-label={`${BRAND.name} home`}><Wordmark size={30} /></a>
        <nav aria-label="Main" className="hidden items-center gap-6 text-sm font-semibold text-stone-600 md:flex">
          {SITE.nav.map((n) => <a key={n.href} href={n.href} className="transition hover:text-brand-dark">{n.label}</a>)}
        </nav>
      </header>

      <main className="relative mx-auto max-w-xl px-5 pb-20 pt-10">
        <div className="animate-pop text-center">
          <div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full border border-peach-200 bg-white/70 px-3 py-1 text-xs font-bold text-brand-dark backdrop-blur">
            <Paw size={12} /> Natural neural voices
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Read with your <span className="relative whitespace-nowrap text-brand">ears<svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 8" preserveAspectRatio="none"><path d="M1 5Q12 0 25 4T50 4 75 4 99 3" fill="none" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" /></svg></span>.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-stone-600">{BRAND.blurb}</p>
        </div>

        <div className="relative mt-48 animate-pop [animation-delay:.12s]">
          <Cat className="absolute -top-[10rem] left-1/2 w-64 -translate-x-1/2 drop-shadow-sm" mood={loading ? "curious" : error ? "surprised" : "happy"} interactive />
          <div className="relative rounded-3xl border border-peach-100 bg-white p-2 shadow-xl shadow-peach-900/10">
            <div className="grid grid-cols-3 gap-1 rounded-2xl bg-peach-50 p-1">
              {tabs.map(([k, label]) => (
                <button key={k} onClick={() => { setTab(k); setError(""); }} className={`rounded-xl py-2 text-sm font-semibold transition ${tab === k ? "bg-white text-ink shadow-sm" : "text-stone-500 hover:text-ink"}`}>{label}</button>
              ))}
            </div>
            <div className="p-3">
              {tab === "url" && (
                <form onSubmit={fromUrl} className="flex flex-col gap-3 sm:flex-row">
                  <input required type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Drop a link — Substack, blog, news…" className="min-w-0 flex-1 rounded-2xl border border-peach-100 bg-cream px-4 py-3 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-peach-100" />
                  <button disabled={loading} className={btn}>{loading ? <><Yarn size={18} /> Fetching…</> : <><Paw size={16} /> Listen</>}</button>
                </form>
              )}
              {tab === "file" && (
                <div
                  onClick={() => fileInput.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => { e.preventDefault(); setDrag(false); e.dataTransfer.files[0] && fromFile(e.dataTransfer.files[0]); }}
                  className={`grid h-40 cursor-pointer place-items-center rounded-2xl border-2 border-dashed text-center transition ${drag ? "border-brand bg-peach-50" : "border-peach-200 hover:border-brand hover:bg-peach-50/50"}`}
                >
                  <div><Paw size={28} className="mx-auto mb-2 text-brand-light" /><p className="font-semibold">Drop a file or click to browse</p><p className="mt-1 text-sm text-stone-400">.pdf · .txt · .md · .html</p></div>
                  <input ref={fileInput} type="file" accept=".pdf,application/pdf,.txt,.md,.markdown,.html,.htm" className="hidden" onChange={(e) => e.target.files?.[0] && fromFile(e.target.files[0])} />
                </div>
              )}
              {tab === "paste" && (
                <div className="space-y-3">
                  <textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={7} placeholder="Paste text here…" className="w-full resize-none rounded-2xl border border-peach-100 bg-cream p-4 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-peach-100" />
                  <button disabled={!paste.trim()} onClick={() => setDoc({ title: "Pasted text", text: paste })} className={btn}><Paw size={16} /> Listen</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">⚠️ {error}</p>}
        {tab === "url" && (
          <p className="mt-6 text-center text-sm text-stone-500">
            New here? Try{" "}
            <button onClick={() => { setUrl(EXAMPLE); fromUrl(undefined, EXAMPLE); }} className="font-semibold text-brand-dark underline decoration-peach-200 decoration-2 underline-offset-4 hover:decoration-brand">an example article</button>
          </p>
        )}
      </main>
      {children}
    </div>
  );
}
