import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const useLogin = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);

    const handleLogin = async (email, password, onSuccess) => {
        try {
            await login(email, password);
            setErrorMessage(null);

            if (onSuccess) onSuccess();

            if (window.location.pathname !== "/meals") {
                navigate("/meals");
            } else {
                window.location.reload();
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.error || "Login failed. Please try again.");
        }
    };

    return { handleLogin, errorMessage };
};

export default useLogin;
