import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserMealsContext } from "../context/UserMealsContext";
import { registerUserApi } from "../services/authService.js";

const useRegister = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const { fetchUserMealsData } = useContext(UserMealsContext);

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
                await fetchUserMealsData();
                if (onClose) onClose();
                navigate("/profile");
            } else {
                setSuccessMessage("User successfully created.");
                if (onClose) onClose();
            }

        } catch (err) {
            setErrorMessage(err.message || "Registration failed.");
            console.error("Registration failed:", err);
        }
    };

    return {
        handleRegistration,
        errorMessage,
        successMessage,
        setErrorMessage,
        setSuccessMessage,
    };
};

export default useRegister;
