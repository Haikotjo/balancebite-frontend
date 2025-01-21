import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Box, TextField, Button, Alert, useTheme } from "@mui/material";
import useLogin from "../../../../hooks/useLogin.js";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx"; // Import de UserMealsContext

const LoginForm = ({ onClose, onSwitchToRegister }) => {
    const theme = useTheme();
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
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: theme.palette.action.disabledBackground,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1300,
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
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
                    Don&#39;t have an account? Register
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
