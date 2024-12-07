import { useState, useEffect } from "react";
import axios from "axios";

const useNutrients = (mealId) => {
    const [nutrients, setNutrients] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNutrients = async () => {
            try {
                const nutrientsEndpoint = `http://localhost:8080/meals/nutrients/${mealId}`;

                // Axios GET request
                const { data } = await axios.get(nutrientsEndpoint);

                // Set nutrients data
                setNutrients(Object.values(data));
                setError(null); // Clear previous errors
            } catch (error) {
                console.error(`Error fetching nutrients for mealId ${mealId}:`, error);
                setError(error.response?.data?.message || error.message); // Use API error if available
            }
        };

        if (mealId) {
            fetchNutrients();
        }
    }, [mealId]);

    return { nutrients, error };
};

export default useNutrients;
