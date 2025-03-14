import { useState } from "react";

/**
 * Custom hook to manage filter selection logic.
 *
 * This hook:
 * - Stores selected filters in state.
 * - Handles adding or removing filters when a user selects/deselects an option.
 * - Calls the `onFilter` callback to propagate changes to the parent component.
 *
 * @param {Object} initialFilters - The initial set of selected filters.
 * @param {Function} onFilter - Callback function to update filters in the parent component.
 * @returns {Object} An object containing:
 *   - `selectedFilters` {Object} - The current state of selected filters.
 *   - `setSelectedFilters` {Function} - Function to manually update filter state.
 *   - `handleFilterClick` {Function} - Function to handle filter selection/deselection.
 */
const useFilterSelection = (initialFilters, onFilter) => {
    // State to store the selected filters
    const [selectedFilters, setSelectedFilters] = useState(initialFilters);

    /**
     * Handles user interaction with filters.
     *
     * - If the filter is already selected, it is removed.
     * - If the filter is not selected, it is added.
     * - Updates the parent component by calling `onFilter`.
     *
     * @param {string} category - The filter category (e.g., "mealType", "diet", "cuisine").
     * @param {string} value - The selected filter value.
     */
    const handleFilterClick = (category, value) => {
        setSelectedFilters((prevFilters) => {
            // Create a copy of the previous filters
            const newFilters = { ...prevFilters };

            if (newFilters[category] === value) {
                // If the filter is already selected, remove it
                delete newFilters[category];
            } else {
                // Otherwise, select the new filter
                newFilters[category] = value;
            }

            // Update the parent component with the new filter state
            onFilter(newFilters);

            return newFilters;
        });
    };

    return { selectedFilters, setSelectedFilters, handleFilterClick };
};

export default useFilterSelection;
