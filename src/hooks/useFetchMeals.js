// src/hooks/useFetchMeals.js
import { useEffect, useState } from "react";
import { fetchMeals } from "../services/apiService.js";

export function useFetchMeals(endpoint = "/meals") {
    const [mealOptions, setMealOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchMeals(endpoint);
                if (data.content && Array.isArray(data.content)) {
                    const options = data.content.map((m) => ({
                        value: m.id.toString(),
                        label: m.name,
                    }));
                    setMealOptions(options);
                } else {
                    setError("Unexpected response format.");
                }
            } catch (e) {
                setError("Failed to load meals.");
                console.error("Failed to load meals", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [endpoint]);

    return { mealOptions, loading, error };
}
