import { useState, useContext } from "react";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import useFavoritesMeals from "./useFavoritesMeals.jsx";

export const useToggleMealFavorite = (meal, onAuthRequired, onError, onSuccess) => {
    const { userMeals } = useContext(UserMealsContext);
    const { user } = useContext(AuthContext);
    const { addMealToFavorites, removeMealFromFavorites } = useFavoritesMeals();
    const [isProcessing, setIsProcessing] = useState(false);

    const isSaved = userMeals.some((m) => String(m.id) === String(meal?.id));
    const isAllMealsCopy = meal?.isTemplate === false && meal?.originalMealId != null;
    const alreadyFavorited = isSaved || isAllMealsCopy;

    const toggleFavorite = async () => {
        if (!user) return onAuthRequired?.();
        if (isProcessing) return;

        setIsProcessing(true);
        try {
            if (alreadyFavorited) {
                await removeMealFromFavorites(meal);
            } else {
                await addMealToFavorites(meal);
            }
            onSuccess?.();
        } catch (e) {
            const message = e?.response?.data?.error || "Could not toggle favorite. Try again later.";
            const diets = e?.response?.data?.diets || [];
            onError?.({ message, diets });
        } finally {
            setIsProcessing(false);
        }
    };

    return { toggleFavorite, alreadyFavorited, isProcessing };
};
