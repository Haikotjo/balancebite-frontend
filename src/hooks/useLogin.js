import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const useLogin = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);

    const handleLogin = async (email, password) => {
        try {
            await login(email, password);
            setErrorMessage(null); // Wis eerdere foutmeldingen

            if (window.location.pathname !== "/meals") {
                navigate("/meals"); // Navigeer naar MealsPage als je er niet al bent
            } else {
                window.location.reload(); // Vernieuw de pagina als je al op /meals bent
            }
        } catch (err) {
            setErrorMessage(err.message || "Login failed. Please try again.");
        }
    };

    return { handleLogin, errorMessage };
};

export default useLogin;
