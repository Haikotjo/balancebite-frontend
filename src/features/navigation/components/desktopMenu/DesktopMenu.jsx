import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, LogIn, LogOut, Gauge, ShieldUser, Info, Sun, Moon } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import clsx from "clsx";
import CustomTooltip from "../../../../components/layout/CustomTooltip.jsx";
import MealsMenu from "../mealsMenu/MealsMenu.jsx";
import DietsMenu from "../dietsMenu/DietsMenu.jsx";
import ProfileMenu from "../profileMenu/ProfileMenu.jsx";
import HamburgerMenu from "../hamburgerMenu/HamburgerMenu.jsx"; // <-- add
import { useThemeMode } from "../../../../themes/useThemeMode.js";

const DesktopMenu = ({ user, onLogout, onLoginClick, onRegisterClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = user?.roles.includes("ADMIN");
    const { mode, toggleTheme } = useThemeMode();

    // Helper: mark active route
    const isActive = (path) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    return (
        <CustomBox className="flex flex-col gap-y-2 w-full font-body font-bold text-white">
            {/* Home */}
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

            {/* About */}
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

            <MealsMenu compact />
            <DietsMenu compact />

            {/* Profile */}
            <ProfileMenu
                compact
                user={user}
                onLogout={onLogout}
                onLoginClick={onLoginClick}
                onRegisterClick={onRegisterClick}
                text="Profile"
            />

            {/* Dashboard */}
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

            {/* Admin */}
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

            {/* Auth fallback (optional) */}
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

            {/* Theme toggle */}
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

            {/* HamburgerMenu */}
            <CustomBox className="mt-2 self-center">
                <HamburgerMenu
                    user={user}
                    onLogout={onLogout}
                    onLoginClick={onLoginClick}
                    onRegisterClick={onRegisterClick}
                    variant="desktop"         // ← activeert centreren + rechts openen
                    iconColor="text-white"
                />
            </CustomBox>

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
