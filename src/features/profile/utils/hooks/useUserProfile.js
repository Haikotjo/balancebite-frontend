import { useState, useEffect, useCallback } from "react";
import {fetchUserProfile} from "../../../../services/apiService.js";


const useUserProfile = (token) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadProfileData = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        try {
            const result = await fetchUserProfile(token);


            setUserData(result);
            setError(null);
        } catch (err) {
            console.error("Error loading profile data:", err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadProfileData();
    }, [loadProfileData]);

    return { userData, isLoading, error, refetch: loadProfileData };
};

export default useUserProfile;