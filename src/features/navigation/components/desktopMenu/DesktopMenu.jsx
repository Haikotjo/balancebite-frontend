// DesktopMenu.jsx
import { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, LogIn, LogOut, Gauge, ShieldUser, Info, Sun, Moon, UserCircle } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import clsx from "clsx";
import CustomTooltip from "../../../../components/layout/CustomTooltip.jsx";
import MealsMenu from "../mealsMenu/MealsMenu.jsx";
import DietsMenu from "../dietsMenu/DietsMenu.jsx";
import ProfileMenu from "../profileMenu/ProfileMenu.jsx";
import HamburgerMenu from "../hamburgerMenu/HamburgerMenu.jsx";
import { useThemeMode } from "../../../../themes/useThemeMode.js";
import Logo from "../../../../components/logo/Logo.jsx";

// Small hook to track viewport height (used to hide items below a threshold)
function useViewportHeight() {
    const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 0);
    useEffect(() => {
        const onResize = () => setVh(window.innerHeight);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);
    return vh;
}

const DesktopMenu = ({ user, onLogout, onLoginClick, onRegisterClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = !!user && Array.isArray(user.roles) && user.roles.includes("ADMIN");
    const { mode, toggleTheme } = useThemeMode();
    const vh = useViewportHeight();

    // Hide some icons when the available height is tight
    const isShort = vh < 742;

    // Mark active route
    const isActive = (path) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    // ----- Build groups in the desired fixed order -----
    // 1) Hamburger (always after logo)
    const GroupHamburger = (
        <CustomBox className="flex flex-col items-center">
            <HamburgerMenu
                user={user}
                onLogout={onLogout}
                onLoginClick={onLoginClick}
                onRegisterClick={onRegisterClick}
                variant="desktop"
                iconColor="text-white"
            />
        </CustomBox>
    );

    // 2) Meals / Diets / Profile dropdowns
    const GroupMenus = (
        <CustomBox className="flex flex-col items-center gap-1">
            <MealsMenu compact />
            <DietsMenu compact />
            <ProfileMenu
                compact
                user={user}
                onLogout={onLogout}
                onLoginClick={onLoginClick}
                onRegisterClick={onRegisterClick}
                text="Profile"
            />
        </CustomBox>
    );

    // 3) Profile / Dashboard / Admin (hidden when short)
    const GroupPrimary = isShort ? null : (
        <CustomBox className="flex flex-col items-center">
            <CustomTooltip text="Profile" position="right">
                <CustomBox
                    onClick={() => (user ? navigate("/profile") : onLoginClick())}
                    className={clsx(
                        "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                        isActive("/profile") ? "text-primary" : "text-white"
                    )}
                    title={user ? "Open profile" : "Login/Register"}
                >
                    <UserCircle className="w-8 h-8 mx-auto" />
                </CustomBox>
            </CustomTooltip>

            {user && (
                <CustomTooltip text="Dashboard" position="right">
                    <CustomBox
                        onClick={() => navigate("/dashboard")}
                        className={clsx(
                            "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                            isActive("/dashboard") ? "text-primary" : "text-white"
                        )}
                    >
                        <Gauge className="w-8 h-8 mx-auto" />
                    </CustomBox>
                </CustomTooltip>
            )}

            {isAdmin && (
                <CustomTooltip text="Admin" position="right">
                    <CustomBox
                        onClick={() => navigate("/admin")}
                        className={clsx(
                            "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                            isActive("/admin") ? "text-primary" : "text-white"
                        )}
                    >
                        <ShieldUser className="w-8 h-8 mx-auto" />
                    </CustomBox>
                </CustomTooltip>
            )}
        </CustomBox>
    );

    // 4) Home / About (hidden when short)
    const GroupSecondary = isShort ? null : (
        <CustomBox className="flex flex-col items-center">
            <CustomTooltip text="Home" position="right">
                <CustomBox
                    onClick={() => navigate("/")}
                    className={clsx(
                        "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                        isActive("/") ? "text-primary" : "text-white"
                    )}
                >
                    <Home className="w-8 h-8 mx-auto" />
                </CustomBox>
            </CustomTooltip>

            <CustomTooltip text="About" position="right">
                <CustomBox
                    onClick={() => navigate("/about")}
                    className={clsx(
                        "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                        isActive("/about") ? "text-primary" : "text-white"
                    )}
                >
                    <Info className="w-8 h-8 mx-auto" />
                </CustomBox>
            </CustomTooltip>
        </CustomBox>
    );

    // 5) Auth (always visible)
    const GroupAuth = (
        <CustomBox className="flex flex-col items-center">
            {!user ? (
                <CustomTooltip text="Sign in" position="right">
                    <CustomBox
                        onClick={onLoginClick}
                        className="w-full cursor-pointer p-2 rounded-md transition-all hover:bg-white/10"
                    >
                        <LogIn className="w-8 h-8 mx-auto" />
                    </CustomBox>
                </CustomTooltip>
            ) : (
                <CustomTooltip text="Log out" position="right">
                    <CustomBox
                        onClick={onLogout}
                        className="w-full cursor-pointer p-2 rounded-md hover:bg-white/10"
                    >
                        <LogOut className="w-8 h-8 mx-auto" />
                    </CustomBox>
                </CustomTooltip>
            )}
        </CustomBox>
    );

    // Compose only the visible groups in fixed order
    const groups = [GroupHamburger, GroupMenus, GroupPrimary, GroupSecondary, GroupAuth].filter(Boolean);

    return (
        // Sidebar container
        <CustomBox className="flex h-full min-h-full w-full flex-col justify-between font-body font-bold text-white">
            {/* Header (fixed top): Logo */}
            <CustomBox className="flex items-center justify-center py-4">
                <Logo size={40} className="block text-white" to="/" />
            </CustomBox>

            {/* Middle: evenly distribute groups using flex spacers */}
            <CustomBox className="flex-1 flex flex-col items-center">
                {/* Spacer before the first group to match the pattern */}
                <div className="flex-1" />

                {groups.map((node, idx) => (
                    <Fragment key={idx}>
                        {node}
                        {/* Spacer between groups (equal space) */}
                        {idx < groups.length - 1 && <div className="flex-1" />}
                    </Fragment>
                ))}

                {/* Spacer after the last group so spacing above Theme equals others; Theme stays at bottom */}
                <div className="flex-1" />
            </CustomBox>

            {/* Footer (fixed bottom): theme toggle) */}
            <CustomTooltip text="Toggle theme" position="right">
                <CustomBox
                    onClick={toggleTheme}
                    className={clsx(
                        "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                        mode === "dark" ? "text-white" : "text-gray-800"
                    )}
                >
                    {mode === "dark" ? (
                        <Sun className="w-8 h-8 mx-auto" />
                    ) : (
                        <Moon className="w-8 h-8 mx-auto" fill="currentColor" stroke="none" />
                    )}
                </CustomBox>
            </CustomTooltip>
        </CustomBox>
    );
};

DesktopMenu.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        roles: PropTypes.arrayOf(PropTypes.string).isRequired,
        type: PropTypes.string.isRequired,
    }),
    onLogout: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired,
};

export default DesktopMenu;
