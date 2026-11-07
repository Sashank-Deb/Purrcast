// Pure SVG drawing of the PurrCast mascot: a chubby black-and-white podcast cat in headphones, sitting at its mic.
// No hooks and only plain SVG elements, so it works in the live hero (components/Cat.tsx) and in the generated
// images (lib/cards.tsx, via satori). Helpers are plain functions (not components) because satori only accepts
// intrinsic elements. Scene viewBox "0 0 210 165"; the desk line sits at y=160 so the hero can rest on a card edge.
export const CAT = {
  ink: "#171717", fur: "#FFFFFF", gray: "#7C7C82", grayD: "#3A3A3F", grayM: "#46464B", grayL: "#BDBDC2", earIn: "#E4E4E7",
  pink: "#F5A6AD", red: "#F28B91", tongue: "#FF8FA0", gold: "#FFC93C", heart: "#E8505B",
};
export type Look = { x: number; y: number; tilt: number };
export type CatMood = "happy" | "laugh" | "curious" | "surprised" | "sleepy" | "listening" | "cool" | "love" | "sparkle" | "wink" | "dizzy";
export const CAT_MOODS: { id: CatMood; label: string }[] = [
  { id: "happy", label: "Happy host" }, { id: "laugh", label: "Laughing" }, { id: "curious", label: "Curious" },
  { id: "surprised", label: "Surprised" }, { id: "sleepy", label: "Sleepy" }, { id: "listening", label: "Listening" },
  { id: "cool", label: "Cool" }, { id: "love", label: "Love" }, { id: "sparkle", label: "Sparkle" },
  { id: "wink", label: "Wink" }, { id: "dizzy", label: "Dizzy" },
];

