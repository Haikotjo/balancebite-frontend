import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {fetchUserDietById} from "../services/apiService.js";


const useUserDietById = (dietId) => {
    const [diet, setDiet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await fetchUserDietById(dietId, token);
                setDiet(data);
            } catch (err) {
                setError(err.message || "Failed to fetch user diet.");
            } finally {
                setLoading(false);
            }
        };
        if (token) fetch(); // voorkomt dat hij zonder token fired
    }, [dietId, token]);

    return { diet, loading, error };
};

export default useUserDietById;
