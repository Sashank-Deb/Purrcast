import type { Metadata } from "next";
import CopyButton from "@/components/marketing/CopyButton";
import MoodSticker from "@/components/marketing/MoodSticker";
import { Footer, SectionTitle } from "@/components/marketing/Sections";
import { PawField } from "@/components/Bits";
import { Wordmark } from "@/components/Logo";
import { CARDS } from "@/lib/cards";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Press kit — logos, the cat & social images",
  description: "Download the PurrCast logo, ready-made social images, brand colours and boilerplate copy.",
  alternates: { canonical: "/press" },
  openGraph: { url: "/press", title: "PurrCast press kit", description: "Logos, the cat, social images, colours and copy for PurrCast." },
};

const COLORS = [["Purr orange", "#EA580C"], ["Orange dark", "#C2410C"], ["Peach", "#FED7AA"], ["Cream", "#FFF7ED"], ["Ink", "#2B1D14"], ["Cat black", "#171717"], ["Nose pink", "#F5A6AD"]];
const COPY = [
  ["One-liner", "PurrCast turns any article into audio with natural neural voices."],
  ["Short (≈40 words)", "PurrCast is a free text-to-speech reader. Paste a link or document and a friendly cat reads it to you in a natural neural voice, with the text following along. Choose from seven voices, set your speed and listen anywhere."],
  ["Long (≈90 words)", "PurrCast is a free, cozy way to read with your ears. Drop in a link to any article, blog post or newsletter — or upload a document — and PurrCast reads it aloud in a natural-sounding neural voice while highlighting the text. Pick from seven voices in US, UK and Australian accents, speed things up to 2×, and use the Chrome extension to listen to whatever page you're on. No account, no sign-up, and a very patient cat."],
];
const MASCOTS = [
  ["Happy host", "happy"], ["Excited host", "excited"], ["Speaking host", "speaking"], ["Cool host", "cool"],
  ["Thinking host", "thinking"], ["Idea host", "idea"], ["Relaxed host", "relaxed"], ["Live on air", "on-air"],
  ["Sleepy host", "sleepy"], ["Surprised host", "surprised"], ["Love", "love"], ["Working host", "working"],
] as const;

