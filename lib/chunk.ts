export type Chunk = { text: string; para: number };

/** Split text into paragraphs, then into ≤ max-char chunks on sentence boundaries. */
export function toChunks(text: string, max = 420): Chunk[] {
  const out: Chunk[] = [];
  text.split(/\n+/).map((p) => p.trim()).filter(Boolean).forEach((para, pi) => {
    const sentences = para.match(/[^.!?]+[.!?]+["')\]”’]*\s*|[^.!?]+$/g) ?? [para];
    let cur = "";
    const flush = () => { if (cur.trim()) out.push({ text: cur.trim(), para: pi }); cur = ""; };
    for (let s of sentences) {
      while (s.length > max) {
        const cut = s.lastIndexOf(" ", max);
        const i = cut > 40 ? cut : max;
        if (cur) flush();
        out.push({ text: s.slice(0, i).trim(), para: pi });
        s = s.slice(i);
      }
      if ((cur + s).length > max) flush();
      cur += s;
    }
    flush();
  });
  return out;
}
