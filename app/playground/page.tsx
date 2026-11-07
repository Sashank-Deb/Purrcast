import type { Metadata } from "next";
import Playground from "@/components/marketing/Playground";
import { Footer, SectionTitle } from "@/components/marketing/Sections";
import { PawField } from "@/components/Bits";
import { Wordmark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Text-to-speech playground — try neural voices free",
  description: "Type or paste any text and hear it read aloud in seven natural neural voices. Compare accents, tweak the speed and find your favourite narrator — free, no sign-up.",
  alternates: { canonical: "/playground" },
  openGraph: { url: "/playground", title: "PurrCast Playground — try neural text-to-speech voices", description: "Type anything, pick a voice, press play. Seven natural neural voices in US, UK and Australian accents." },
};

export default function PlaygroundPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <PawField />
      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-5 pt-6">
        <a href="/" aria-label="PurrCast home"><Wordmark size={30} /></a>
        <a href="/" className="text-sm font-semibold text-stone-600 hover:text-brand-dark">← Back home</a>
      </header>
      <main className="relative mx-auto max-w-3xl px-5 pb-24 pt-14">
        <SectionTitle eyebrow="Playground" title="Find your favourite voice" sub="Type anything, pick a narrator, press play. The cat is listening too." />
        <h1 className="sr-only">PurrCast text-to-speech playground</h1>
        <Playground />
      </main>
      <Footer />
    </div>
  );
}
