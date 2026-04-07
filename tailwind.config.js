/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: "#fdf2f2",
          100: "#fde8e9",
          200: "#fbd0d2",
          300: "#f5a1a5",
          400: "#ec6b71",
          500: "#c12f36",
          600: "#9a1b22", // your main color
          700: "#84171d",
          800: "#6e1418",
          900: "#581014",
        },
      },
    },
  },
  plugins: [],
};