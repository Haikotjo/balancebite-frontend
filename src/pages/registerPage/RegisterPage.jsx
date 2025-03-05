import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../components/navigation/loginRegisterForm/registerForm/RegisterForm.jsx";

function RegisterPage() {
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
            <RegisterForm onSwitchToLogin={() => navigate("/login")} />
        </Box>
    );
}

export default RegisterPage;
