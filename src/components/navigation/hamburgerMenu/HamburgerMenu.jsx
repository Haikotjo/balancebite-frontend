import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem, IconButton, ListItemText, ListItemIcon, Divider } from "@mui/material";
import { useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded"; // Import Meals icoon
import { useNavigate, useLocation } from "react-router-dom";
import ProfileMenuItem from "../ProfileMenuItem/ProfileMenuItem.jsx";
import ProfileMenu from "../profileMenu/ProfileMenu.jsx";
import LoginLogoutMenuItem from "../loginLogoutMenuItem/LoginLogoutMenuItem.jsx";

const HamburgerMenu = ({ user, onLogout, onLoginClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mealsMenuAnchorEl, setMealsMenuAnchorEl] = useState(null);
    const [isIconLoaded, setIsIconLoaded] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const isMenuOpen = Boolean(anchorEl);
    const isMealsMenuOpen = Boolean(mealsMenuAnchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMealsMenuAnchorEl(null);
    };

    const handleMealsMenuOpen = (event) => {
        setMealsMenuAnchorEl(event.currentTarget);
    };

    const handleMealsMenuClose = () => {
        setMealsMenuAnchorEl(null);
    };

    useEffect(() => {
        setTimeout(() => setIsIconLoaded(true), 100);
    }, []);

    const isActive = (path) => location.pathname === path;

    const menuItemStyle = (path) => ({
        backgroundColor: isActive(path) ? theme.palette.action.selected : "inherit",
    });

    return (
        <>
            <IconButton
                edge="end"
                onClick={handleMenuOpen}
                sx={{
                    color: theme.palette.background.default,
                    transition: "transform 0.75s ease-in-out, opacity 0.5s",
                    transform: `${isIconLoaded ? "rotate(360deg)" : "rotate(0deg)"} ${
                        isMenuOpen ? "rotate(360deg)" : ""
                    }`,
                    opacity: isIconLoaded ? 1 : 0,
                    transformOrigin: "center",
                }}
            >
                <MenuIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
                <MenuItem
                    onClick={() => {
                        if (!isActive("/")) {
                            navigate("/");
                            handleMenuClose();
                        }
                    }}
                    disabled={isActive("/")}
                    sx={menuItemStyle("/")}
                >
                    <ListItemIcon>
                        <HomeRoundedIcon sx={{ color: theme.palette.text.primary }} />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </MenuItem>
                <Divider sx={{ height: "1px", margin: 0 }} />
                <MenuItem
                    onClick={() => {
                        if (!isActive("/about")) {
                            navigate("/about");
                            handleMenuClose();
                        }
                    }}
                    disabled={isActive("/about")}
                    sx={menuItemStyle("/about")}
                >
                    <ListItemIcon>
                        <InfoRoundedIcon sx={{ color: theme.palette.text.primary }} />
                    </ListItemIcon>
                    <ListItemText primary="About" />
                </MenuItem>
                <Divider sx={{ height: "1px", margin: 0 }} />

                <MenuItem disableRipple style={{ display: "flex", justifyContent: "space-between" }}>
                    <ProfileMenu
                        user={user}
                        onLogout={onLogout}
                        onLoginClick={onLoginClick}
                        iconColor={theme.palette.text.primary}
                        onClose={handleMenuClose}
                        text="Profile"
                    />
                </MenuItem>


                <Divider sx={{ height: "1px", margin: 0 }} />

                <MenuItem
                    onClick={handleMealsMenuOpen}
                    disableRipple
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <ListItemIcon>
                        <FoodBankRoundedIcon sx={{ color: theme.palette.text.primary }} />
                    </ListItemIcon>
                    <ListItemText primary="Meals" />
                    <ListItemIcon style={{ minWidth: "auto" }}>
                        <ArrowRightIcon />
                    </ListItemIcon>
                </MenuItem>

                <Divider sx={{ height: "1px", margin: 0 }} />

                <Menu
                    anchorEl={mealsMenuAnchorEl}
                    open={isMealsMenuOpen}
                    onClose={handleMealsMenuClose}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                    <MenuItem
                        onClick={() => {
                            if (!isActive("/meals")) {
                                navigate("/meals");
                                handleMenuClose();
                            }
                        }}
                        disabled={isActive("/meals")}
                        sx={menuItemStyle("/meals")}
                    >
                        View Meals
                    </MenuItem>
                    <Divider sx={{ height: "1px", margin: 0 }} />
                    {user && (
                        <MenuItem
                            onClick={() => {
                                if (!isActive("/create-meal")) {
                                    navigate("/create-meal");
                                    handleMenuClose();
                                }
                            }}
                            disabled={isActive("/create-meal")}
                            sx={menuItemStyle("/create-meal")}
                        >
                            Create Meal
                        </MenuItem>
                    )}
                </Menu>

                {user ? (
                    <LoginLogoutMenuItem
                        user={user}
                        onLoginClick={onLoginClick}
                        onLogout={onLogout}
                        onClose={handleMenuClose}
                    />
                ) : (
                    <LoginLogoutMenuItem
                        user={user}
                        onLoginClick={onLoginClick}
                        onLogout={onLogout}
                        onClose={handleMenuClose}
                    />
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
