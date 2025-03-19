import { useContext, useEffect } from "react";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography, Link } from "@mui/material";
import PropTypes from "prop-types";
import CustomButton from "./createMealButton/CustomButton.jsx";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";
import RefreshIcon from '@mui/icons-material/Refresh';

function MealList({ sortBy, filters }) {

    const { meals, loading, error, fetchMealsData, userMeals, currentListEndpoint, setCurrentListEndpoint } = useContext(UserMealsContext);

    const generateEndpoint = () => {
        let baseUrl = currentListEndpoint.split("?")[0]; // behoud huidige endpoint zonder query parameters
        baseUrl += "?page=0&size=10";

        Object.entries(filters).forEach(([key, value]) => {
            baseUrl += `&${key}=${encodeURIComponent(value)}`;
        });

        if (sortBy?.sortKey && sortBy?.sortOrder) {
            baseUrl += `&sortBy=${sortBy.sortKey}&sortOrder=${sortBy.sortOrder}`;
        }

        return baseUrl;
    };

    const handleFilter = (category, value) => {
        const newFilters = { ...filters, [category]: value };
        onFiltersChange(newFilters);
    };

    useEffect(() => {
        const newEndpoint = generateEndpoint();
        if (newEndpoint !== currentListEndpoint) {
            setCurrentListEndpoint(newEndpoint);
        }
    }, [filters, sortBy, setCurrentListEndpoint]);  // ❗️ Geen `currentListEndpoint` in de dependencies!

    useEffect(() => {
        fetchMealsData();
    }, [currentListEndpoint, fetchMealsData]);




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
            <Box marginTop={3} display="flex" flexDirection="column" alignItems="center" minHeight="50vh" gap={1}>
                <Typography variant="h6" gutterBottom>No meals found.</Typography>
            </Box>
        );

    return (
        <Box
            display="grid"
            sx={{
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                    xl: "repeat(5, 1fr)",
                },
                gap: 3,
                padding: 2,
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
            }}
        >
            {meals.map((meal) => {
                const userMealMatch = userMeals.find(userMeal => String(userMeal.originalMealId) === String(meal.id));
                const mealToRender = userMealMatch || meal;

                return (
                    <MealCard
                        key={mealToRender.id}
                        meal={mealToRender}
                        refreshList={fetchMealsData}
                        onFilter={handleFilter}
                    />
                );
            })}
        </Box>
    );
}

MealList.propTypes = {
    sortBy: PropTypes.object,
    filters: PropTypes.object.isRequired,
    onFiltersChange: PropTypes.func.isRequired,
};

export default MealList;
