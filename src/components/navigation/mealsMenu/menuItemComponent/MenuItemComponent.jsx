import { useState } from "react";
import PropTypes from "prop-types";
import { MenuItem, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SnackbarComponent from "../../../snackbarComponent/SnackbarComponent.jsx";

const MenuItemComponent = ({
                               icon: Icon,
                               label,
                               path,
                               user,
                               onClose,
                               requiresAuth,
                           }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [showAlert, setShowAlert] = useState(false);

    const handleClick = () => {
        if (requiresAuth && !user) {
            setShowAlert(true);
        } else {
            navigate(path);
            if (onClose) onClose();
        }
    };

    const handleAlertClose = () => {
        setShowAlert(false);
    };

    return (
        <>
            <MenuItem
                onClick={handleClick}
                sx={{
                    color: !requiresAuth || user ? theme.palette.text.primary : theme.palette.action.disabled,
                    cursor: "pointer",
                }}
            >
                <ListItemIcon>
                    <Icon
                        sx={{
                            color: !requiresAuth || user ? theme.palette.text.primary : theme.palette.action.disabled,
                        }}
                    />
                </ListItemIcon>
                <ListItemText primary={label} />
            </MenuItem>

            <SnackbarComponent
                open={showAlert}
                onClose={handleAlertClose}
                autoHideDuration={3000}
                message={`Please log in to access ${label.toLowerCase()}.`}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                severity="info"
            />
        </>
    );
};

MenuItemComponent.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    user: PropTypes.object,
    onClose: PropTypes.func,
    requiresAuth: PropTypes.bool,
};

export default MenuItemComponent;
