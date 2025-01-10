import { useEffect, useState, useContext } from "react";
import { fetchMeals } from "../../services/apiService.js";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { UserMealsContext } from "../../context/UserMealsContext"; // Import UserMealsContext
import { useNavigate } from "react-router-dom"; // For navigation
import PropTypes from "prop-types";

/**
 * A component that fetches and displays a list of meals based on the current endpoint provided by the UserMealsContext.
 */
function MealList({ setCreatedByName }) {
    const [meals, setMeals] = useState([]); // State to store fetched meals
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const { currentListEndpoint, updateEndpoint } = useContext(UserMealsContext); // Use updateEndpoint from context
    const navigate = useNavigate(); // For navigation

    /**
     * Fetch meals from the current endpoint whenever it changes.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const mealsData = await fetchMeals(currentListEndpoint);
                setMeals(mealsData);

                if (mealsData.length > 0 && setCreatedByName) {
                    const createdBy = mealsData[0]?.createdBy?.userName || "Unknown User";
                    setCreatedByName(createdBy);
                }

                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData().catch((err) => console.error("Unhandled error in fetchData:", err));
    }, [currentListEndpoint, setCreatedByName]);

    // Show a loading indicator while data is being fetched
    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );

    // Show an error message if fetching meals failed
    if (error)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );

    // Show options to add or view meals if no meals are found
    if (meals.length === 0)
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh">
                <Typography variant="h6" gutterBottom>
                    You have no meals yet!
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        const newEndpoint = `${import.meta.env.VITE_BASE_URL}/meals`;
                        updateEndpoint(newEndpoint); // Use updateEndpoint from context
                    }}
                    sx={{ mb: 2 }}
                >
                    Start Adding Meals
                </Button>
                <Typography sx={{ mb: 2 }}>or</Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/create-meal")}
                >
                    Create a Meal
                </Button>
            </Box>
        );

    // Render the list of meals
    return (
        <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={2}
            padding={2}
        >
            {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
            ))}
        </Box>
    );
}

MealList.propTypes = {
    setCreatedByName: PropTypes.func,
};

export default MealList;
