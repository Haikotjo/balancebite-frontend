import { useState } from "react";
import { consumeMealApi } from "../services/apiService.js";

/**
 * Custom hook to handle meal consumption logic, including API call,
 * modal/dialog state management, and nutrition refresh.
 *
 * @param {Object} params
 * @param {Object} params.meal - The meal to be consumed.
 * @param {Function} params.refetchRecommendedNutrition - Callback to refresh nutrition data after consuming.
 * @param {Function} [params.onSuccess] - Optional callback after successful consumption.
 * @param {Function} [params.onError] - Optional callback if an error occurs.
 * @returns {{
 *   handleConsumeMeal: Function,
 *   isModalOpen: boolean,
 *   setModalOpen: Function,
 *   isDialogOpen: boolean,
 *   setDialogOpen: Function,
 *   errorMessage: string,
 * }}
 */
export const useConsumeMeal = ({ meal, onSuccess, onError, refetchRecommendedNutrition }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const token = localStorage.getItem("accessToken");

    /**
     * Handles the meal consumption process:
     * - Checks authentication
     * - Calls the backend
     * - Updates UI state
     */
    const handleConsumeMeal = async () => {
        if (!token) {
            // If user is not authenticated
            setErrorMessage("You must be logged in to consume a meal.");
            setDialogOpen(true);
            onError?.(); // Call optional error callback
            return;
        }

        try {
            // Make API request to consume the meal
            const remainingIntakes = await consumeMealApi(meal.id, token);

            // Refresh nutrition data
            await refetchRecommendedNutrition();

            // Show success modal
            setModalOpen(true);
            onSuccess?.(remainingIntakes); // Call optional success callback
        } catch (error) {
            // Handle specific RDI error
            if (
                error.response?.status === 404 &&
                error.response?.data?.error?.includes("Recommended daily intake not found")
            ) {
                setErrorMessage("Please update your profile to calculate your daily intake.");
            } else {
                setErrorMessage("Something went wrong. Please try again later.");
            }

            setDialogOpen(true);
            onError?.(error); // Call optional error callback
        }
    };

    return {
        handleConsumeMeal,
        isModalOpen,
        setModalOpen,
        isDialogOpen,
        setDialogOpen,
        errorMessage,
        isAuthenticated: !!token,
    };
};
