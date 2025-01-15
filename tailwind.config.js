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
        primary: "#1687c5",
        secondary: "#EDB6A3",
        error: "#DD1155",
        success: "#7EE081",
        lightText: "#4D5061",
        darkText: "#ffffff",
        lightBackground: "#FFFFFF",
        darkBackground: "#4D5061",
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
  plugins: [typography, forms], // Plugins als ES modules
};
