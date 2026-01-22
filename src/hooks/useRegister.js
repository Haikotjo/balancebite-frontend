import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserMealsContext } from "../context/UserMealsContext";
import { registerUserApi } from "../services/authService.js";
import {createUserAsAdminApi} from "../services/apiService.js";

/**
 * Custom hook to handle user registration and admin-led user creation.
 * It routes requests to the appropriate endpoint based on the context.
 */
const useRegister = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const { fetchUserMealsData } = useContext(UserMealsContext);

    /**
     * Handles the registration process.
     * @param {Object} formData - The user data including roles and foodSource.
     * @param {Function} onClose - Optional callback to close the UI modal.
     * @param {Boolean} isAdminContext - Flag to determine if an admin is creating the user.
     */
    const handleRegistration = async (formData, onClose, isAdminContext = false) => {
        setErrorMessage("");
        setSuccessMessage("");

        try {
            let response;

            if (isAdminContext) {
                const token = localStorage.getItem("accessToken");
                // Routes to the admin-specific endpoint to ensure foodSource logic is executed
                const apiResponse = await createUserAsAdminApi(formData, token);
                response = apiResponse.data;
            } else {
                // Standard registration for new users
                localStorage.clear();
                sessionStorage.clear();
                response = await registerUserApi(formData);
            }

            if (!isAdminContext) {
                const { accessToken, refreshToken } = response;

                if (!accessToken || !refreshToken) {
                    throw new Error("Invalid response from server.");
                }

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                await fetchUserMealsData();
                if (onClose) onClose();
                navigate("/profile");
            } else {
                setSuccessMessage("User successfully created.");
                if (onClose) {
                    setTimeout(() => {
                        onClose();
                    }, 2000);
                }
            }

        } catch (err) {
            setErrorMessage(err.message || "Registration failed.");
            console.error("Registration error:", err);
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