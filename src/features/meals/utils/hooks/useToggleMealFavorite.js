import { useState, useContext } from "react";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import useFavoritesMeals from "./useFavoritesMeals.jsx";
import {AuthContext} from "../../../../context/AuthContext.jsx";

/**
 * Custom hook to toggle a meal as favorite or remove it from favorites.
 * Handles authentication check, and delegates favorite logic to `useFavorites`.
 *
 * @param {Object} meal - The meal object to toggle.
 * @param {Function} [onAuthRequired] - Optional callback when user is not authenticated.
 * @param onError
 * @param onSuccess
 * @returns {Object} Contains:
 *  - toggleFavorite: Function to call when toggling.
 *  - alreadyFavorited: Boolean indicating if the meal is currently favorited.
 *  - isProcessing: Boolean indicating if the toggle is in progress.
 */
export const useToggleMealFavorite = (meal, onAuthRequired, onError, onSuccess) => {
    const { userMeals } = useContext(UserMealsContext);
    const { user } = useContext(AuthContext);
    const { addMealToFavorites, removeMealFromFavorites } = useFavoritesMeals();
    const [isProcessing, setIsProcessing] = useState(false);

    const alreadyFavorited = userMeals.some(userMeal => userMeal.id === meal.id);

    const toggleFavorite = async () => {
        if (!user) {
            onAuthRequired?.();
            return;
        }

        setIsProcessing(true);
        try {
            if (alreadyFavorited) {
                await removeMealFromFavorites(meal);
                onSuccess?.(`${meal.name} removed from favorites`);
            } else {
                await addMealToFavorites(meal);
                onSuccess?.(`${meal.name} added to favorites`);
            }
        } catch (e) {
            console.error("Favorite toggle failed:", e);
            console.log("⚠️ Full error object:", e.response?.data);

            console.log("⚠️ Full error response:", e.response?.data);
            const backendMessage = e?.response?.data?.error || "Could not toggle favorite. Try again later.";
            const diets = e?.response?.data?.diets || [];
            console.log("⚠️ diets:", diets);

            onError?.({ message: backendMessage, diets });

        }
        finally {
            setIsProcessing(false);
        }
    };

    return { toggleFavorite, alreadyFavorited, isProcessing };
};
