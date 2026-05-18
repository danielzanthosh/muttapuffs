import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bakery: {
          cream: "var(--bakery-cream)",
          paper: "var(--bakery-paper)",
        },
        egg: {
          yellow: "var(--egg-yellow)",
        },
        chocolate: {
          brown: "var(--chocolate-brown)",
        },
        warm: {
          orange: "var(--warm-orange)",
        },
        tomato: {
          red: "var(--tomato-red)",
        },
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      boxShadow: {
        'brutalist-sm': '2px 2px 0px 0px var(--chocolate-brown)',
        'brutalist-md': '4px 4px 0px 0px var(--chocolate-brown)',
        'brutalist-lg': '8px 8px 0px 0px var(--chocolate-brown)',
        'brutalist-hover': '6px 6px 0px 0px var(--chocolate-brown)',
      },
      borderRadius: {
        'brutalist': '12px',
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        comic: ["var(--font-comic)"],
        hand: ["var(--font-hand)"],
      },
    },
  },
  plugins: [],
};
export default config;
