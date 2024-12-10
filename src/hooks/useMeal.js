import { useState, useEffect } from "react";
import { fetchMeals } from "../services/apiService.js";

/**
 * Custom hook to fetch meal data dynamically based on a given meal ID.
 *
 * @param {number} mealId - The ID of the meal to fetch.
 * @returns {Object} - Contains meal data, loading state, and error state.
 */
export function useMeal(mealId) {
    const [meal, setMeal] = useState(null); // Stores the fetched meal data
    const [loading, setLoading] = useState(true); // Indicates loading state
    const [error, setError] = useState(null); // Stores error messages, if any

    const baseEndpoint = `${import.meta.env.VITE_BASE_URL}/meals`; // Haal de base URL uit .env

    useEffect(() => {
        if (!mealId) {
            console.warn("Meal ID is not provided. Skipping fetch."); // Log missing mealId
            setLoading(false);
            return;
        }

        const fetchMealData = async () => {
            setLoading(true);
            try {
                const data = await fetchMeals(`${baseEndpoint}/${mealId}`); // Gebruik fetchMeals met dynamische URL
                setMeal(data); // Zet de opgehaalde maaltijd in de state
                setError(null); // Clear eventuele vorige fouten
            } catch (err) {
                setError(err.message); // Stel de foutmelding in
                console.error("Error fetching meal data:", err.message); // Log de fout
            } finally {
                setLoading(false); // Eindig de loading state
            }
        };

        fetchMealData();
    }, [baseEndpoint, mealId]); // Re-run de effect als baseEndpoint of mealId verandert

    return { meal, loading, error }; // Return meal data, loading state, and error state
}
