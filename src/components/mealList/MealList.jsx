import {useContext, useEffect, useState} from "react";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";
import CustomButton from "./CreateMealButton/CustomButton.jsx";
import useMeals from "./hooks/useMeals.js";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";

/**
 * A component that fetches and displays a list of meals based on sorting.
 */
function MealList({setCreatedByName, sortBy}) {
    console.log("✅ Received in MealList - sortBy:", sortBy);

    const {meals, loading, error, refreshList} = useMeals(setCreatedByName);
    const {updateEndpoint} = useContext(UserMealsContext);

    const [filters, setFilters] = useState({});

    /**
     * Dynamically generates the API endpoint based on sorting.
     */
    const generateEndpoint = () => {
        let baseUrl = `${import.meta.env.VITE_BASE_URL}/meals?page=0&size=10`;

        // ✅ Filters toevoegen aan de endpoint
        Object.entries(filters).forEach(([key, value]) => {
            baseUrl += `&${key}=${encodeURIComponent(value)}`;
        });

        // ✅ Sorting parameters toevoegen
        if (sortBy?.sortKey && sortBy?.sortOrder) {
            baseUrl += `&sortBy=${sortBy.sortKey}&sortOrder=${sortBy.sortOrder}`;
        }

        console.log("🔗 Generated API Endpoint:", baseUrl);
        return baseUrl;
    };

    /**
     * Handle filter data received from MealCard.
     */
    const handleFilter = (category, value) => {
        console.log(`🔽 Received in MealList - Category: ${category}, Value: ${value}`);

        setFilters((prevFilters) => ({
            ...prevFilters,
            [category]: value, // ✅ Filter toevoegen of updaten
        }));
    };

    /**
     * Updates the endpoint when sorting changes.
     */
    useEffect(() => {
        const newEndpoint = generateEndpoint();
        console.log("🔗 Generated API Endpoint:", newEndpoint);
        updateEndpoint(newEndpoint);
        refreshList();
    }, [sortBy, filters]);

    // Show a loading indicator while data is being fetched
    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress/>
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
            <Box
                marginTop={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                minHeight="50vh"
                gap={1}
            >
                <Typography variant="h6" gutterBottom>
                    No meals found.
                </Typography>
                <CustomButton
                    onClick={() => {
                        const resetEndpoint = generateEndpoint();
                        console.log("🔄 Resetting to:", resetEndpoint);
                        updateEndpoint(resetEndpoint);
                        refreshList();
                    }}
                    label="Reset Sorting"
                    variant="outlined"
                />
            </Box>
        );

    // Render the list of meals
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            padding={2}
            position="relative"
        >
            {/* Meal List */}
            <Box
                display="grid"
                gridTemplateColumns={{xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)"}}
                gap={2}
                padding={0}
            >
                {meals.map((meal) => (
                    <MealCard key={meal.id} meal={meal} refreshList={refreshList} onFilter={handleFilter}/>
                ))}
            </Box>
        </Box>
    );
}

MealList.propTypes = {
    setCreatedByName: PropTypes.func,
    sortBy: PropTypes.shape({
        sortKey: PropTypes.string,
        sortOrder: PropTypes.string,
    }),
};

export default MealList;
