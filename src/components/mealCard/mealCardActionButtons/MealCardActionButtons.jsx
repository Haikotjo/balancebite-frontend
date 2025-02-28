import PropTypes from "prop-types";
import { Box } from "@mui/material";
import {useContext, useEffect} from "react";
import { UserMealsContext } from "../../../context/UserMealsContext";
import { RecommendedNutritionContext } from "../../../context/RecommendedNutritionContext.jsx";
import EatButton from "../eatButton/EatButton";
import FavoriteButton from "../favoriteButton/FavoriteButton.jsx";
import { addMealToFavoritesApi, removeMealFromFavoritesApi } from "../../../services/apiService";
import {AuthContext} from "../../../context/AuthContext.jsx";

const MealCardActionButtons = ({ meal }) => {
    const { userMeals, addMealToUserMeals, removeMealFromUserMeals } = useContext(UserMealsContext);
    const { refetchRecommendedNutrition } = useContext(RecommendedNutritionContext);
    const token = localStorage.getItem("accessToken");

    const { user } = useContext(AuthContext);

    console.log("🔄 Rendering MealCardActionButtons - Meal ID:", meal.id);
    console.log("🔍 Current userMeals:", userMeals.map(m => m.id));

    const isDuplicate =
        meal.isTemplate !== true ||  // Meal is geen template (dus een kopie)
        userMeals.some(userMeal => userMeal.originalMealId === meal.id) ||  // Meal is een kopie van een andere meal in de lijst
        userMeals.some(userMeal => userMeal.id === meal.id);  // Meal staat al direct in de lijst1


    const handleAddToFavorites = async () => {
        try {
            await addMealToFavoritesApi(meal.id, token);
            addMealToUserMeals(meal);
            console.log(`${meal.name} added to favorites.`);
        } catch (error) {
            console.error("Error adding to favorites:", error);
        }
    };

    return (
        <Box
            sx={{
                position: "absolute",
                top: 15,
                right: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
            }}
        >

            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                    backgroundColor: "rgba(255,255,255)",
                    borderRadius: "40%",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.5)",
                    width: "35px",
                    height: "35px",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                        transform: "scale(1.2)",
                    },
                }}
            >
                <FavoriteButton
                    isFavorite={isDuplicate}
                    onAdd={handleAddToFavorites}
                    meal={meal}
                />
            </Box>

            {isDuplicate && (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        backgroundColor: "rgba(255,255,255)",
                        borderRadius: "40%",
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.5)",
                        width: "35px",
                        height: "35px",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                            transform: "scale(1.2)",
                        },
                    }}
                >
                    <EatButton
                        meal={meal}
                        refetchRecommendedNutrition={refetchRecommendedNutrition}
                    />
                </Box>
            )}

        </Box>
    );
};

MealCardActionButtons.propTypes = {
    meal: PropTypes.object.isRequired,
};

export default MealCardActionButtons;
