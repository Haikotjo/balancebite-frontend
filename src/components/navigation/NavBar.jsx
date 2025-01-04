import { useContext, useState } from "react";
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, ListItemText, ListItemIcon } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import LoginRegisterForm from "./loginRegisterForm/LoginRegisterForm";
import HamburgerMenu from "./hamburgerMenu/HamburgerMenu";
import DesktopMenu from "./desktopMenu/DesktopMenu";
import ErrorAlert from "../errorAlert/ErrorAlert";
import useLogout from "../../hooks/useLogout.js";
import useLogin from "../../hooks/useLogin";
import { AuthContext } from "../../context/AuthContext.jsx";
import Logo from "../logo/Logo.jsx";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./profileMenu/ProfileMenu.jsx";
import MealsMenu from "./mealsMenu/MealsMenu.jsx";
import PropTypes from "prop-types";

const NavBar = () => {
    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const handleLogout = useLogout();
    const { handleLogin, errorMessage } = useLogin();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const navigate = useNavigate();

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
                    {/* Meals Icon */}
                    <MealsMenu
                        user={user}
                        iconColor={theme.palette.background.default}
                    />


                    {/* ProfileMenu Component */}
                    <ProfileMenu
                        user={user}
                        onLogout={handleLogout}
                        onLoginClick={() => setShowLoginForm(true)}
                        iconColor={theme.palette.background.default}
                        onClose={() => {}}
                    />

                    {/* Hamburger Menu */}
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
