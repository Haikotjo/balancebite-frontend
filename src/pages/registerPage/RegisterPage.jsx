import RegisterForm from "../../components/navigation/loginRegisterForm/registerForm/RegisterForm.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUserApi } from "../../services/apiService";

const RegisterPage = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (formData) => {
        try {
            console.log("[RegisterPage] Submitting registration form:", formData); // Log formuliergegevens
            await registerUserApi(formData);
            console.log("[RegisterPage] Registration successful, redirecting to login."); // Log succes
            navigate("/login");
        } catch (error) {
            console.error(
                "[RegisterPage] Registration failed:",
                error.response?.data?.error || error.message
            ); // Log fout
            setErrorMessage(
                error.response?.data?.error || "Registration failed. Please try again."
            );
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <RegisterForm
                onSubmit={handleRegister}
                errorMessage={errorMessage}
                onClose={() => navigate("/")}
            />
        </div>
    );
};

export default RegisterPage;
