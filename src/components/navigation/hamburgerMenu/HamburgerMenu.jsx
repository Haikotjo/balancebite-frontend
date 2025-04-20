import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuIcon, Home, Info, LogIn, LogOut, UserPlus } from "lucide-react";
import CustomBox from "../../layout/CustomBox.jsx";
import CustomButton from "../../layout/CustomButton.jsx";
import CustomTypography from "../../layout/CustomTypography.jsx";
import CustomDivider from "../../layout/CustomDivider.jsx";
import { Sun, Moon } from "lucide-react";
import {useThemeMode} from "../../../themes/ThemeProvider.jsx";
import DarkModeSwitch from "../darkModeSwitch/DarkModeSwitch.jsx";

/**
 * A responsive hamburger menu for small screens.
 * Displays a toggle button and a dropdown menu with navigation or auth actions.
 *
 * @component
 * @param {Object} props
 * @param {Object|null} props.user - The current logged-in user, or null if not authenticated.
 * @param {Function} props.onLogout - Callback to handle logout.
 * @param {Function} props.onLoginClick - Callback to navigate to login.
 * @param {Function} props.onRegisterClick - Callback to navigate to registration.
 */
const HamburgerMenu = ({ user, onLogout, onLoginClick, onRegisterClick }) => {
    const [open, setOpen] = useState(false);
    const [isIconLoaded, setIsIconLoaded] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    // Rotate icon on mount for simple animation effect
    useEffect(() => {
        setTimeout(() => setIsIconLoaded(true), 100);
    }, []);

    // Close menu when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const { mode, toggleTheme } = useThemeMode();

    useEffect(() => {
        const savedMode = localStorage.getItem("theme-mode");
        if (savedMode && savedMode !== mode) {
            toggleTheme();
        }
    }, []);

    // Menu item configuration
    const menuItems = [
        { label: "Home", icon: Home, path: "/" },
        { label: "About", icon: Info, path: "/about" },
        !user && { label: "Login", icon: LogIn, action: onLoginClick },
        !user && { label: "Register", icon: UserPlus, action: onRegisterClick },
        user && { label: "Logout", icon: LogOut, action: onLogout },
    ].filter(Boolean);

    return (
        <CustomBox ref={menuRef} className="relative">
            {/* Toggle button */}
            <CustomButton
                onClick={() => setOpen(!open)}
                className={`text-white transition-transform duration-700 ease-in-out ${
                    isIconLoaded ? "rotate-[360deg]" : "rotate-0"
                }`}
            >
                <MenuIcon className="w-6 h-6" />
            </CustomButton>

            {/* Dropdown menu */}
            {open && (
                <CustomBox className="absolute bottom-full mb-1 sm:bottom-auto sm:top-full sm:mt-2 mt-2 left-0 sm:left-auto sm:right-0 min-w-[10rem] max-w-[90vw] rounded-xl bg-white dark:bg-gray-800 shadow-lg z-[999] px-4">
                {menuItems.map(({ label, icon: Icon, path, action }, index) => (
                        <CustomBox key={label}>
                            <CustomButton
                                onClick={() => {
                                    if (path && !isActive(path)) navigate(path);
                                    if (action) action();
                                    setOpen(false);
                                }}
                                className="w-full flex items-center justify-start gap-6 px-4 py-4 text-sm text-userText hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <Icon className="w-4 h-4" />
                                <CustomTypography as="span">{label}</CustomTypography>
                            </CustomButton>

                            {index < menuItems.length - 1 && (
                                <CustomDivider className="bg-gray-200 dark:bg-gray-600" />
                            )}
                        </CustomBox>
                    ))}
                    {/* Divider before the theme toggle */}
                    <CustomDivider className="bg-gray-200 dark:bg-gray-600" />

                    <DarkModeSwitch withLabel />

                </CustomBox>
            )}
        </CustomBox>
    );
};

HamburgerMenu.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        roles: PropTypes.arrayOf(PropTypes.string).isRequired,
        type: PropTypes.string.isRequired,
    }),
    onLogout: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired,
};

export default HamburgerMenu;
