import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/navigation/loginRegisterForm/loginForm/LoginForm.jsx";

function LoginPage() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                padding: 2,
            }}
        >
            <LoginForm onSwitchToRegister={() => navigate("/register")} />
        </Box>
    );
}

export default LoginPage;
