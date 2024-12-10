import { useEffect, useState } from "react";
import axios from "axios";
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
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");

                // Fetch meals from the endpoint
                const mealsResponse = await axios.get(endpoint, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setMeals(mealsResponse.data);

                if (mealsResponse.data.length > 0 && setCreatedByName) {
                    setCreatedByName(mealsResponse.data[0].createdBy?.userName || "Unknown User");
                }

                // Fetch user meals only if there is a valid token
                if (token) {
                    const userMealsResponse = await axios.get("http://localhost:8080/users/meals", {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    // Controleer of userMealsResponse.data een array is voordat je map aanroept
                    if (Array.isArray(userMealsResponse.data)) {
                        setUserMeals(userMealsResponse.data);
                    } else {
                        setUserMeals([]); // Zet userMeals als lege array als data geen array is
                    }
                } else {
                    setUserMeals([]); // Reset userMeals als er geen token is
                }

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

    // Mark duplicate meals (skip if userMeals is empty)
    const isDuplicateMeal = (meal) => {
        if (userMeals.length === 0) return false;

        const mealIngredientIds = meal.mealIngredients.map((ingredient) => ingredient.foodItemId).sort();

        const isDuplicate = userMeals.some((userMeal) => {
            const userMealIngredientIds = userMeal.mealIngredients.map((ingredient) => ingredient.foodItemId).sort();

            // Check if the sorted ingredient lists are identical
            return (
                mealIngredientIds.length === userMealIngredientIds.length &&
                mealIngredientIds.every((id, index) => id === userMealIngredientIds[index])
            );
        });

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
