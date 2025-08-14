import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, LogIn, LogOut, Gauge, ShieldUser, Info, Sun, Moon, UserCircle  } from "lucide-react";
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

    const isActive = (path) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    return (
        <CustomBox className="flex flex-col justify-between h-full w-full font-body font-bold text-white">
            {/* Bovenste sectie */}
            <CustomBox className="flex flex-col gap-y-2">
                {/* Logo */}
                <CustomBox className="flex flex-col items-center justify-center py-4 w-auto">
                    <Logo size={40} className="block text-white" to="/" />
                </CustomBox>

                {/* MealsMenu */}
                <MealsMenu compact />

                {/* DietsMenu */}
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

            <CustomBox className="flex flex-col items-center gap-y-2 mb-4">
                <CustomBox className="mt-2 self-center">
                    <HamburgerMenu
                        user={user}
                        onLogout={onLogout}
                        onLoginClick={onLoginClick}
                        onRegisterClick={onRegisterClick}
                        variant="desktop"
                        iconColor="text-white"
                    />
                </CustomBox>

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

                {/* Profile (icoon) */}
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


                {/* Auth fallback */}
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
