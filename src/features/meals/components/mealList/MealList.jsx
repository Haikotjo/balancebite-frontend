import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import MealDetailCard from "../mealCardLarge/MealDetailCard.jsx";
import {UserMealsContext} from "../../../../context/UserMealsContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
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
function MealList({ filters, sortBy, selectedMeal, pinnedMeals = [] }) {
    const { meals, setFilters, setSortBy  } = useContext(UserMealsContext);
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

    const pinnedMealIds = new Set(pinnedMeals.map(m => String(m.id)));
    const combinedMeals = [...pinnedMeals, ...filteredMeals.filter(m => !pinnedMealIds.has(String(m.id)))];

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


    // Render filtered meals in a grid
    return (
        <CustomGrid>
            {combinedMeals.map((meal) => (
                <CustomBox key={meal.id} className="mb-4 break-inside-avoid">
                    <MealDetailCard
                        meal={meal}
                        viewMode="list"
                        isPinned={pinnedMealIds.has(String(meal.id))}
                    />
                </CustomBox>
            ))}
        </CustomGrid>
    );

}

MealList.propTypes = {
    filters: PropTypes.object.isRequired,
    sortBy: PropTypes.shape({
        sortKey: PropTypes.string,
        sortOrder: PropTypes.string
    }),
    onMealClick: PropTypes.func,
    selectedMeal: PropTypes.object,
    pinnedMeals: PropTypes.array,
};

export default MealList;
