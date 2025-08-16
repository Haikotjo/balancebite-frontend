import { useNavigate } from "react-router-dom";
import CustomBox from "../../components/layout/CustomBox.jsx";
import RegisterForm from "../../features/navigation/components/authRegisterForm/RegisterForm.jsx";
import PageWrapper from "../../components/layout/PageWrapper.jsx";

function RegisterPage() {
    const navigate = useNavigate();

    return (
        <PageWrapper narrow>
            <CustomBox className="flex flex-col items-center">
                <RegisterForm onSwitchToLogin={() => navigate("/login")} />
            </CustomBox>
        </PageWrapper>
    );
}

export default RegisterPage;
