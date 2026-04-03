import PropTypes from "prop-types";
import { Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { useThemeMode } from "../../../../themes/useThemeMode.js";

/**
 * DarkModeSwitch
 * - variant="icon": animated pill toggle (used in NavBar sidebar footer)
 * - variant="inline": icon + text label (used in hamburger menu)
 */
const DarkModeSwitch = ({ variant = "inline", expanded = false, className = "" }) => {
    const { mode, toggleTheme } = useThemeMode();
    const isDark = mode === "dark";

    if (variant === "icon") {
        // Collapsed: centered icon button matching other sidebar icons
        if (!expanded) {
            return (
                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    aria-pressed={isDark}
                    className={clsx(
                        "w-full flex items-center justify-center py-2.5 rounded-md text-white hover:bg-white/10 transition-colors",
                        className
                    )}
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" fill="currentColor" stroke="none" />}
                </button>
            );
        }

        // Expanded: animated pill toggle
        return (
            <div className={clsx("w-full flex items-center gap-3 px-3 py-2.5", className)}>
                <span className="text-white text-sm font-medium whitespace-nowrap">
                    {isDark ? "Light mode" : "Dark mode"}
                </span>
                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    aria-pressed={isDark}
                    className={clsx(
                        "relative shrink-0 w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                        isDark ? "bg-primary/40" : "bg-white/25"
                    )}
                >
                    <span
                        className={clsx(
                            "absolute top-0.5 flex items-center justify-center w-5 h-5 rounded-full shadow transition-all duration-300",
                            isDark ? "translate-x-5 bg-primary text-white" : "translate-x-0.5 bg-white text-app-bar"
                        )}
                    >
                        {isDark
                            ? <Moon className="w-3 h-3" fill="currentColor" stroke="none" />
                            : <Sun className="w-3 h-3" />
                        }
                    </span>
                </button>
            </div>
        );
    }

    // Inline variant: icon + label row
    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
            className={clsx(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-white",
                "hover:bg-white/10 transition-colors text-sm font-medium",
                className
            )}
        >
            {isDark
                ? <Sun className="w-5 h-5 shrink-0" />
                : <Moon className="w-5 h-5 shrink-0" fill="currentColor" stroke="none" />
            }
            <span>{isDark ? "Light mode" : "Dark mode"}</span>
        </button>
    );
};

DarkModeSwitch.propTypes = {
    variant: PropTypes.oneOf(["inline", "icon"]),
    expanded: PropTypes.bool,
    className: PropTypes.string,
};

export default DarkModeSwitch;
