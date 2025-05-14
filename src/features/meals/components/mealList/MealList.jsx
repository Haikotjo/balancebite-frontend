import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import MealDetailCard from "../mealCardLarge/MealDetailCard.jsx";
import {UserMealsContext} from "../../../../context/UserMealsContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomGrid from "../../../../components/layout/CustomGrid.jsx";

/**
 * MealList component — renders a responsive grid of meals with support for filtering,
 * sorting, loading and error states. Pulls userMeals and state from context.
 *
 * @param {Object} props
 * @param {Object} props.filters - Currently applied filter criteria.
 * @param {{sortKey?: string, sortOrder?: string}} [props.sortBy] - Sorting preferences.
 * @param {Object} [props.selectedMeal] - If present, only this meal is shown.
 * @returns {JSX.Element}
 */
function MealList({ filters, sortBy, selectedMeal }) {
    const { meals, loading, error, userMeals, setFilters, setSortBy } = useContext(UserMealsContext);
    const location = useLocation();

    // Apply name filter or selected meal override
    const filteredMeals = selectedMeal
        ? [selectedMeal]
        : meals.filter((m) => {
            if (filters.name) {
                return m.name.toLowerCase().includes(filters.name.toLowerCase());
            }
            return true;
        });

    // Update filters/sortBy from props or redirect state
    useEffect(() => {
        const stateFilters = location.state?.filtersFromRedirect;
        if (stateFilters) {
            setFilters(stateFilters);
        } else {
            setFilters(filters);
        }
        setSortBy(sortBy);
    }, [filters, sortBy, setFilters, setSortBy, location.state]);

    // Show loading spinner
    if (loading)
        return (
            <CustomBox className="flex justify-center items-center min-h-[50vh]">
                <Spinner />
            </CustomBox>
        );

    // Show error message
    if (error)
        return (
            <CustomBox className="flex justify-center items-center min-h-[50vh]">
                <CustomTypography
                    as="p"
                    variant="paragraph"
                    className="text-red-600"
                >
                    Error: {error}
                </CustomTypography>
            </CustomBox>
        );

    // Show empty state
    if (meals.length === 0)
        return (
            <CustomBox className="flex justify-center items-center min-h-[50vh]">
                <CustomTypography
                    as="h6"
                    variant="h5"
                    className="mb-4"
                >
                    No meals found.
                </CustomTypography>
            </CustomBox>
        );

    // Render filtered meals in a grid
    return (
        <CustomGrid>
            {filteredMeals.map((meal) => {
                const userMealMatch = userMeals.find(userMeal =>
                    String(userMeal.originalMealId) === String(meal.id)
                );
                const mealToRender = userMealMatch || meal;

                return (
                    <CustomBox key={mealToRender.id} className="mb-4 break-inside-avoid">
                        <MealDetailCard
                            meal={mealToRender}
                            viewMode="list"
                        />
                    </CustomBox>
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
    selectedMeal: PropTypes.object
};

export default MealList;
