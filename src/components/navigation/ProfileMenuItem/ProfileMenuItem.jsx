import PropTypes from "prop-types";
import { MenuItem, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import SnackbarComponent from "../../snackbarComponent/SnackbarComponent.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileMenuItem = ({ user, onClose }) => {
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();

    const handleProfileClick = () => {
        if (user) {
            navigate("/profile");
            if (onClose) onClose(); // Sluit het bovenliggende menu
        } else {
            setShowAlert(true);
        }
    };

    const handleAlertClose = () => {
        setShowAlert(false);
    };

    return (
        <>
            <MenuItem
                onClick={handleProfileClick}
                sx={{
                    color: user ? theme.palette.text.primary : theme.palette.action.disabled,
                    pointerEvents: user ? "auto" : "all",
                }}
            >
                <ListItemIcon>
                    <AccountBoxRoundedIcon
                        sx={{
                            color: user ? theme.palette.text.primary : theme.palette.action.disabled,
                        }}
                    />
                </ListItemIcon>
                <ListItemText primary="Profile" />
            </MenuItem>

            {/* Snackbar Alert */}
            <SnackbarComponent
                open={showAlert}
                onClose={handleAlertClose}
                message="Please log in to access your profile."
                position="top"
                severity="info"
            />
        </>
    );
};

ProfileMenuItem.propTypes = {
    user: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default ProfileMenuItem;

