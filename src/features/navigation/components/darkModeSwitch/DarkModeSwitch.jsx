import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import PropTypes from "prop-types";
import { useThemeMode } from "../../../../themes/useThemeMode.js";

const DarkModeSwitch = ({ withLabel = false, hamburgerStyle = false }) => {
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

    // Hamburger style: small icon + optional text label (unchanged)
    if (hamburgerStyle) {
        return (
            <CustomBox className="flex items-center gap-6 w-full" onClick={toggleTheme}>
                {mode === "dark" ? (
                    <Sun className="w-4 h-4 text-white md:w-3 md:h-3" />
                ) : (
                    <Moon className="w-4 h-4 text-gray-800 md:w-3 md:h-3" />
                )}
                <CustomTypography as="span">
                    {mode === "dark" ? "Light Mode" : "Dark Mode"}
                </CustomTypography>
            </CustomBox>
        );
    }

    // Default style: icon-only (bigger), no text, no slider
    return (
        <CustomBox
            className="inline-flex items-center justify-center cursor-pointer select-none"
            onClick={toggleTheme}
            role="button"
            aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={mode === "dark" ? "Light mode" : "Dark mode"}
        >
            {mode === "dark" ? (
                <Sun className="w-7 h-7 md:w-6 md:h-6 text-white" />
            ) : (
                <Moon
                    className="w-7 h-7 md:w-6 md:h-6 text-gray-800"
                    fill="currentColor"
                    stroke="none"
                />
            )}
        </CustomBox>
    );
};

DarkModeSwitch.propTypes = {
    /** Show text label (only used in hamburgerStyle) */
    withLabel: PropTypes.bool,
    /** Render simplified hamburger-style (icon + label) */
    hamburgerStyle: PropTypes.bool,
};

export default DarkModeSwitch;
