import { useState, useContext } from "react";
import {UserDietsContext} from "../../../../context/UserDietContext.jsx";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import useDietFavorites from "./useFavoriteDiets.js";

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
    const { addDietToFavorites, removeDietFromFavorites } = useDietFavorites();
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
                console.log("🔄 Removing from favorites:", diet);
                await removeDietFromFavorites(diet);
                onSuccess?.(`${diet.name} removed from favorites`);
            } else {
                console.log("➕ Adding to favorites:", diet);
                const result = await addDietToFavorites(diet);
                console.log("✅ Add result:", result);
                onSuccess?.(`${diet.name} added to favorites`);
            }
        } catch (e) {
            console.error("❌ Favorite toggle failed:", e);
            onError?.("Could not toggle favorite. Try again later.");
        } finally {
            setIsProcessing(false);
        }
    };

    return { toggleFavorite, alreadyFavorited, isProcessing };
};
