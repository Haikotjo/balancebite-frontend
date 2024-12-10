import { useEffect, useState } from "react";
import { fetchMeals, fetchUserMeals } from "../../services/apiService.js";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";

function MealList({ endpoint, setCreatedByName }) {
    const [meals, setMeals] = useState([]);
    const [userMeals, setUserMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");

                // Haal de maaltijden op
                const mealsData = await fetchMeals(endpoint);
                setMeals(mealsData);

                if (mealsData.length > 0 && setCreatedByName) {
                    setCreatedByName(mealsData[0].createdBy?.userName || "Unknown User");
                }

                // Haal de maaltijden van de gebruiker op (als er een token is)
                if (token) {
                    const userMealsData = await fetchUserMeals(token);
                    setUserMeals(Array.isArray(userMealsData) ? userMealsData : []);
                } else {
                    setUserMeals([]);
                }

                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, setCreatedByName]);

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    if (error)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    if (meals.length === 0)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <Typography>No meals found.</Typography>
            </Box>
        );

    const isDuplicateMeal = (meal) => {
        if (userMeals.length === 0) return false;

        const mealIngredientIds = meal.mealIngredients.map((ingredient) => ingredient.foodItemId).sort();

        return userMeals.some((userMeal) => {
            const userMealIngredientIds = userMeal.mealIngredients.map((ingredient) => ingredient.foodItemId).sort();
            return (
                mealIngredientIds.length === userMealIngredientIds.length &&
                mealIngredientIds.every((id, index) => id === userMealIngredientIds[index])
            );
        });
    };

    return (
        <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={2}
            padding={2}
        >
            {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} isDuplicate={isDuplicateMeal(meal)} />
            ))}
        </Box>
    );
}

MealList.propTypes = {
    endpoint: PropTypes.string.isRequired,
    setCreatedByName: PropTypes.func,
};

export default MealList;
