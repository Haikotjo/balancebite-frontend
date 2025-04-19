import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import CustomTypography from "../../layout/CustomTypography.jsx";
import CustomButton from "../../layout/CustomButton.jsx";
import CustomBox from "../../layout/CustomBox.jsx";

const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "View Meals", path: "/meals" },
];

const DesktopMenu = ({ user, onLogout, onLoginClick, onRegisterClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) =>
        path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(path);


    return (
        <CustomBox className="flex gap-3 items-center">
            {navItems.map((item) => (
                <CustomButton
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-3 py-1 rounded-md text-sm transition-all
    ${isActive(item.path)
                        ? "bg-userPrimary text-white"
                        : "text-userText"} hover:bg-white/30`}

                >
                    <CustomTypography className="text-sm">{item.label}</CustomTypography>
                </CustomButton>
            ))}

            {user ? (
                <CustomButton onClick={onLogout} className="text-userText hover:bg-white/30 px-3 py-1 rounded-md">
                    <CustomTypography className="text-sm">Logout</CustomTypography>
                </CustomButton>
            ) : (
                <>
                    <CustomButton onClick={onLoginClick} className="text-userText hover:bg-white/30 px-3 py-1 rounded-md">
                        <CustomTypography className="text-sm">Login</CustomTypography>
                    </CustomButton>
                    <CustomButton onClick={onRegisterClick} className="text-userText hover:bg-white/30 px-3 py-1 rounded-md">
                        <CustomTypography className="text-sm">Register</CustomTypography>
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
