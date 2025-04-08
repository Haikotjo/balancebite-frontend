import {useContext, useEffect, useState} from "react";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography } from "@mui/material";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";
import PropTypes from "prop-types";
import MealModal from "../mealModal/MealModal.jsx";
import { useLocation } from "react-router-dom";

function MealList({ filters, sortBy, onFiltersChange }) {
    const { meals, loading, error, userMeals, setFilters, setSortBy } = useContext(UserMealsContext);

    const [selectedMeal, setSelectedMeal] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleTitleClick = (meal) => {
        setSelectedMeal(meal);
        setModalOpen(true);
    };


    // ✅ Filters opslaan in de context
    const handleFilter = (category, value) => {
        const updated = {
            ...filters,
            [category]: value,
        };

        setFilters(updated);
        onFiltersChange?.(updated);
    };

    // ✅ Sorting opslaan in de context
    const handleSort = (sortKey, sortOrder) => {
        setSortBy({ sortKey, sortOrder });
    };


    const location = useLocation();

    useEffect(() => {
        const stateFilters = location.state?.filtersFromRedirect;
        if (stateFilters) {
            setFilters(stateFilters);
        } else {
            setFilters(filters);
        }
        setSortBy(sortBy);
    }, [filters, sortBy, setFilters, setSortBy, location.state]);


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
        <>
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
                    justifyContent: "center",
                }}
            >
                {meals.map((meal) => {
                    const userMealMatch = userMeals.find(userMeal => String(userMeal.originalMealId) === String(meal.id));
                    const mealToRender = userMealMatch || meal;

                    return (
                        <MealCard
                            key={mealToRender.id}
                            meal={mealToRender}
                            onFilter={handleFilter}
                            onSort={handleSort}
                            onTitleClick={handleTitleClick}
                        />
                    );
                })}
            </Box>

            {selectedMeal && (
                <MealModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    meal={selectedMeal}
                />
            )}
        </>
    );
}

    MealList.propTypes = {
    filters: PropTypes.object.isRequired,
    sortBy: PropTypes.shape({
        sortKey: PropTypes.string,
        sortOrder: PropTypes.string
    }),
        onFiltersChange: PropTypes.func,
};

export default MealList;
