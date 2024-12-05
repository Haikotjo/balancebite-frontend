import React, { useContext } from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const NavBar = () => {
    const { user, logout } = useContext(AuthContext); // Haal user en logout uit context
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login"); // Navigeer naar de loginpagina
    };

    const handleLogout = () => {
        logout(); // Voer de logout uit
        navigate("/"); // Navigeer terug naar de homepagina
    };

    const handleHomeClick = () => {
        navigate("/"); // Navigeer naar de homepagina
    };

    return (
        <AppBar position="static" sx={{ mb: 2 }}>
            <Toolbar>
                {/* Titel of logo, klikbaar maar stijl blijft behouden */}
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, cursor: "pointer" }}
                    onClick={handleHomeClick}
                >
                    Balance Bite
                </Typography>

                {/* Navigatielinks */}
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/about">
                        About
                    </Button>
                    <Button color="inherit" component={Link} to="/meals">
                        Meals
                    </Button>
                </Box>

                {/* Login/Logout knop */}
                {user ? (
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                ) : (
                    <Button color="inherit" onClick={handleLogin}>
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
