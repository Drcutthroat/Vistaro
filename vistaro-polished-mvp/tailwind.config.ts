import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: { soft: "0 10px 30px rgba(0,0,0,.08)" },
      keyframes: { subtlePulse: { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.01)" } } },
      animation: { subtlePulse: "subtlePulse 6s ease-in-out infinite" }
    },
  },
  plugins: [],
} satisfies Config;
