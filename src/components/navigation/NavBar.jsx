import {useContext, useState} from "react";
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
import DarkModeSwitch from "./darkModeSwitch/DarkModeSwitch.jsx";
import { useThemeMode } from "../../themes/ThemeProvider.jsx";
import VerticalDivider from "../verticalDivider/VerticalDivider.jsx";

const NavBar = () => {
    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const { mode } = useThemeMode(); // Verkrijg de juiste mode
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
                backgroundColor: mode === "dark" ? "#2E7A97" : theme.palette.text.primary,
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
                    <Logo size={40} color={theme.palette.text.light} to="/" />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {!isMobile && (
                            <MenuItem
                                onClick={(e) => e.currentTarget.nextSibling.click()}
                                sx={{
                                    color: theme.palette.text.light,
                                    cursor: "pointer",
                                }}
                            >
                                Meals
                            </MenuItem>
                        )}
                        <MealsMenu
                            user={user}
                            iconColor={theme.palette.text.light}
                        />
                    </Box>

                    <VerticalDivider marginLeft={1} marginRight={0} hiddenOnMobile />

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {!isMobile && (
                            <MenuItem
                                onClick={(e) => e.currentTarget.nextSibling.click()}
                                sx={{
                                    color: theme.palette.text.light,
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
                            iconColor={theme.palette.text.light}
                            onClose={() => {}}
                        />
                    </Box>
                    <VerticalDivider marginLeft={1} marginRight={0} hiddenOnMobile />

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {isMobile ? (
                            <HamburgerMenu
                                user={user}
                                onLogout={handleLogout}
                                onLoginClick={() => setShowLoginForm(true)}
                                iconColor="text.light"
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

                <DarkModeSwitch />
            </Toolbar>

            {showLoginForm && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1300,
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: "white",
                            padding: 3,
                            borderRadius: 2,
                            boxShadow: 3,
                            width: "90%",
                            maxWidth: 400,
                        }}
                    >
                        <LoginRegisterForm
                            onLogin={handleLogin}
                            onRegister={handleRegister}
                            errorMessage={errorMessage}
                            onClose={() => setShowLoginForm(false)}
                        />
                    </Box>
                </Box>
            )}

            <ErrorAlert message={errorMessage} />
        </AppBar>
    );
};

ProfileMenu.propTypes = {
    onClose: PropTypes.func,
};

export default NavBar;
