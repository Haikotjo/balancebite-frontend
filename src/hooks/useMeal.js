import { useState, useEffect } from "react";

/**
 * Custom hook to fetch meal data dynamically based on a given endpoint and meal ID.
 *
 * @param {string} baseEndpoint - The base API endpoint to fetch the meal data from.
 * @param {number} mealId - The ID of the meal to fetch.
 * @returns {Object} - Contains meal data, loading state, and error state.
 */
export function useMeal(baseEndpoint = "http://localhost:8080/meals", mealId) {
    const [meal, setMeal] = useState(null); // Stores the fetched meal data
    const [loading, setLoading] = useState(true); // Indicates loading state
    const [error, setError] = useState(null); // Stores error messages, if any

    useEffect(() => {
        if (!mealId) {
            console.warn("Meal ID is not provided. Skipping fetch."); // Log missing mealId
            return;
        }

        const fetchMealData = async () => {
            setLoading(true);
            const endpoint = `${baseEndpoint}/${mealId}`; // Construct the dynamic endpoint
            console.log("Fetching meal data from:", endpoint); // Log the endpoint

            try {
                const response = await fetch(endpoint);

                if (!response.ok) {
                    throw new Error(`Failed to fetch meal with ID ${mealId}: ${response.statusText}`);
                }

                const data = await response.json();
                setMeal(data);
                setError(null); // Clear any previous error
                console.log("Fetched meal data successfully:", data); // Log fetched meal data
            } catch (err) {
                console.error("Error fetching meal data:", err.message); // Log the error
                setError(err.message);
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchMealData();
    }, [baseEndpoint, mealId]); // Re-run the effect if baseEndpoint or mealId changes

    return { meal, loading, error }; // Return meal data, loading state, and error state
}
