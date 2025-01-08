import { useEffect, useState, useContext } from "react";
import { fetchMeals } from "../../services/apiService.js";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import { UserMealsContext } from "../../context/UserMealsContext"; // Import UserMealsContext
import PropTypes from "prop-types";

/**
 * A component that displays a list of meals fetched from the current endpoint in the UserMealsContext.
 *
 * @component
 * @param {Function} [setCreatedByName] - Optional callback to set the name of the user who created the meals.
 * @returns {JSX.Element} The rendered MealList component.
 */
function MealList({ setCreatedByName }) {
    const [meals, setMeals] = useState([]); // State for the fetched meals
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const { currentListEndpoint } = useContext(UserMealsContext); // Get the current endpoint from context

    /**
     * Fetches meals from the current endpoint whenever it changes.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Start loading
                const mealsData = await fetchMeals(currentListEndpoint); // Fetch meals from the current endpoint
                setMeals(mealsData); // Update meals state

                // If meals are found and setCreatedByName is provided, set the creator's name
                if (mealsData.length > 0 && setCreatedByName) {
                    const createdBy = mealsData[0]?.createdBy?.userName || "Unknown User";
                    setCreatedByName(createdBy);
                }

                setError(null); // Clear any existing error
            } catch (err) {
                setError(err.message); // Set error state
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchData().catch((err) => console.error("Unhandled error in fetchData:", err));
    }, [currentListEndpoint, setCreatedByName]); // Re-fetch when the endpoint or setCreatedByName changes

    // Show a loading indicator while fetching meals
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

    // Show a message if no meals are found
    if (meals.length === 0)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <Typography>No meals found.</Typography>
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
    /**
     * Optional callback to set the name of the user who created the meals.
     */
    setCreatedByName: PropTypes.func,
};

export default MealList;
