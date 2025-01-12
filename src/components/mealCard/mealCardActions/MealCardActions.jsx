import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Box, Button, IconButton, Typography, Modal } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandMoreIconButton from "../expandMoreIconButton/ExpandMoreIconButton.jsx";
import { UserMealsContext } from "../../../context/UserMealsContext";
import { RecommendedNutritionContext } from "../../../context/RecommendedNutritionContext.jsx";
import useFavorites from "../../../hooks/useFavorites.jsx";
import { consumeMealApi } from "../../../services/apiService.js";
import RecommendedNutritionDisplay from "../../recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";

const MealCardActions = ({ meal, expanded, toggleExpand }) => {
    const { addMealToFavorites } = useFavorites();
    const { userMeals, addMealToUserMeals } = useContext(UserMealsContext);
    const { refetchRecommendedNutrition } = useContext(RecommendedNutritionContext);

    const [isModalOpen, setModalOpen] = useState(false);

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
        const success = await addMealToFavorites(meal.id);
        if (success) {
            addMealToUserMeals(meal); // Voeg toe aan context
        }
    };

    const handleConsumeMeal = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("No token found. User not authenticated.");
                return;
            }

            console.log("Attempting to consume meal:", meal.id);

            const remainingIntakes = await consumeMealApi(meal.id, token);
            console.log("Meal consumed successfully. Remaining intake:", remainingIntakes);

            await refetchRecommendedNutrition(); // Refresh de data in de context
            setModalOpen(true); // Open de modal
        } catch (error) {
            console.error("Error consuming meal:", error);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
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
                <Button
                    size="small"
                    variant="outlined"
                    sx={{ marginLeft: "8px", fontSize: "0.7rem" }}
                    onClick={handleConsumeMeal} // Alleen actief als isDuplicate true is
                >
                    Eat
                </Button>
            )}
            <IconButton
                onClick={handleAddToFavorites}
                sx={{ marginLeft: "auto" }}
                disabled={isDuplicate}
            >
                {isDuplicate ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon color="primary" />}
            </IconButton>

            {/* Modal Weergave */}
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="nutrition-modal-title"
                aria-describedby="nutrition-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <RecommendedNutritionDisplay />
                </Box>
            </Modal>
        </Box>
    );
};

MealCardActions.propTypes = {
    meal: PropTypes.object.isRequired,
    expanded: PropTypes.bool.isRequired,
    toggleExpand: PropTypes.func.isRequired,
};

export default MealCardActions;
