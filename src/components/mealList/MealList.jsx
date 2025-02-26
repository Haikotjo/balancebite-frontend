import {useContext, useEffect, useState} from "react";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";
import CustomButton from "./createMealButton/CustomButton.jsx";
import useMeals from "./hooks/useMeals.js";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";

/**
 * A component that fetches and displays a list of meals based on sorting.
 */
function MealList({setCreatedByName, sortBy, filters, onFiltersChange, activeOption }) {
    console.log("📥 Received activeOption in MealList:", activeOption);

    const {meals, loading, error, refreshList} = useMeals(setCreatedByName);
    const {updateEndpoint} = useContext(UserMealsContext);

    /**
     * Dynamically generates the API endpoint based on sorting.
     */
    const generateEndpoint = () => {
        let baseUrl;

        if (activeOption === "My Meals") {
            baseUrl = `${import.meta.env.VITE_BASE_URL}/users/meals`;
        } else if (activeOption === "Created Meals") {
            baseUrl = `${import.meta.env.VITE_BASE_URL}/users/created-meals`;
        } else {
            baseUrl = `${import.meta.env.VITE_BASE_URL}/meals`;
        }

        baseUrl += "?page=0&size=10"; // Voeg standaard paginatie toe

        Object.entries(filters).forEach(([key, value]) => {
            baseUrl += `&${key}=${encodeURIComponent(value)}`;
        });

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
        const newFilters = {
            ...filters,
            [category]: value,
        };

        onFiltersChange(newFilters);
    };

    /**
     * Updates the endpoint when filters or sorting change.
     */
    useEffect(() => {
        const newEndpoint = generateEndpoint();
        updateEndpoint(newEndpoint);
        refreshList();
    }, [sortBy, filters, activeOption]);

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
    filters: PropTypes.object.isRequired,
    onFiltersChange: PropTypes.func.isRequired,
    activeOption: PropTypes.string.isRequired,
};

export default MealList;
