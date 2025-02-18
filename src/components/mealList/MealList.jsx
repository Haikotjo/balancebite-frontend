import {useContext, useEffect, useState} from "react";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";
import CustomButton from "./CreateMealButton/CustomButton.jsx";
import useMeals from "./hooks/useMeals.js";
import {UserMealsContext} from "../../context/UserMealsContext.jsx";
import { Button } from "@mui/material";

/**
 * A component that fetches and displays a list of meals based on the current endpoint.
 */
function MealList({ setCreatedByName, sortBy }) {
    const { meals, filteredMeals, setFilteredMeals, loading, error, refreshList } = useMeals(setCreatedByName, sortBy);
    const [filter, setFilter] = useState(null);
    const { updateEndpoint } = useContext(UserMealsContext);
    const { userId, currentListEndpoint } = useContext(UserMealsContext);


    /**
     * Apply filter when filter state changes
     */
    useEffect(() => {
        let updatedMeals = meals;

        if (currentListEndpoint.includes("/my-meals")) {
            updatedMeals = updatedMeals.filter((meal) => meal.createdBy?.userId === userId);
        }

        if (filter) {
            updatedMeals = updatedMeals.filter((meal) =>
                meal[filter.category]?.toLowerCase() === filter.value.toLowerCase()
            );
        }

        setFilteredMeals(updatedMeals);
    }, [filter, meals, currentListEndpoint]);


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
                    onClick={() => {
                        setFilter(null);
                        updateEndpoint(`${import.meta.env.VITE_BASE_URL}/meals`);
                        refreshList();
                    }}
                    label="All Meals"
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
            {filter && (
                <Typography
                    variant="body1"
                    sx={{
                        alignSelf: "center",
                        marginBottom: 0,
                        color: "primary.main",
                        cursor: "pointer",
                        paddingBottom: 1,
                        textDecoration: "underline",
                        "&:hover": { opacity: 0.8 }
                    }}
                    onClick={() => setFilter(null)}
                >
                    Clear filter: {filter.value}
                </Typography>
            )}

            {/* Meal List */}
            <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
                gap={2}
                padding={0}
            >
                {filteredMeals.map((meal) => (
                    <MealCard key={meal.id} meal={meal} refreshList={refreshList} onFilter={handleFilter} />
                ))}
            </Box>
        </Box>
    );
}

MealList.propTypes = {
    setCreatedByName: PropTypes.func,
    sortBy: PropTypes.string,
};

export default MealList;
