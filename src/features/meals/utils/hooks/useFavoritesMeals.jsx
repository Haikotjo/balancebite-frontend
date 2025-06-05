import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import {
    addMealToFavoritesApi, forceUnlinkMealFromUserApi,
    removeMealFromFavoritesApi
}
    from "../../../../services/apiService.js";

export const useFavoritesMeals = () => {
    const { token } = useContext(AuthContext);
    const {
        removeMealFromUserMeals,
        addMealToUserMeals,
        removeMealFromMeals,
        replaceMealInMeals,
    } = useContext(UserMealsContext);

    const addMealToFavorites = async (meal) => {
        const response = await addMealToFavoritesApi(meal.id, token);
        let newMeal = response.meals.find(m => String(m.originalMealId) === String(meal.id))
            || response.meals.find(m => String(m.id) === String(meal.id));

        if (!newMeal) throw new Error("Meal not found in response.");

        addMealToUserMeals(newMeal);
        replaceMealInMeals(meal.id, newMeal);

        return newMeal;
    };

    const removeMealFromFavorites = async (meal) => {
        try {
            await removeMealFromFavoritesApi(meal.id, token);
        } catch (e) {
            if (e?.response?.data?.message === "This meal is still used in the following diets.") {
                console.warn("⚠️ Meal still used, forcing unlink.");
                await forceUnlinkMealFromUserApi(meal.id, token);
            } else {
                throw e;
            }
        }

        removeMealFromUserMeals(meal.id);
        removeMealFromMeals(meal.id);
    };


    return { addMealToFavorites, removeMealFromFavorites };
};

export default useFavoritesMeals;
