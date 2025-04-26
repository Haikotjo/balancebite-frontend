import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import CustomTypography from "../../layout/CustomTypography.jsx";
import CustomButton from "../../layout/CustomButton.jsx";
import CustomBox from "../../layout/CustomBox.jsx";

/**
 * Array of navigation links shown in the top-level desktop menu.
 * Each item includes a display label and the corresponding route path.
 */
const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "View Meals", path: "/meals" },
];

/**
 * DesktopMenu renders navigation buttons and login/logout/register options.
 * Navigation buttons highlight the active route.
 *
 * @component
 * @param {object} props - Component props
 * @param {object|null} props.user - Current user object or null if not logged in
 * @param {Function} props.onLogout - Callback to handle logout
 * @param {Function} props.onLoginClick - Callback to open login flow
 * @param {Function} props.onRegisterClick - Callback to open registration flow
 * @returns {JSX.Element}
 */
const DesktopMenu = ({ user, onLogout, onLoginClick, onRegisterClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = user?.roles.includes("ADMIN");

    /**
     * Returns true if the current route matches the given path.
     * For root ("/"), it requires exact match.
     */
    const isActive = (path) =>
        path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(path);

    return (
        <CustomBox className="flex gap-3 items-center">
            {/* Render main navigation links */}
            {navItems.map((item) => (
                <CustomButton
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-3 py-1 rounded-md text-sm transition-all border border-white/30
            ${isActive(item.path)
                        ? "bg-userPrimary text-white"
                        : "text-userText"} hover:bg-white/30`}
                >
                    <CustomTypography className="text-sm text-white">{item.label}</CustomTypography>
                </CustomButton>
            ))}

            {isAdmin && (
                <CustomButton
                    onClick={() => navigate("/admin")}
                    className="px-3 py-1 rounded-md text-sm transition-all border border-white/30 text-userText hover:bg-white/30"
                >
                    <CustomTypography className="text-sm text-white">Admin</CustomTypography>
                </CustomButton>
            )}


            {/* Render authentication options */}
            {user ? (
                <CustomButton
                    onClick={onLogout}
                    className="text-userText hover:bg-white/30 px-3 py-1 rounded-md border border-white/30"
                >
                    <CustomTypography className="text-sm text-white">Logout</CustomTypography>
                </CustomButton>
            ) : (
                <>
                    <CustomButton
                        onClick={onLoginClick}
                        className="text-userText hover:bg-white/30 px-3 py-1 rounded-md border border-white/30"
                    >
                        <CustomTypography className="text-sm text-white">Login</CustomTypography>
                    </CustomButton>
                    <CustomButton
                        onClick={onRegisterClick}
                        className="text-userText hover:bg-white/30 px-3 py-1 rounded-md border border-white/30"
                    >
                        <CustomTypography className="text-sm text-white">Register</CustomTypography>
                    </CustomButton>
                </>
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
