import { useContext } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMoreIconButton from "../expandMoreIconButton/ExpandMoreIconButton.jsx";
import { UserMealsContext } from "../../../context/UserMealsContext";
import { RecommendedNutritionContext } from "../../../context/RecommendedNutritionContext.jsx";
import EatButton from "../eatButton/EatButton";
import FavoriteButton from "../favoriteButton/FavoriteButton.jsx";
import { addMealToFavoritesApi, removeMealFromFavoritesApi } from "../../../services/apiService";

const MealCardActions = ({ meal, expanded, toggleExpand }) => {
    const { userMeals, addMealToUserMeals, removeMealFromUserMeals } = useContext(UserMealsContext);
    const { refetchRecommendedNutrition } = useContext(RecommendedNutritionContext);

    const token = localStorage.getItem("accessToken");

    const isDuplicate = userMeals.some((userMeal) => {
        const mealIngredientIds = meal.mealIngredients
            ?.map((ingredient) => ingredient?.foodItemId)
            .filter(Boolean)
            .sort();

        const userMealIngredientIds = userMeal.mealIngredients
            ?.map((ingredient) => ingredient?.foodItemId)
            .filter(Boolean)
            .sort();

        return (
            mealIngredientIds.length === userMealIngredientIds.length &&
            mealIngredientIds.every((id, index) => id === userMealIngredientIds[index])
        );
    });

    const handleAddToFavorites = async () => {
        try {
            await addMealToFavoritesApi(meal.id, token);
            addMealToUserMeals(meal);
            console.log(`${meal.name} added to favorites.`);
        } catch (error) {
            console.error("Error adding to favorites:", error);
        }
    };

    const handleRemoveFromFavorites = async () => {
        try {
            await removeMealFromFavoritesApi(meal.id, token);
            removeMealFromUserMeals(meal.id);
            console.log(`${meal.name} removed from favorites.`);
        } catch (error) {
            console.error("Error removing from favorites:", error);
        }
    };

    return (
        <Box display="flex" alignItems="center" width="100%">
            <Typography
                variant="body2"
                sx={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                    "&:hover": { color: "primary.main" },
                }}
                onClick={toggleExpand}
                aria-expanded={expanded}
                aria-label="show more"
            >
                Ingredients and Nutrients
            </Typography>
            <ExpandMoreIconButton
                expand={expanded}
                onClick={toggleExpand}
                aria-expanded={expanded}
                aria-label="show more"
            >
                <ExpandMoreIcon />
            </ExpandMoreIconButton>
            {isDuplicate && (
                <EatButton
                    meal={meal}
                    refetchRecommendedNutrition={refetchRecommendedNutrition}
                />
            )}
            <FavoriteButton
                isFavorite={isDuplicate}
                onAdd={handleAddToFavorites}
                onRemove={handleRemoveFromFavorites}
                meal={meal}
            />
        </Box>
    );
};

MealCardActions.propTypes = {
    meal: PropTypes.object.isRequired,
    expanded: PropTypes.bool.isRequired,
    toggleExpand: PropTypes.func.isRequired,
    refreshList: PropTypes.func.isRequired,
};

export default MealCardActions;
