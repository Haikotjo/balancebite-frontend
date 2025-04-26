import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/navigation/loginRegisterForm/loginForm/LoginForm.jsx";
import CustomBox from "../../components/layout/CustomBox.jsx";

function LoginPage() {
    const navigate = useNavigate();

    return (
        <CustomBox className="flex flex-col items-center min-h-screen p-2">
            <LoginForm onSwitchToRegister={() => navigate("/register")} />
        </CustomBox>
    );
}

export default LoginPage;
