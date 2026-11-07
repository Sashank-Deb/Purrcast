# 🐻 PurrCast

Turn any article URL, document, or pasted text into an audio read-along (browser text-to-speech, no API keys).

## Web app (Next.js + Tailwind)
```bash
npm install
npm run dev   # http://localhost:3000
```
Paste a URL (server extracts the article via Readability), upload .txt/.md/.html, or paste text. Click any sentence to jump there.

## Chrome extension
1. Open `chrome://extensions`, enable **Developer mode**
2. **Load unpacked** → select the `extension/` folder
3. Start the app (`npm run dev`) so the extension can fetch neural voices — the extension auto-finds it on localhost:3000–3002. If the server isn't running, it falls back to your browser's voice.
4. On any article, click the extension → **Listen** (select text first to read only that)
