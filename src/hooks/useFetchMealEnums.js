import { useState, useEffect } from "react";
import { fetchMealEnums } from "../services/apiService.js";

/**
 * Custom hook to fetch meal-related enums (diets, cuisines, meal types).
 *
 * This hook:
 * - Fetches diets, cuisines, and meal types options from the API.
 * - Stores the fetched data in state variables.
 * - Manages a loading state to indicate the fetching process.
 *
 * @param {boolean} isOpen - Indicates whether the sidebar (or related UI) is open.
 * @returns {Object} An object containing:
 *   - `diets` {Array} - List of diet options.
 *   - `cuisines` {Array} - List of cuisine options.
 *   - `mealTypes` {Array} - List of meal type options.
 *   - `loading` {boolean} - Indicates whether data is being loaded.
 */
const useFetchMealEnums = (isOpen) => {
    // State variables to store fetched enum data
    const [diets, setDiets] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [mealTypes, setMealTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Only fetch if sidebar or related UI is open
        if (!isOpen) return;

        const fetchData = async () => {
            setLoading(true); // Set loading before fetching

            try {
                const response = await fetchMealEnums();
                setDiets(response.diets || []);
                setCuisines(response.cuisines || []);
                setMealTypes(response.mealTypes || []);
            } catch (error) {
                console.error("Error fetching enums:", error);
            } finally {
                setLoading(false); // Always end loading state
            }
        };

        fetchData();
    }, [isOpen]);

    return { diets, cuisines, mealTypes, loading };
};

export default useFetchMealEnums;
