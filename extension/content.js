(() => {
  if (window.__purrLoaded) return;
  window.__purrLoaded = true;

  let chunks = [], idx = 0, playing = false, loading = false, rate = 1, gen = 0, title = "";
  let voice = "en-US-AvaNeural", neural = true;
  const audio = new Audio();
  audio.preservesPitch = true;
  const cache = new Map();

  chrome.storage.local.get(["voice", "rate"]).then((v) => {
    if (v.voice) voice = v.voice;
    if (v.rate) rate = v.rate;
  });

  function extract() {
    const sel = String(getSelection()).trim();
    if (sel.length > 80) return sel;
    const root = document.querySelector("article") || document.querySelector("[role=main], main") || document.body;
    const out = [];
    root.querySelectorAll("h1,h2,h3,p,li,blockquote").forEach((n) => {
      if (n.closest("nav,header,footer,aside,form,script,style,[aria-hidden=true]")) return;
      const t = n.innerText.replace(/\s+/g, " ").replace(/\[\d+\]/g, "").trim();
      if (t.length > 25 || (/^H[1-3]$/.test(n.tagName) && t.length > 3)) out.push(t);
    });
    return out.join("\n");
  }

  function toChunks(text, max = 420) {
    const out = [];
    for (const para of text.split(/\n+/)) {
      let cur = "";
      const flush = () => { if (cur.trim()) out.push(cur.trim()); cur = ""; };
      for (let s of para.match(/[^.!?]+[.!?]+["')\]”’]*\s*|[^.!?]+$/g) || []) {
        while (s.length > max) {
          const c = s.lastIndexOf(" ", max), i = c > 40 ? c : max;
          if (cur) flush();
          out.push(s.slice(0, i).trim());
          s = s.slice(i);
        }
        if ((cur + s).length > max) flush();
        cur += s;
      }
      flush();
    }
    return out;
  }

  function fetchChunk(i) {
    const key = voice + ":" + i;
    let p = cache.get(key);
    if (!p) {
      p = chrome.runtime.sendMessage({ type: "tts", text: chunks[i], voice }).then((r) => {
        if (!r || !r.ok) throw new Error("tts unavailable");
        const bin = atob(r.b64), u = new Uint8Array(bin.length);
        for (let j = 0; j < bin.length; j++) u[j] = bin.charCodeAt(j);
        return URL.createObjectURL(new Blob([u], { type: "audio/mpeg" }));
      });
      p.catch(() => cache.delete(key));
      cache.set(key, p);
    }
    return p;
  }

  function clearCache() {
    cache.forEach((p) => p.then(URL.revokeObjectURL).catch(() => {}));
    cache.clear();
  }

  function browserSpeak(i, my) {
    const u = new SpeechSynthesisUtterance(chunks[i]);
    u.rate = rate;
    u.onend = () => my === gen && playFrom(i + 1);
    u.onerror = (e) => { if (my === gen && e.error !== "interrupted" && e.error !== "canceled") playing = false; };
    speechSynthesis.speak(u);
  }

  async function playFrom(i) {
    const my = ++gen;
    audio.pause();
    speechSynthesis.cancel();
    if (i >= chunks.length) { playing = false; loading = false; idx = 0; return; }
    idx = i; playing = true;
    if (neural) {
      loading = true;
      try {
        const url = await fetchChunk(i);
        if (my !== gen) return;
        audio.src = url;
        audio.playbackRate = rate;
        audio.onended = () => my === gen && playFrom(i + 1);
        await audio.play();
        if (my !== gen) return;
        loading = false;
        fetchChunk(i + 1).catch(() => {});
        if (i + 2 < chunks.length) fetchChunk(i + 2).catch(() => {});
        return;
      } catch {
        if (my !== gen) return;
        neural = false; loading = false; // server off or media blocked → browser voice
      }
    }
    browserSpeak(i, my);
  }

  function stop() { gen++; audio.pause(); speechSynthesis.cancel(); playing = false; loading = false; }

  const status = () => ({
    playing, loading, idx, total: chunks.length, rate, title, voice,
    loaded: chunks.length > 0, engine: neural ? "neural" : "browser",
  });

  chrome.runtime.onMessage.addListener((msg, _s, reply) => {
    switch (msg.type) {
      case "load":
        stop(); clearCache();
        chrome.runtime.sendMessage({ type: "reset" });
        title = document.title; neural = true;
        chunks = toChunks(extract()); idx = 0;
        if (chunks.length) playFrom(0);
        break;
      case "toggle": {
        if (playing) { stop(); break; }
        const i = idx;
        if (neural && audio.src && audio.currentTime > 0 && !audio.ended && audio.paused) {
          const my = ++gen;
          audio.onended = () => my === gen && playFrom(i + 1);
          playing = true;
          audio.play().catch(() => playFrom(i));
        } else playFrom(i);
        break;
      }
      case "skip": playFrom(Math.min(Math.max(0, idx + msg.by), chunks.length)); break;
      case "rate":
        rate = msg.value; audio.playbackRate = rate;
        chrome.storage.local.set({ rate });
        if (playing && !neural) playFrom(idx);
        break;
      case "voice":
        voice = msg.value; clearCache();
        chrome.storage.local.set({ voice });
        if (playing && neural) playFrom(idx);
        break;
      case "stop": stop(); idx = 0; break;
    }
    reply(status());
  });
})();
