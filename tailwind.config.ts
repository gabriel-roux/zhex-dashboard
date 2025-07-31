import { zhexFoundations } from './src/styles/foundations'
import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'from-neutral-200',
    'via-neutral-100',
    'to-neutral-200',
    'border-neutral-200',
    'text-neutral-500',
    'bg-neutral-200',
  ],
  darkMode: 'class', // ou "media" se preferir
  theme: {
    extend: {
      colors: zhexFoundations.colors,
      fontFamily: {
        araboto: 'var(--font-araboto), "Araboto", sans-serif',
        inter: 'var(--font-inter), "Inter", sans-serif',
        signature: 'var(--font-style-script), "Style Script", cursive',
      },
      maxWidth: {
        ...zhexFoundations.containers,
      },
    },
  },
  plugins: [],
} satisfies Config
