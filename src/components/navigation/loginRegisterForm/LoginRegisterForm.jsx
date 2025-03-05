import { useState } from "react";
import PropTypes from "prop-types";
import { Box, useTheme } from "@mui/material";
import LoginForm from "./loginForm/LoginForm.jsx";
import RegisterForm from "./registerForm/RegisterForm.jsx";

const LoginRegisterForm = ({ onLogin, onRegister, errorMessage, onClose }) => {
    const theme = useTheme();
    const [isRegistering, setIsRegistering] = useState(false);

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
                zIndex: 1400,
            }}
        >
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: "90%",
                    maxWidth: 400,
                }}
            >
                {isRegistering ? (
                    <RegisterForm
                        onClose={onClose}
                        onRegister={onRegister}
                        onSwitchToLogin={() => setIsRegistering(false)}
                    />
                ) : (
                    <LoginForm
                        onClose={onClose}
                        onSubmit={onLogin}
                        errorMessage={errorMessage}
                        onSwitchToRegister={() => setIsRegistering(true)}
                    />
                )}
            </Box>
        </Box>
    );
};

LoginRegisterForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
    onRegister: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};

export default LoginRegisterForm;
