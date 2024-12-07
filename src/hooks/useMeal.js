import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Custom hook to fetch meal data and nutrients dynamically based on a given endpoint and meal ID using Axios.
 *
 * @param {string} baseEndpoint - The base API endpoint to fetch the meal data from.
 * @param {number} mealId - The ID of the meal to fetch.
 * @returns {Object} - Contains meal data, nutrients, loading states, and error states.
 */
export function useMeal(baseEndpoint = "http://localhost:8080/meals", mealId) {
    const [meal, setMeal] = useState(null); // Stores the fetched meal data
    const [loading, setLoading] = useState(true); // Indicates loading state for meal
    const [error, setError] = useState(null); // Stores error messages for meal
    const [nutrients, setNutrients] = useState([]); // Stores fetched nutrients
    const [loadingNutrients, setLoadingNutrients] = useState(true); // Indicates loading state for nutrients
    const [nutrientError, setNutrientError] = useState(null); // Stores error messages for nutrients

    useEffect(() => {
        if (!mealId) {
            console.warn("Meal ID is not provided. Skipping fetch."); // Log missing mealId
            return;
        }

        const fetchMealData = async () => {
            setLoading(true);
            const endpoint = `${baseEndpoint}/${mealId}`; // Construct the meal endpoint
            console.log("Fetching meal data from:", endpoint); // Log the endpoint

            try {
                // Retrieve the token from localStorage
                const token = localStorage.getItem("accessToken");

                // Axios request with authorization header
                const { data } = await axios.get(endpoint, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }), // Conditionally add the Authorization header
                    },
                });

                setMeal(data);
                setError(null); // Clear any previous error
                console.log("Fetched meal data successfully:", data); // Log fetched meal data
            } catch (err) {
                console.error("Error fetching meal data:", err.message); // Log the error
                setError(err.response?.data?.message || err.message); // Handle API-specific error messages
            } finally {
                setLoading(false); // End loading state
            }
        };

        const fetchNutrients = async () => {
            setLoadingNutrients(true);
            const nutrientsEndpoint = `http://localhost:8080/meals/nutrients/${mealId}`; // Nutrients endpoint
            console.log("Fetching nutrients from:", nutrientsEndpoint); // Log the endpoint

            try {
                // Retrieve the token from localStorage
                const token = localStorage.getItem("accessToken");

                // Axios request with authorization header
                const { data } = await axios.get(nutrientsEndpoint, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }), // Conditionally add the Authorization header
                    },
                });

                setNutrients(data);
                setNutrientError(null); // Clear any previous error
                console.log("Fetched nutrients successfully:", data); // Log fetched nutrients
            } catch (err) {
                console.error("Error fetching nutrients:", err.message); // Log the error
                setNutrientError(err.response?.data?.message || err.message); // Handle API-specific error messages
            } finally {
                setLoadingNutrients(false); // End loading state for nutrients
            }
        };

        fetchMealData();
        fetchNutrients();
    }, [baseEndpoint, mealId]); // Re-run the effect if baseEndpoint or mealId changes

    return {
        meal,
        nutrients,
        loading,
        loadingNutrients,
        error,
        nutrientError,
    }; // Return meal and nutrients data, loading states, and error states
}
