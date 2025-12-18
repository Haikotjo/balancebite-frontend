// src/features/navbar/components/desktopMenuMd/DesktopMenuMd.jsx
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Home,
    LogIn,
    LogOut,
    Gauge,
    ShieldUser,
    Info,
    Apple,
    UserCircle,
} from "lucide-react";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTooltip from "../../../../components/layout/CustomTooltip.jsx";
import Logo from "../../../../components/logo/Logo.jsx";
import DarkModeSwitch from "../darkModeSwitch/DarkModeSwitch.jsx";

import MealsMenu from "../mealsMenu/MealsMenu.jsx";
import DietsMenu from "../dietsMenu/DietsMenu.jsx";
import ProfileMenu from "../profileMenu/ProfileMenu.jsx";
import HamburgerMenu from "../hamburgerMenu/HamburgerMenu.jsx";
import NavItem from "../navItem/NavItem.jsx";

/**
 * DesktopMenuMd - Sidebar navigation for md screens (md -> < lg).
 */
const DesktopMenuMd = ({ user, onLogout, onLoginClick, onRegisterClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = !!user && Array.isArray(user.roles) && user.roles.includes("ADMIN");

    const isActive = (path) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    return (
        <CustomBox className="hidden md:flex lg:hidden h-full w-full flex-col justify-between font-body font-bold">
            {/* Header: logo */}
            <CustomBox className="flex items-center justify-center pt-4">
                <Logo size={30} className="block text-white" to="/" />
            </CustomBox>

            {/* Middle: groups with flex-1 spacers */}
            <CustomBox className="flex-1 flex flex-col items-center">
                <CustomBox className="flex-1" />

                {/* Hamburger */}
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

                <CustomBox className="flex-1" />

                {/* Meals / Diets / Profile */}
                <CustomBox className="flex flex-col items-center gap-3">
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

                <CustomBox className="flex-1" />

                <>
                    <CustomBox className="flex flex-col items-center gap-1">
                        {/* Home */}
                        <NavItem
                            label="Home"
                            active={isActive("/")}
                            onClick={() => navigate("/")}
                            icon={<Home className="w-6 h-6" />}
                        />

                        {/* About */}
                        <NavItem
                            label="About"
                            active={isActive("/about")}
                            onClick={() => navigate("/about")}
                            icon={<Info className="w-6 h-6" />}
                        />

                        <CustomBox className="mb-2" />

                        <NavItem
                            label="Ingredients"
                            active={isActive("/ingredients")}
                            onClick={() => navigate("/ingredients")}
                            icon={<Apple className="w-6 h-6" />}
                        />

                        <NavItem
                            label="Profile"
                            active={isActive("/profile")}
                            onClick={() => (user ? navigate("/profile") : onLoginClick())}
                            icon={<UserCircle className="w-6 h-6" />}
                            className={!user ? "opacity-50 hover:bg-transparent" : ""}
                        />



                        <NavItem
                            label="Dashboard"
                            active={isActive("/dashboard")}
                            onClick={() => (user ? navigate("/dashboard") : onLoginClick())}
                            icon={<Gauge className="w-6 h-6" />}
                            className={!user ? "opacity-50 hover:bg-transparent" : ""}
                        />



                        {isAdmin && (
                            <NavItem
                                label="Admin"
                                active={isActive("/admin")}
                                onClick={() => navigate("/admin")}
                                icon={<ShieldUser className="w-6 h-6" />}
                            />
                        )}

                    </CustomBox>

                    <CustomBox className="flex-1" />
                </>


                {/* Auth group */}
                <CustomBox className="flex flex-col items-center">
                    {!user ? (
                        <NavItem
                            label="Sign in"
                            active={false}
                            onClick={onLoginClick}
                            icon={<LogIn className="w-8 h-8" />}
                        />
                    ) : (
                        <NavItem
                            label="Log out"
                            active={false}
                            onClick={onLogout}
                            icon={<LogOut className="w-8 h-8" />}
                        />
                    )}
                </CustomBox>

                <CustomBox className="flex-1" />
            </CustomBox>

            {/* Footer: theme switch */}
            <CustomTooltip text="Toggle theme" position="right" >
                <DarkModeSwitch variant="icon" iconSize={32} className="mb-2"/>
            </CustomTooltip>
        </CustomBox>
    );
};

DesktopMenuMd.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string,
        roles: PropTypes.arrayOf(PropTypes.string),
        type: PropTypes.string,
    }),
    onLogout: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired,
};

export default DesktopMenuMd;
