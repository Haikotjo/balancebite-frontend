// hooks/useMeals.js
import { useState, useEffect } from "react";
import { fetchMeals, fetchUserMeals } from "../api/mealApi";

/**
 * Custom hook to fetch meals and user meals.
 * @param {string} endpoint - The API endpoint for fetching the list of meals.
 * @param {Function} [setCreatedByName] - Optional callback to set the creator's name.
 * @returns {Object} - Contains meals, userMeals, loading, and error states.
 */
const useMeals = (endpoint, setCreatedByName) => {
    const [meals, setMeals] = useState([]);
    const [userMeals, setUserMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");

                // Fetch all meals
                const mealsData = await fetchMeals(endpoint);
                setMeals(mealsData);
                console.log(`Fetched ${mealsData.length} meals:`, mealsData.map((meal) => meal.id));

                if (mealsData.length > 0 && setCreatedByName) {
                    setCreatedByName(mealsData[0].createdBy?.userName || "Unknown User");
                }

                // Fetch user-specific meals
                const userMealsData = await fetchUserMeals(token);
                setUserMeals(userMealsData);
                console.log(`Fetched ${userMealsData.length} user meals:`, userMealsData.map((meal) => meal.id));

                setError(null);
            } catch (err) {
                console.error("Error fetching meals:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, setCreatedByName]);

    return { meals, userMeals, loading, error };
};

export default useMeals;
