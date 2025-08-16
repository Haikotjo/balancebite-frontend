import { useNavigate } from "react-router-dom";
import CustomBox from "../../components/layout/CustomBox.jsx";
import LoginForm from "../../features/navigation/components/authLoginForm/LoginForm.jsx";
import PageWrapper from "../../components/layout/PageWrapper.jsx";

function LoginPage() {
    const navigate = useNavigate();

    return (
        <PageWrapper narrow>
            <CustomBox className="flex flex-col items-center">
                <LoginForm onSwitchToRegister={() => navigate("/register")} />
            </CustomBox>
        </PageWrapper>
    );
}

export default LoginPage;
