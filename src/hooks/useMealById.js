// src/hooks/useMealById.js

import { useEffect, useState } from "react";
import { fetchMealById } from "../services/apiService";

/**
 * Custom hook to fetch meal details by ID.
 *
 * @param {string} mealId - The ID of the meal to fetch.
 * @returns {{
 *   meal: object | null,
 *   loading: boolean,
 *   error: string | null
 * }}
 */
const useMealById = (mealId) => {
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const data = await fetchMealById(mealId);
                setMeal(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch meal details", err);
                setError("Could not load meal data.");
            } finally {
                setLoading(false);
            }
        };

        if (mealId) {
            setLoading(true);
            fetchMeal();
        }
    }, [mealId]);

    return { meal, loading, error };
};

export default useMealById;
