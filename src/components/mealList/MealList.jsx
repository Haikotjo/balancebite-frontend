import { useEffect, useState, useContext } from "react";
import { fetchMeals } from "../../services/apiService.js";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import { UserMealsContext } from "../../context/UserMealsContext"; // Import UserMealsContext
import { useNavigate } from "react-router-dom"; // For navigation
import PropTypes from "prop-types";
import CustomButton from "./CreateMealButton/CustomButton.jsx";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

/**
 * A component that fetches and displays a list of meals based on the current endpoint provided by the UserMealsContext.
 */
function MealList({ setCreatedByName }) {
    const [meals, setMeals] = useState([]); // All meals
    const [filteredMeals, setFilteredMeals] = useState([]); // Filtered meals
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentListEndpoint, updateEndpoint, activeOption, setActiveOption } = useContext(UserMealsContext);
    const navigate = useNavigate();

    // State for filters
    const [filter, setFilter] = useState(null);

    /**
     * Fetch meals from the current endpoint whenever it changes.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const mealsData = await fetchMeals(currentListEndpoint);
                setMeals(mealsData);
                setFilteredMeals(mealsData); // Initial display is all meals

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

    /**
     * Apply filter when filter state changes
     */
    useEffect(() => {
        if (!filter) {
            setFilteredMeals(meals);
        } else {
            setFilteredMeals(
                meals.filter((meal) =>
                    meal[filter.category]?.toLowerCase() === filter.value.toLowerCase()
                )
            );
        }
    }, [filter, meals]);

    /**
     * Function to refresh the current list.
     */
    const refreshList = async () => {
        try {
            setLoading(true);
            const mealsData = await fetchMeals(currentListEndpoint);
            setMeals(mealsData);
            setFilteredMeals(mealsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle filtering meals
     */
    const handleFilter = (category, value) => {
        setFilter({ category, value });
    };

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
    if (filteredMeals.length === 0)
        return (
            <Box
                marginTop={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                minHeight="50vh"
                gap={1}
            >
                <Typography variant="h6" gutterBottom>
                    No meals found for selected filter.
                </Typography>
                <CustomButton
                    onClick={() => setFilter(null)}
                    label="Reset Filter"
                    variant="outlined"
                />
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
            {filteredMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} refreshList={refreshList} onFilter={handleFilter} />
            ))}
        </Box>
    );
}

MealList.propTypes = {
    setCreatedByName: PropTypes.func,
};

export default MealList;
