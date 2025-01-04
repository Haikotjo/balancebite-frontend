import { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem } from "@mui/material";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ProfileMenuItem from "../ProfileMenuItem/ProfileMenuItem.jsx";
import LoginLogoutMenuItem from "../loginLogoutMenuItem/LoginLogoutMenuItem.jsx";

const ProfileMenu = ({ user, onLogout, onLoginClick, iconColor, onClose, text }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        onLoginClick();
        handleMenuClose();
        onClose();
    };

    const handleLogout = () => {
        onLogout();
        handleMenuClose();
        onClose();
    };

    return (
        <>
            <div
                onClick={handleMenuOpen}
                style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: iconColor,
                }}
            >
                <AccountBoxRoundedIcon />
                <KeyboardArrowDownIcon sx={{ fontSize: "16px", ml: 0.05 }} />
                {text && <span style={{ marginLeft: "8px" }}>{text}</span>}
            </div>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <ProfileMenuItem user={user} />

                <LoginLogoutMenuItem
                    user={user}
                    onLoginClick={handleLogin}
                    onLogout={handleLogout}
                    onClose={handleMenuClose}
                />
            </Menu>
        </>
    );
};

ProfileMenu.propTypes = {
    user: PropTypes.object,
    onLogout: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    iconColor: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    text: PropTypes.string, // Optionele tekst naast de iconen
};

export default ProfileMenu;
