import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";

import CustomIconButton from "../../layout/CustomIconButton.jsx";
import CustomBox from "../../layout/CustomBox.jsx";
import CustomButton from "../../layout/CustomButton.jsx";
import CustomTypography from "../../layout/CustomTypography.jsx";
import PropTypes from "prop-types";
import {useThemeMode} from "../../../themes/useThemeMode.js";

/**
 * Theme toggle button using `lucid-react` icons.
 * Automatically syncs with `localStorage` to persist the user's preference.
 *
 * Can render as:
 * - A compact icon-only button (`withLabel: false`)
 * - A full-width menu item with label and icon (e.g., for use inside a dropdown or hamburger menu) using `CustomButton` (`withLabel: true`)
 *
 * @component
 * @param {Object} props
 * @param {boolean} [props.withLabel=false] – Whether to display a label next to the icon.
 * @returns {JSX.Element}
 */
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

    // Choose icon based on current mode
    const icon = mode === "dark" ? <Sun size={18} /> : <Moon size={18} />;

    // Render full-width dropdown-style button with icon and label
    if (withLabel) {
        return (
            <CustomButton
                onClick={toggleTheme}
                className="w-full flex items-center justify-start gap-6 px-4 py-4 text-sm text-userText hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                {icon}
                <CustomTypography as="span">
                    {mode === "dark" ? "Light" : "Dark"}
                </CustomTypography>
            </CustomButton>
        );
    }

    // Default icon-only button for inline usage
    return (
        <CustomBox>
            <CustomIconButton
                onClick={toggleTheme}
                icon={icon}
                bgColor="bg-primary/80"
            />
        </CustomBox>
    );
};

DarkModeSwitch.propTypes = {
    /** Show text label next to the icon, e.g., for use in hamburger menu */
    withLabel: PropTypes.bool,
};

export default DarkModeSwitch;
