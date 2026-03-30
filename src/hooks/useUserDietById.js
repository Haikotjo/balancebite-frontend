import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {fetchUserDietById} from "../services/apiService.js";


const useUserDietById = (dietId) => {
    const [diet, setDiet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const controller = new AbortController();

        const fetch = async () => {
            try {
                const data = await fetchUserDietById(dietId, token);
                if (!controller.signal.aborted) setDiet(data);
            } catch (err) {
                if (controller.signal.aborted) return;
                setError(err.message || "Failed to fetch user diet.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        if (token) fetch();

        return () => controller.abort();
    }, [dietId, token]);

    return { diet, loading, error };
};

export default useUserDietById;