const c = CAT;
const HX = 98, HY = 76, HRX = 54, HRY = 43; // head ellipse
const LX = 80, RX = 120, EY = 83;          // eyes
const MX = 100, MY = 94;                    // mouth
const sw = { stroke: c.ink, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const pt = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(HX + HRX * Math.cos(a)).toFixed(1)} ${(HY + HRY * Math.sin(a)).toFixed(1)}`;
};

const star = (x: number, y: number, s: number, fill: string, key?: string) => (
  <path key={key} transform={`translate(${x} ${y}) scale(${s})`} d="M0 -8Q1 -1 8 0Q1 1 0 8Q-1 1 -8 0Q-1 -1 0 -8Z" fill={fill} stroke={c.ink} strokeWidth="1.2" strokeLinejoin="round" />
);
const heart = (x: number, y: number, s: number, key?: string) => (
  <path key={key} transform={`translate(${x} ${y}) scale(${s})`} d="M0 3C-5 -4 -11 4 0 11C11 4 5 -4 0 3Z" fill={c.heart} stroke={c.ink} strokeWidth="1.4" strokeLinejoin="round" />
);
const openEye = (x: number, look: Look, key: string) => (
  <g key={key}>
    <ellipse cx={x + look.x} cy={EY + look.y} rx="4.8" ry="6.4" fill={c.ink} />
    <circle cx={x + look.x - 1.4} cy={EY + look.y - 2.4} r="1.8" fill="#fff" />
  </g>
);
const happyArc = (x: number, key: string) => <path key={key} d={`M${x - 8} ${EY + 3}q8 -10 16 0`} fill="none" strokeWidth="3.2" {...sw} />;
const sleepArc = (x: number, key: string) => <path key={key} d={`M${x - 8} ${EY - 1}q8 8 16 0`} fill="none" strokeWidth="3" {...sw} />;
const omega = (s = 1) => <path d={`M${MX - 8 * s} ${MY}q${4 * s} ${4.6 * s} ${8 * s} 0q${4 * s} ${4.6 * s} ${8 * s} 0`} fill="none" strokeWidth="2.8" {...sw} />;
const openMouth = (w = 9, h = 13) => (
  <g>
    <path d={`M${MX - w} ${MY - 1}Q${MX} ${MY - 3} ${MX + w} ${MY - 1}Q${MX + w - 2} ${MY - 1 + h} ${MX} ${MY - 1 + h}Q${MX - w + 2} ${MY - 1 + h} ${MX - w} ${MY - 1}Z`} fill={c.red} strokeWidth="2.8" {...sw} />
    <ellipse cx={MX} cy={MY + h - 4} rx={w * 0.45} ry="2.6" fill={c.tongue} />
  </g>
);

function eyes(mood: CatMood, look: Look, animated: boolean) {
  const blinkProps = animated ? { className: "animate-blink", style: { transformOrigin: `${MX}px ${EY}px` } } : {};
  switch (mood) {
    case "happy": case "curious":
      return (
        <g {...blinkProps}>
          {openEye(LX, look, "l")}{openEye(RX, look, "r")}
          {mood === "curious" && <path d={`M${RX - 9} ${EY - 14}q9 -6 18 -1`} fill="none" strokeWidth="2.6" {...sw} />}
        </g>
      );
    case "surprised":
      return (
        <g {...blinkProps}>
          <circle cx={LX} cy={EY} r="9.5" fill="#fff" strokeWidth="3" {...sw} /><circle cx={RX} cy={EY} r="9.5" fill="#fff" strokeWidth="3" {...sw} />
          <circle cx={LX + look.x * 0.8} cy={EY + look.y * 0.8} r="3.4" fill={c.ink} /><circle cx={RX + look.x * 0.8} cy={EY + look.y * 0.8} r="3.4" fill={c.ink} />
        </g>
      );
    case "laugh": return <g>{happyArc(LX, "l")}{happyArc(RX, "r")}</g>;
    case "sleepy": case "listening": return <g>{sleepArc(LX, "l")}{sleepArc(RX, "r")}</g>;
    case "cool":
      return (
        <g>
          <rect x="61" y="74" width="35" height="19" rx="7" fill={c.ink} /><rect x="104" y="74" width="35" height="19" rx="7" fill={c.ink} />
          <path d="M96 80h8" stroke={c.ink} strokeWidth="3" />
          <path d="M67 79l7 -2M110 79l7 -2" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".7" />
        </g>
      );
    case "love": return <g>{heart(LX, EY - 5, 1.05, "l")}{heart(RX, EY - 5, 1.05, "r")}</g>;
    case "sparkle": return <g>{star(LX, EY, 1.3, c.gold, "l")}{star(RX, EY, 1.3, c.gold, "r")}</g>;
    case "wink":
      return (
        <g {...blinkProps}>
          {openEye(LX, look, "l")}
          <path d={`M${RX - 7} ${EY - 6}l12 6 -12 6`} fill="none" strokeWidth="3" {...sw} />
        </g>
      );
    case "dizzy":
      return (
        <g>
          {[LX, RX].map((x) => (
            <g key={x}>
              <circle cx={x} cy={EY} r="9" fill="#fff" strokeWidth="2.4" {...sw} />
              <path d={`M${x} ${EY}a1.8 1.8 0 0 1 3.6 0a3.6 3.6 0 0 1 -7.2 0a5.4 5.4 0 0 1 10.8 0`} fill="none" strokeWidth="1.8" {...sw} />
            </g>
          ))}
        </g>
      );
  }
}

function mouth(mood: CatMood) {
  switch (mood) {
    case "laugh": return openMouth(10, 14);
    case "sparkle": return openMouth(8, 11);
    case "love": return openMouth(7, 9);
    case "surprised": return <ellipse cx={MX} cy={MY + 5} rx="4.2" ry="6" fill={c.red} strokeWidth="2.6" {...sw} />;
    case "curious": return <path d={`M${MX - 6} ${MY + 2}q6 -4 12 0`} fill="none" strokeWidth="2.6" {...sw} />;
    case "sleepy": return omega(0.8);
    case "dizzy": return <path d={`M${MX - 8} ${MY + 2}q4 -4 8 0q4 4 8 0`} fill="none" strokeWidth="2.6" {...sw} />;
    default: return omega(1);
  }
}

function extras(mood: CatMood, animated: boolean) {
  const f = animated ? "animate-floaty" : undefined;
  const fs = animated ? ({ ["--r" as string]: "0deg" } as React.CSSProperties) : undefined;
  switch (mood) {
    case "curious":
      return (
        <g className={f} style={fs}>
          <circle cx="184" cy="36" r="16" fill="#fff" strokeWidth="3" {...sw} />
          <path d="M174 48l-6 10l14 -6" fill="#fff" strokeWidth="3" {...sw} />
          <path d="M177 32q0 -7 7 -7q7 0 7 6q0 4 -7 8v3" fill="none" strokeWidth="3" {...sw} /><circle cx="184" cy="47" r="1.8" fill={c.ink} />
        </g>
      );
    case "surprised":
      return (
        <g className={f} style={fs} stroke={c.ink} strokeWidth="4.5" strokeLinecap="round">
          <path d="M178 16v14M190 18v12" /><circle cx="178" cy="38" r="0.5" /><circle cx="190" cy="38" r="0.5" />
        </g>
      );
    case "sleepy":
      return (
        <g className={f} style={fs} fill="none" stroke="#6B6B70" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M172 42h10l-10 12h10" /><path d="M188 26h7l-7 8.5h7" strokeWidth="2.4" />
        </g>
      );
    case "listening":
      return (
        <g>
          <g className={f} style={fs}>
            <ellipse cx="178" cy="34" rx="5" ry="3.8" transform="rotate(-20 178 34)" fill={c.ink} /><path d="M182 32V14l9 2" fill="none" stroke={c.ink} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g stroke={c.ink} strokeWidth="3" strokeLinecap="round">
            {[[182, 80, 94], [189, 74, 100], [196, 82, 92], [203, 78, 96]].map(([x, a, b], i) => (
              <path key={i} d={`M${x} ${a}V${b}`} className={animated ? "animate-bars" : undefined} style={animated ? { transformOrigin: `${x}px 87px`, animationDelay: `${i * 0.15}s` } : undefined} />
            ))}
          </g>
        </g>
      );
    case "cool": return <g className={f} style={fs}>{star(180, 28, 1.2, c.gold, "a")}{star(194, 46, 0.8, c.gold, "b")}</g>;
    case "love": return <g className={f} style={fs}>{heart(182, 30, 1.1, "a")}{heart(196, 50, 0.7, "b")}</g>;
    case "sparkle": return <g className={f} style={fs}>{star(180, 26, 1, "#fff", "a")}{star(196, 44, 0.8, c.gold, "b")}</g>;
    case "laugh": return <g stroke={c.ink} strokeWidth="3.2" strokeLinecap="round" fill="none"><path d="M174 32l9 -9M182 46h11M174 60l9 6" /></g>;
    case "wink": return <g className={f} style={fs}>{star(182, 30, 1.1, c.gold, "a")}</g>;
    case "dizzy": return <g className={f} style={fs} stroke={c.ink} strokeWidth="3" strokeLinecap="round" fill="none"><path d="M174 28l10 6M188 20l4 11M178 44l12 -2" /></g>;
    default:
      return <g stroke={c.ink} strokeWidth="3.2" strokeLinecap="round" fill="none"><path d="M172 28l9 -7M178 40h10M172 52l9 5" /></g>;
  }
}

const EAR_L = "M56 60L52 20L90 40";
const EAR_R = "M140 60L146 20L108 40";

function head(mood: CatMood, look: Look, animated: boolean) {
  const tilt = animated ? { transform: `rotate(${look.tilt}deg)`, transformOrigin: `${HX}px 110px`, transition: "transform .25s ease-out" } : undefined;
  const earProps = animated ? { className: "animate-ear", style: { transformOrigin: "56px 58px" } } : {};
  const headEllipse = <ellipse cx={HX} cy={HY} rx={HRX} ry={HRY} />;
  return (
    <g style={tilt}>
      <g className={mood === "listening" && animated ? "animate-bob" : undefined}>
        {/* outline pass, then fill pass → one clean outer outline */}
        <g strokeWidth="4.5" {...sw} fill={c.fur}><path d={EAR_L} /><path d={EAR_R} />{headEllipse}</g>
        <g fill={c.fur} stroke="none"><path d={EAR_L} /><path d={EAR_R} />{headEllipse}</g>
        <path d="M137 53L141 30L118 41Z" fill={c.earIn} />
        {/* tuxedo patches: left ear + upper-left of the face, small patch on the right */}
        <g {...earProps}><path d={EAR_L} fill={c.ink} strokeWidth="4.5" {...sw} /></g>
        <path d={`M${pt(166)}A${HRX} ${HRY} 0 0 1 ${pt(262)}Q84 56 70 60Q58 64 57 78Q55 82 ${pt(166)}Z`} fill={c.ink} />
        <path d={`M${pt(298)}A${HRX} ${HRY} 0 0 1 ${pt(346)}Q142 62 135 69Q128 56 ${pt(298)}Z`} fill={c.ink} />
        <path d={EAR_R} fill="none" strokeWidth="4.5" {...sw} />
        <ellipse cx={HX} cy={HY} rx={HRX} ry={HRY} fill="none" strokeWidth="4.5" {...sw} opacity="0" />

        {eyes(mood, look, animated)}
        <ellipse cx="68" cy="95" rx="6.5" ry="4" fill={c.pink} opacity=".6" /><ellipse cx="132" cy="95" rx="6.5" ry="4" fill={c.pink} opacity=".6" />
        {mouth(mood)}
        {/* whisker ticks on the left cheek, like the reference */}
        <path d="M40 112L27 108M41 119L28 122M43 126L33 132" fill="none" strokeWidth="2.6" {...sw} />

        {/* glossy headphones */}
        <path d="M46 82C38 4 158 4 150 82" fill="none" stroke={c.grayD} strokeWidth="8.5" strokeLinecap="round" />
        <path d="M58 54C72 20 124 20 138 54" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".4" />
        {[44, 152].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy="86" rx="14.5" ry="20.5" fill={c.gray} strokeWidth="3.8" {...sw} />
            <ellipse cx={x} cy="86" rx="8.5" ry="13.5" fill={c.grayM} />
            <path d={`M${x - 8} ${74}q-2.5 8 0 15`} stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".55" />
          </g>
        ))}
      </g>
    </g>
  );
}

/** Full scene (body, mic, desk, head) in a 210×165 viewBox. `headOnly` draws just the head for stickers (use a cropped viewBox). */
export function CatDrawing({ mood = "happy", look = { x: 0, y: 0, tilt: 0 }, animated = false, headOnly = false }: { mood?: CatMood; look?: Look; animated?: boolean; headOnly?: boolean }) {
  return (
    <g>
      {!headOnly && (
        <g className={animated ? "animate-breathe" : undefined} style={animated ? { transformOrigin: "105px 160px" } : undefined}>
          <path d="M26 160C20 128 40 104 72 98L132 98C170 104 190 130 184 160Z" fill={c.fur} strokeWidth="4.5" {...sw} />
          <path d="M26 160C20 128 40 104 72 98C80 118 62 138 69 160Z" fill={c.ink} />
          <path d="M78 150C90 134 108 138 111 153M82 144l3 6M92 141l2 7" fill="none" strokeWidth="3.2" {...sw} />
          <path d="M148 154C152 142 166 142 168 154" fill="none" strokeWidth="3.2" {...sw} />
        </g>
      )}
      {head(mood, look, animated)}
      {!headOnly && (
        <g>
          {/* podcast mic with U-holder, on the desk line */}
          <path d="M107 128q-2 16 15 16q17 0 15 -16" fill="none" strokeWidth="3.2" {...sw} />
          <rect x="111" y="108" width="22" height="32" rx="11" fill="#55555B" strokeWidth="3.6" {...sw} />
          <path d="M114 117h16M114 124h16M114 131h16" stroke="#9A9AA0" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M115 111q-1.5 4 0 8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".7" />
          <path d="M122 144v12" stroke={c.ink} strokeWidth="3.4" strokeLinecap="round" />
          <path d="M8 160H202" stroke={c.ink} strokeWidth="3.6" strokeLinecap="round" />
          <path d="M108 158h28" stroke={c.ink} strokeWidth="3.6" strokeLinecap="round" />
        </g>
      )}
      {!headOnly && extras(mood, animated)}
    </g>
  );
}
