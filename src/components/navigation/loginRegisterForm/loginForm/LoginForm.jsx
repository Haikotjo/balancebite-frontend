import { useState, useContext } from "react";
import PropTypes from "prop-types";
import {Box, TextField, Button, Alert, useTheme, Typography} from "@mui/material";
import useLogin from "../../../../hooks/useLogin.js";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";

const LoginForm = ({ onClose, onSwitchToRegister }) => {
    const theme = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { handleLogin, errorMessage } = useLogin();
    const { resetUserMeals, fetchUserMealsData } = useContext(UserMealsContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        localStorage.clear();
        sessionStorage.clear();
        resetUserMeals();
        await handleLogin(email, password, async () => {
            await fetchUserMealsData();
            if (onClose) onClose(); // Sluit popup als de prop bestaat
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // minHeight: "100vh",
                width: "100%",
                ...(onClose && {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: theme.palette.action.disabledBackground,
                    zIndex: 1300,
                }),
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
                <Typography
                    variant="h4"
                    sx={{
                        textAlign: "center",
                        marginBottom: 1,
                        fontWeight: 700,
                    }}
                >
                    Login
                </Typography>

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <TextField
                    label="Email"
                    type="email"
                    size="small"
                    value={email}
                    onChange={(e) => setEmail((e.target.value || "").toLowerCase())}
                    onBlur={() => window.scrollTo(0, 0)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    size="small"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => window.scrollTo(0, 0)}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    sx={{
                        color: theme.palette.text.light,
                    }}
                >
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
                {onClose && ( // Close button alleen tonen als het een popup is
                    <Button
                        variant="text"
                        size="small"
                        onClick={onClose}
                        sx={{ alignSelf: "flex-end" }}
                    >
                        Close
                    </Button>
                )}
            </Box>
        </Box>
    );
};

LoginForm.propTypes = {
    onClose: PropTypes.func, // Niet verplicht meer
    onSwitchToRegister: PropTypes.func.isRequired,
};

export default LoginForm;
