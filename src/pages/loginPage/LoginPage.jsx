import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin.js";
import LoginForm from "../../components/navigation/loginRegisterForm/loginForm/LoginForm.jsx";

function LoginPage() {
    const { handleLogin, errorMessage } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (email, password) => {
        await handleLogin(email, password, () => {
            navigate("/meals");
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                padding: 2,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <LoginForm
                onClose={() => {}}
                onSwitchToRegister={() => navigate("/register")}
                errorMessage={errorMessage}
                onSubmit={handleSubmit}
            />
        </Box>
    );
}

export default LoginPage;
