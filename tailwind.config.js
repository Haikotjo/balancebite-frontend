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
        success: "#71f175",
        lightText: "#494d5f",
        darkText: "#ffffff",
        lightBackground: "#F9FAFB",
        darkBackground: "#191e23",
        cardLight: "#FFFFFF",
        cardDark: "#2d2f39",
        cardAccentLight: "#F9FAFB",
        cardAccentDark: "#191e23",
        borderLight: "#46B1C9",
        borderDark: "#5db3c6",
        friendlyGray: "#8f8f8f",
        softIvory: "#F0EAE2",
        appBarColor: "#ff6d38",


        // 🎨 User-configurable kleuren (via CSS variables)
        userPrimary: "var(--user-primary)",
        userSecondary: "var(--user-secondary)",
        userBackground: "var(--user-background)",
        userText: "var(--user-text)",
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