import { useContext, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import MealDetailCard from "../mealCardLarge/MealDetailCard.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";

/**
 * MealList — presentational-ish list that still syncs filters/sort with context,
 * but avoids unnecessary context writes and heavy re-computations.
 *
 * Props:
 * - filters: current filter object (e.g., { name })
 * - sortBy: { sortKey?, sortOrder? } (passed-through to context)
 * - selectedMeal: optional single meal override
 * - pinnedMeals: array of meals to appear at the top (de-duplicated)
 */
function MealList({ filters, sortBy, selectedMeal, pinnedMeals = [] }) {
    const { meals, setFilters, setSortBy } = useContext(UserMealsContext);
    const location = useLocation();

    // Shallow compare helper to prevent redundant context updates
    const shallowEqual = (a, b) => {
        if (a === b) return true;
        if (!a || !b) return false;
        const ka = Object.keys(a);
        const kb = Object.keys(b);
        if (ka.length !== kb.length) return false;
        for (const k of ka) {
            if (a[k] !== b[k]) return false;
        }
        return true;
    };

    // Sync filters/sort with context, but only when they actually change.
    useEffect(() => {
        const stateFilters = location.state?.filtersFromRedirect;
        const nextFilters = stateFilters ?? filters;

        // Guarded setFilters
        setFilters(prev => (shallowEqual(prev || {}, nextFilters || {}) ? prev : nextFilters));

        // Guarded setSortBy
        setSortBy(prev => (shallowEqual(prev || {}, sortBy || {}) ? prev : sortBy));
    }, [filters, sortBy, setFilters, setSortBy, location.state]); // intentionally include location.state

    // Compute filtered list only when inputs change
    const filteredMeals = useMemo(() => {
        if (selectedMeal) return [selectedMeal];
        if (!filters?.name) return meals;
        const q = String(filters.name).toLowerCase();
        return meals.filter(m => m?.name?.toLowerCase().includes(q));
    }, [meals, filters?.name, selectedMeal]);

    // Combine pinned + filtered, de-duplicated by id
    const combinedMeals = useMemo(() => {
        const pinnedIds = new Set(pinnedMeals.map(m => String(m.id)));
        const rest = filteredMeals.filter(m => !pinnedIds.has(String(m.id)));
        return [...pinnedMeals, ...rest];
    }, [pinnedMeals, filteredMeals]);

    return (
        <CustomBox
            as="div"
            className="
            grid
            grid-cols-1
            md:grid-cols-[repeat(auto-fill,minmax(325px,1fr))]
            gap-4
            py-4
            mx-auto
        "
        >
            {combinedMeals.map(meal => (
                <CustomBox key={meal.id} className="mb-4 break-inside-avoid">
                    <MealDetailCard
                        meal={meal}
                        viewMode="list"
                        isPinned={pinnedMeals.some(pm => String(pm.id) === String(meal.id))}
                    />
                </CustomBox>
            ))}
        </CustomBox>
    );

}

MealList.propTypes = {
    filters: PropTypes.object.isRequired,
    sortBy: PropTypes.shape({
        sortKey: PropTypes.string,
        sortOrder: PropTypes.string,
    }),
    selectedMeal: PropTypes.object,
    pinnedMeals: PropTypes.array,
};

export default MealList;
