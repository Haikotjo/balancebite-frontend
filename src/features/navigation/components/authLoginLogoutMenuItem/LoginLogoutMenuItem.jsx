// src/components/navigation/LoginLogoutMenuItem.jsx
import PropTypes from "prop-types";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import MenuItemWrapper from "../../../../components/menuItemWrapper/MenuItemWrapper.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";

/**
 * Shows login/register options when not logged in, logout when logged in.
 */
const LoginLogoutMenuItem = ({ user, onLoginClick, onRegisterClick, onLogout, onClose }) => {
    const handleLogout = () => {
        onLogout();
        onClose();
    };

    const handleLogin = () => {
        onLoginClick();
        onClose();
    };

    const handleRegister = () => {
        onRegisterClick();
        onClose();
    };

    if (user) {
        return (
            <MenuItemWrapper
                icon={<LogOut size={20} />}
                label="Logout"
                onClick={handleLogout}
            />
        );
    }

    return (
        <CustomBox className="flex flex-col gap-2">
            <MenuItemWrapper
                icon={<LogIn size={20} />}
                label="Login"
                onClick={handleLogin}
            />
            <MenuItemWrapper
                icon={<UserPlus size={20} />}
                label="Register"
                onClick={handleRegister}
            />
        </CustomBox>
    );
};

LoginLogoutMenuItem.propTypes = {
    user: PropTypes.object,
    onLoginClick: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default LoginLogoutMenuItem;
