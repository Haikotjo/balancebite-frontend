import {useContext, useEffect, useState} from "react";

import { Box, CircularProgress, Typography } from "@mui/material";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";
import PropTypes from "prop-types";
import MealModal from "../mealModal/MealModal.jsx";
import { useLocation } from "react-router-dom";
import MealDetailCard from "../mealCardLarge/MealDetailCard.jsx";
import CustomGrid from "../layout/CustomGrid.jsx";

function MealList({ filters, sortBy, onFiltersChange }) {
    const { meals, loading, error, userMeals, setFilters, setSortBy } = useContext(UserMealsContext);

    const [selectedMeal, setSelectedMeal] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenAsModal = (meal) => {
        setSelectedMeal(meal);
        setModalOpen(true);
    };

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
            <CustomGrid>
                {meals.map((meal) => {
                    const userMealMatch = userMeals.find(userMeal => String(userMeal.originalMealId) === String(meal.id));
                    const mealToRender = userMealMatch || meal;

                    return (
                        <div key={mealToRender.id} className="mb-4 break-inside-avoid">
                            <MealDetailCard
                                meal={mealToRender}
                                onClick={() => handleTitleClick(mealToRender)}
                                isModal={false}
                                isListItem={true}
                                onOpenAsModal={() => handleOpenAsModal(mealToRender)}
                            />
                        </div>
                    );
                })}
            </CustomGrid>

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
