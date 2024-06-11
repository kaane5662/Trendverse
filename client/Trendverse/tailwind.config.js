/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        josefin: ["Outfit", "Sans-Serif"]
      },
      colors: {
        primary: "#edf2f4 ",
        secondary: "#313638",
        complementary: "#d90429"
      }
    },
  },
  plugins: [],
}

