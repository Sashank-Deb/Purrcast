import Reader from "@/components/Reader";
import Playground from "@/components/marketing/Playground";
import { CTA, ExtensionSection, FAQSection, Features, Footer, HowItWorks, SectionTitle, UseCases } from "@/components/marketing/Sections";
import { FAQ } from "@/lib/site";

export default function Home() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <Reader>
      <HowItWorks />
      <section id="playground" aria-labelledby="pg-h" className="relative mx-auto max-w-3xl px-5 py-16">
        <SectionTitle id="pg-h" eyebrow="Playground" title="Try the voices right here" sub="No link needed — type anything and hear how PurrCast sounds." />
        <Playground />
      </section>
      <Features />
      <UseCases />
      <ExtensionSection />
      <FAQSection />
      <CTA />
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </Reader>
  );
}
