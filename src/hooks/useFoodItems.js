import { useState, useEffect } from "react";
import { getAllFoodItemNames, searchFoodItemsByName } from "../services/apiService.js";

/**
 * Custom hook to manage food item retrieval and search functionality.
 * This hook fetches food item names and allows searching by name.
 *
 * @returns {Object} Contains options (food items), noResults state, handleSearch and refetch function.
 */
const useFoodItems = () => {
    const [options, setOptions] = useState([]);
    const [noResults, setNoResults] = useState([]);

    /**
     * Fetches all food item names (ID and name only).
     * Optimized for search functionality where full item details are not needed.
     */
    const fetchAllFoodItems = async () => {
        try {
            const data = await getAllFoodItemNames();
            setOptions(data);
            return data;
        } catch (error) {
            console.error("Error fetching food item names:", error);
            return [];
        }
    };

    /**
     * Handles searching for food items based on user input.
     * - If the query length is greater than 1, it fetches filtered results.
     * - Otherwise, it loads the full list of food items.
     *
     * @param {string} query - User input for search.
     * @param {number} index - Index to track search instances.
     */
    const handleSearch = async (query, index) => {
        if (query.length > 1) {
            try {
                const data = await searchFoodItemsByName(query);
                const newOptions = [...options];
                const newNoResults = [...noResults];
                newNoResults[index] = data.length === 0;
                newOptions[index] = data;
                setOptions(newOptions);
                setNoResults(newNoResults);
            } catch (error) {
                console.error("Error searching food items:", error);
            }
        } else {
            const allItems = await fetchAllFoodItems();
            const newOptions = [...options];
            const newNoResults = [...noResults];
            newOptions[index] = allItems;
            newNoResults[index] = false;
            setOptions(newOptions);
            setNoResults(newNoResults);
        }
    };

    /**
     * Fetches all food item names when the component using this hook is mounted.
     */
    useEffect(() => {
        (async () => {
            try {
                await fetchAllFoodItems();
            } catch (error) {
                console.error("Error fetching food items:", error);
            }
        })();
    }, []);

    // Make fetchAllFoodItems available as refetch
    return { options, noResults, handleSearch, refetch: fetchAllFoodItems };
};

export default useFoodItems;
