import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import scrollbarHide from "tailwind-scrollbar-hide";

/**
 * @type {import('tailwindcss').Config}
 *
 * Professional token-based design system.
 *
 * All semantic tokens are backed by CSS variables defined in global.css.
 * Dark mode switches automatically — no "dark:" modifier needed for
 * structural colors (page, surface, content, border).
 *
 * Usage examples:
 *   bg-page               → page/body background (light or dark)
 *   bg-surface            → card / panel background
 *   bg-surface-raised     → elevated card / accordion header
 *   bg-surface-sunken     → input field / recessed area
 *   text-content          → primary body text
 *   text-content-muted    → placeholder / secondary text
 *   border-border         → default border
 *   border-border-strong  → emphasized border (inverts in dark mode)
 *   bg-primary            → brand teal
 *   bg-primary-subtle     → lighter brand teal
 *   bg-primary-emphasis   → darker brand / green
 *   bg-error              → error red
 *   bg-error-emphasis     → deeper error red
 *   bg-success            → success green
 *   bg-promote            → promotion yellow
 *   bg-price              → price orange
 *   bg-app-bar            → app bar color
 */
export default {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // ── Page & Surface ────────────────────────────────────────────────
        // Dark mode handled automatically via CSS variables — no dark: needed.
        page: "rgb(var(--color-page) / <alpha-value>)",

        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          raised:  "rgb(var(--color-surface-raised) / <alpha-value>)",
          sunken:  "rgb(var(--color-surface-sunken) / <alpha-value>)",
        },

        // ── Content (Text) ────────────────────────────────────────────────
        content: {
          DEFAULT:  "rgb(var(--color-content) / <alpha-value>)",
          muted:    "rgb(var(--color-content-muted) / <alpha-value>)",
          inverted: "rgb(var(--color-content-inverted) / <alpha-value>)",
        },

        // ── Borders ───────────────────────────────────────────────────────
        border: {
          DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
          strong:  "rgb(var(--color-border-strong) / <alpha-value>)",
        },

        // ── Brand / Primary ───────────────────────────────────────────────
        primary: {
          DEFAULT:  "rgb(var(--color-primary) / <alpha-value>)",
          subtle:   "rgb(var(--color-primary-subtle) / <alpha-value>)",
          emphasis: "rgb(var(--color-primary-emphasis) / <alpha-value>)",
        },

        // ── Secondary Accent ──────────────────────────────────────────────
        secondary: {
          DEFAULT:  "rgb(var(--color-secondary) / <alpha-value>)",
          emphasis: "rgb(var(--color-secondary-emphasis) / <alpha-value>)",
        },

        // ── Semantic Status ───────────────────────────────────────────────
        error: {
          DEFAULT:  "rgb(var(--color-error) / <alpha-value>)",
          emphasis: "rgb(var(--color-error-emphasis) / <alpha-value>)",
        },

        success: {
          DEFAULT:  "rgb(var(--color-success) / <alpha-value>)",
          emphasis: "rgb(var(--color-success-emphasis) / <alpha-value>)",
        },

        // ── Special Purpose ───────────────────────────────────────────────
        promote:   "rgb(var(--color-promote) / <alpha-value>)",
        price:     "rgb(var(--color-price) / <alpha-value>)",
        "app-bar": "rgb(var(--color-app-bar) / <alpha-value>)",

        // ── User-configurable (set via JS at runtime) ─────────────────────
        "user-primary":    "var(--user-primary)",
        "user-secondary":  "var(--user-secondary)",
        "user-background": "var(--user-background)",
      },

      fontFamily: {
        sans:    ["Nunito", "sans-serif"],
        display: ["Roboto", "sans-serif"],
        body:    ["Quicksand", "sans-serif"],
      },

      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [typography, forms, scrollbarHide],
};
