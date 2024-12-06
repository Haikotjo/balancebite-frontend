import { useState, useEffect } from "react";

const useNutrients = (mealId) => {
    const [nutrients, setNutrients] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNutrients = async () => {
            try {
                const nutrientsEndpoint = `http://localhost:8080/meals/nutrients/${mealId}`;
                const response = await fetch(nutrientsEndpoint);
                if (!response.ok) throw new Error("Failed to fetch nutrients");
                const data = await response.json();
                setNutrients(Object.values(data));
            } catch (error) {
                console.error(`Error fetching nutrients for mealId ${mealId}:`, error);
                setError(error.message);
            }
        };

        if (mealId) {
            fetchNutrients();
        }
    }, [mealId]);

    return { nutrients, error };
};

export default useNutrients;
