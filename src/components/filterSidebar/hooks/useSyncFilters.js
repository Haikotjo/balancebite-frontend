import { useState, useEffect } from "react";

/**
 * Custom hook to synchronize and format selected filters.
 *
 * This hook ensures that:
 * - The selected filters remain in sync with the provided `filters` prop.
 * - Filters are formatted (converted to uppercase) for consistency.
 *
 * @param {Object} filters - The initial filters object, where keys are filter categories and values are selected options.
 * @returns {Object} An object containing:
 *   - `selectedFilters` {Object} - The synchronized and formatted filters.
 *   - `setSelectedFilters` {Function} - Function to update the selected filters.
 */
const useSyncFilters = (filters) => {
    // State to store selected filters
    const [selectedFilters, setSelectedFilters] = useState(filters);

    /**
     * Updates the selected filters when the external filters prop changes.
     */
    useEffect(() => {
        setSelectedFilters(filters);
    }, [filters]);

    /**
     * Formats the filters by converting values to uppercase for consistency.
     */
    useEffect(() => {
        const formattedFilters = Object.fromEntries(
            Object.entries(filters).map(([key, value]) => [key, value.toUpperCase()])
        );
        setSelectedFilters(formattedFilters);
    }, [filters]);

    return { selectedFilters, setSelectedFilters };
};

export default useSyncFilters;
