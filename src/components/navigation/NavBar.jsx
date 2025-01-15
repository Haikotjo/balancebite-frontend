import { useContext, useState } from "react";
import { AppBar, Toolbar, Box, MenuItem } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import LoginRegisterForm from "./loginRegisterForm/LoginRegisterForm";
import HamburgerMenu from "./hamburgerMenu/HamburgerMenu";
import DesktopMenu from "./desktopMenu/DesktopMenu";
import ErrorAlert from "../errorAlert/ErrorAlert";
import useLogout from "../../hooks/useLogout.js";
import useLogin from "../../hooks/useLogin";
import { AuthContext } from "../../context/AuthContext.jsx";
import Logo from "../logo/Logo.jsx";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./profileMenu/ProfileMenu.jsx";
import MealsMenu from "./mealsMenu/MealsMenu.jsx";
import PropTypes from "prop-types";
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';

const NavBar = () => {
    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const handleLogout = useLogout();
    const { handleLogin, errorMessage } = useLogin();
    const [showLoginForm, setShowLoginForm] = useState(false);
    useNavigate();
    const handleRegister = (data) => {
        console.log("Register data:", data);
    };


    return (
        <AppBar
            sx={{
                mb: 2,
                backgroundColor: "text.primary",
                position: "sticky",
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        flexShrink: 0,
                        padding: 1,
                    }}
                >
                    <Logo size={40} color={theme.palette.background.default} to="/" />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* Meals Menu */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {!isMobile && (
                            <MenuItem
                                onClick={(e) => e.currentTarget.nextSibling.click()}
                                sx={{
                                    color: theme.palette.background.default,
                                    cursor: "pointer",
                                }}
                            >
                                Meals
                            </MenuItem>
                        )}
                        <MealsMenu
                            user={user}
                            iconColor={theme.palette.background.default}
                        />
                    </Box>

                    {/* Vertical Divider */}
                    <Box
                        sx={{
                            height: "24px",
                            width: "1px",
                            backgroundColor: theme.palette.dividerLight,
                            mx: 1,
                        }}
                    />

                    {/* Profile Menu */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {!isMobile && (
                            <MenuItem
                                onClick={(e) => e.currentTarget.nextSibling.click()}
                                sx={{
                                    color: theme.palette.background.default,
                                    cursor: "pointer",
                                }}
                            >
                                Profile
                            </MenuItem>
                        )}
                        <ProfileMenu
                            user={user}
                            onLogout={handleLogout}
                            onLoginClick={() => setShowLoginForm(true)}
                            iconColor={theme.palette.background.default}
                            onClose={() => {}}
                        />
                    </Box>

                    {/* Vertical Divider */}
                    <Box
                        sx={{
                            height: "24px",
                            width: "1px",
                            backgroundColor: theme.palette.dividerLight,
                            mx: 1,
                        }}
                    />

                    {/* Logout/Login or other menu items */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {isMobile ? (
                            <HamburgerMenu
                                user={user}
                                onLogout={handleLogout}
                                onLoginClick={() => setShowLoginForm(true)}
                            />
                        ) : (
                            <DesktopMenu
                                user={user}
                                onLogout={handleLogout}
                                onLoginClick={() => setShowLoginForm(true)}
                            />
                        )}
                    </Box>
                </Box>

            </Toolbar>

            {showLoginForm && (
                <LoginRegisterForm
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    errorMessage={errorMessage}
                    onClose={() => setShowLoginForm(false)}
                />
            )}

            <ErrorAlert message={errorMessage} />
        </AppBar>
    );
};

ProfileMenu.propTypes = {
    onClose: PropTypes.func,
};

export default NavBar;
