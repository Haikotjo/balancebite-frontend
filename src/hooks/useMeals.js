import { useState, useEffect } from "react";

export function useMeal(mealId) {
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const response = await fetch(`http://localhost:8080/meals/${mealId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch meal");
                }
                const data = await response.json();
                setMeal(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMeal();
    }, [mealId]);

    return { meal, loading, error };
}

export function useMeals() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await fetch("http://localhost:8080/meals");
                if (!response.ok) {
                    throw new Error("Failed to fetch meals");
                }
                const data = await response.json();
                setMeals(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMeals();
    }, []);

    return { meals, loading, error };
}
