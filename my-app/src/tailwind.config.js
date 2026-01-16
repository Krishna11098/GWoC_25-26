// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wave: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-120px)" },
        },
      },
      animation: {
        waveSlow: "wave 26s ease-in-out infinite alternate",
        waveMedium: "wave 34s ease-in-out infinite alternate",
        waveFast: "wave 42s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
