import { useContext, useCallback } from "react";
import { consumeMealApi } from "../services/apiService.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";

export const useConsumeMeal = ({ meal, onSuccess, onError, refetchRecommendedNutrition }) => {
    const { user } = useContext(AuthContext);
    const { showDialog } = useNotification();

    const handleConsumeMeal = useCallback(async () => {
        if (!user) {
            showDialog({ message: "You must be logged in to consume a meal.", type: "error" });
            onError?.();
            return;
        }

        try {
            const remainingIntakes = await consumeMealApi(meal.id);
            await refetchRecommendedNutrition();
            onSuccess?.(remainingIntakes);
        } catch (error) {
            const isRdiMissing =
                error.response?.status === 404 &&
                error.response?.data?.error?.includes("Recommended daily intake not found");

            showDialog({
                message: isRdiMissing
                    ? "Please update your profile to calculate your daily intake."
                    : "Something went wrong. Please try again later.",
                type: "error",
            });

            onError?.(error);
        }
    }, [meal, user, onSuccess, onError, refetchRecommendedNutrition, showDialog]);

    return {
        handleConsumeMeal,
        isAuthenticated: !!user,
    };
};
