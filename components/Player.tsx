"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toChunks } from "@/lib/chunk";
import { VOICES } from "@/lib/voices";
import { LogoMark } from "@/components/Logo";
import { Bars, Yarn } from "@/components/Bits";

const RATES = [0.8, 1, 1.15, 1.3, 1.5, 1.75, 2];

const load = (k: string, d: string) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } };
const save = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} };

export default function Player({ title, byline, text, source }: { title: string; byline?: string | null; text: string; source?: string }) {
  const chunks = useMemo(() => toChunks(text), [text]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rate, setRate] = useState(1);
  const [voice, setVoice] = useState(VOICES[0].id);
  const [menu, setMenu] = useState(false);

  const audio = useRef<HTMLAudioElement | null>(null);
  const cache = useRef(new Map<string, Promise<string>>());
  const gen = useRef(0);
  const idxRef = useRef(0);
  const activeRef = useRef<HTMLSpanElement>(null);
  const voiceRef = useRef(voice);
  const rateRef = useRef(rate);

  useEffect(() => {
    const v = load("listen:voice", VOICES[0].id), r = parseFloat(load("listen:rate", "1"));
    if (VOICES.some((x) => x.id === v)) { setVoice(v); voiceRef.current = v; }
    if (RATES.includes(r)) { setRate(r); rateRef.current = r; }
    const a = new Audio();
    a.preservesPitch = true;
    audio.current = a;
    return () => { a.pause(); a.src = ""; cache.current.forEach((p) => p.then(URL.revokeObjectURL).catch(() => {})); };
  }, []);

  const fetchChunk = useCallback((i: number) => {
    const key = `${voiceRef.current}:${i}`;
    let p = cache.current.get(key);
    if (!p) {
      p = fetch("/api/tts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: chunks[i].text, voice: voiceRef.current }),
      }).then(async (r) => {
        if (!r.ok) throw new Error("Voice service unavailable — try again in a moment.");
        return URL.createObjectURL(await r.blob());
      });
      p.catch(() => cache.current.delete(key));
      cache.current.set(key, p);
    }
    return p;
  }, [chunks]);

  const playFrom = useCallback(async (i: number) => {
    const a = audio.current;
    if (!a) return;
    const my = ++gen.current;
    a.pause();
    if (i >= chunks.length) { setPlaying(false); setIdx(0); idxRef.current = 0; return; }
    idxRef.current = i; setIdx(i); setPlaying(true); setLoading(true); setError("");
    try {
      const url = await fetchChunk(i);
      if (my !== gen.current) return;
      a.src = url;
      a.playbackRate = rateRef.current;
      a.onended = () => my === gen.current && playFrom(i + 1);
      await a.play();
      setLoading(false);
      fetchChunk(i + 1).catch(() => {}); // prefetch ahead
      if (i + 2 < chunks.length) fetchChunk(i + 2).catch(() => {});
    } catch (e) {
      if (my !== gen.current) return;
      setLoading(false); setPlaying(false);
      setError((e as Error).message || "Couldn't play audio.");
    }
  }, [chunks, fetchChunk]);

  const pause = () => { gen.current++; audio.current?.pause(); setPlaying(false); setLoading(false); };
  const toggle = useCallback(() => {
    const a = audio.current;
    if (playing) return pause();
    if (a && a.src && a.paused && a.currentTime > 0 && !a.ended) {
      const my = ++gen.current; const i = idxRef.current;
      a.onended = () => my === gen.current && playFrom(i + 1);
      a.play(); setPlaying(true);
    } else playFrom(idxRef.current);
  }, [playing, playFrom]);

  const changeRate = (r: number) => { setRate(r); rateRef.current = r; save("listen:rate", String(r)); if (audio.current) audio.current.playbackRate = r; };
  const changeVoice = (v: string) => {
    setVoice(v); voiceRef.current = v; save("listen:voice", v); setMenu(false);
    cache.current.forEach((p) => p.then(URL.revokeObjectURL).catch(() => {})); cache.current.clear();
    if (playing) playFrom(idxRef.current);
  };

  useEffect(() => { activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" }); }, [idx]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && !(e.target as HTMLElement).closest("select,input,textarea,button")) { e.preventDefault(); toggle(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const total = chunks.reduce((n, c) => n + c.text.length, 0);
  const done = chunks.slice(0, idx).reduce((n, c) => n + c.text.length, 0);
  const minsLeft = Math.max(1, Math.round((total - done) / 15 / 60 / rate)); // ~15 chars/sec
  const pct = total ? (done / total) * 100 : 0;
  const paras: number[][] = [];
  chunks.forEach((c, i) => (paras[c.para] ??= []).push(i));
  const voiceInfo = VOICES.find((v) => v.id === voice)!;

  return (
    <article className="pb-44">
      <header className="mb-10 border-b border-stone-200 pb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-dark">Now reading</p>
        <h1 className="font-serif text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-stone-500">
          {[byline, source, `${Math.max(1, Math.round(total / 15 / 60))} min listen`].filter(Boolean).join(" · ")}
        </p>
      </header>

      <div className="font-serif text-[1.2rem] leading-[1.85] text-ink">
        {paras.map((ids, p) => (
          <p key={p} className="mb-6">
            {ids.map((i) => (
              <span
                key={i}
                ref={i === idx ? activeRef : undefined}
                onClick={() => playFrom(i)}
                className={`cursor-pointer rounded-sm py-0.5 transition-colors duration-300 hover:bg-stone-200/60 ${
                  i === idx && (playing || loading) ? "bg-peach-100 shadow-[0_0_0_4px_theme(colors.orange.100)]" : i < idx ? "text-stone-400" : ""
                }`}
              >
                {chunks[i].text}{" "}
              </span>
            ))}
          </p>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-4 z-10 px-4">
        <div className="mx-auto max-w-2xl overflow-visible rounded-3xl border border-peach-100 bg-white/90 shadow-xl shadow-peach-900/10 backdrop-blur-xl">
          <div
            className="relative cursor-pointer pt-5"
            onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); const t = ((e.clientX - r.left) / r.width) * total; let acc = 0, i = 0; while (i < chunks.length - 1 && acc + chunks[i].text.length < t) acc += chunks[i++].text.length; playFrom(i); }}
          >
            <div className="absolute top-0 -translate-x-1/2 transition-[left] duration-500" style={{ left: `${Math.min(97, Math.max(3, pct))}%` }}>
              <div className={playing && !loading ? "animate-bob" : ""}><LogoMark size={26} /></div>
            </div>
            <div className="h-1.5 bg-peach-100"><div className="h-full rounded-r-full bg-gradient-to-r from-brand-light to-brand transition-all duration-500" style={{ width: `${pct}%` }} /></div>
          </div>
          <div className="flex items-center gap-2 px-4 py-3">
            <button onClick={() => playFrom(Math.max(0, idx - 1))} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900" aria-label="Previous">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zM9.5 12 18 6v12z" /></svg>
            </button>
            <button onClick={toggle} className="grid h-12 w-12 place-items-center rounded-full bg-brand text-white shadow-md shadow-peach-500/30 transition hover:scale-105 hover:bg-brand-dark" aria-label={playing ? "Pause" : "Play"}>
              {loading ? <Yarn size={24} />
                : playing ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>}
            </button>
            <button onClick={() => playFrom(idx + 1)} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900" aria-label="Next">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM6 18V6l8.5 6z" /></svg>
            </button>
            <div className="ml-2 hidden min-w-0 sm:block">
              <p className="text-xs font-medium text-stone-700">{error ? <span className="text-red-600">Oops! {error}</span> : <span className="inline-flex items-center gap-2"><Bars active={playing && !loading} />{playing ? "Playing…" : "Paused"} · {minsLeft} min left</span>}</p>
              <p className="text-xs text-stone-400">{Math.round(pct)}% · press Space to play/pause</p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => changeRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length])} className="w-14 rounded-full bg-stone-100 py-1.5 text-sm font-semibold tabular-nums hover:bg-stone-200" title="Playback speed">{rate}×</button>
              <div className="relative">
                <button onClick={() => setMenu((m) => !m)} className="flex items-center gap-2 rounded-full bg-stone-100 py-1.5 pl-2 pr-3 text-sm font-medium hover:bg-stone-200">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-brand to-amber-400 text-xs font-bold text-white">{voiceInfo.name[0]}</span>
                  {voiceInfo.name}
                </button>
                {menu && (
                  <ul className="absolute bottom-full right-0 mb-2 w-52 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-xl">
                    {VOICES.map((v) => (
                      <li key={v.id}>
                        <button onClick={() => changeVoice(v.id)} className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-stone-50 ${v.id === voice ? "font-semibold text-peach-600" : ""}`}>
                          {v.name}<span className="text-xs font-normal text-stone-400">{v.note}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
