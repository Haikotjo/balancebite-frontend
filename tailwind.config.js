import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import scrollbarHide from "tailwind-scrollbar-hide";

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
        lightText: "#5b616e",
        darkText: "#F9FAFB",
        // lightText: "#aa0411",
        // darkText: "#007df6",
        userText: "#111827",
        userTextDark: "#F9FAFB",

        // navActive: "#46B1C9",
        // navInactive: "#ffffff",

        lightBackground: "#F9FAFB",
        darkBackground: "#111827",


        primary: "#41D3BD",
        secondary: "#EDB6A3",
        error: "#DD1155",
        success: "#71f175",

        cardLight: "#FFFFFF",
        cardDark: "#192339",
        cardAccentLight: "#F9FAFB",
        cardAccentDark: "#191e23",

        borderLight: "#41D3BD",
        borderDark: "#41D3BD",

        friendlyGray: "#8f8f8f",
        softIvory: "#F0EAE2",

        appBarColor: "#DB324D",


        // 🎨 User-configurable kleuren (via CSS variables)
        userPrimary: "var(--user-primary)",
        userSecondary: "var(--user-secondary)",
        userBackground: "var(--user-background)",
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
  plugins: [typography, forms, scrollbarHide],
};