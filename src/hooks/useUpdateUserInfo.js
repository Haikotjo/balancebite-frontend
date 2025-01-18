import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {updateUserInfoApi} from "../services/apiService.js";

const useUpdateUserInfo = () => {
    const { token } = useContext(AuthContext);
    const [updateError, setUpdateError] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState("");

    const updateUserInfo = async (data, initialValues, setInitialValues, reset, setIsEditable) => {
        setUpdateError(""); // Reset error message
        setUpdateSuccess(""); // Reset success message

        const payload = {
            userName: data.username.trim(),
            email: data.email.trim(),
        };

        try {
            const result = await updateUserInfoApi(payload, token);
            setInitialValues(result); // Update with new values

            // Check which values have changed
            let successMessage = "";
            if (payload.userName !== initialValues.username) {
                successMessage += `Username updated to ${result.userName}`;
            }
            if (payload.email !== initialValues.email) {
                successMessage += successMessage ? ` and email updated to ${result.email}` : `Email updated to ${result.email}`;
            }

            // Display success message if changes were made
            if (successMessage) {
                setUpdateSuccess(successMessage);
            }
        } catch (error) {
            setUpdateError("Failed to update user information. Please try again.");
            console.error("Error updating user information:", error);

            // ✅ Reset username and email to original values
            reset({
                username: initialValues.username,
                email: initialValues.email,
            });
        }

        setIsEditable(false);
    };

    return { updateUserInfo, updateError, updateSuccess, setUpdateError, setUpdateSuccess };
};

export default useUpdateUserInfo;
