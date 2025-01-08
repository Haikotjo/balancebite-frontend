import PropTypes from "prop-types";
import { Box, Button, Menu, MenuItem, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";

const DesktopMenu = ({ user, onLogout, onLoginClick }) => {
    const theme = useTheme(); // Toegang tot het huidige thema
    const [anchorEl, setAnchorEl] = useState(null);
    const handleMealsMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{ color: theme.palette.text.light }}
            >
                Home
            </Button>
            <Box
                sx={{
                    height: "24px",
                    width: "1px",
                    backgroundColor: theme.palette.dividerLight,
                }}
            />
            <Button
                color="inherit"
                component={Link}
                to="/about"
                sx={{ color: theme.palette.text.light }}
            >
                About
            </Button>
            <Box
                sx={{
                    height: "24px",
                    width: "1px",
                    backgroundColor: theme.palette.dividerLight,
                }}
            />
            <Box
                sx={{

                    width: "1px",
                    backgroundColor: theme.palette.dividerLight,
                }}
            />
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMealsMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
            >

                <MenuItem
                    onClick={handleMealsMenuClose}
                    component={Link}
                    to="/meals"
                    sx={{ color: theme.palette.text.primary }}
                >
                    View Meals
                </MenuItem>
                {user && (
                    <MenuItem
                        onClick={handleMealsMenuClose}
                        component={Link}
                        to="/create-meal"
                        sx={{ color: theme.palette.text.primary }}
                    >
                        Create Meal
                    </MenuItem>
                )}
            </Menu>

            {user ? (
                <Button
                    color="inherit"
                    onClick={onLogout}
                    sx={{ color: theme.palette.text.light }}
                >
                    Logout
                </Button>
            ) : (
                <Button
                    color="inherit"
                    onClick={onLoginClick}
                    sx={{ color: theme.palette.text.light }}
                >
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
