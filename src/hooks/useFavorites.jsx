import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { UserMealsContext } from "../context/UserMealsContext.jsx";
import { SnackbarContext } from "../context/SnackbarContext.jsx";
import { addMealToFavoritesApi, removeMealFromFavoritesApi } from "../services/apiService.js";

const useFavorites = () => {
    const { user, token } = useContext(AuthContext);
    const { removeMealFromUserMeals, fetchUserMealsData } = useContext(UserMealsContext);
    const { showSnackbar } = useContext(SnackbarContext);

    const addMealToFavorites = async (meal) => {
        if (!user) {
            showSnackbar("You need to login or register to add a meal.", "warning");
            return false;
        }

        try {
            await addMealToFavoritesApi(meal.id, token);
            await fetchUserMealsData();

            showSnackbar(`${meal.name} added to favorites!`, "success");
            return true;
        } catch (error) {
            console.error("Error adding meal to favorites:", error);
            showSnackbar("Failed to add meal.", "error");
            return false;
        }
    };

    const removeMealFromFavorites = async (meal) => {
        if (!user) {
            showSnackbar("You need to login or register to remove a meal.", "warning");
            return false;
        }

        try {
            await removeMealFromFavoritesApi(meal.id, token);
            removeMealFromUserMeals(meal.id); // Update context
            showSnackbar(`${meal.name} removed from favorites!`, "error");
            return true;
        } catch (error) {
            console.error("Error removing meal from favorites:", error);
            showSnackbar("Failed to remove meal.", "error");
            return false;
        }
    };

    return { addMealToFavorites, removeMealFromFavorites };
};

export default useFavorites;
