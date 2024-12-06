import React, { useContext, useState } from "react";
import {
    AppBar,
    Toolbar,
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import LoginForm from "../loginForm/LoginForm";
import HamburgerMenu from "../hamburgerMenu/HamburgerMenu";
import DesktopMenu from "../desktopMenu/DesktopMenu";
import NavLogo from "../navLogo/NavLogo";
import ErrorAlert from "../errorAlert/ErrorAlert";
import useLogout from "../../hooks/useLogout"; // Importeer de useLogout-hook
import useLogin from "../../hooks/useLogin";
import {AuthContext} from "../../context/AuthContext.jsx"; // Importeer de useLogin-hook

const NavBar = () => {
    const { user } = useContext(AuthContext); // Haal alleen `user` op
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const handleLogout = useLogout(); // Gebruik de useLogout-hook
    const { handleLogin, errorMessage } = useLogin(); // Gebruik de useLogin-hook
    const [showLoginForm, setShowLoginForm] = useState(false);

    return (
        <AppBar position="static" sx={{ mb: 2 }}>
            <Toolbar>
                <NavLogo title="Balance Bite" />

                {/* Render alleen het juiste menu op basis van schermgrootte */}
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

                {showLoginForm && (
                    <LoginForm
                        onSubmit={handleLogin}
                        errorMessage={errorMessage}
                        onClose={() => setShowLoginForm(false)}
                    />
                )}

                <ErrorAlert message={errorMessage} />
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
