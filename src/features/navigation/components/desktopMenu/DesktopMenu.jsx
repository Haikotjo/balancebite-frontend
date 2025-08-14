// DesktopMenu.jsx
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

const DesktopMenu = ({ user, onLogout, onLoginClick, onRegisterClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = user?.roles.includes("ADMIN");
    const { mode, toggleTheme } = useThemeMode();

    // Mark active route
    const isActive = (path) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    return (
        // Root fills the full sidebar height; header at top, footer at bottom
        <CustomBox className="flex h-full min-h-full w-full flex-col justify-between font-body font-bold text-white">

            {/* Header (fixed top) */}
            <CustomBox className="flex items-center justify-center py-4">
                <Logo size={40} className="block text-white" to="/" />
            </CustomBox>

            {/* Middle: evenly distribute 4 sections using a 4-row grid that fills remaining space */}
            <CustomBox className="flex-1 grid grid-rows-4 justify-items-center content-between py-2">
                {/* Section 1: Meals / Diets / Profile menu */}
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

                {/* Section 2: Hamburger (optional extras) */}
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

                {/* Section 3: Profile / Dashboard / Admin */}
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

                {/* Section 4: Home / About / Auth */}
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
            </CustomBox>

            {/* Footer (fixed bottom): theme toggle */}
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
