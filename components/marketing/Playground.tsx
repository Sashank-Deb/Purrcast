"use client";
import { useEffect, useRef, useState } from "react";
import Cat from "@/components/Cat";
import { Bars, Paw, Yarn } from "@/components/Bits";
import { VOICES } from "@/lib/voices";

const SAMPLES = [
  { label: "📖 Story", text: "Once upon a time, in a forest full of tall pines, a small black-and-white cat found a pair of headphones hanging from a branch. He put them on, and for the very first time, the whole forest began to tell him stories." },
  { label: "📰 News", text: "Scientists say the humble honeybee may be far better at maths than anyone expected. In new experiments, bees learned to add and subtract small numbers, then used the rule to find the sweetest flowers." },
  { label: "🌿 Calm", text: "Take a slow breath in. Let your shoulders drop. Somewhere nearby, a kettle is warming, the rain is soft on the window, and there is nothing at all that you need to read right now. Just listen." },
  { label: "🇬🇧 Accent test", text: "The weather forecast said it would be rather lovely, but the clouds had other ideas. We had tea and biscuits anyway, and read the paper out loud to one another by the window." },
];
const MAX = 600;

export default function Playground() {
  const [text, setText] = useState(SAMPLES[0].text);
  const [voice, setVoice] = useState(VOICES[0].id);
  const [rate, setRate] = useState(1);
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const [error, setError] = useState("");
  const audio = useRef<HTMLAudioElement | null>(null);
  const urls = useRef(new Map<string, string>());
  const gen = useRef(0);

  useEffect(() => {
    const a = new Audio();
    a.preservesPitch = true;
    audio.current = a;
    const u = urls.current;
    return () => { a.pause(); u.forEach(URL.revokeObjectURL); };
  }, []);
  useEffect(() => { if (audio.current) audio.current.playbackRate = rate; }, [rate]);

  function stop() { gen.current++; audio.current?.pause(); setState("idle"); }

  async function play(v = voice, t = text) {
    const a = audio.current;
    if (!a || !t.trim()) return;
    const my = ++gen.current;
    a.pause(); setError(""); setState("loading");
    try {
      const key = `${v}|${t}`;
      let url = urls.current.get(key);
      if (!url) {
        const r = await fetch("/api/tts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: t.slice(0, MAX), voice: v }) });
        if (!r.ok) throw new Error("The voice service is taking a nap. Please try again in a moment.");
        url = URL.createObjectURL(await r.blob());
        urls.current.set(key, url);
      }
      if (my !== gen.current) return;
      a.src = url; a.playbackRate = rate;
      a.onended = () => my === gen.current && setState("idle");
      await a.play();
      if (my === gen.current) setState("playing");
    } catch (e) {
      if (my !== gen.current) return;
      setState("idle"); setError((e as Error).message);
    }
  }

  const busy = state !== "idle";
  return (
    <div className="relative mt-32">
      <Cat className="absolute -top-[6.4rem] left-1/2 w-44 -translate-x-1/2 drop-shadow-sm" mood={error ? "surprised" : state === "loading" ? "curious" : state === "playing" ? "listening" : "happy"} interactive />
      <div className="relative rounded-3xl border border-peach-100 bg-white p-4 shadow-xl shadow-peach-900/10 sm:p-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sample texts">
          {SAMPLES.map((s) => (
            <button key={s.label} onClick={() => { stop(); setText(s.text); }} className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${text === s.text ? "border-brand bg-peach-50 text-brand-dark" : "border-peach-100 text-stone-600 hover:border-brand"}`}>{s.label}</button>
          ))}
        </div>

        <label htmlFor="pg-text" className="sr-only">Text to read aloud</label>
        <textarea id="pg-text" value={text} maxLength={MAX} onChange={(e) => { setText(e.target.value); }} rows={5}
          className="mt-4 w-full resize-none rounded-2xl border border-peach-100 bg-cream p-4 font-serif text-lg leading-relaxed outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-peach-100" />
        <p className="mt-1 text-right text-xs text-stone-400">{text.length}/{MAX}</p>

        <p className="mt-3 text-xs font-bold uppercase tracking-widest text-stone-500">Voice</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {VOICES.map((v) => (
            <button key={v.id} onClick={() => { setVoice(v.id); if (busy) play(v.id); }}
              aria-pressed={voice === v.id}
              className={`flex items-center gap-2.5 rounded-2xl border p-2.5 text-left transition ${voice === v.id ? "border-brand bg-peach-50 ring-2 ring-peach-100" : "border-peach-100 hover:border-brand"}`}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-peach-400 font-display font-bold text-white">{v.name[0]}</span>
              <span className="min-w-0"><span className="block truncate text-sm font-bold">{v.name}</span><span className="block truncate text-xs text-stone-500">{v.note}</span></span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button onClick={() => (busy ? stop() : play())} disabled={!text.trim()}
            className="inline-flex min-w-36 items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3 font-display font-bold text-white shadow-md shadow-peach-500/30 transition hover:-translate-y-0.5 hover:bg-brand-dark disabled:opacity-50">
            {state === "loading" ? <><Yarn size={18} /> Warming up…</> : state === "playing" ? <>❚❚ Stop</> : <><Paw size={16} /> Hear it</>}
          </button>
          <Bars active={state === "playing"} />
          <label className="ml-auto flex items-center gap-3 text-sm font-semibold text-stone-600">
            Speed
            <input type="range" min={0.8} max={2} step={0.05} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-32 accent-[#EA580C]" aria-label="Playback speed" />
            <span className="w-10 tabular-nums text-ink">{rate.toFixed(2).replace(/0$/, "")}×</span>
          </label>
        </div>
        {error && <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">⚠️ {error}</p>}
      </div>
    </div>
  );
}
