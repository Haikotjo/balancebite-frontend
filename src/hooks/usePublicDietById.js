import { useEffect, useState } from "react";
import {getPublicDietPlanByIdApi } from "../services/apiService.js";

const usePublicDietById = (dietId) => {
    const [diet, setDiet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetch = async () => {
            try {
                const data = await getPublicDietPlanByIdApi(dietId);
                if (!controller.signal.aborted) setDiet(data);
            } catch (err) {
                if (controller.signal.aborted) return;
                setError(err.message || "Failed to fetch diet.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetch();

        return () => controller.abort();
    }, [dietId]);

    return { diet, loading, error };
};

export default usePublicDietById;
