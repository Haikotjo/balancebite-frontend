import { useState, useContext } from "react";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import useFavoritesMeals from "./useFavoritesMeals.jsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";

/**
 * Custom hook to toggle a meal as favorite or remove it from favorites.
 * Handles authentication check, and delegates favorite logic to `useFavoritesMeals`.
 */
export const useToggleMealFavorite = (meal, onAuthRequired, onError, onSuccess) => {
    const { userMeals } = useContext(UserMealsContext);
    const { user } = useContext(AuthContext);
    const { addMealToFavorites, removeMealFromFavorites } = useFavoritesMeals();
    const [isProcessing, setIsProcessing] = useState(false);

    const isSaved = userMeals.some((m) => String(m.id) === String(meal?.id));
    const isAllMealsCopy = meal?.isTemplate === false && meal?.originalMealId != null;

    const alreadyFavorited = isAllMealsCopy || isSaved;
    const shouldRemove = isSaved || isAllMealsCopy;

    const toggleFavorite = async () => {
        if (!user) return onAuthRequired?.();

        console.log("🔥 [useToggleMealFavorite] DECISION", {
            mealId: meal?.id,
            mealOriginalMealId: meal?.originalMealId,
            mealIsTemplate: meal?.isTemplate,
            userMealsCount: userMeals?.length ?? 0,
            isSaved,
            isAllMealsCopy,
            alreadyFavorited,
            action: shouldRemove ? "REMOVE" : "ADD",
        });

        setIsProcessing(true);
        try {
            if (shouldRemove) {
                console.log("🔥 [useToggleMealFavorite] CALL removeMealFromFavorites", {
                    mealId: meal?.id,
                });
                await removeMealFromFavorites(meal);
            } else {
                console.log("🔥 [useToggleMealFavorite] CALL addMealToFavorites", {
                    mealId: meal?.id,
                });
                await addMealToFavorites(meal);
            }

            onSuccess?.();
        } catch (e) {
            const backendMessage =
                e?.response?.data?.error || "Could not toggle favorite. Try again later.";
            const diets = e?.response?.data?.diets || [];

            console.error("🔥 [useToggleMealFavorite] ERROR", {
                mealId: meal?.id,
                backendMessage,
                diets,
                error: e,
            });

            onError?.({ message: backendMessage, diets });
        } finally {
            setIsProcessing(false);
        }
    };

    return { toggleFavorite, alreadyFavorited, isProcessing };
};
