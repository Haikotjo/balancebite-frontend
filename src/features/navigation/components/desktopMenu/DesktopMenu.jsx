// DesktopMenu.jsx
import {useRef} from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Home,
    LogIn,
    LogOut,
    Info,
    Apple,
} from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import clsx from "clsx";
import CustomTooltip from "../../../../components/layout/CustomTooltip.jsx";
import MealsMenu from "../mealsMenu/MealsMenu.jsx";
import DietsMenu from "../dietsMenu/DietsMenu.jsx";
import ProfileMenu from "../profileMenu/ProfileMenu.jsx";
import HamburgerMenu from "../hamburgerMenu/HamburgerMenu.jsx";
import Logo from "../../../../components/logo/Logo.jsx";
import DarkModeSwitch from "../darkModeSwitch/DarkModeSwitch.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import NavItem from "../navItem/NavItem.jsx";

const DesktopMenu = ({ user, onLogout, onLoginClick, onRegisterClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const hamburgerRef = useRef(null);


    const isActive = (path) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    // ---- lg+ NavItem component ----
    return (
        <CustomBox className="flex h-full min-h-full w-full flex-col text-white">

            <CustomBox className="hidden lg:flex h-full w-full flex-col justify-between text-white">
                {/* Top: logo */}
                <CustomBox className="flex items-center justify-center pt-4 pb-2">
                    <Logo size={40} className="block text-white" to="/" />
                </CustomBox>

                {/* Middle: main navigation */}
                <CustomBox className="flex-1 flex flex-col gap-2 items-stretch px-1">

                    {/* Menu met label */}

                    <CustomBox
                        onClick={() => hamburgerRef.current.toggle()}
                        className={clsx(
                            "w-full rounded-md cursor-pointer",
                            "flex items-center justify-center lg:justify-start gap-3",
                            "transition-all hover:bg-white/10"
                        )}
                    >
                        <HamburgerMenu
                            ref={hamburgerRef}
                            user={user}
                            onLogout={onLogout}
                            onLoginClick={onLoginClick}
                            onRegisterClick={onRegisterClick}
                            variant="desktop"
                            iconColor="text-white"
                        />
                        <CustomTypography bold color="white" className="hidden lg:inline text-sm">
                            Menu
                        </CustomTypography>
                    </CustomBox>

                    {/* Home */}
                    <NavItem
                        label="Home"
                        active={isActive("/")}
                        onClick={() => navigate("/")}
                        icon={<Home className="w-6 h-6" />}
                    />

                    {/* Meals / Diets / Profile dropdowns (compact icon menus) */}
                    <CustomBox className="flex flex-col items-center gap-1 mt-1 mb-1">
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

                    {/* Ingredients */}
                    <NavItem
                        label="Ingredients"
                        active={isActive("/ingredients")}
                        onClick={() => navigate("/ingredients")}
                        icon={<Apple className="w-6 h-6" />}
                    />

                    {/* About */}
                    <NavItem
                        label="About"
                        active={isActive("/about")}
                        onClick={() => navigate("/about")}
                        icon={<Info className="w-6 h-6" />}
                    />

                </CustomBox>

                {/* Auth group */}
                <CustomBox className="flex flex-col gap-3 pb-4 px-1">

                    {!user ? (
                        <NavItem
                            label="Sign in"
                            active={false}
                            onClick={onLoginClick}
                            icon={<LogIn className="w-6 h-6" />}
                        />
                    ) : (
                        <NavItem
                            label="Log out"
                            active={false}
                            onClick={onLogout}
                            icon={<LogOut className="w-6 h-6" />}
                        />
                    )}

                    {/* Footer: theme switch */}
                    <CustomTooltip text="Toggle theme" position="right">
                        <DarkModeSwitch variant="icon" iconSize={28} />
                    </CustomTooltip>
                </CustomBox>
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
