// English code comments as requested
import { useEffect, forwardRef } from "react";
import { Sun, Moon } from "lucide-react";
import PropTypes from "prop-types";
import { useThemeMode } from "../../../../themes/useThemeMode.js";

const DarkModeSwitch = forwardRef(function DarkModeSwitch(
    { hamburgerStyle = false, className = "" , ...props},
    ref
) {
    const { mode, toggleTheme } = useThemeMode();

    // Restore saved mode on mount
    useEffect(() => {
        const savedMode = localStorage.getItem("theme-mode");
        if (savedMode && savedMode !== mode) {
            toggleTheme();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Persist mode on change
    useEffect(() => {
        localStorage.setItem("theme-mode", mode);
    }, [mode]);

    if (hamburgerStyle) {
        return (
            <button
                type="button"
                ref={ref}
                onClick={toggleTheme}
                className={`flex items-center gap-6 w-full cursor-pointer select-none ${className}`}
                {...props}
            >
                {mode === "dark" ? (
                    <Sun className="w-4 h-4 text-white md:w-3 md:h-3" />
                ) : (
                    <Moon className="w-4 h-4 text-gray-800 md:w-3 md:h-3" fill="currentColor" stroke="none" />
                )}
                <span className="font-medium text-sm">{mode === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>
        );
    }

    // Default: icon-only, no text, no slider
    return (
        <button
            type="button"
            ref={ref}
            onClick={toggleTheme}
            className={`inline-flex items-center justify-center cursor-pointer select-none ${className}`}
            aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            {...props}
        >
            {mode === "dark" ? (
                <Sun className="w-8 h-8 mx-auto text-white" />
            ) : (
                <Moon className="w-8 h-8 mx-auto text-gray-800" fill="currentColor" stroke="none" />
            )}
        </button>
    );
});

DarkModeSwitch.propTypes = {
    /** Render simplified hamburger-style (icon + label) */
    hamburgerStyle: PropTypes.bool,
    /** Optional extra classes for the root button */
    className: PropTypes.string,
};

export default DarkModeSwitch;
