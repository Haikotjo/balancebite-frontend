import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { MenuItem, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SnackbarComponent from "../../../snackbarComponent/SnackbarComponent.jsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";

/**
 * A reusable menu item component that can navigate to a specified path or display an alert
 * if user authentication is required and the user is not logged in.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ElementType} props.icon - The icon to display for the menu item.
 * @param {string} props.label - The label text to display for the menu item.
 * @param {string} props.path - The navigation path for the menu item.
 * @param {Function} [props.onClose] - Callback function to close the parent menu after the item is clicked.
 * @param {boolean} [props.requiresAuth=false] - Whether the menu item requires user authentication.
 * @returns {JSX.Element} The rendered menu item component.
 */
const MenuItemComponent = ({
                               icon: Icon, // Icon component to render
                               label,      // Menu item label
                               path,       // Navigation path
                               onClose,    // Callback to close the menu
                               requiresAuth = false, // Whether this item requires authentication
                           }) => {
    const { user } = useContext(AuthContext); // Access the authenticated user from context
    const navigate = useNavigate(); // Hook to navigate programmatically
    const theme = useTheme(); // Access the Material-UI theme for consistent styling
    const [showAlert, setShowAlert] = useState(false); // State to manage the visibility of the alert snackbar

    /**
     * Handles the menu item click event. If the item requires authentication and the user
     * is not logged in, it displays an alert. Otherwise, it navigates to the specified path
     * and optionally closes the parent menu.
     */
    const handleClick = () => {
        if (requiresAuth && !user) {
            setShowAlert(true); // Show alert if authentication is required and no user is logged in
        } else {
            navigate(path); // Navigate to the specified path
            if (onClose) onClose(); // Call the onClose callback if provided
        }
    };

    /**
     * Handles the closing of the alert snackbar.
     */
    const handleAlertClose = () => {
        setShowAlert(false); // Hide the alert
    };

    return (
        <>
            {/* Menu item */}
            <MenuItem
                onClick={handleClick}
                sx={{
                    color: !requiresAuth || user ? theme.palette.text.primary : theme.palette.action.disabled, // Disable item if not authenticated
                    cursor: "pointer",
                }}
            >
                <ListItemIcon>
                    {/* Render the icon with appropriate color */}
                    <Icon
                        sx={{
                            color: !requiresAuth || user ? theme.palette.text.primary : theme.palette.action.disabled,
                        }}
                    />
                </ListItemIcon>
                <ListItemText primary={label} /> {/* Render the label */}
            </MenuItem>

            {/* Snackbar alert for authentication warning */}
            <SnackbarComponent
                open={showAlert} // Whether the snackbar is visible
                onClose={handleAlertClose} // Callback to close the snackbar
                autoHideDuration={3000} // Automatically hide after 3 seconds
                message={`Please log in to access ${label.toLowerCase()}.`} // Dynamic message based on the label
                anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position of the snackbar
                severity="info" // Severity level for the alert
            />
        </>
    );
};

MenuItemComponent.propTypes = {
    /**
     * The icon to display for the menu item.
     */
    icon: PropTypes.elementType.isRequired,
    /**
     * The label text to display for the menu item.
     */
    label: PropTypes.string.isRequired,
    /**
     * The navigation path for the menu item.
     */
    path: PropTypes.string.isRequired,
    /**
     * Callback function to close the parent menu after the item is clicked.
     */
    onClose: PropTypes.func,
    /**
     * Whether the menu item requires user authentication.
     */
    requiresAuth: PropTypes.bool,
};

export default MenuItemComponent;
