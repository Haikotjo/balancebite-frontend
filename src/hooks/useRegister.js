import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { registerUserApi } from "../services/apiService";
import { UserMealsContext } from "../context/UserMealsContext";
import useLogin from "./useLogin";

const useRegister = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const { fetchUserMealsData } = useContext(UserMealsContext);
    const { handleLogin } = useLogin();

    const handleRegistration = async (formData, onClose, isAdminContext = false) => {
        setErrorMessage("");
        setSuccessMessage("");

        try {
            localStorage.clear();
            sessionStorage.clear();

            const { accessToken, refreshToken } = await registerUserApi(formData);
            if (!accessToken || !refreshToken) {
                throw new Error("Invalid response from server.");
            }

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            if (!isAdminContext) {
                await handleLogin(formData.email, formData.password, async () => {
                    await fetchUserMealsData();
                    if (onClose) onClose();
                    navigate("/profile");
                });
            } else {
                setSuccessMessage("User successfully created.");
                if (onClose) onClose();
            }

        } catch (err) {
            setErrorMessage(err.message);
            console.error("Registration failed:", err);
        }
    };

    return { handleRegistration, errorMessage, successMessage, setErrorMessage, setSuccessMessage };
};

export default useRegister;
