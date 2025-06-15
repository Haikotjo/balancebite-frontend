import { useEffect, useState } from "react";

/**
 * Custom hook to manage filter selection logic.
 *
 * This hook:
 * - Stores selected filters in local state.
 * - Handles adding or removing filters when the user interacts with a filter option.
 * - Calls the `onFilter` callback only after the state has updated.
 *
 * @param {Object} initialFilters - The initial set of filters from the parent component.
 * @param {Function} onFilter - Callback to notify the parent of filter changes.
 * @returns {Object} An object containing:
 *   - `selectedFilters` {Object} - The current state of selected filters.
 *   - `setSelectedFilters` {Function} - Function to manually update the filter state.
 *   - `handleFilterClick` {Function} - Function to toggle a filter on or off.
 */
const useFilterSelection = (initialFilters, onFilter) => {
    const [selectedFilters, setSelectedFilters] = useState(initialFilters);

    // Notify parent only when filters have changed
    useEffect(() => {
        if (JSON.stringify(selectedFilters) !== JSON.stringify(initialFilters)) {
            onFilter(selectedFilters);
        }
    }, [selectedFilters]);

    /**
     * Toggles a filter in the specified category.
     *
     * @param {string} category - The filter category (e.g., "mealTypes", "diets").
     * @param {string} value - The selected filter value to toggle.
     */
    const handleFilterClick = (category, value) => {
        setSelectedFilters((prevFilters) => {
            const updated = { ...prevFilters };

            if (updated[category] === value) {
                delete updated[category]; // Remove filter
            } else {
                updated[category] = value; // Add/replace filter
            }

            return updated;
        });
    };

    return { selectedFilters, setSelectedFilters, handleFilterClick };
};

export default useFilterSelection;
