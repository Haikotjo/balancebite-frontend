import PropTypes from "prop-types";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const DesktopMenu = ({ user, onLogout, onLoginClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMealsMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMealsMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button color="inherit" component={Link} to="/">
                Home
            </Button>
            <Button color="inherit" component={Link} to="/about">
                About
            </Button>
            <Button color="inherit" component={Link} to="/profile">
                Profile
            </Button>

                {/* Meals met submenu en een pijltje */}
            <Button
                color="inherit"
                onClick={handleMealsMenuOpen}
                endIcon={<KeyboardArrowDownIcon />}
            >
                Meals
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMealsMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
                <MenuItem onClick={handleMealsMenuClose} component={Link} to="/meals">
                    View Meals
                </MenuItem>
                {user && (
                    <MenuItem onClick={handleMealsMenuClose} component={Link} to="/create-meal">
                        Create Meal
                    </MenuItem>
                )}
            </Menu>

            {user ? (
                <Button color="inherit" onClick={onLogout}>
                    Logout
                </Button>
            ) : (
                <Button color="inherit" onClick={onLoginClick}>
                    Login
                </Button>
            )}
        </Box>
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
};

export default DesktopMenu;
