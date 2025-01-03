import { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem, ListItemText, ListItemIcon, Tooltip } from "@mui/material";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import SnackbarComponent from "../../snackbarComponent/SnackbarComponent.jsx"; // Zorg dat je het component importeert

const ProfileMenu = ({ user, onLogout, onLoginClick, iconColor }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = () => {
        if (user) {
            navigate("/profile");
            handleMenuClose();
        } else {
            setShowAlert(true);
        }
    };

    const handleAlertClose = () => {
        setShowAlert(false);
    };

    return (
        <>
            {/* Profile Icon with Arrow */}
            <IconButton
                onClick={handleMenuOpen}
                sx={{ color: iconColor, display: "flex", alignItems: "center" }}
            >
                <AccountBoxRoundedIcon />
                <KeyboardArrowDownIcon sx={{ fontSize: "16px", ml: 0.05 }} />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {/* Profile Link */}
                <Tooltip
                    title={user ? "" : "Please log in to access your profile"}
                    placement="top"
                    arrow
                >
                    <span>
                        <MenuItem
                            onClick={handleProfileClick}
                            sx={{
                                color: user ? "inherit" : "#D3D3D3",
                                pointerEvents: user ? "auto" : "all",
                            }}
                        >
                            <ListItemIcon>
                                <AccountBoxRoundedIcon sx={{ color: user ? "inherit" : "#D3D3D3" }} />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </MenuItem>
                    </span>
                </Tooltip>

                {/* Login/Logout */}
                {user ? (
                    <MenuItem
                        onClick={() => {
                            onLogout();
                            handleMenuClose();
                        }}
                    >
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </MenuItem>
                ) : (
                    <MenuItem
                        onClick={() => {
                            onLoginClick();
                            handleMenuClose();
                        }}
                    >
                        <ListItemIcon>
                            <LoginIcon />
                        </ListItemIcon>
                        <ListItemText primary="Login" />
                    </MenuItem>
                )}
            </Menu>

            {/* Gebruik SnackbarComponent */}
            <SnackbarComponent
                open={showAlert}
                onClose={handleAlertClose}
                message="Please log in to access your profile."
                position="center"
                severity="info"
            />
        </>
    );
};

ProfileMenu.propTypes = {
    user: PropTypes.object,
    onLogout: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    iconColor: PropTypes.string,
};

export default ProfileMenu;
