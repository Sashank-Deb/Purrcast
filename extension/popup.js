const $ = (id) => document.getElementById(id);
let tabId;

async function send(msg) {
  try {
    return await chrome.tabs.sendMessage(tabId, msg);
  } catch {
    // Page was open before install: inject the content script, then retry.
    await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
    return await chrome.tabs.sendMessage(tabId, msg);
  }
}

function render(s) {
  if (!s) return;
  $("controls").style.display = s.loaded ? "flex" : "none";
  $("bar").style.display = s.loaded ? "block" : "none";
  $("bars").style.display = s.playing ? "flex" : "none";
  $("toggle").textContent = s.playing ? "❚❚" : "▶";
  $("fill").style.width = s.total ? (s.idx / s.total) * 100 + "%" : "0";
  $("rate").value = String(s.rate);
  $("voice").value = s.voice || $("voice").value;
  if (s.loaded) {
    $("engine").className = s.engine;
    $("engine").textContent = s.loading ? "Fetching voice…" : s.engine === "neural" ? "Neural voice" : "Browser voice — PurrCast server not found";
  }
  if (s.title) $("title").textContent = s.title;
  $("listen").textContent = s.loaded ? "Restart from top" : "Listen";
  if (!s.loaded && s.title !== undefined) $("msg").textContent = "";
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  tabId = tab.id;
  if (!/^https?:/.test(tab.url || "")) {
    $("listen").disabled = true;
    $("msg").textContent = "Open a regular web page to use PurrCast.";
    return;
  }
  render(await send({ type: "status" }));
  setInterval(async () => render(await send({ type: "status" })), 700);
}

$("listen").onclick = async () => {
  const s = await send({ type: "load" });
  $("msg").textContent = s.loaded ? "" : "This page has nothing to read — the cat is confused.";
  render(s);
};
$("toggle").onclick = async () => render(await send({ type: "toggle" }));
$("prev").onclick = async () => render(await send({ type: "skip", by: -1 }));
$("next").onclick = async () => render(await send({ type: "skip", by: 1 }));
$("rate").onchange = async (e) => render(await send({ type: "rate", value: +e.target.value }));

$("voice").onchange = async (e) => render(await send({ type: "voice", value: e.target.value }));

init();
