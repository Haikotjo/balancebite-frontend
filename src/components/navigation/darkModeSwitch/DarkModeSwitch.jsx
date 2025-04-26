import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";

import CustomBox from "../../layout/CustomBox.jsx";
import CustomTypography from "../../layout/CustomTypography.jsx";
import PropTypes from "prop-types";
import { useThemeMode } from "../../../themes/useThemeMode.js";

const DarkModeSwitch = ({ withLabel = false }) => {
    const { mode, toggleTheme } = useThemeMode();

    // Restore saved mode from localStorage on mount
    useEffect(() => {
        const savedMode = localStorage.getItem("theme-mode");
        if (savedMode && savedMode !== mode) {
            toggleTheme();
        }
    }, []);

    // Persist mode to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("theme-mode", mode);
    }, [mode]);

    return (
        <CustomBox className="flex items-center gap-1">
            {withLabel && (
                <CustomTypography as="span" className="text-sm text-userText">
                    {mode === "dark" ? "Light" : "Dark"}
                </CustomTypography>
            )}

            <Sun size={18} className="text-white" />

            <CustomBox
                onClick={toggleTheme}
                className={`
        relative w-10 h-4 rounded-full cursor-pointer transition-all duration-300 
        ${mode === "dark" ? "bg-cardDark" : "bg-gray-200"}
    `}
            >
                <CustomBox
                    className={`
            absolute top-1 left-1 w-2 h-2 rounded-full shadow-md transition-transform duration-300 
            ${mode === "dark" ? "bg-white translate-x-6" : "bg-gray-500 translate-x-0"}
        `}
                />
            </CustomBox>


            <Moon size={18} className="text-gray-500 fill" />
        </CustomBox>
    );
};

DarkModeSwitch.propTypes = {
    /** Show text label next to the icon, e.g., for use in hamburger menu */
    withLabel: PropTypes.bool,
};

export default DarkModeSwitch;
