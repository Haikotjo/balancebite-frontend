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
                    const options = data.content.map((m) => {
                        const sorted = Array.isArray(m.images) && m.images.length > 0
                            ? [...m.images].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                            : [];
                        const servings = m.servings > 0 ? m.servings : 1;
                        return {
                            value: m.id.toString(),
                            label: m.name,
                            imageUrl: sorted[0]?.imageUrl ?? m.imageUrls?.[0] ?? null,
                            mealTypes: m.mealTypes ?? [],
                            calories: m.totalCalories != null ? Math.round(m.totalCalories / servings) : null,
                            protein:  m.totalProtein  != null ? Math.round(m.totalProtein  / servings) : null,
                            carbs:    m.totalCarbs    != null ? Math.round(m.totalCarbs    / servings) : null,
                            fat:      m.totalFat      != null ? Math.round(m.totalFat      / servings) : null,
                        };
                    });
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
