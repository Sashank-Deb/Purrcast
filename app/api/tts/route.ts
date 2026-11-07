import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

export const runtime = "nodejs";

const VOICES = new Set([
  "en-US-AvaNeural", "en-US-AndrewNeural", "en-US-EmmaNeural", "en-US-BrianNeural",
  "en-US-AriaNeural", "en-US-GuyNeural", "en-GB-SoniaNeural", "en-GB-RyanNeural", "en-AU-NatashaNeural",
]);

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export async function POST(req: Request) {
  const { text, voice } = await req.json().catch(() => ({}));
  if (typeof text !== "string" || !text.trim() || text.length > 2000)
    return new Response("Bad text", { status: 400 });
  const v = VOICES.has(voice) ? voice : "en-US-AvaNeural";

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(v, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(esc(text));
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      audioStream.on("data", (d: Buffer) => chunks.push(d));
      audioStream.on("close", () => resolve());
      audioStream.on("error", reject);
    });
    const body = Buffer.concat(chunks);
    if (!body.length) throw new Error("empty audio");
    return new Response(body, { headers: { "content-type": "audio/mpeg", "cache-control": "private, max-age=3600" } });
  } catch (e) {
    return new Response((e as Error).message, { status: 502 });
  }
}
