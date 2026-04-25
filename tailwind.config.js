/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jp: ["'Hiragino Kaku Gothic ProN'", "'Noto Sans JP'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
