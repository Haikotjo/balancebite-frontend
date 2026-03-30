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
        const controller = new AbortController();

        const fetchMeal = async () => {
            try {
                const data = await fetchMealById(mealId);
                if (!controller.signal.aborted) {
                    setMeal(data);
                    setError(null);
                }
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error("Failed to fetch meal details", err);
                setError("Could not load meal data.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        if (mealId) {
            setLoading(true);
            fetchMeal();
        }

        return () => controller.abort();
    }, [mealId]);

    return { meal, loading, error };
};

export default useMealById;
