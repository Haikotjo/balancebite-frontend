import PropTypes from "prop-types";
import { MenuItem, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

const LoginLogoutMenuItem = ({ user, onLoginClick, onLogout, onClose }) => {
    const theme = useTheme();

    return user ? (
        <MenuItem
            onClick={() => {
                onLogout();
                onClose();
            }}
        >
            <ListItemIcon>
                <LogoutIcon
                />
            </ListItemIcon>
            <ListItemText primary="Logout" />
        </MenuItem>
    ) : (
        <MenuItem
            onClick={() => {
                onLoginClick();
                onClose();
            }}
        >
            <ListItemIcon>
                <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
        </MenuItem>
    );
};

LoginLogoutMenuItem.propTypes = {
    user: PropTypes.object,
    onLoginClick: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default LoginLogoutMenuItem;
