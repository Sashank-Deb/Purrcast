/** One downloadable scene from the approved PurrCast mascot SVG pack. */
export default function MoodSticker({ src, label }: { src: string; label: string }) {
  return (
    <figure className="rounded-3xl border border-peach-100 bg-white p-3">
      <div className="grid h-36 place-items-center rounded-2xl bg-peach-50">
        <img src={src} className="h-32 w-auto max-w-full object-contain" alt={`PurrCast cat — ${label}`} />
      </div>
      <figcaption className="mt-2 flex items-center justify-between gap-2">
        <b className="text-sm">{label}</b>
        <a href={src} download className="text-xs font-bold text-brand-dark underline">SVG</a>
      </figcaption>
    </figure>
  );
}
