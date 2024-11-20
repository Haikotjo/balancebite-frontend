import { useState, useEffect } from "react";

export function useMeal(mealId) {
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!mealId) return; // Geen mealId, sla op
        setLoading(true); // Start met laden
        fetch(`http://localhost:8080/meals/${mealId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch meal");
                }
                return response.json();
            })
            .then((data) => {
                setMeal(data);
                setError(null); // Geen fout
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [mealId]);

    return { meal, loading, error }; // Teruggeven aan de component
}
