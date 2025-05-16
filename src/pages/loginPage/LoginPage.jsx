import { useNavigate } from "react-router-dom";
import CustomBox from "../../components/layout/CustomBox.jsx";
import LoginForm from "../../features/navigation/components/authLoginForm/LoginForm.jsx";


function LoginPage() {
    const navigate = useNavigate();

    return (
        <CustomBox className="flex flex-col items-center min-h-screen p-2">
            <LoginForm onSwitchToRegister={() => navigate("/register")} />
        </CustomBox>
    );
}

export default LoginPage;
