import { zhexFundations } from "./src/styles/fundations";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // ou "media" se preferir
  theme: {
    extend: {
      colors: zhexFundations.colors,
      fontFamily: {
        araboto: 'var(--font-araboto), "Araboto", sans-serif',
        inter: 'var(--font-inter), "Inter", sans-serif',
        signature: 'var(--font-style-script), "Style Script", cursive',
      },
      maxWidth: {
        ...zhexFundations.containers,
      },
    },
  },
  plugins: [],
} satisfies Config;
