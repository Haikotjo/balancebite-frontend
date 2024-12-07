import { useEffect, useState } from "react";
import axios from "axios";
import MealCard from "../MealCard.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";

/**
 * MealList component to display a list of meals.
 * @param {Function} setCreatedByName - Callback to set the creator's name (optional).
 */
function MealList({ setCreatedByName }) {
    const [meals, setMeals] = useState([]);  // All meals state
    const [filteredMeals, setFilteredMeals] = useState([]);  // Filtered meals state
    const [userMeals, setUserMeals] = useState([]);  // Meals by user state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            console.log("Fetching meals from the endpoint");
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");

                // Fetch meals from the endpoint (use your existing endpoint here)
                const mealsResponse = await axios.get("http://localhost:8080/meals", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setMeals(mealsResponse.data);  // Store all meals
                setFilteredMeals(mealsResponse.data);  // Initially, display all meals

                // If meals are fetched successfully, set the creator's name
                if (mealsResponse.data.length > 0 && setCreatedByName) {
                    setCreatedByName(mealsResponse.data[0].createdBy?.userName || "Unknown User");
                }

                // Fetch user-specific meals
                if (token) {
                    const userMealsResponse = await axios.get("http://localhost:8080/users/meals", {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const userMealsData = Array.isArray(userMealsResponse.data) ? userMealsResponse.data : [];
                    setUserMeals(userMealsData);
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

        fetchMeals();
    }, [setCreatedByName]);

    // Function to handle the click on the creator's name
    const filterMealsByCreator = (creatorName) => {
        const filtered = meals.filter((meal) => meal.createdBy?.userName === creatorName);
        setFilteredMeals(filtered);  // Set filtered meals based on creator's name
    };

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

    if (filteredMeals.length === 0)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <Typography>No meals found.</Typography>
            </Box>
        );

    return (
        <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={2}
            padding={2}
        >
            {filteredMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} isDuplicate={false} onCreatorClick={filterMealsByCreator} />
            ))}
        </Box>
    );
}

MealList.propTypes = {
    setCreatedByName: PropTypes.func,
};

export default MealList;

