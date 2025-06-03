import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import clsx from "clsx";

const navItems = [
    { label: "About", path: "/about" },
    { label: "All Meals", path: "/meals" },
    { label: "All Diets", path: "/diets" },
];

const DesktopMenu = ({ user, onLogout, onLoginClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = user?.roles.includes("ADMIN");

    const isActive = (path) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    return (
        <CustomBox className="flex flex-col space-y-2 w-full font-body font-bold text-white">
            {/* Home */}
            <CustomBox
                onClick={() => navigate("/")}
                className={clsx(
                    "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                    isActive("/") ? "text-primary" : "text-white"
                )}
            >
                <CustomBox className="flex items-center gap-2">
                    <Home className="w-5 h-5 md:hidden" />
                    Home
                </CustomBox>
            </CustomBox>

            <CustomDivider className="bg-white my-2" />

            {/* Nav‐links */}
            {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                    <CustomBox
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={clsx(
                            "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                            active ? "text-primary" : "text-white"
                        )}
                    >
                        {item.label}
                    </CustomBox>
                );
            })}

            <CustomDivider className="bg-white my-2" />

            {/* Admin */}
            {isAdmin && (
                <>
                    <CustomBox
                        onClick={() => navigate("/admin")}
                        className={clsx(
                            "cursor-pointer p-2 rounded-md transition-all hover:bg-white/10",
                            isActive("/admin") ? "text-primary" : "text-white"
                        )}
                    >
                        Admin
                    </CustomBox>
                    <CustomDivider className="bg-white my-2" />
                </>
            )}

            {/* Auth */}
            {!user ? (
                <CustomBox
                    onClick={onLoginClick}
                    className={clsx(
                        "w-full cursor-pointer p-2 rounded-md transition-all hover:bg-white/10"
                    )}
                >
                    <CustomTypography className="text-sm text-white">
                        Sign In
                    </CustomTypography>
                </CustomBox>
            ) : (
                <CustomBox
                    onClick={onLogout}
                    className="w-full cursor-pointer p-2 rounded-md hover:bg-white/10"
                >
                    <CustomTypography className="text-sm text-white">
                        Logout
                    </CustomTypography>
                </CustomBox>
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
