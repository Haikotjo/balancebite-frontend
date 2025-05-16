import { useNavigate } from "react-router-dom";
import CustomBox from "../../components/layout/CustomBox.jsx";
import RegisterForm from "../../features/navigation/components/authRegisterForm/RegisterForm.jsx";

function RegisterPage() {
    const navigate = useNavigate();

    return (
        <CustomBox className="flex flex-col items-center min-h-screen p-2 pt-4">
            <RegisterForm onSwitchToLogin={() => navigate("/login")} />
        </CustomBox>
    );
}

export default RegisterPage;