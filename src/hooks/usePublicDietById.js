import { useEffect, useState } from "react";
import {fetchPublicDietById} from "../services/apiService.js";

const usePublicDietById = (dietId) => {
    const [diet, setDiet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await fetchPublicDietById(dietId);
                setDiet(data);
            } catch (err) {
                setError(err.message || "Failed to fetch diet.");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [dietId]);

    return { diet, loading, error };
};

export default usePublicDietById;
