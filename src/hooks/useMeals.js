// src/hooks/useMeals.js
import { useState, useEffect } from "react";
import { getAccessToken } from "../utils/helpers/getAccessToken";
import { getAllMealsApi } from "../services/apiService";
import { handleApiError } from "../utils/helpers/handleApiError";

const useMeals = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMeals = async () => {
        try {
            const token = getAccessToken();
            const response = await getAllMealsApi(token);
            const enriched = response.map(meal => ({
                value: meal.id.toString(),
                label: `${meal.name} (Created by: ${meal.createdBy?.email || 'unknown'}, Added by: ${meal.adjustedBy?.email || 'unknown'}) - ${meal.userCount ?? 0} users`,
                id: meal.id
            }));
            setMeals(enriched);
        } catch (err) {
            console.error("Failed to fetch meals", err);
            handleApiError(err);
            setError("Could not load meals.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    return { meals, loading, error, refetch: fetchMeals };
};

export default useMeals;
