import { useState } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem, IconButton, ListItemText, ListItemIcon } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useNavigate } from "react-router-dom";

const HamburgerMenu = ({ user, onLogout, onLoginClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mealsMenuAnchorEl, setMealsMenuAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMealsMenuAnchorEl(null); // Sluit het submenu
    };

    const handleMealsMenuOpen = (event) => {
        setMealsMenuAnchorEl(event.currentTarget);
    };

    const handleMealsMenuClose = () => {
        setMealsMenuAnchorEl(null);
    };

    return (
        <>
            <IconButton
                edge="end"
                color="inherit"
                onClick={handleMenuOpen}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => { navigate("/"); handleMenuClose(); }}>Home</MenuItem>
                <MenuItem onClick={() => { navigate("/about"); handleMenuClose(); }}>About</MenuItem>

                {/* Meals submenu */}
                <MenuItem
                    onClick={handleMealsMenuOpen}
                    disableRipple
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <ListItemText primary="Meals" />
                    <ListItemIcon style={{ minWidth: "auto" }}>
                        <ArrowRightIcon />
                    </ListItemIcon>
                </MenuItem>
                <Menu
                    anchorEl={mealsMenuAnchorEl}
                    open={Boolean(mealsMenuAnchorEl)}
                    onClose={handleMealsMenuClose}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                    <MenuItem onClick={() => { navigate("/meals"); handleMenuClose(); }}>
                        View Meals
                    </MenuItem>
                    {user && (
                        <MenuItem onClick={() => { navigate("/create-meal"); handleMenuClose(); }}>
                            Create Meal
                        </MenuItem>
                    )}
                </Menu>

                {user ? (
                    <MenuItem onClick={() => { onLogout(); handleMenuClose(); }}>Logout</MenuItem>
                ) : (
                    <MenuItem onClick={() => { onLoginClick(); handleMenuClose(); }}>Login</MenuItem>
                )}
            </Menu>
        </>
    );
};

HamburgerMenu.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        roles: PropTypes.arrayOf(PropTypes.string).isRequired,
        type: PropTypes.string.isRequired,
    }),
    onLogout: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
};

export default HamburgerMenu;
