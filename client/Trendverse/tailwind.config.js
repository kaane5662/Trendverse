/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        josefin: ["Josefin Sans", "Sans-Serif"]
      },
      colors: {
        primary: "#ffffff",
        secondary: "#110d31",
        complementary: "#4d3ccd"
      }
    },
  },
  plugins: [],
}

