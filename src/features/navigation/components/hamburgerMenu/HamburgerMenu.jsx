import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import {
    MenuIcon, Home, Info, LogIn, LogOut, UserPlus, Settings,
    Soup, CookingPot, Gauge, Apple
} from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import DarkModeSwitch from "../darkModeSwitch/DarkModeSwitch.jsx";

const HamburgerMenu = forwardRef(({
                                      user,
                                      onLogout,
                                      onLoginClick,
                                      onRegisterClick,
                                      variant = "mobile",
                                      iconColor = "text-white",
                                      className = "",
                                      desktopOffsetY = 8,
                                      desktopOffsetXmd = 16,
                                      desktopOffsetXlg = 124,
                                  }, ref) => {

    const [show, setShow] = useState(false);
    const [animIn, setAnimIn] = useState(false);
    const [mountAnim, setMountAnim] = useState(true);
    const [maxHeight, setMaxHeight] = useState("80vh");

    const menuRef = useRef(null);
    const posRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const isDesktop = variant === "desktop";
    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const t = setTimeout(() => setMountAnim(false), 700);
        return () => clearTimeout(t);
    }, []);

    const openMenu = () => {
        setShow(true);
        requestAnimationFrame(() => setAnimIn(true));
    };

    const closeMenu = () => {
        setAnimIn(false);
        setTimeout(() => setShow(false), 200);
    };

    useImperativeHandle(ref, () => ({
        toggle() {
            show ? closeMenu() : openMenu();
        }
    }));

    useEffect(() => {
        if (!show) return;
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) closeMenu();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [show]);

    useEffect(() => {
        if (show) closeMenu();
    }, [location.pathname]);

    useEffect(() => {
        if (!show) return;
        requestAnimationFrame(() => {
            if (!posRef.current) return;
            const rect = posRef.current.getBoundingClientRect();
            const viewport = window.innerHeight;
            const available = Math.max(160, viewport - rect.top - 16);
            setMaxHeight(`${Math.min(Math.floor(viewport * 0.8), available)}px`);
        });
    }, [show]);

    const menuItems = [
        { label: "Home", icon: Home, path: "/" },
        user && { label: "Dashboard", icon: Gauge, path: "/dashboard" },
        { label: "About", icon: Info, path: "/about" },
        { label: "Meals", icon: Soup, path: "/meals" },
        { label: "Diets", icon: CookingPot, path: "/diets" },
        { label: "Ingredients", icon: Apple, path: "/ingredients" },
        user?.roles?.includes("ADMIN") && { label: "Admin", icon: Settings, path: "/admin" },
        !user && { label: "Login", icon: LogIn, action: onLoginClick },
        !user && { label: "Register", icon: UserPlus, action: onRegisterClick },
        user && { label: "Logout", icon: LogOut, action: onLogout },
    ].filter(Boolean);

    return (
        <CustomBox ref={menuRef} className="relative">
            <CustomButton
                onClick={() => (show ? closeMenu() : openMenu())}
                className={`transition-transform ${className} ${
                    mountAnim ? "duration-700 rotate-[360deg]" :
                        show ? "duration-200 rotate-90" : "duration-200 rotate-0"
                }`}
            >
                <MenuIcon className={`w-8 h-8 ${iconColor}`} />
            </CustomButton>

            {show && (
                <CustomBox
                    ref={posRef}
                    className={`${isDesktop ? "absolute left-full top-0" : "absolute bottom-full mb-2 right-0"} z-50`}
                    style={
                        isDesktop
                            ? {
                                marginLeft:
                                    window.innerWidth < 1024
                                        ? desktopOffsetXmd
                                        : desktopOffsetXlg,
                                transform: `translateY(${desktopOffsetY}px)`
                            }
                            : {}
                    }

                >
                    <CustomBox
                        className={`w-64 max-w-[90vw] rounded-xl bg-white dark:bg-gray-800 shadow-lg overflow-y-auto
                            transition-all duration-200 ease-out
                            ${animIn ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                        style={{ maxHeight }}
                    >
                        {menuItems.map(({ label, icon: Icon, path, action }, i) => {
                            const active = path && isActive(path);
                            return (
                                <CustomBox key={label}>
                                    <CustomButton
                                        onClick={() => {
                                            if (path && !active) navigate(path);
                                            if (action) action();
                                            closeMenu();
                                        }}
                                        className={`w-full flex items-center gap-6 px-4 py-3 text-sm
                                            ${active ? "bg-gray-100 dark:bg-gray-700" : ""}
                                            hover:bg-gray-100 dark:hover:bg-gray-700`}
                                    >
                                        <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-lightText dark:text-darkText"}`} />
                                        <CustomTypography
                                            className={`${active ? "text-primary dark:text-primary" : "text-lightText dark:text-darkText"}`}
                                        >
                                            {label}
                                        </CustomTypography>
                                    </CustomButton>

                                    {i < menuItems.length - 1 && (
                                        <CustomDivider className="bg-gray-200 dark:bg-gray-600" />
                                    )}
                                </CustomBox>
                            );
                        })}

                        <CustomDivider className="bg-gray-200 dark:bg-gray-600" />
                        <CustomButton className="w-full flex items-center gap-6 px-4 py-3">
                            <DarkModeSwitch />
                        </CustomButton>
                    </CustomBox>
                </CustomBox>
            )}
        </CustomBox>
    );
});

HamburgerMenu.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string,
        roles: PropTypes.arrayOf(PropTypes.string),
        type: PropTypes.string,
    }),
    onLogout: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(["mobile", "desktop"]),
    iconColor: PropTypes.string,
    className: PropTypes.string,
    desktopOffsetY: PropTypes.number,
    desktopOffsetXmd: PropTypes.number,
    desktopOffsetXlg: PropTypes.number,
};

HamburgerMenu.displayName = "HamburgerMenu";

export default HamburgerMenu;

