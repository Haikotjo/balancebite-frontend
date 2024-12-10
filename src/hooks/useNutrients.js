import { useState, useEffect } from "react";
import { fetchMealNutrientsById } from "../services/apiService.js";

/**
 * Custom hook to fetch nutrients for a specific meal.
 *
 * @param {number} mealId - The ID of the meal to fetch nutrients for.
 * @returns {Object} - Contains nutrients data and error state.
 */
const useNutrients = (mealId) => {
    const [nutrients, setNutrients] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNutrients = async () => {
            try {
                const data = await fetchMealNutrientsById(mealId);
                setNutrients(Object.values(data)); // Convert object to array if needed
                setError(null);
            } catch (error) {
                console.error(`Error fetching nutrients for mealId ${mealId}:`, error);
                setError(error.message);
            }
        };

        if (mealId) {
            void fetchNutrients();
        }
    }, [mealId]);

    return { nutrients, error };
};

export default useNutrients;
