import { useState, useContext } from "react";
import {UserDietsContext} from "../../../../context/UserDietContext.jsx";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import useFavoritesDiets from "./useFavoriteDiets.js";

/**
 * Custom hook to toggle a diet as favorite or remove it from favorites.
 * Handles authentication check, and delegates favorite logic to `useDietFavorites`.
 *
 * @param {Object} diet - The diet object to toggle.
 * @param {Function} [onAuthRequired] - Optional callback when user is not authenticated.
 * @param onError
 * @param onSuccess
 * @returns {Object} Contains:
 *  - toggleFavorite: Function to call when toggling.
 *  - alreadyFavorited: Boolean indicating if the diet is currently favorited.
 *  - isProcessing: Boolean indicating if the toggle is in progress.
 */
export const useToggleDietFavorite = (diet, onAuthRequired, onError, onSuccess) => {
    const { userDiets } = useContext(UserDietsContext);
    const { user } = useContext(AuthContext);
    const { addDietToFavorites, removeDietFromFavorites } = useFavoritesDiets();
    const [isProcessing, setIsProcessing] = useState(false);

    const alreadyFavorited = userDiets.some(userDiet => userDiet.id === diet.id);

    const toggleFavorite = async () => {
        if (!user) {
            onAuthRequired?.();
            return;
        }

        setIsProcessing(true);
        try {
            if (alreadyFavorited) {
                await removeDietFromFavorites(diet);
                onSuccess?.(`${diet.name} removed from favorites`);
            } else {
                await addDietToFavorites(diet);
                onSuccess?.(`${diet.name} added to favorites`);
            }
        } catch (e) {
            console.error("❌ Favorite toggle failed:", e);
            console.log("⚠️ Full error object:", e.response?.data);

            console.log("⚠️ Full error response:", e.response?.data);
            const backendMessage = e?.response?.data?.error || "Could not toggle favorite. Try again later.";
            const diets = e?.response?.data?.diets || [];
            console.log("⚠️ diets:", diets);

            onError?.({ message: backendMessage, diets });
        } finally {
            setIsProcessing(false);
        }
    };


    return { toggleFavorite, alreadyFavorited, isProcessing };
};
