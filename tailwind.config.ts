import type { Config } from "tailwindcss";
import scrollbarHide from 'tailwind-scrollbar-hide';

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/store/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media", // 시스템 설정에 따라 자동 전환
  theme: {
    extend: {
      height: {
        app: "var(--app-height)",
      },
      minHeight: {
        app: "var(--app-height)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
        "primary-dark": "var(--color-primary-dark)",
        secondary: "var(--color-secondary)",
        correct: "var(--color-right)",
        warning: "var(--color-warning)",
        green: "var(--color-green)",
        kakao: "var(--color-kakao)",
        toast: {
          DEFAULT: "var(--color-toast-bg)",
          foreground: "var(--color-toast-text)",
        },
        grey: {
          100: "var(--color-grey-100)",
          200: "var(--color-grey-200)",
          300: "var(--color-grey-300)",
          400: "var(--color-grey-400)",
          500: "var(--color-grey-500)",
          600: "var(--color-grey-600)",
          700: "var(--color-grey-700)",
          800: "var(--color-grey-800)",
        },
        purple: {
          100: "var(--color-purple-100)",
          200: "var(--color-purple-200)",
          300: "var(--color-purple-300)",
          400: "var(--color-purple-400)",
          500: "var(--color-purple-500)",
          600: "var(--color-purple-600)",
          700: "var(--color-purple-700)",
          800: "var(--color-purple-800)",
        },
        red: {
          100: "var(--color-red-100)",
          200: "var(--color-red-200)",
          300: "var(--color-red-300)",
          400: "var(--color-red-400)",
          500: "var(--color-red-500)",
          600: "var(--color-red-600)",
          700: "var(--color-red-700)",
          800: "var(--color-red-800)",
        },
        lime: {
          100: "var(--color-lime-100)",
          200: "var(--color-lime-200)",
          300: "var(--color-lime-300)",
          400: "var(--color-lime-400)",
          500: "var(--color-lime-500)",
          600: "var(--color-lime-600)",
          700: "var(--color-lime-700)",
          800: "var(--color-lime-800)",
        },
      },
    },
  },
  plugins: [scrollbarHide],
};
export default config;
