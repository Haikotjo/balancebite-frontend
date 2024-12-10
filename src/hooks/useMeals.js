import { useState, useEffect } from "react";
import { fetchMealById, fetchMealNutrientsById } from "../services/apiService.js";

/**
 * Custom hook to fetch meal data and nutrients based on a given meal ID.
 *
 * @param {number} mealId - The ID of the meal to fetch.
 * @returns {Object} - Contains meal data, nutrients, loading states, and error states.
 */
export function useMeal(mealId) {
    const [meal, setMeal] = useState(null); // Stores the fetched meal data
    const [nutrients, setNutrients] = useState([]); // Stores fetched nutrients
    const [loading, setLoading] = useState(true); // Indicates loading state for meal
    const [loadingNutrients, setLoadingNutrients] = useState(true); // Indicates loading state for nutrients
    const [error, setError] = useState(null); // Stores error messages for meal
    const [nutrientError, setNutrientError] = useState(null); // Stores error messages for nutrients

    useEffect(() => {
        if (!mealId) {
            console.warn("Meal ID is not provided. Skipping fetch."); // Log missing mealId
            setLoading(false);
            setLoadingNutrients(false);
            return;
        }

        // Fetch meal data
        const fetchMealData = async () => {
            setLoading(true);
            try {
                const mealData = await fetchMealById(mealId);
                setMeal(mealData);
                setError(null);
            } catch (err) {
                console.error("Error fetching meal data:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // Fetch nutrients data
        const fetchNutrientsData = async () => {
            setLoadingNutrients(true);
            try {
                const nutrientsData = await fetchMealNutrientsById(mealId);
                setNutrients(nutrientsData);
                setNutrientError(null);
            } catch (err) {
                console.error("Error fetching nutrients:", err.message);
                setNutrientError(err.message);
            } finally {
                setLoadingNutrients(false);
            }
        };

        // Call the functions
        void fetchMealData();
        void fetchNutrientsData();
    }, [mealId]); // Re-run the effect if mealId changes

    return {
        meal,
        nutrients,
        loading,
        loadingNutrients,
        error,
        nutrientError,
    };
}
