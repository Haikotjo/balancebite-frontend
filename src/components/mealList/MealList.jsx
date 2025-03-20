import {useContext, useEffect} from "react";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";
import PropTypes from "prop-types";

function MealList({ filters, sortBy }) {
    const { meals, loading, error, fetchMealsData, userMeals, setFilters, setSortBy } = useContext(UserMealsContext);

    // ✅ Filters opslaan in de context
    const handleFilter = (category, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [category]: value,
        }));
    };

    // ✅ Sorting opslaan in de context
    const handleSort = (sortKey, sortOrder) => {
        setSortBy({ sortKey, sortOrder });
    };

    // ⬇️ ✅ Stuur filters en sorting door naar de context (1 keer bij laden)
    useEffect(() => {
        setFilters(filters);
        setSortBy(sortBy);
    }, [filters, sortBy, setFilters, setSortBy]);

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
                        onFilter={handleFilter} // ✅ Filters werken weer
                        onSort={handleSort}     // ✅ Sorting werkt weer
                    />
                );
            })}
        </Box>
    );
}

MealList.propTypes = {
    filters: PropTypes.object.isRequired,
    sortBy: PropTypes.shape({
        sortKey: PropTypes.string,
        sortOrder: PropTypes.string
    }),
};

export default MealList;
