/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Activeer dark mode via een class op <html>
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan alle React-bestanden
    "./public/index.html",        // Scan je public/index.html
  ],
  theme: {
    extend: {
      colors: {
        primary: "#46B1C9",        // Primaire kleur
        secondary: "#EDB6A3",      // Secundaire kleur
        error: "#DD1155",          // Error kleur
        success: "#7EE081",        // Succes kleur
        lightText: "#4D5061",      // Tekstkleur voor light mode
        darkText: "#ffffff",       // Tekstkleur voor dark mode
        lightBackground: "#FFFFFF", // Achtergrondkleur light mode
        darkBackground: "#4D5061", // Achtergrondkleur dark mode
      },
    },
  },
  plugins: [], // Geen plugins nodig op dit moment
};
