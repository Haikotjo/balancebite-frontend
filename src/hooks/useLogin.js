import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const useLogin = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (email, password, onSuccess = () => {}) => {
        try {
            await login(email, password);
            await onSuccess();

            if (window.location.pathname !== "/meals") {
                navigate("/meals", { replace: true });
            }
        } catch (err) {
            const msg = err.response?.data?.error || "Login failed. Please try again.";
            throw new Error(msg);
        }
    };

    return { handleLogin };
};

export default useLogin;
