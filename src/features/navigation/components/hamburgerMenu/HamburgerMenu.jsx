import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuIcon, Home, Info, LogIn, LogOut, UserPlus, Settings, Soup, Apple, Gauge } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import DarkModeSwitch from "../darkModeSwitch/DarkModeSwitch.jsx";

/**
 * Responsive hamburger menu.
 * - Mobile (default): button at bottom bar, dropdown opens upward/right-aligned.
 * - Desktop variant: centered button in sidebar, dropdown opens to the right.
 */
const HamburgerMenu = ({
                           user,
                           onLogout,
                           onLoginClick,
                           onRegisterClick,
                           variant = "mobile",        // "mobile" | "desktop"
                           iconColor = "text-white",  // allow overriding icon color
                           className = "",            // optional extra classes for the toggle button
                       }) => {
    const [open, setOpen] = useState(false);
    const [isIconLoaded, setIsIconLoaded] = useState(false);
    const isAdmin = user?.roles.includes("ADMIN");
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const isDesktop = variant === "desktop";

    const isActive = (path) => location.pathname === path;

    // Simple mount animation for the icon
    useEffect(() => {
        const timer = setTimeout(() => setIsIconLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    // Close on route change
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    // Menu config
    const menuItems = [
        { label: "Home", icon: Home, path: "/" },
        { label: "Dashboard", icon: Gauge, path: "/dashboard" },
        { label: "About", icon: Info, path: "/about" },
        { label: "Meals", icon: Soup, path: "/meals" },
        { label: "Diets", icon: Apple, path: "/diets" },
        isAdmin && { label: "Admin", icon: Settings, path: "/admin" },
        !user && { label: "Login", icon: LogIn, action: onLoginClick },
        !user && { label: "Register", icon: UserPlus, action: onRegisterClick },
        user && { label: "Logout", icon: LogOut, action: onLogout },
    ].filter(Boolean);

    // Positioning: mobile opens upward right-aligned; desktop opens to the right, vertically centered
    const dropdownPosClasses = isDesktop
        ? "absolute left-full top-1/2 -translate-y-1/2 ml-2"
        : "absolute bottom-full mb-2 right-0";

    return (
        <CustomBox ref={menuRef} className={isDesktop ? "relative self-center" : "relative"}>
            {/* Toggle button */}
            <CustomButton
                onClick={() => setOpen(!open)}
                className={`transition-transform duration-700 ease-in-out ${isIconLoaded ? "rotate-[360deg]" : "rotate-0"} ${className}`}
            >
                <MenuIcon className={`w-8 h-8 ${iconColor}`} /> {/* bigger on desktop by default */}
            </CustomButton>

            {/* Dropdown */}
            {open && (
                <CustomBox
                    className={`${dropdownPosClasses} z-50 w-64 max-w-[90vw] rounded-xl bg-white dark:bg-gray-800 shadow-lg px-4 py-2`}
                >
                    {menuItems.map(({ label, icon: Icon, path, action }, index) => (
                        <CustomBox key={label}>
                            <CustomButton
                                onClick={() => {
                                    if (path && !isActive(path)) navigate(path);
                                    if (action) action();
                                    setOpen(false);
                                }}
                                className="w-full flex items-center justify-start gap-6 px-4 py-3 text-sm text-userText hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <Icon className="w-4 h-4 text-[#5b616e] dark:text-[#F9FAFB]" />
                                <CustomTypography as="span">{label}</CustomTypography>
                            </CustomButton>

                            {index < menuItems.length - 1 && (
                                <CustomDivider className="bg-gray-200 dark:bg-gray-600" />
                            )}
                        </CustomBox>
                    ))}

                    {/* Theme toggle */}
                    <CustomDivider className="bg-gray-200 dark:bg-gray-600" />
                    <CustomButton className="w-full flex items-center justify-start gap-6 px-4 py-3 text-sm text-userText hover:bg-gray-100 dark:hover:bg-gray-700">
                        <DarkModeSwitch />
                    </CustomButton>
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
    variant: PropTypes.oneOf(["mobile", "desktop"]),
    iconColor: PropTypes.string,
    className: PropTypes.string,
};

export default HamburgerMenu;
