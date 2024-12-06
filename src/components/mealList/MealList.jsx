import { useEffect, useState } from "react";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";

/**
 * MealList component to display a list of meals.
 * @param {String} endpoint - The API endpoint for fetching the list of meals.
 * @param {Function} setCreatedByName - Callback to set the creator's name (optional).
 */
function MealList({ endpoint, setCreatedByName }) {
    const [meals, setMeals] = useState([]);
    const [userMeals, setUserMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            console.log(`Fetching meals from ${endpoint}`);
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");
                const headers = { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) };

                // Fetch meals from endpoint
                const response = await fetch(endpoint, { headers });
                if (!response.ok) throw new Error(`Failed to fetch meals: ${response.statusText}`);
                const data = await response.json();

                setMeals(data);
                console.log(`Fetched ${data.length} meals:`, data.map((meal) => meal.id));

                if (data.length > 0 && setCreatedByName) {
                    setCreatedByName(data[0].createdBy?.userName || "Unknown User");
                }

                // Fetch user meals for duplicate check
                const userMealsResponse = await fetch("http://localhost:8080/users/meals", { headers });
                if (!userMealsResponse.ok) throw new Error(`Failed to fetch user meals: ${userMealsResponse.statusText}`);
                const userMealsData = await userMealsResponse.json();

                setUserMeals(userMealsData);
                console.log(`Fetched ${userMealsData.length} user meals:`, userMealsData.map((meal) => meal.id));
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMeals();
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

    // Mark duplicate meals
    const isDuplicateMeal = (meal) => {
        const mealIngredientIds = meal.mealIngredients.map((ingredient) => ingredient.foodItemId).sort();

        const isDuplicate = userMeals.some((userMeal) => {
            const userMealIngredientIds = userMeal.mealIngredients.map((ingredient) => ingredient.foodItemId).sort();

            // Check if the sorted ingredient lists are identical
            return (
                mealIngredientIds.length === userMealIngredientIds.length &&
                mealIngredientIds.every((id, index) => id === userMealIngredientIds[index])
            );
        });

        console.log(`Meal ${meal.id} (${meal.name}) is duplicate:`, isDuplicate);
        return isDuplicate;
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
