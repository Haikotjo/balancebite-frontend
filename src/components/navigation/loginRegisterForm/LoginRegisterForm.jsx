import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Collapse } from "@mui/material";
import LoginForm from "./loginForm/LoginForm.jsx";
import RegisterForm from "./registerForm/RegisterForm.jsx";

const LoginRegisterForm = ({ onLogin, onRegister, errorMessage, onClose }) => {
    const [isRegistering, setIsRegistering] = useState(false);

    return (
        <Collapse in={true}>
            <Box
                sx={{
                    position: "relative",
                    zIndex: 10,
                    maxWidth: "400px",
                    margin: "auto",
                    marginTop: "20px",
                }}
            >
                {isRegistering ? (
                    <RegisterForm
                        onClose={onClose}
                        onRegister={onRegister}
                    />
                ) : (
                    <LoginForm
                        onClose={onClose}
                        onSubmit={onLogin}
                        errorMessage={errorMessage}
                        onSwitchToRegister={() => setIsRegistering(true)}
                    />
                )}

                {isRegistering && (
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => setIsRegistering(false)}
                        sx={{ display: "block", margin: "10px auto" }}
                    >
                        Already have an account? Login
                    </Button>
                )}
            </Box>
        </Collapse>
    );
};

LoginRegisterForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
    onRegister: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};

export default LoginRegisterForm;