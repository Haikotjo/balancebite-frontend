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
        <Collapse in={true}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 1,
                    boxShadow: 3,
                    zIndex: 10,
                    position: "absolute",
                    top: "100%",
                    right: 16,
                    width: {
                        xs: "90vw",
                        sm: 300,
                        md: 400,
                    },
                    maxWidth: 400,
                    transition: "all 0.3s ease-in-out",
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
        </Collapse>
    );
};

LoginForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSwitchToRegister: PropTypes.func.isRequired,
};

export default LoginForm;
