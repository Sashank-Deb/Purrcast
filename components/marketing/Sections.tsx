import { Paw } from "@/components/Bits";
import { FAQ, FEATURES } from "@/lib/site";
import { Wordmark } from "@/components/Logo";
import { BRAND } from "@/lib/brand";

export function SectionTitle({ eyebrow, title, sub, id }: { eyebrow: string; title: string; sub?: string; id?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-dark"><Paw size={12} />{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-lg text-stone-600">{sub}</p>}
    </div>
  );
}

const STEPS = [
  { n: "1", title: "Drop it in", body: "Paste a link to any article or newsletter, upload a document, or paste the text." },
  { n: "2", title: "Pick a voice", body: "Choose from seven natural neural voices and set the speed that suits you." },
  { n: "3", title: "Settle in & listen", body: "Press play. Follow along with the highlighted text, or just close your eyes." },
];

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-h" className="relative mx-auto max-w-5xl px-5 py-20">
      <SectionTitle id="how-h" eyebrow="How it works" title="From article to audio in three steps" />
      <ol className="mt-12 grid gap-5 md:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-3xl border border-peach-100 bg-white p-6 shadow-sm">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand font-display text-lg font-extrabold text-white">{s.n}</span>
            <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-stone-600">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Features() {
  return (
    <section id="features" aria-labelledby="feat-h" className="relative mx-auto max-w-5xl px-5 py-16">
      <SectionTitle id="feat-h" eyebrow="Features" title="Everything you need to read with your ears" sub="Small, friendly and fast — built for long reads and busy days." />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <article key={f.title} className="group rounded-3xl border border-peach-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-peach-900/5">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-peach-50 text-2xl transition group-hover:rotate-6">{f.icon}</div>
            <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
            <p className="mt-1.5 text-stone-600">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const USES = [
  ["🚶", "On the move", "Turn your reading list into a commute, a walk or a gym session."],
  ["👀", "Rest your eyes", "Long reads are easier on tired eyes when someone reads them to you."],
  ["🌍", "Language learners", "Hear natural pronunciation in US, UK and Australian accents while you read along."],
  ["♿", "Accessibility", "Listening can make dense text far more approachable for people who find reading hard."],
];
export function UseCases() {
  return (
    <section aria-labelledby="use-h" className="relative mx-auto max-w-5xl px-5 py-16">
      <SectionTitle id="use-h" eyebrow="Made for" title="Reading, but cozier" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {USES.map(([i, t, b]) => (
          <div key={t} className="rounded-3xl bg-gradient-to-br from-peach-50 to-white p-6 ring-1 ring-peach-100">
            <div className="text-3xl">{i}</div>
            <h3 className="mt-3 font-display font-bold">{t}</h3>
            <p className="mt-1 text-sm text-stone-600">{b}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ExtensionSection() {
  const bars = [0, 0.2, 0.4, 0.1];
  return (
    <section id="extension" aria-labelledby="ext-h" className="relative mx-auto max-w-5xl px-5 py-20">
      <div className="grid items-center gap-12 rounded-[2rem] bg-ink p-8 text-white sm:p-12 md:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-peach-300">Chrome extension</p>
          <h2 id="ext-h" className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Read any page, right where you are</h2>
          <p className="mt-4 text-peach-100/80">Click the cat on any article and PurrCast starts reading it aloud. Select a paragraph first to hear just that part.</p>
          <ol className="mt-6 space-y-2 text-sm text-peach-100/90">
            <li>1. Open <code className="rounded bg-white/10 px-1.5 py-0.5">chrome://extensions</code> and switch on Developer mode</li>
            <li>2. Choose <b>Load unpacked</b> and select the <code className="rounded bg-white/10 px-1.5 py-0.5">extension</code> folder</li>
            <li>3. Open an article and press <b>Listen</b></li>
          </ol>
        </div>
        <div className="mx-auto w-full max-w-[290px] rotate-2 rounded-2xl bg-cream p-4 text-ink shadow-2xl transition hover:rotate-0" aria-hidden>
          <div className="flex items-center gap-2.5"><Wordmark size={30} /></div>
          <p className="mt-2 truncate text-xs text-stone-500">Code is cheap. Show me the talk.</p>
          <div className="mt-3 rounded-xl bg-brand py-2.5 text-center text-sm font-bold text-white shadow">Listen</div>
          <div className="mt-3 h-1.5 rounded-full bg-peach-100"><div className="h-1.5 w-2/5 rounded-full bg-brand" /></div>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-lg bg-peach-100 px-3 py-1.5 text-brand-dark">⏮</span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white">❚❚</span>
            <span className="rounded-lg bg-peach-100 px-3 py-1.5 text-brand-dark">⏭</span>
            <span className="ml-auto inline-flex h-4 items-end gap-[3px]">{bars.map((d, i) => <i key={i} className="h-full w-[3px] origin-bottom animate-bars rounded-full bg-brand" style={{ animationDelay: `${d}s` }} />)}</span>
          </div>
          <p className="mt-3 text-xs text-stone-500"><span className="text-brand">●</span> Neural voice</p>
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section id="faq" aria-labelledby="faq-h" className="relative mx-auto max-w-3xl px-5 py-20">
      <SectionTitle id="faq-h" eyebrow="FAQ" title="Questions, answered" />
      <div className="mt-10 divide-y divide-peach-100 rounded-3xl border border-peach-100 bg-white">
        {FAQ.map((f) => (
          <details key={f.q} className="group p-5 open:bg-peach-50/40">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold">
              <h3 className="text-lg">{f.q}</h3>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-peach-100 text-brand-dark transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-stone-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section aria-label="Get started" className="relative mx-auto max-w-5xl px-5 pb-20">
      <div className="rounded-[2rem] bg-gradient-to-br from-brand to-brand-dark p-10 text-center text-white sm:p-14">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Got a reading list? Let’s read it to you.</h2>
        <p className="mx-auto mt-3 max-w-lg text-peach-100">Free, no sign-up, and the cat is very patient.</p>
        <a href="#top" className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3 font-display font-bold text-brand-dark shadow-lg transition hover:-translate-y-0.5"><Paw size={16} /> Start listening</a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-peach-100 bg-white/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-stone-500 sm:flex-row">
        <Wordmark size={26} />
        <p>{BRAND.tagline}</p>
        <nav aria-label="Footer" className="flex gap-5 font-semibold">
          <a href="/playground" className="hover:text-brand-dark">Playground</a>
          <a href="/press" className="hover:text-brand-dark">Press kit</a>
          <a href="/#faq" className="hover:text-brand-dark">FAQ</a>
        </nav>
      </div>
    </footer>
  );
}
