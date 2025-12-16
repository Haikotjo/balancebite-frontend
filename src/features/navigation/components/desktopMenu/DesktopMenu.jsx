// DesktopMenu.jsx
import {useEffect, useRef, useState} from "react";
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
import clsx from "clsx";
import CustomTooltip from "../../../../components/layout/CustomTooltip.jsx";
import MealsMenu from "../mealsMenu/MealsMenu.jsx";
import DietsMenu from "../dietsMenu/DietsMenu.jsx";
import ProfileMenu from "../profileMenu/ProfileMenu.jsx";
import HamburgerMenu from "../hamburgerMenu/HamburgerMenu.jsx";
import Logo from "../../../../components/logo/Logo.jsx";
import DarkModeSwitch from "../darkModeSwitch/DarkModeSwitch.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

// ---- Hook voor md-layout (oude versie) ----
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
    const vh = useViewportHeight();
    const hamburgerRef = useRef(null);

    const isAdmin =
        !!user && Array.isArray(user.roles) && user.roles.includes("ADMIN");
    const isShort = vh < 742;

    const isActive = (path) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    // ---- lg+ NavItem component (nieuwe versie) ----
    const NavItem = ({ icon, label, active, onClick }) => (
        <CustomTooltip text={label} position="right">
            <button
                type="button"
                onClick={onClick}
                className={clsx(
                    "w-full cursor-pointer rounded-md px-3 py-2",
                    "flex items-center justify-center lg:justify-start gap-3",
                    "transition-all hover:bg-white/10",
                    active && "bg-white/25"
                )}
            >
                <span className="flex items-center justify-center">
                    {icon}
                </span>
                <span className="hidden lg:inline text-sm font-medium">
                    {label}
                </span>
            </button>
        </CustomTooltip>
    );

    NavItem.propTypes = {
        icon: PropTypes.node.isRequired,
        label: PropTypes.string.isRequired,
        active: PropTypes.bool,
        onClick: PropTypes.func.isRequired,
    };

    // ---------------- RENDER ----------------
    return (
        <CustomBox className="flex h-full min-h-full w-full flex-col text-white">
            {/* md layout: OUDE versie met groepen + spacers */}
            <CustomBox className="hidden md:flex lg:hidden h-full w-full flex-col justify-between font-body font-bold">
                {/* Header: logo */}
                <CustomBox className="flex items-center justify-center pt-4">
                    <Logo size={40} className="block text-white" to="/" />
                </CustomBox>

                {/* Midden: groepen met flex-1 spacers */}
                <CustomBox className="flex-1 flex flex-col items-center">

                    <CustomBox className="flex-1" />
                    {/* 1) Hamburger */}
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

                    {/* 2) Meals / Diets / Profile / Ingredients */}
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

                    {!isShort && <CustomBox className="flex-1" />}

                    {/* 3) Profile / Dashboard / Admin (hidden when short) */}
                    {!isShort && (
                        <>
                            <CustomBox className="flex flex-col items-center">
                                <CustomTooltip text="Ingredients" position="right">
                                    <CustomBox
                                        onClick={() => navigate("/ingredients")}
                                        className={clsx(
                                            "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                                            isActive("/ingredients")
                                                ? "text-primary"
                                                : "text-white"
                                        )}
                                    >
                                        <Apple className="w-6 h-6 mx-auto" />
                                    </CustomBox>
                                </CustomTooltip>
                                <CustomTooltip text="Profile" position="right">
                                    <CustomBox
                                        onClick={() =>
                                            user ? navigate("/profile") : onLoginClick()
                                        }
                                        className={clsx(
                                            "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                                            isActive("/profile")
                                                ? "text-primary"
                                                : "text-white"
                                        )}
                                        title={user ? "Open profile" : "Login/Register"}
                                    >
                                        <UserCircle className="w-6 h-6 mx-auto" />
                                    </CustomBox>
                                </CustomTooltip>

                                {user && (
                                    <CustomTooltip text="Dashboard" position="right">
                                        <CustomBox
                                            onClick={() => navigate("/dashboard")}
                                            className={clsx(
                                                "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                                                isActive("/dashboard")
                                                    ? "text-primary"
                                                    : "text-white"
                                            )}
                                        >
                                            <Gauge className="w-6 h-6 mx-auto" />
                                        </CustomBox>
                                    </CustomTooltip>
                                )}

                                {isAdmin && (
                                    <CustomTooltip text="Admin" position="right">
                                        <CustomBox
                                            onClick={() => navigate("/admin")}
                                            className={clsx(
                                                "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                                                isActive("/admin")
                                                    ? "text-primary"
                                                    : "text-white"
                                            )}
                                        >
                                            <ShieldUser className="w-6 h-6 mx-auto" />
                                        </CustomBox>
                                    </CustomTooltip>
                                )}
                            </CustomBox>

                            <CustomBox className="flex-1" />

                            {/* 4) Home / About */}
                            <CustomBox className="flex flex-col items-center">
                                <CustomTooltip text="Home" position="right">
                                    <CustomBox
                                        onClick={() => navigate("/")}
                                        className={clsx(
                                            "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                                            isActive("/")
                                                ? "text-primary"
                                                : "text-white"
                                        )}
                                    >
                                        <Home className="w-6 h-6 mx-auto" />
                                    </CustomBox>
                                </CustomTooltip>

                                <CustomTooltip text="About" position="right">
                                    <CustomBox
                                        onClick={() => navigate("/about")}
                                        className={clsx(
                                            "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                                            isActive("/about")
                                                ? "text-primary"
                                                : "text-white"
                                        )}
                                    >
                                        <Info className="w-6 h-6 mx-auto" />
                                    </CustomBox>
                                </CustomTooltip>

                            </CustomBox>

                            <CustomBox className="flex-1" />
                        </>
                    )}

                    {/* 5) Auth group */}
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

                    <CustomBox className="flex-1" />
                </CustomBox>

                {/* Footer: theme switch */}
                <CustomTooltip text="Toggle theme" position="right">
                    <DarkModeSwitch variant="icon" iconSize={32} />
                </CustomTooltip>
            </CustomBox>

            {/* lg+ layout: NIEUWE versie met NavItem + labels */}
            <CustomBox className="hidden lg:flex h-full w-full flex-col justify-between text-white">
                {/* Top: logo */}
                <CustomBox className="flex items-center justify-center pt-4 pb-2">
                    <Logo size={40} className="block text-white" to="/" />
                </CustomBox>

                {/* Middle: main navigation */}
                <CustomBox className="flex-1 flex flex-col gap-2 items-stretch px-1">

                    {/* Menu met label */}
                    <CustomTooltip text="Menu" position="right">
                        <CustomBox
                            onClick={() => hamburgerRef.current.toggle()}   // <— hele rij opent menu
                            className={clsx(
                                "w-full rounded-md",
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

                    </CustomTooltip>

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

                {/* Bottom: auth + theme toggle */}
                <CustomBox className="flex flex-col gap-3 pb-4 px-1">
                    {/* Sign in / Log out netjes uitgelijnd zoals andere NavItems */}
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
