import {useContext, useEffect} from "react";

import { Typography } from "@mui/material";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import MealDetailCard from "../mealCardLarge/MealDetailCard.jsx";
import CustomGrid from "../layout/CustomGrid.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import Spinner from "../layout/spinner.jsx";

function MealList({ filters, sortBy, selectedMeal, onFiltersChange }) {
    const { meals, loading, error, userMeals, setFilters, setSortBy } = useContext(UserMealsContext);
    const location = useLocation();
    const filteredMeals = selectedMeal
        ? [selectedMeal]
        : meals.filter((m) => {
            if (filters.name) {
                return m.name.toLowerCase().includes(filters.name.toLowerCase());
            }
            return true;
        });


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
            <CustomBox className="flex justify-center items-center min-h-[50vh]">
                <Spinner />
            </CustomBox>
        );

    if (error)
        return (
            <CustomBox className="flex justify-center items-center min-h-[50vh]">
                <Typography color="error">Error: {error}</Typography>
            </CustomBox>
        );

    if (meals.length === 0)
        return (
            <CustomBox className="flex justify-center items-center min-h-[50vh]">
                <Typography variant="h6" gutterBottom>No meals found.</Typography>
            </CustomBox>
        );

    return (
        <CustomGrid>
            {filteredMeals.map((meal) => {
                const userMealMatch = userMeals.find(userMeal =>
                    String(userMeal.originalMealId) === String(meal.id)
                );
                const mealToRender = userMealMatch || meal;

                return (
                    <div key={mealToRender.id} className="mb-4 break-inside-avoid">
                        <MealDetailCard
                            meal={mealToRender}
                            viewMode="list"
                        />
                    </div>
                );
            })}
        </CustomGrid>
    );
}

MealList.propTypes = {
    filters: PropTypes.object.isRequired,
    sortBy: PropTypes.shape({
        sortKey: PropTypes.string,
        sortOrder: PropTypes.string
    }),
    selectedMeal: PropTypes.object,
    onFiltersChange: PropTypes.func,
};

export default MealList;

