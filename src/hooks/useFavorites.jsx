import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { UserMealsContext } from "../context/UserMealsContext.jsx";
import { addMealToFavoritesApi, removeMealFromFavoritesApi } from "../services/apiService.js";

export const useFavorites = () => {
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
    };

    const removeMealFromFavorites = async (meal) => {
        await removeMealFromFavoritesApi(meal.id, token);
        removeMealFromUserMeals(meal.id);
        removeMealFromMeals(meal.id);
    };

    return { addMealToFavorites, removeMealFromFavorites };
};

export default useFavorites;
