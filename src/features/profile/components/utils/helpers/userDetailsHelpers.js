import { jwtDecode } from "jwt-decode";

/**
 * Decode a JWT token to extract the user ID (sub).
 * @param {string} token - The JWT token to decode.
 * @returns {string|null} - The user ID (sub) or null if decoding fails.
 */
export const decodeToken = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken?.sub || null;
    } catch (error) {
        console.error("Error decoding token:", error.message);
        return null;
    }
};

export const handleCancel = (userProfile, reset, setIsEditable) => {
    if (userProfile) {
        reset(userProfile);
    }
    setIsEditable(false);
};

export const handleConfirm = async (data, updateUserDetails, fetchRecommendedNutrition, setIsEditable, setSnackbarOpen) => {
    try {
        await updateUserDetails(data);
        setIsEditable(false);

        if (fetchRecommendedNutrition) {
            await fetchRecommendedNutrition();
        }

        setSnackbarOpen(true);
    } catch (error) {
        console.error("Error updating user details:", error);
    }
};


export const handleEdit = (setIsEditable) => {
    setIsEditable(true);
};

