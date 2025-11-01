// src/themes/ThemeModeProvider.jsx
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { ThemeModeContext } from "./ThemeModeContext";

/**
 * Single source of truth for theme mode.
 * - Restores from localStorage or system preference on first mount.
 * - Persists to localStorage on change.
 * - Applies/removes the 'dark' class on <html>.
 */
export const ThemeModeProvider = ({ children }) => {
    // Lazy init: read once from localStorage or system preference
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem("theme-mode");
        if (saved === "light" || saved === "dark") return saved;
        const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
        return prefersDark ? "dark" : "light";
    });

    const toggleTheme = () => setMode((m) => (m === "light" ? "dark" : "light"));

    // Apply to <html> and persist
    useEffect(() => {
        document.documentElement.classList.toggle("dark", mode === "dark");
        localStorage.setItem("theme-mode", mode);
    }, [mode]);

    const value = useMemo(() => ({ mode, toggleTheme }), [mode]);
    return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
};

ThemeModeProvider.propTypes = { children: PropTypes.node.isRequired };
