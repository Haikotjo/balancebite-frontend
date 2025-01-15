import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Box, TextField, Button, Alert, Collapse } from "@mui/material";
import useLogin from "../../../../hooks/useLogin.js";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx"; // Import de UserMealsContext

const LoginForm = ({ onClose, onSwitchToRegister }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { handleLogin, errorMessage } = useLogin();
    const { resetUserMeals, fetchUserMealsData } = useContext(UserMealsContext); // Haal functies uit context

    const handleSubmit = async (event) => {
        event.preventDefault();
        localStorage.clear(); // Verwijder oude tokens
        sessionStorage.clear();
        resetUserMeals(); // Reset maaltijden van vorige gebruiker
        await handleLogin(email, password, async () => {
            await fetchUserMealsData(); // Haal nieuwe meals op na login
            onClose(); // Sluit het loginformulier
        });
    };

    return (
        <Box
            sx={{
                position: "fixed", // Zorg dat het los staat van de AppBar of andere ouders
                top: 0,
                left: 0,
                width: "100vw", // Bedekt de hele breedte
                height: "100vh", // Bedekt de hele hoogte
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Donkere overlay
                display: "flex", // Flexbox om het formulier te centreren
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1300, // Zorg dat het boven de rest ligt
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    backgroundColor: "white", // Witte achtergrond voor het formulier
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: "90%",
                    maxWidth: 400,
                }}
            >
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <TextField
                    label="Email"
                    type="email"
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    size="small"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" size="small">
                    Login
                </Button>
                <Button
                    variant="text"
                    size="small"
                    onClick={onSwitchToRegister}
                    sx={{ alignSelf: "flex-start" }}
                >
                    Don't have an account? Register
                </Button>
                <Button
                    variant="text"
                    size="small"
                    onClick={onClose}
                    sx={{ alignSelf: "flex-end" }}
                >
                    Close
                </Button>
            </Box>
        </Box>
    );
};

LoginForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSwitchToRegister: PropTypes.func.isRequired,
};

export default LoginForm;
