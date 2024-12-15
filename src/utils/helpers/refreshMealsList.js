import { handleApiError } from "./handleApiError";

export const refreshMealsList = async (fetchUserMealsData) => {
    try {
        await fetchUserMealsData();
    } catch (error) {
        handleApiError(error, () => console.warn("Failed to refresh meals list."));
    }
};
