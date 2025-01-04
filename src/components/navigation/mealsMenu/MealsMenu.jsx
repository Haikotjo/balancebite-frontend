import { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem, ListItemText, ListItemIcon, Tooltip } from "@mui/material";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import SnackbarComponent from "../../snackbarComponent/SnackbarComponent.jsx"; // Zorg dat je SnackbarComponent importeert

const MealsMenu = ({ user, iconColor }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(""); // Voor dynamische berichten
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleUnauthorizedAction = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
    };

    const handleAlertClose = () => {
        setShowAlert(false);
    };

    return (
        <>
            {/* Meals Icon */}
            <IconButton
                onClick={handleMenuOpen}
                sx={{ color: iconColor }}
            >
                <FoodBankRoundedIcon />
                <KeyboardArrowDownIcon sx={{ fontSize: "16px", ml: 0.05 }} />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {/* View All Meals */}
                <MenuItem
                    onClick={() => {
                        navigate("/meals");
                        handleMenuClose();
                    }}
                >
                    <ListItemIcon>
                        <MenuBookRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="All Meals" />
                </MenuItem>

                {/* My Meals (Requires Login) */}
                <MenuItem
                    onClick={() => {
                        if (user) {
                            navigate("/my-meals");
                            handleMenuClose();
                        } else {
                            handleUnauthorizedAction("Please log in to access your meals.");
                        }
                    }}
                    sx={{
                        color: user ? "inherit" : "#D3D3D3",
                        pointerEvents: user ? "auto" : "all",
                    }}
                >
                    <ListItemIcon>
                        <FoodBankRoundedIcon sx={{ color: user ? "inherit" : "#D3D3D3" }} />
                    </ListItemIcon>
                    <ListItemText primary="My Meals" />
                </MenuItem>

                {/* Create Meal (Requires Login) */}
                <MenuItem
                    onClick={() => {
                        if (user) {
                            navigate("/create-meal");
                            handleMenuClose();
                        } else {
                            handleUnauthorizedAction("Please log in to create a meal.");
                        }
                    }}
                    sx={{
                        color: user ? "inherit" : "#D3D3D3",
                        pointerEvents: user ? "auto" : "all",
                    }}
                >
                    <ListItemIcon>
                        <AddCircleOutlineRoundedIcon sx={{ color: user ? "inherit" : "#D3D3D3" }} />
                    </ListItemIcon>
                    <ListItemText primary="Create Meal" />
                </MenuItem>
            </Menu>

            {/* Snackbar Alert */}
            <SnackbarComponent
                open={showAlert}
                onClose={handleAlertClose}
                message={alertMessage}
                position="center"
                severity="info"
            />
        </>
    );
};

MealsMenu.propTypes = {
    user: PropTypes.object,
    iconColor: PropTypes.string,
};

export default MealsMenu;
