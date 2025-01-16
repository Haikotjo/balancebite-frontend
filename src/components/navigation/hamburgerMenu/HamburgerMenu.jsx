import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem, IconButton, ListItemText, ListItemIcon, Divider } from "@mui/material";
import { useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileMenu from "../profileMenu/ProfileMenu.jsx";
import LoginLogoutMenuItem from "../loginLogoutMenuItem/LoginLogoutMenuItem.jsx";
import MealsMenu from "../mealsMenu/MealsMenu.jsx";

const HamburgerMenu = ({ user, onLogout, onLoginClick, iconColor = "text.primary" }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mealsMenuAnchorEl, setMealsMenuAnchorEl] = useState(null);
    const [isIconLoaded, setIsIconLoaded] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const isMenuOpen = Boolean(anchorEl);
    Boolean(mealsMenuAnchorEl);
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMealsMenuAnchorEl(null);
    };
    useEffect(() => {
        setTimeout(() => setIsIconLoaded(true), 100);
    }, []);

    const isActive = (path) => location.pathname === path;

    const menuItemStyle = (path) => ({
        backgroundColor: isActive(path)
            ? theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.2)" // Lichte modus: semi-transparant wit
                : theme.palette.primary.main // Donkere modus: primary.main
            : "inherit",
    });


    return (
        <>
            <IconButton
                edge="end"
                onClick={handleMenuOpen}
                sx={{
                    color: theme.palette[iconColor] || iconColor,
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
                {/* MealsMenu */}
                <MenuItem disableRipple style={{ display: "flex", justifyContent: "space-between" }}>
                    <MealsMenu
                        user={user}
                        iconColor={null}
                        text="Meals"
                        onClose={handleMenuClose}
                    />
                </MenuItem>
                <Divider sx={{ height: "1px", margin: 0 }} />

                {/* ProfileMenu */}
                <MenuItem disableRipple style={{ display: "flex", justifyContent: "space-between" }}>
                    <ProfileMenu
                        user={user}
                        onLogout={onLogout}
                        onLoginClick={onLoginClick}
                        iconColor={null}
                        onClose={handleMenuClose}
                        text="Profile"
                    />
                </MenuItem>
                <Divider sx={{ height: "1px", margin: 0 }} />

                {/* Home */}
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
                        <HomeRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </MenuItem>
                <Divider sx={{ height: "1px", margin: 0 }} />

                {/* About */}
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
                        <InfoRoundedIcon sx={null} />
                    </ListItemIcon>
                    <ListItemText primary="About" />
                </MenuItem>
                <Divider sx={{ height: "1px", margin: 0 }} />

                {/* LoginLogoutMenuItem */}
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
    iconColor: PropTypes.string,
};

export default HamburgerMenu;
