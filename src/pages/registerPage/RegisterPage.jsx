import { useNavigate } from "react-router-dom";
import RegisterForm from "../../components/navigation/loginRegisterForm/registerForm/RegisterForm.jsx";
import CustomBox from "../../components/layout/CustomBox.jsx";

function RegisterPage() {
    const navigate = useNavigate();

    return (
        <CustomBox className="flex flex-col items-center min-h-screen p-2 pt-4">
            <RegisterForm onSwitchToLogin={() => navigate("/login")} />
        </CustomBox>
    );
}

export default RegisterPage;