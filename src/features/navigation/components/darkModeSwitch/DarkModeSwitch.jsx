// DarkModeSwitch.jsx
// English code comments as requested
import PropTypes from "prop-types";
import { Sun, Moon } from "lucide-react";
import clsx from "clsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { useThemeMode } from "../../../../themes/useThemeMode.js";

/**
 * DarkModeSwitch
 * - variant="inline": small icon + text label (hamburger style)
 * - variant="icon": large icon only (desktop footer style)
 * - Fully controlled by ThemeModeProvider (no internal effects)
 */
const DarkModeSwitch = ({
                            variant = "inline",      // "inline" | "icon"
                            iconSize = 32,           // used for variant="icon"
                            inlineIconSize = 16,     // used for variant="inline"
                            className = "",
                            labelClassName = "",
                        }) => {
    const { mode, toggleTheme } = useThemeMode();
    const isDark = mode === "dark";

    const handleKey = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleTheme();
        }
    };

    if (variant === "icon") {
        // Desktop footer style: big icon, centered, no label
        return (
            <CustomBox
                role="button"
                tabIndex={0}
                aria-pressed={isDark}
                onClick={toggleTheme}
                onKeyDown={handleKey}
                className={clsx(
                    "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10 flex items-center justify-center",
                    isDark ? "text-white" : "text-darkBackground",
                    className
                )}
            >
                {isDark ? (
                    <Sun className="mx-auto" style={{ width: iconSize, height: iconSize }} />
                ) : (
                    <Moon className="mx-auto" style={{ width: iconSize, height: iconSize }} fill="currentColor" stroke="none" />
                )}
            </CustomBox>
        );
    }

    // Default: inline hamburger style (icon + label)
    return (
        <CustomBox
            role="button"
            tabIndex={0}
            aria-pressed={isDark}
            onClick={toggleTheme}
            onKeyDown={handleKey}
            className={clsx("flex items-center gap-6 w-full", className)}
        >
            {isDark ? (
                <Sun className="md:w-3 md:h-3" style={{ width: inlineIconSize, height: inlineIconSize }} />
            ) : (
                <Moon className="md:w-3 md:h-3" style={{ width: inlineIconSize, height: inlineIconSize }} fill="currentColor" stroke="none" />
            )}
            <CustomTypography as="span" className={labelClassName}>
                {isDark ? "Light Mode" : "Dark Mode"}
            </CustomTypography>
        </CustomBox>
    );
};

DarkModeSwitch.propTypes = {
    variant: PropTypes.oneOf(["inline", "icon"]),
    iconSize: PropTypes.number,
    inlineIconSize: PropTypes.number,
    className: PropTypes.string,
    labelClassName: PropTypes.string,
};

export default DarkModeSwitch;
