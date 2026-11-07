export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001").replace(/\/$/, "");

export const SITE = {
  title: "PurrCast — Turn any article into audio (free text-to-speech reader)",
  description:
    "PurrCast turns any article, blog post, Substack newsletter or document into a natural-sounding audio read-along. Pick a neural voice, adjust the speed and listen anywhere — free, no sign-up.",
  keywords: [
    "text to speech", "article reader", "listen to articles", "read aloud", "Substack audio", "blog to audio",
    "neural text to speech", "audio articles", "webpage to audio", "text to speech chrome extension", "audiobook generator",
  ],
  nav: [
    { href: "/#how", label: "How it works" },
    { href: "/#playground", label: "Playground" },
    { href: "/#extension", label: "Chrome extension" },
    { href: "/#faq", label: "FAQ" },
  ],
};

export const FAQ = [
  { q: "What is PurrCast?", a: "PurrCast is a free text-to-speech reader. Paste a link, upload a document or drop in some text and it reads it to you with natural-sounding neural voices while the text follows along." },
  { q: "Does it work with Substack and other blogs?", a: "Yes. PurrCast pulls out just the article text from most blogs, newsletters and news sites, so you hear the story and not the menus, ads or footers." },
  { q: "Which voices can I choose from?", a: "Seven natural neural voices in US, UK and Australian English, including Ava, Andrew, Emma, Brian, Sonia, Ryan and Natasha. Try them all in the playground." },
  { q: "Can I change the reading speed?", a: "Yes, from a relaxed 0.8× up to 2×. Your speed and voice are remembered for next time." },
  { q: "Is there a Chrome extension?", a: "Yes. The PurrCast extension reads the page you are on, or just the text you have selected, with the same neural voices." },
  { q: "What kinds of documents can I listen to?", a: "Links, plain text, Markdown and HTML files, or anything you paste in. PDF support is on the wish list." },
  { q: "Is it free?", a: "PurrCast is free to use and needs no account." },
];

export const FEATURES = [
  { icon: "🎧", title: "Natural neural voices", body: "Warm, human-sounding narration in seven voices — not the robotic voice built into your browser." },
  { icon: "🔗", title: "Any link, any document", body: "Paste a URL, upload a .txt, .md or .html file, or drop in raw text. PurrCast strips the clutter." },
  { icon: "👆", title: "Follow along & jump around", body: "The paragraph being read is highlighted. Click any paragraph to jump straight there." },
  { icon: "⏩", title: "Your speed, your way", body: "From 0.8× to 2× with pitch preserved. Pause and resume with the space bar." },
  { icon: "🧩", title: "Chrome extension", body: "Read the page you're on, or just your selection, without leaving the tab." },
  { icon: "🔒", title: "No sign-up", body: "No accounts, no tracking. Your articles are fetched, read aloud and forgotten." },
];
