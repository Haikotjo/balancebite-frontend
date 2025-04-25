import { useState } from "react";
import { getAccessToken } from "../../utils/helpers/getAccessToken.js";
import { deleteFoodItemApi } from "../../services/apiService.js";
import { handleApiError } from "../../utils/helpers/handleApiError.js";

/**
 * Custom hook to handle deleting a food item.
 * @param {function} refetch - Function to refetch the list of food items after deletion.
 */
const useDeleteFoodItem = (refetch) => {
    const [successMessage, setSuccessMessage] = useState("");

    const deleteFoodItem = async (foodItemId) => {
        try {
            if (!foodItemId) return;
            const token = getAccessToken();
            await deleteFoodItemApi(foodItemId, token);
            setSuccessMessage(`Food item with ID ${foodItemId} deleted.`);
            await refetch();
        } catch (error) {
            handleApiError(error);
        }
    };

    return {
        successMessage,
        deleteFoodItem,
    };
};

export default useDeleteFoodItem;
