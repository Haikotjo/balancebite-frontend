import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuIcon, Home, Info, LogIn, LogOut, UserPlus, Settings, Soup, Apple, Gauge } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import DarkModeSwitch from "../darkModeSwitch/DarkModeSwitch.jsx";

const HamburgerMenu = ({
                           user,
                           onLogout,
                           onLoginClick,
                           onRegisterClick,
                           variant = "mobile",        // "mobile" | "desktop"
                           iconColor = "text-white",
                           className = "",
                           desktopOffsetY = 12,       // extra downward offset (px) for desktop dropdown
                           desktopOffsetX = 8,        // extra right offset (px) for desktop dropdown
                       }) => {
    const [open, setOpen] = useState(false);
    const [isIconLoaded, setIsIconLoaded] = useState(false);
    const [maxHeight, setMaxHeight] = useState("80vh"); // default cap for scrollable menu
    const isAdmin = user?.roles.includes("ADMIN");
    const menuRef = useRef(null);
    const dropdownRef = useRef(null);
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

    // Recompute a safe max-height when opened or on resize so the dropdown can scroll if needed
    useEffect(() => {
        if (!open) return;

        const computeMaxHeight = () => {
            // After render, measure dropdown top to figure out available space to bottom
            requestAnimationFrame(() => {
                if (!dropdownRef.current) return;
                const rect = dropdownRef.current.getBoundingClientRect();
                const viewportH = window.innerHeight;

                // Available room from dropdown top to viewport bottom minus a small margin
                const available = Math.max(160, viewportH - rect.top - 16);
                // Cap to 80vh so the menu never becomes too tall
                const computed = Math.min(Math.floor(viewportH * 0.8), Math.floor(available));
                setMaxHeight(`${computed}px`);
            });
        };

        computeMaxHeight();
        window.addEventListener("resize", computeMaxHeight);
        return () => window.removeEventListener("resize", computeMaxHeight);
    }, [open]);

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

    // Positioning classes; desktop opens to the right, slightly lower; mobile opens upward right-aligned
    const dropdownPosClasses = isDesktop
        ? "absolute left-full top-1/2"        // Will adjust with inline transform + margins
        : "absolute bottom-full mb-2 right-0";

    // Inline style to nudge desktop dropdown down/right (keeps relative positioning)
    const desktopStyle = isDesktop
        ? {
            marginLeft: `${desktopOffsetX}px`,
            transform: `translateY(calc(-50% + ${desktopOffsetY}px))`,
        }
        : {};

    return (
        <CustomBox ref={menuRef} className={isDesktop ? "relative self-center" : "relative"}>
            {/* Toggle button */}
            <CustomButton
                onClick={() => setOpen(!open)}
                className={`transition-transform duration-700 ease-in-out ${isIconLoaded ? "rotate-[360deg]" : "rotate-0"} ${className}`}
            >
                <MenuIcon className={`w-8 h-8 ${iconColor}`} />
            </CustomButton>

            {/* Dropdown */}
            {open && (
                <CustomBox
                    ref={dropdownRef}
                    className={`${dropdownPosClasses} z-50 w-64 max-w-[90vw] rounded-xl bg-white dark:bg-gray-800 shadow-lg px-4 py-2 overflow-y-auto`} // scrollable
                    style={{ ...desktopStyle, maxHeight }} // enforce scrollable height
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
    desktopOffsetY: PropTypes.number,
    desktopOffsetX: PropTypes.number,
};

export default HamburgerMenu;
