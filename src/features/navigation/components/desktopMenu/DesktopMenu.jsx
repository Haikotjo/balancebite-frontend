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
        <CustomBox className="flex flex-col space-y-2 w-full">
            <CustomBox className="flex flex-col space-y-2 w-full font-body font-bold">
            {/* Home */}
            <CustomButton
                onClick={() => navigate("/")}
                className={clsx(
                    "w-full text-left p-2 rounded-md border border-white/30 transition-all hover:bg-white/30",
                    isActive("/") ? "text-primary" : "text-white"
                )}
            >
                <CustomBox  className="flex items-center gap-2">
                    <Home className="w-5 h-5 md:hidden" />
                    Home
                </CustomBox >
            </CustomButton>

            {/* Nav‐links */}
            {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                    <CustomButton
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={clsx(
                            "w-full text-left p-2 rounded-md border border-white/30 transition-all hover:bg-white/30",
                            active ? "text-primary" : "text-white"
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
                        className={clsx(
                            "w-full text-left p-2 rounded-md border border-white/30 transition-all hover:bg-white/30",
                            isActive("/admin") ? "text-primary" : "text-white"
                        )}
                    >
                        <CustomBox className="flex items-center gap-2">
                            Admin
                        </CustomBox>
                    </CustomButton>
                )}

                {/* Auth */}
            {!user ? (
                <CustomButton
                    onClick={onLoginClick}
                    className={clsx(
                        "w-full text-left px-3 py-1 rounded-md border border-white/30 transition-all hover:bg-white/30",
                        isActive("/login") ? "text-primary" : "text-white"
                    )}
                >
                    <CustomTypography className="text-sm text-white dark:text-white">
                        Sign In
                    </CustomTypography>
                </CustomButton>
            ) : (
                <CustomButton
                    onClick={onLogout}
                    className="w-full text-left px-3 py-1 rounded-md border border-white/30 text-white hover:bg-white/30"
                >
                    <CustomTypography className="text-sm text-white">Logout</CustomTypography>
                </CustomButton>
            )}
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