export default function Press() {
  const dl = "inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 text-sm font-bold text-white transition hover:bg-brand-dark";
  return (
    <div className="relative min-h-screen overflow-hidden">
      <PawField />
      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-5 pt-6">
        <a href="/" aria-label="PurrCast home"><Wordmark size={30} /></a>
        <a href="/" className="text-sm font-semibold text-stone-600 hover:text-brand-dark">← Back home</a>
      </header>

      <main className="relative mx-auto max-w-5xl space-y-20 px-5 pb-24 pt-14">
        <div>
          <SectionTitle eyebrow="Press kit" title="Everything you need to share PurrCast" sub="Logos, the cat, social images, colours and copy — free to use when you write about or link to us." />
          <h1 className="sr-only">PurrCast press kit</h1>
        </div>

        <section aria-labelledby="copy-h">
          <h2 id="copy-h" className="font-display text-2xl font-extrabold">Boilerplate copy</h2>
          <div className="mt-5 space-y-3">
            {COPY.map(([t, c]) => (
              <div key={t} className="rounded-3xl border border-peach-100 bg-white p-5">
                <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold uppercase tracking-widest text-brand-dark">{t}</h3><CopyButton text={c} /></div>
                <p className="mt-2 text-stone-700">{c}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="logo-h">
          <h2 id="logo-h" className="font-display text-2xl font-extrabold">Mascot artwork</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-peach-100 bg-white p-6">
              <div className="grid h-36 place-items-center rounded-2xl bg-peach-50"><img src="/mascots/happy.svg" alt="PurrCast happy host" className="h-28 w-auto" /></div>
              <p className="mt-4 font-bold">Happy host · SVG</p>
              <a className={`${dl} mt-3`} href="/mascots/happy.svg" download>Download</a>
            </div>
            <div className="rounded-3xl border border-peach-100 bg-white p-6">
              <div className="grid h-36 place-items-center rounded-2xl bg-peach-50"><img src="/mascots/on-air.svg" alt="PurrCast live on air host" className="h-28 w-auto" /></div>
              <p className="mt-4 font-bold">Live on air · SVG</p>
              <a className={`${dl} mt-3`} href="/mascots/on-air.svg" download>Download</a>
            </div>
            <div className="rounded-3xl border border-peach-100 bg-white p-6">
              <div className="grid h-36 place-items-center rounded-2xl bg-peach-50"><img src="/mascots/working.svg" alt="PurrCast working host" className="h-28 w-auto" /></div>
              <p className="mt-4 font-bold">Working host · SVG</p>
              <a className={`${dl} mt-3`} href="/mascots/working.svg" download>Download</a>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-ink p-5 text-sm text-peach-100"><b className="text-white">Do</b> — give the logo clear space around it, keep it on light or dark-green backgrounds, and use the mark on its own at small sizes.</div>
            <div className="rounded-3xl bg-red-50 p-5 text-sm text-red-900"><b>Don’t</b> — stretch, recolour or rotate the logo, add effects, or remove the headphones.</div>
          </div>
        </section>

        <section aria-labelledby="social-h">
          <h2 id="social-h" className="font-display text-2xl font-extrabold">Social images</h2>
          <p className="mt-1 text-stone-600">Ready-made, generated at full resolution.</p>
          <div className="mt-5 grid items-start gap-5 md:grid-cols-2">
            {(Object.values(CARDS)).map((c) => (
              <figure key={c.file} className="self-start rounded-3xl border border-peach-100 bg-white p-4">
                <div className="grid place-items-center overflow-hidden rounded-2xl bg-peach-50 p-3">
                  <img src={`/press/assets/${c.file}`} alt={`${c.label} — PurrCast`} loading="lazy" className={c.h > c.w ? "max-h-72 w-auto" : "w-full"} />
                </div>
                <figcaption className="mt-3 flex items-center justify-between gap-3">
                  <span><b>{c.label}</b><span className="block text-xs text-stone-500">{c.w} × {c.h} px</span></span>
                  <a className={dl} href={`/press/assets/${c.file}`} download={`purrcast-${c.file}`}>Download</a>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section aria-labelledby="mood-h">
          <h2 id="mood-h" className="font-display text-2xl font-extrabold">Meet the cat</h2>
          <p className="mt-1 text-stone-600">The approved podcast-hosting cat scenes — free to download as SVG.</p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {MASCOTS.map(([label, file]) => <MoodSticker key={file} label={label} src={`/mascots/${file}.svg`} />)}
          </div>
        </section>

        <section aria-labelledby="color-h">
          <h2 id="color-h" className="font-display text-2xl font-extrabold">Colours</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {COLORS.map(([n, c]) => (
              <div key={c} className="overflow-hidden rounded-2xl border border-peach-100 bg-white">
                <div className="h-20" style={{ background: c }} />
                <div className="flex items-center justify-between gap-1 p-2.5"><span className="text-xs"><b className="block">{n}</b>{c}</span><CopyButton text={c} label="Copy" /></div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-stone-500">Type: Nunito (rounded) for headlines, Georgia for article text.</p>
        </section>

        <section aria-labelledby="fact-h" className="rounded-3xl border border-peach-100 bg-white p-6">
          <h2 id="fact-h" className="font-display text-2xl font-extrabold">Fact sheet</h2>
          <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            {[["Product", BRAND.name], ["What it does", "Turns articles and documents into audio"], ["Voices", "7 neural voices · US, UK, AU English"], ["Speed", "0.8× – 2×"], ["Platforms", "Web · Chrome extension"], ["Price", "Free · no sign-up"]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-peach-100 pb-2"><dt className="font-bold">{k}</dt><dd className="text-right text-stone-600">{v}</dd></div>
            ))}
          </dl>
        </section>
      </main>
      <Footer />
    </div>
  );
}
