import PropTypes from "prop-types";
import { Box, IconButton, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandMoreIconButton from "../../styledComponents/expandMoreIconButton/ExpandMoreIconButton.jsx";
import { useContext } from "react";
import { UserMealsContext } from "../../../context/UserMealsContext";
import useFavorites from "../../../hooks/useFavorites.jsx";

const MealCardActions = ({ meal, expanded, toggleExpand }) => {
    const { addMealToFavorites } = useFavorites();
    const { userMeals, addMealToUserMeals } = useContext(UserMealsContext);

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
            <IconButton
                onClick={handleAddToFavorites}
                sx={{ marginLeft: "auto" }}
                disabled={isDuplicate}
            >
                {isDuplicate ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon color="primary" />}
            </IconButton>
        </Box>
    );
};

MealCardActions.propTypes = {
    meal: PropTypes.object.isRequired,
    expanded: PropTypes.bool.isRequired,
    toggleExpand: PropTypes.func.isRequired,
};

export default MealCardActions;
