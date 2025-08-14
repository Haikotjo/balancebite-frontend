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
 * HamburgerMenu
 * - Desktop: dropdown opens to the right, top-aligned with the button, grows downward.
 * - Mobile: dropdown opens upward, right-aligned to the button (unchanged).
 * - Dropdown is scrollable when tall; maxHeight is recomputed on open and resize.
 * - Enter/exit animations for the dropdown; icon rotates on open/close.
 */
const HamburgerMenu = ({
                           user,
                           onLogout,
                           onLoginClick,
                           onRegisterClick,
                           variant = "mobile",        // "mobile" | "desktop"
                           iconColor = "text-white",
                           className = "",
                           desktopOffsetY = 8,        // extra downward offset (px) for desktop dropdown
                           desktopOffsetX = 8,        // extra right offset (px) for desktop dropdown
                       }) => {
    // Mounted/animation states
    const [show, setShow] = useState(false);    // controls whether dropdown is mounted
    const [animIn, setAnimIn] = useState(false); // controls enter/exit classes
    const [mountAnim, setMountAnim] = useState(true); // one-time initial icon spin
    const [maxHeight, setMaxHeight] = useState("80vh");

    const isAdmin = user?.roles.includes("ADMIN");
    const isDesktop = variant === "desktop";

    const menuRef = useRef(null);       // wrapper around button + dropdown
    const posRef = useRef(null);        // outer positioner (used for measuring top)
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    // One-time icon spin on mount (optional flair)
    useEffect(() => {
        const t = setTimeout(() => setMountAnim(false), 700);
        return () => clearTimeout(t);
    }, []);

    // Open/close helpers with exit animation
    const openMenu = () => {
        setShow(true);
        // Wait a frame so CSS transitions can kick in
        requestAnimationFrame(() => setAnimIn(true));
    };
    const closeMenu = () => {
        setAnimIn(false);
        // Unmount after exit animation completes
        setTimeout(() => setShow(false), 200);
    };

    // Close on outside click
    useEffect(() => {
        if (!show) return;
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) closeMenu();
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [show]);

    // Close on route change
    useEffect(() => {
        if (show) closeMenu();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    // Recompute a safe max-height when opened or on resize so the dropdown can scroll if needed
    useEffect(() => {
        if (!show) return;

        const computeMaxHeight = () => {
            // Measure the positioner (outer container that defines top-left)
            requestAnimationFrame(() => {
                if (!posRef.current) return;
                const rect = posRef.current.getBoundingClientRect();
                const viewportH = window.innerHeight;

                // Available room from dropdown's top to the bottom of the viewport, minus small margin
                const available = Math.max(160, viewportH - rect.top - 16);
                // Cap to 80vh so the menu never becomes excessively tall
                const computed = Math.min(Math.floor(viewportH * 0.8), Math.floor(available));
                setMaxHeight(`${computed}px`);
            });
        };

        computeMaxHeight();
        window.addEventListener("resize", computeMaxHeight);
        return () => window.removeEventListener("resize", computeMaxHeight);
    }, [show]);

    // Menu entries
    const menuItems = [
        { label: "Home", icon: Home, path: "/" },
        user && { label: "Dashboard", icon: Gauge, path: "/dashboard" },
        { label: "About", icon: Info, path: "/about" },
        { label: "Meals", icon: Soup, path: "/meals" },
        { label: "Diets", icon: Apple, path: "/diets" },
        isAdmin && { label: "Admin", icon: Settings, path: "/admin" },
        !user && { label: "Login", icon: LogIn, action: onLoginClick },
        !user && { label: "Register", icon: UserPlus, action: onRegisterClick },
        user && { label: "Logout", icon: LogOut, action: onLogout },
    ].filter(Boolean);

    // Positioning classes:
    // - Desktop: right of the button, top-aligned (`top-0`), then nudged down by desktopOffsetY
    // - Mobile: above the button, right-aligned
    const dropdownPosClasses = isDesktop
        ? "absolute left-full top-0"
        : "absolute bottom-full mb-2 right-0";

    // Inline style to nudge desktop dropdown down/right (keeps relative positioning)
    const desktopStyle = isDesktop
        ? {
            marginLeft: `${desktopOffsetX}px`,
            transform: `translateY(${desktopOffsetY}px)`, // top-aligned + push down
        }
        : {};

    // Icon rotation: one-time spin on mount, then 0/90deg on open/close
    const iconTransformClass = mountAnim
        ? "duration-700 rotate-[360deg]"
        : show
            ? "duration-200 rotate-90"
            : "duration-200 rotate-0";

    return (
        <CustomBox ref={menuRef} className={isDesktop ? "relative self-center" : "relative"}>
            {/* Toggle button */}
            <CustomButton
                onClick={() => (show ? closeMenu() : openMenu())}
                className={`transition-transform ease-in-out ${iconTransformClass} ${className}`}
            >
                <MenuIcon className={`w-8 h-8 ${iconColor}`} />
            </CustomButton>

            {/* Dropdown (two layers: positioner -> animated panel) */}
            {show && (
                <CustomBox
                    ref={posRef}
                    className={`${dropdownPosClasses} z-50`}
                    style={{ ...desktopStyle }}
                >
                    <CustomBox
                        className={[
                            "w-64 max-w-[90vw] rounded-xl bg-white dark:bg-gray-800 shadow-lg px-4 py-2 overflow-y-auto",
                            // Enter/exit animation for the panel
                            "transition-[opacity,transform] duration-200 ease-out",
                            animIn ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
                        ].join(" ")}
                        style={{ maxHeight }}
                    >
                        {menuItems.map(({ label, icon: Icon, path, action }, index) => (
                            <CustomBox key={label}>
                                <CustomButton
                                    onClick={() => {
                                        if (path && !isActive(path)) navigate(path);
                                        if (action) action();
                                        closeMenu();
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
