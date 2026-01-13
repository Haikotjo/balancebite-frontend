import { useState, useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { updateUserInfoApi } from "../../../../services/apiService.js";

/**
 * Hook to update user information and manage success/error state.
 */
const useUpdateUserInfo = () => {
    const { token } = useContext(AuthContext);
    const [updateError, setUpdateError] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState("");

    const updateUserInfo = async (data, initialValues, setInitialValues, reset, setIsEditable) => {
        setUpdateError("");
        setUpdateSuccess("");

        const payload = {
            userName: data.username.trim(),
            email: data.email.trim(),
        };

        try {
            const result = await updateUserInfoApi(payload, token);

            // Update local state and form values
            setInitialValues(result);
            reset({
                username: result.userName,
                email: result.email,
            });

            // Build success message
            let successMessage = "";
            if (payload.userName !== initialValues.username) {
                successMessage += `Username updated to ${result.userName}`;
            }
            if (payload.email !== initialValues.email) {
                successMessage += successMessage
                    ? ` and email updated to ${result.email}`
                    : `Email updated to ${result.email}`;
            }

            if (successMessage) {
                setUpdateSuccess(successMessage);
            }
        } catch (error) {
            console.error("Error updating user information:", error);
            setUpdateError("Failed to update user information. Please try again.");

            // Reset to previous values on failure
            reset({
                username: initialValues.username,
                email: initialValues.email,
            });
        }

        setIsEditable(false);
    };

    return {
        updateUserInfo,
        updateError,
        updateSuccess,
        setUpdateError,
        setUpdateSuccess,
    };
};

export default useUpdateUserInfo;
