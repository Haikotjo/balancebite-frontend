// src/hooks/useToggleFavorite.js

import { useState, useContext } from "react";
import { UserMealsContext } from "../context/UserMealsContext.jsx";
import useFavorites from "./useFavorites.jsx";

/**
 * Custom hook to toggle a meal as favorite or remove it from favorites.
 * Handles authentication check, and delegates favorite logic to `useFavorites`.
 *
 * @param {Object} meal - The meal object to toggle.
 * @param {Function} [onAuthRequired] - Optional callback when user is not authenticated.
 * @returns {Object} Contains:
 *  - toggleFavorite: Function to call when toggling.
 *  - alreadyFavorited: Boolean indicating if the meal is currently favorited.
 *  - isProcessing: Boolean indicating if the toggle is in progress.
 */
export const useToggleFavorite = (meal, onAuthRequired) => {
    const { userMeals } = useContext(UserMealsContext);
    const { addMealToFavorites, removeMealFromFavorites } = useFavorites();
    const [isProcessing, setIsProcessing] = useState(false);

    // Check if the meal is already in the user's favorites
    const alreadyFavorited = userMeals.some(userMeal => userMeal.id === meal.id);

    /**
     * Toggles the favorite status of the given meal.
     * Calls onAuthRequired if user is not logged in.
     */
    const toggleFavorite = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            onAuthRequired?.(); // Optional callback for login prompt
            return;
        }

        setIsProcessing(true);
        try {
            if (alreadyFavorited) {
                await removeMealFromFavorites(meal);
            } else {
                await addMealToFavorites(meal);
            }
        } catch (e) {
            // Forward error to caller if needed
            throw e;
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        toggleFavorite,
        alreadyFavorited,
        isProcessing,
    };
};
