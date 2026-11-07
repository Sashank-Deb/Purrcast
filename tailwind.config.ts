import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { serif: ["Georgia", "Charter", "serif"], display: ["ui-rounded", "'SF Pro Rounded'", "'Nunito'", "system-ui", "sans-serif"] },
      colors: {
        cream: "#FFF7ED",
        ink: "#2B1D14",
        brand: { DEFAULT: "#EA580C", dark: "#C2410C", light: "#FDBA74" },
        peach: { 50: "#FFF7ED", 100: "#FFEDD5", 200: "#FED7AA", 300: "#FDBA74", 400: "#FB923C", 500: "#F97316", 600: "#EA580C", 700: "#C2410C", 800: "#9A3412", 900: "#7C2D12" },
      },
      keyframes: {
        wag: { "0%,100%": { transform: "rotate(-10deg)" }, "50%": { transform: "rotate(16deg)" } },
        blink: { "0%,92%,100%": { transform: "scaleY(1)" }, "96%": { transform: "scaleY(0.08)" } },
        floaty: { "0%,100%": { transform: "translateY(0) rotate(var(--r,0deg))" }, "50%": { transform: "translateY(-16px) rotate(calc(var(--r,0deg) + 6deg))" } },
        bob: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-3px)" } },
        bars: { "0%,100%": { transform: "scaleY(0.3)" }, "50%": { transform: "scaleY(1)" } },
        ear: { "0%,88%,100%": { transform: "rotate(0)" }, "92%": { transform: "rotate(-14deg)" }, "96%": { transform: "rotate(4deg)" } },
        breathe: { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.025)" } },
        chew: { "0%,100%": { transform: "translate(0,0) rotate(0)" }, "50%": { transform: "translate(-1.5px,-2.5px) rotate(-2.5deg)" } },
        munch: { "0%,100%": { transform: "scaleY(1)" }, "50%": { transform: "scaleY(0.3)" } },
        pop: { "0%": { opacity: "0", transform: "translateY(8px) scale(.98)" }, "100%": { opacity: "1", transform: "none" } },
      },
      animation: {
        wag: "wag 2.2s ease-in-out infinite",
        blink: "blink 5s infinite",
        floaty: "floaty 7s ease-in-out infinite",
        bob: "bob .5s ease-in-out infinite",
        bars: "bars .9s ease-in-out infinite",
        ear: "ear 6s ease-in-out infinite",
        breathe: "breathe 3.5s ease-in-out infinite",
        chew: "chew .7s ease-in-out infinite",
        munch: "munch .7s ease-in-out infinite",
        pop: "pop .5s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
