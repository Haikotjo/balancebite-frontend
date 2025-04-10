import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#46B1C9",
        secondary: "#EDB6A3",
        error: "#DD1155",
        success: "#7EE081",
        lightText: "#4D5061",
        darkText: "#ffffff",
        lightBackground: "#FFFFFF",
        darkBackground: "#2d2f39",
        cardLight: "#e1e1e1",
        cardDark: "#191e23",
      },
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
        display: ["Roboto", "sans-serif"],
        body: ["Quicksand", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [typography, forms],
};
