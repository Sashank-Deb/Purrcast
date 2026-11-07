// Fetches neural TTS audio from the PurrCast server. Doing it here (not in the page) avoids CORS / mixed-content blocks.
const CANDIDATES = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://127.0.0.1:3000"];
let working = null;
let downUntil = 0;

function toBase64(buf) {
  const b = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
  return btoa(s);
}

async function tts(text, voice) {
  if (Date.now() < downUntil) return null;
  const bases = [...new Set([working, ...CANDIDATES].filter(Boolean).map((u) => u.replace(/\/+$/, "")))];
  for (const base of bases) {
    try {
      const r = await fetch(base + "/api/tts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, voice }),
        signal: AbortSignal.timeout(20000),
      });
      if (r.ok && (r.headers.get("content-type") || "").includes("audio")) {
        working = base;
        return toBase64(await r.arrayBuffer());
      }
    } catch {}
    if (base === working) working = null;
  }
  downUntil = Date.now() + 20000; // don't hammer when the server is off
  return null;
}

chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg.type === "tts") {
    tts(msg.text, msg.voice).then((b64) => reply(b64 ? { ok: true, b64 } : { ok: false }));
    return true; // async reply
  }
  if (msg.type === "reset") { downUntil = 0; working = null; reply({ ok: true }); }
});
