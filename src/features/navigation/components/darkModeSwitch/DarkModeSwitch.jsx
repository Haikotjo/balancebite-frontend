import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import PropTypes from "prop-types";
import { useThemeMode } from "../../../../themes/useThemeMode.js";

const DarkModeSwitch = ({ withLabel = false, hamburgerStyle = false }) => {
    const { mode, toggleTheme } = useThemeMode();

    useEffect(() => {
        const savedMode = localStorage.getItem("theme-mode");
        if (savedMode && savedMode !== mode) {
            toggleTheme();
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("theme-mode", mode);
    }, [mode]);

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

    return (
        <CustomBox className="flex items-center gap-1 cursor-pointer" onClick={toggleTheme}>
            {withLabel && (
                <CustomTypography as="span" className="text-sm text-userText">
                    {mode === "dark" ? "Light" : "Dark"}
                </CustomTypography>
            )}

            <Sun className="text-white w-5 h-5 md:w-4 md:h-4" />
            <CustomBox
                className={`
                    relative 
                    w-10 h-3 
                    rounded-full transition-all duration-300 
                    ${mode === "dark" ? "bg-cardDark" : "bg-gray-200"}
                `}
            >
                <CustomBox
                    className={`
                        absolute top-0.5 left-0.5
                        w-2 h-2 
                        rounded-full shadow-md transition-transform duration-300 
                        ${mode === "dark" ? "bg-white md:translate-x-7" : "bg-gray-500 translate-x-0"}
                    `}
                />
            </CustomBox>
            <Moon className="text-gray-800 fill-gray-800 w-5 h-5 md:w-4 md:h-4" />
        </CustomBox>
    );
};

DarkModeSwitch.propTypes = {
    /** Show text label next to the icon, e.g., for use in hamburger menu */
    withLabel: PropTypes.bool,
    /** Render in simplified hamburger-style (icon + label only) */
    hamburgerStyle: PropTypes.bool,
};

export default DarkModeSwitch;
