import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import clsx from "clsx";

const navItems = [
    { label: "About", path: "/about" },
    { label: "Meals", path: "/meals" },
    { label: "Diets", path: "/diets" },
];

const DesktopMenu = ({ user, onLogout, onLoginClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = user?.roles.includes("ADMIN");

    const isActive = (path) =>
        path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(path);

    return (
        <CustomBox className="flex gap-3 items-center">
            {/* Home icon button */}
            <CustomButton
                onClick={() => navigate("/")}
                className={clsx(
                    "p-2 rounded-md border border-white/30 transition-all hover:bg-white/30",
                    isActive("/") ? "text-primary" : "text-userTextDark"
                )}
            >
                <Home className="w-5 h-5" />
            </CustomButton>

            {/* Render other nav links */}
            {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                    <CustomButton
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={clsx(
                            "p-2 rounded-md border border-white/30 transition-all hover:bg-white/30",
                            active ? "text-navActive" : "text-userTextDark"
                        )}
                    >
                        {item.label}
                    </CustomButton>
                );
            })}



            {/* Admin */}
            {isAdmin && (
                <CustomButton
                    onClick={() => navigate("/admin")}
                    className="px-3 py-1 rounded-md text-sm transition-all border border-white/30 text-navInactive hover:bg-white/30"
                >
                    <CustomTypography className="text-sm">Admin</CustomTypography>
                </CustomButton>
            )}

            {/* Auth */}
            {!user ? (
                <CustomButton
                    onClick={onLoginClick}
                    className="text-navInactive hover:bg-white/30 px-3 py-1 rounded-md border border-white/30"
                >
                    <CustomTypography className="text-sm text-white dark:text-white">Sign In</CustomTypography>
                </CustomButton>
            ) : (
                <CustomButton
                    onClick={onLogout}
                    className="text-navInactive hover:bg-white/30 px-3 py-1 rounded-md border border-white/30"
                >
                    <CustomTypography className="text-sm text-white">Logout</CustomTypography>
                </CustomButton>
            )}
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
